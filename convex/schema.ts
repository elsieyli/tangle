import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  people: defineTable({
    name: v.string(),
    notes: v.string(),
    connected_to: v.array(v.id("people")),
    embedding_id: v.optional(v.id("peopleEmbedding")),
    }).index("by_embedding", ['embedding_id'],
    ),
  peopleEmbedding: defineTable({
    person_id: v.id("people"),
    embedding: v.array(v.number()),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1024,
  })
});

