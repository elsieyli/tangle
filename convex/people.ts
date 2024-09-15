import { Doc } from "./_generated/dataModel";
import { query, action, internalQuery, mutation, internalAction, internalMutation} from "./_generated/server";
import { v } from "convex/values";
import {internal} from "./_generated/api"

import {embed_doc, embed_search} from "./cohere"


export const get = query({
  args: {},
  handler: async (ctx : any) => {
    return await ctx.db.query("people").collect();
  },
});

export const searchByName = query({
  args: {name: v.string()},
  handler: async (ctx, args) => {
    const person = (await ctx.db.query("people").filter(
      q => q.eq(q.field("name"), args.name)
    ).collect())

    return person
  }
})
export const insert = mutation({
  args: { name: v.string(), notes: v.string() },
  handler: async (ctx, args) => {
    // Convert name to lowercase to ensure case-insensitive matching
    const name = args.name.toLowerCase();

    // Check if a person with the given name already exists
    const existingPerson = await ctx.db.query("people")
      .filter(q => q.eq(q.field("name"), name))
      .first();

    let personId;

    if (existingPerson) {
      // If the person exists, update their notes
      personId = existingPerson._id;
      await ctx.db.patch(personId, {
        notes: existingPerson.notes + '\n' +  args.notes,
      });
    } else {
      // If the person doesn't exist, insert a new entry
      personId = await ctx.db.insert("people", {
        name,
        notes: args.notes,
        connected_to: [],
      });
    }

    // Kick off an action to generate an embedding for this person
    await ctx.scheduler.runAfter(0, internal.people.generateAndAddEmbedding, {
      personId,
      name: args.name,
      notes: args.notes,
    });
  },
});


export const generateAndAddEmbedding = internalAction({
  args: { personId: v.id("people"), notes: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const embedding = await embed_doc(`My name is ${name} and\n`+args.notes);
    await ctx.runMutation(internal.people.addEmbedding, {
      personId: args.personId,
      embedding,
    });
    await ctx.runAction(internal.people.generateConnections, {
      personId: args.personId, 
      embedding: embedding,
    })
  },
});

export const addEmbedding = internalMutation({
  args: { personId: v.id("people"), embedding: v.array(v.number()) },
  handler: async (ctx, args) => {
    const person = await ctx.db.get(args.personId);
    if (person === null) {
      // No person to update
      return;
    }
    
    // Check if an embedding already exists for this person
    const existingEmbedding = await ctx.db.query("peopleEmbedding")
      .filter(q => q.eq(q.field("person_id"), args.personId))
      .first();

    if (existingEmbedding) {
      // If embedding exists, update it
      await ctx.db.patch(existingEmbedding._id, {
        embedding: args.embedding,
      });
    } else {
      // If embedding does not exist, insert a new entry
      const notesEmbedding = await ctx.db.insert("peopleEmbedding", {
        embedding: args.embedding,
        person_id: args.personId,
      });
      
      // Update the person record with the new embedding_id
      await ctx.db.patch(args.personId, {
        embedding_id: notesEmbedding,
      });
    }
  },
});


export const generateConnections = internalAction({
  args: { personId: v.id("people"),  embedding: v.array(v.number()) },
  handler: async (ctx, args) => {
    const similarPeople = await ctx.runAction(internal.people.similarPeopleVector, {
      embedding: args.embedding,
    })
    await ctx.runMutation(internal.people.connectUserToOthers, {
      personId: args.personId, 
      similarPeople: similarPeople.map(p => p._id).filter(id => id != args.personId),
    })
    
  }
})

export const connectUserToOthers = internalMutation({
  args: {personId: v.id("people"), similarPeople: v.array(v.id("people"))},
  handler: async (ctx, args) => {
    const peopleToConnect = await Promise.all(
      args.similarPeople.map(async id => await ctx.db.get(id))
    )
    const person = await ctx.db.get(args.personId)
    if (person == null) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const newConnected = person?.connected_to!
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    peopleToConnect.forEach(p => newConnected.push(p?._id!))

    await ctx.db.patch(args.personId, {connected_to: newConnected})
    peopleToConnect.forEach(
      p => p?.connected_to.push(person?._id!)
    )
    const patchWork = peopleToConnect.map(
      async p => await ctx.db.patch(p?._id!, {connected_to: p?.connected_to})
    )
    await Promise.all(patchWork)

  }

})


export const fetchResults = internalQuery({
  args: { ids: v.array(v.id("peopleEmbedding")) },
  handler: async (ctx, args) => {
    const results = [];
    for (const id of args.ids) {
      const doc = await ctx.db.get(id);
      if (doc === null) {
        continue;
      }

      const personId = doc.person_id
      const person = (await ctx.db.query("people")
      .filter((q) => q.eq(q.field("_id"), personId))
      .collect())[0]

      
      
      results.push(person);
    }
    return results;
  },
});
export const getEmbedding = internalQuery({
  args: {
    embeddingId: v.id("peopleEmbedding")
  },
  handler: async (ctx, args) => {
      return await ctx.db.get(args.embeddingId)
    }

  
})
export const similarPeopleByEmbeddingId = action({
  args: {
    embeddingId: v.id("peopleEmbedding"), // Argument to accept an embeddingId
  },
  handler: async (ctx, args) => {
    // Step 1: Retrieve the embedding from the database using embeddingId
    const embeddingDoc = await ctx.runQuery(internal.people.getEmbedding, {embeddingId: args.embeddingId});
    if (!embeddingDoc) {
      throw new Error(`Embedding with ID ${args.embeddingId} not found.`);
    }

    const { embedding } = embeddingDoc;
    if (!embedding || !Array.isArray(embedding)) {
      throw new Error(`Invalid embedding data for ID ${args.embeddingId}.`);
    }

    // Step 2: Perform the vector search using the retrieved embedding
    const results = await ctx.vectorSearch("peopleEmbedding", "by_embedding", {
      vector: embedding,
    });

    // Step 3: Filter results and fetch the people data
    const people: Array<Doc<"people">> = await ctx.runQuery(
      internal.people.fetchResults,
      { ids: results.filter(r => r._score >= 0.50).map((result) => result._id) },
    );

    return people;
  }
});


export const similarPeopleVector = internalAction({
  args: {
    embedding: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.vectorSearch("peopleEmbedding", "by_embedding", {
      vector: args.embedding,
      
      
    })
    const people: Array<Doc<"people">> = await ctx.runQuery(
      internal.people.fetchResults,
      { ids: results.filter(r => r._score >= 0.50).map((result) => result._id) },
    );
    return people
  }
})

export const similarPeopleSearch = action({
  args: {
    searchQuery: v.string(),

  },
  handler: async (ctx, args) => {
    const vector = await embed_search(args.searchQuery);
    console.log(`vector is ${vector}`)
    const results = await ctx.vectorSearch("peopleEmbedding", "by_embedding", {
      vector: vector,
      limit: 200,
      
    })
    
    console.log(results)
    const people: Array<Doc<"people">> = await ctx.runQuery(
      internal.people.fetchResults,
      { ids: results.filter(result => result._score >= 0.23).map((result) => result._id) },
    );
    console.log(`people is ${people}`)
    return people
  }
})

