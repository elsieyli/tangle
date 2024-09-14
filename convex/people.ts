import { query, action } from "./_generated/server";
import { v } from "convex/values";


export const get = query({
  args: {},
  handler: async (ctx : any) => {
    return await ctx.db.query("people").collect();
  },
});

export const similarPeople = action({
  args: {
    searchQuery: v.string(),

  },
  handler: async (ctx, args) => {
    const vector = await embed(args.searchQuery);
    const results = await ctx.vectorSearch("people", "by_vector", {
      vector: vector,
      limit: 16,
    })
  }
})