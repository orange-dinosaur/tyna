import { mutation, query } from './_generated/server.js';
import { v } from 'convex/values';
import { ConvexError } from 'convex/values';

// Create a review for a work
export const create = mutation({
    args: {
        userId: v.string(),
        workId: v.id('works'),
        content: v.string(),
        isSpoiler: v.boolean(),
        isPublic: v.boolean(),
    },
    handler: async (ctx, args) => {
        // Validate content is non-empty (trimmed)
        if (args.content.trim().length === 0) {
            throw new ConvexError('Review content cannot be empty');
        }

        // Check uniqueness via by_user_work index
        const existing = await ctx.db
            .query('reviews')
            .withIndex('by_user_work', (q) =>
                q.eq('userId', args.userId).eq('workId', args.workId)
            )
            .first();

        if (existing) {
            throw new ConvexError('Review already exists');
        }

        const now = Date.now();

        return await ctx.db.insert('reviews', {
            userId: args.userId,
            workId: args.workId,
            content: args.content,
            isSpoiler: args.isSpoiler,
            isPublic: args.isPublic,
            likeCount: 0,
            commentCount: 0,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing review
export const update = mutation({
    args: {
        userId: v.string(),
        reviewId: v.id('reviews'),
        content: v.string(),
        isSpoiler: v.boolean(),
        isPublic: v.boolean(),
    },
    handler: async (ctx, args) => {
        // Validate content is non-empty (trimmed)
        if (args.content.trim().length === 0) {
            throw new ConvexError('Review content cannot be empty');
        }

        const existing = await ctx.db.get(args.reviewId);
        if (!existing) {
            throw new ConvexError('Review not found');
        }

        // Verify ownership
        if (existing.userId !== args.userId) {
            throw new ConvexError('Not authorized');
        }

        await ctx.db.patch(args.reviewId, {
            content: args.content,
            isSpoiler: args.isSpoiler,
            isPublic: args.isPublic,
            updatedAt: Date.now(),
        });
    },
});

// Remove a review
export const remove = mutation({
    args: {
        userId: v.string(),
        reviewId: v.id('reviews'),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.reviewId);
        if (!existing) {
            throw new ConvexError('Review not found');
        }

        // Verify ownership
        if (existing.userId !== args.userId) {
            throw new ConvexError('Not authorized');
        }

        await ctx.db.delete(args.reviewId);
    },
});

// Get a single review for a user+work pair
export const getByUserAndWork = query({
    args: {
        userId: v.string(),
        workId: v.id('works'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('reviews')
            .withIndex('by_user_work', (q) =>
                q.eq('userId', args.userId).eq('workId', args.workId)
            )
            .first();
    },
});

// List public reviews for a work
export const listPublicByWork = query({
    args: {
        workId: v.id('works'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('reviews')
            .withIndex('by_work_public', (q) =>
                q.eq('workId', args.workId).eq('isPublic', true)
            )
            .collect();
    },
});
