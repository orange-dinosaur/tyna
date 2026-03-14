import { mutation, query } from './_generated/server.js';
import { v } from 'convex/values';
import { ConvexError } from 'convex/values';

// Create a new library
export const create = mutation({
    args: {
        userId: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        isPublic: v.boolean(),
        color: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        return await ctx.db.insert('libraries', {
            userId: args.userId,
            name: args.name,
            description: args.description,
            isPublic: args.isPublic,
            color: args.color,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing library
export const update = mutation({
    args: {
        userId: v.string(),
        libraryId: v.id('libraries'),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        isPublic: v.optional(v.boolean()),
        color: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.libraryId);
        if (!existing) {
            throw new ConvexError('Library not found');
        }

        if (existing.userId !== args.userId) {
            throw new ConvexError('Not authorized');
        }

        const updates: Record<string, unknown> = {
            updatedAt: Date.now(),
        };

        if (args.name !== undefined) updates.name = args.name;
        if (args.description !== undefined)
            updates.description = args.description;
        if (args.isPublic !== undefined) updates.isPublic = args.isPublic;
        if (args.color !== undefined) updates.color = args.color;

        await ctx.db.patch(args.libraryId, updates);
    },
});

// Remove a library and all associated libraryBooks entries (cascade)
export const remove = mutation({
    args: {
        userId: v.string(),
        libraryId: v.id('libraries'),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.libraryId);
        if (!existing) {
            throw new ConvexError('Library not found');
        }

        if (existing.userId !== args.userId) {
            throw new ConvexError('Not authorized');
        }

        // Cascade delete all associated libraryBooks entries
        const libraryBooks = await ctx.db
            .query('libraryBooks')
            .withIndex('by_library', (q) => q.eq('libraryId', args.libraryId))
            .collect();

        for (const entry of libraryBooks) {
            await ctx.db.delete(entry._id);
        }

        await ctx.db.delete(args.libraryId);
    },
});

// List all libraries for a user
export const listByUser = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('libraries')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .collect();
    },
});

// Get a library by ID
export const getById = query({
    args: {
        libraryId: v.id('libraries'),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.libraryId);
    },
});
