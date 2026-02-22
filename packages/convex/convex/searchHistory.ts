import { mutation, query } from './_generated/server.js';
import { v } from 'convex/values';

// Save a new search query
export const create = mutation({
    args: {
        query: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert('searchHistory', {
            query: args.query,
            userId: args.userId,
            searchedAt: Date.now(),
        });
        return id;
    },
});

// Get search history for a specific user
export const list = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('searchHistory')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .order('desc')
            .collect();
    },
});
