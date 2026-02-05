import { mutation, query } from './_generated/server.js';
import { v } from 'convex/values';

// Save a new search query
export const create = mutation({
    args: {
        query: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert('searchHistory', {
            query: args.query,
            searchedAt: Date.now(),
        });
        return id;
    },
});

// Get all search history
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('searchHistory').order('desc').collect();
    },
});
