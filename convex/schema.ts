import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  people: defineTable({
    name: v.string(),
    notes: v.string(),
    connected_to: v.array(v.string()),
    vector: v.array(v.float64()),
    }).vectorIndex("by_vector", {
      vectorField: "vector",
      dimensions: 356,
      // filterFields: [""]
    })
});

