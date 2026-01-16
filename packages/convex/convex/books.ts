import { mutation, query } from 'convex/server';
import { v } from 'convex/values';

export const createBook = mutation({
    args: {
        workId: v.id('works'),
        externalId: v.string(),
        externalSource: v.string(),
        title: v.string(),
        subtitle: v.optional(v.string()),
        authors: v.array(v.string()),
        description: v.optional(v.string()),
        coverUrl: v.optional(v.string()),
        isbn10: v.optional(v.string()),
        isbn13: v.optional(v.string()),
        publisher: v.optional(v.string()),
        publishedDate: v.optional(v.string()),
        pageCount: v.optional(v.number()),
        language: v.optional(v.string()),
        format: v.optional(v.string()),
        dataHash: v.string()
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const work = await ctx.db.get(args.workId);
        if (!work) {
            throw new Error('Work not found');
        }

        const bookId = await ctx.db.insert('books', {
            workId: args.workId,
            externalId: args.externalId,
            externalSource: args.externalSource,
            title: args.title,
            subtitle: args.subtitle,
            authors: args.authors,
            description: args.description,
            coverUrl: args.coverUrl,
            isbn10: args.isbn10,
            isbn13: args.isbn13,
            publisher: args.publisher,
            publishedDate: args.publishedDate,
            pageCount: args.pageCount,
            language: args.language,
            format: args.format,
            dataHash: args.dataHash,
            lastFetchedAt: now,
            lastCheckedAt: now
        });

        await ctx.db.patch(args.workId, {
            editionCount: work.editionCount + 1,
            updatedAt: now
        });

        return bookId;
    }
});

export const getBookById = query({
    args: { bookId: v.id('books') },
    handler: async (ctx, args) => {
        return ctx.db.get(args.bookId);
    }
});

export const getBookByExternalId = query({
    args: { externalSource: v.string(), externalId: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query('books')
            .withIndex('by_external', (q) =>
                q.eq('externalSource', args.externalSource).eq(
                    'externalId',
                    args.externalId
                )
            )
            .first();
    }
});

export const listBooksByWork = query({
    args: { workId: v.id('works') },
    handler: async (ctx, args) => {
        return ctx.db
            .query('books')
            .withIndex('by_work', (q) => q.eq('workId', args.workId))
            .collect();
    }
});
