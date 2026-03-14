import { mutation, query, type MutationCtx } from './_generated/server.js';
import { v } from 'convex/values';
import { ConvexError } from 'convex/values';
import type { Id } from './_generated/dataModel.js';

/**
 * Recalculate avgRating and ratingCount on the works entry.
 * Sets avgRating to undefined when no ratings remain.
 */
async function recalculateWorkRating(
    ctx: MutationCtx,
    workId: Id<'works'>
): Promise<void> {
    const allRatings = await ctx.db
        .query('ratings')
        .withIndex('by_work', (q) => q.eq('workId', workId))
        .collect();

    if (allRatings.length === 0) {
        await ctx.db.patch(workId, {
            avgRating: undefined,
            ratingCount: 0,
        });
        return;
    }

    const sum = allRatings.reduce((acc, r) => acc + r.score, 0);
    const avg = sum / allRatings.length;

    await ctx.db.patch(workId, {
        avgRating: avg,
        ratingCount: allRatings.length,
    });
}

// Rate a work (upsert: create or update)
export const rate = mutation({
    args: {
        userId: v.string(),
        workId: v.id('works'),
        score: v.number(),
    },
    handler: async (ctx, args) => {
        // Validate score is an integer in [1, 5]
        if (!Number.isInteger(args.score) || args.score < 1 || args.score > 5) {
            throw new ConvexError('Score must be an integer between 1 and 5');
        }

        const now = Date.now();

        const existing = await ctx.db
            .query('ratings')
            .withIndex('by_user_work', (q) =>
                q.eq('userId', args.userId).eq('workId', args.workId)
            )
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                score: args.score,
                updatedAt: now,
            });
        } else {
            await ctx.db.insert('ratings', {
                userId: args.userId,
                workId: args.workId,
                score: args.score,
                createdAt: now,
                updatedAt: now,
            });
        }

        await recalculateWorkRating(ctx, args.workId);
    },
});

// Delete a rating
export const deleteRating = mutation({
    args: {
        userId: v.string(),
        workId: v.id('works'),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query('ratings')
            .withIndex('by_user_work', (q) =>
                q.eq('userId', args.userId).eq('workId', args.workId)
            )
            .first();

        if (!existing) {
            throw new ConvexError('Rating not found');
        }

        await ctx.db.delete(existing._id);
        await recalculateWorkRating(ctx, args.workId);
    },
});

// Get a single rating for a user+work pair
export const getByUserAndWork = query({
    args: {
        userId: v.string(),
        workId: v.id('works'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('ratings')
            .withIndex('by_user_work', (q) =>
                q.eq('userId', args.userId).eq('workId', args.workId)
            )
            .first();
    },
});

// List all ratings for a work
export const listByWork = query({
    args: {
        workId: v.id('works'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('ratings')
            .withIndex('by_work', (q) => q.eq('workId', args.workId))
            .collect();
    },
});
