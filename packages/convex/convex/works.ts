import { mutation, query } from 'convex/server';
import { v } from 'convex/values';
import { generateLocalWorkHash, getPrimaryAuthor } from './lib/workMatcher';

export const createWork = mutation({
    args: {
        title: v.string(),
        authors: v.array(v.string()),
        description: v.optional(v.string()),
        originalPublishedYear: v.optional(v.number()),
        categories: v.optional(v.array(v.string())),
        externalWorkId: v.optional(v.string()),
        externalSource: v.optional(v.string()),
        verificationStatus: v.optional(
            v.union(
                v.literal('unverified'),
                v.literal('verified'),
                v.literal('not_found'),
                v.literal('pending_review')
            )
        )
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const primaryAuthor = getPrimaryAuthor(args.authors);
        const localWorkHash = generateLocalWorkHash(args.title, primaryAuthor);

        const workId = await ctx.db.insert('works', {
            title: args.title,
            authors: args.authors,
            description: args.description,
            originalPublishedYear: args.originalPublishedYear,
            categories: args.categories ?? [],
            localWorkHash,
            externalWorkId: args.externalWorkId,
            externalSource: args.externalSource,
            verificationStatus: args.verificationStatus ?? 'unverified',
            editionCount: 0,
            avgRating: undefined,
            ratingCount: 0,
            createdAt: now,
            updatedAt: now
        });

        return workId;
    }
});

export const getWorkById = query({
    args: { workId: v.id('works') },
    handler: async (ctx, args) => {
        return ctx.db.get(args.workId);
    }
});

export const getWorkByLocalHash = query({
    args: { localWorkHash: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query('works')
            .withIndex('by_local_hash', (q) =>
                q.eq('localWorkHash', args.localWorkHash)
            )
            .first();
    }
});

export const listWorksByLocalHash = query({
    args: { localWorkHashes: v.array(v.string()) },
    handler: async (ctx, args) => {
        const results = await Promise.all(
            args.localWorkHashes.map((hash) =>
                ctx.db
                    .query('works')
                    .withIndex('by_local_hash', (q) =>
                        q.eq('localWorkHash', hash)
                    )
                    .collect()
            )
        );
        return results.flat();
    }
});

export const setWorkExternalId = mutation({
    args: {
        workId: v.id('works'),
        externalWorkId: v.string(),
        externalSource: v.string(),
        verificationStatus: v.optional(
            v.union(
                v.literal('unverified'),
                v.literal('verified'),
                v.literal('not_found'),
                v.literal('pending_review')
            )
        )
    },
    handler: async (ctx, args) => {
        const work = await ctx.db.get(args.workId);
        if (!work) {
            throw new Error('Work not found');
        }

        await ctx.db.patch(args.workId, {
            externalWorkId: args.externalWorkId,
            externalSource: args.externalSource,
            verificationStatus: args.verificationStatus ?? work.verificationStatus,
            updatedAt: Date.now()
        });
    }
});

export const incrementEditionCount = mutation({
    args: { workId: v.id('works'), delta: v.number() },
    handler: async (ctx, args) => {
        const work = await ctx.db.get(args.workId);
        if (!work) {
            throw new Error('Work not found');
        }

        await ctx.db.patch(args.workId, {
            editionCount: Math.max(0, work.editionCount + args.delta),
            updatedAt: Date.now()
        });
    }
});
