import { Doc } from "./_generated/dataModel";
import { query, action, internalQuery, mutation, internalAction, internalMutation} from "./_generated/server";
import { v } from "convex/values";
import {internal} from "./_generated/api"


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
    const personId = await ctx.db.insert("people", {
      name: args.name.toLowerCase(),
      notes: args.notes,
      connected_to: [],
    });
    // Kick off an action to generate an embedding for this person
    await ctx.scheduler.runAfter(0, internal.people.generateAndAddEmbedding, {
      personId,
      notes: args.notes,
    });
  },
});

export const generateAndAddEmbedding = internalAction({
  args: { personId: v.id("people"), notes: v.string() },
  handler: async (ctx, args) => {
    const embedding = await embed_docs([args.notes]);
    await ctx.runMutation(internal.people.addEmbedding, {
      personId: args.personId,
      embedding,
    });
  },
});

export const addEmbedding = internalMutation({
  args: { personId: v.id("people"), embedding: v.array(v.number()) },
  handler: async (ctx, args) => {
    const person = await ctx.db.get(args.personId);
    if (person === null) {
      // No movie to update
      return;
    }
    const notesEmbedding = await ctx.db.insert("peopleEmbedding", {
      embedding: args.embedding,
      person_id: args.personId,
    });
    await ctx.db.patch(args.personId, {
      embedding_id: notesEmbedding,
    });
  },
});






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

export const similarPeopleVector = internalAction({
  args: {
    embedding: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.vectorSearch("peopleEmbedding", "by_embedding", {
      vector: args.embedding,
      limit: 16,
    })
    const people: Array<Doc<"people">> = await ctx.runQuery(
      internal.people.fetchResults,
      { ids: results.map((result) => result._id) },
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
    const results = await ctx.vectorSearch("peopleEmbedding", "by_embedding", {
      vector: vector,
      limit: 16,
    })
    const people: Array<Doc<"people">> = await ctx.runQuery(
      internal.people.fetchResults,
      { ids: results.map((result) => result._id) },
    );
    return people
  }
})

