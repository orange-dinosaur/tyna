import { mutation, query } from './_generated/server.js';
import { v } from 'convex/values';
import { ConvexError } from 'convex/values';

const shelfStatus = v.union(
    v.literal('want_to_read'),
    v.literal('reading'),
    v.literal('finished'),
    v.literal('dnf')
);

// Add a book to the user's shelf
export const addToShelf = mutation({
    args: {
        userId: v.string(),
        bookId: v.id('books'),
        status: shelfStatus,
    },
    handler: async (ctx, args) => {
        // Check uniqueness via by_user_book index
        const existing = await ctx.db
            .query('userBooks')
            .withIndex('by_user_book', (q) =>
                q.eq('userId', args.userId).eq('bookId', args.bookId)
            )
            .first();

        if (existing) {
            throw new ConvexError('Book already on shelf');
        }

        const now = Date.now();

        const id = await ctx.db.insert('userBooks', {
            userId: args.userId,
            bookId: args.bookId,
            status: args.status,
            isFavorite: false,
            startedAt: args.status === 'reading' ? now : undefined,
            finishedAt: undefined,
            createdAt: now,
            updatedAt: now,
        });

        // Queue enrichment for first-time shelves (any user)
        const book = await ctx.db.get(args.bookId);
        if (book) {
            const existingEnrichment = await ctx.db
                .query('enrichmentQueue')
                .withIndex('by_book', (q) => q.eq('bookId', args.bookId))
                .first();

            if (!existingEnrichment) {
                await ctx.db.insert('enrichmentQueue', {
                    bookId: args.bookId,
                    workId: book.workId,
                    isbn: book.isbn13 ?? book.isbn10 ?? undefined,
                    status: 'pending',
                    attempts: 0,
                    createdAt: now,
                });
            }
        }

        return id;
    },
});

// Update the shelf status of an existing entry
export const updateShelfStatus = mutation({
    args: {
        userId: v.string(),
        bookId: v.id('books'),
        status: shelfStatus,
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query('userBooks')
            .withIndex('by_user_book', (q) =>
                q.eq('userId', args.userId).eq('bookId', args.bookId)
            )
            .first();

        if (!existing) {
            throw new ConvexError('Book not on shelf');
        }

        const now = Date.now();
        const updates: Record<string, unknown> = {
            status: args.status,
            updatedAt: now,
        };

        // Set startedAt on transition to reading (if not already set)
        if (args.status === 'reading' && !existing.startedAt) {
            updates.startedAt = now;
        }

        // Set finishedAt on transition to finished
        if (args.status === 'finished') {
            updates.finishedAt = now;
        }

        await ctx.db.patch(existing._id, updates);
    },
});

// Remove a book from the user's shelf
export const removeFromShelf = mutation({
    args: {
        userId: v.string(),
        bookId: v.id('books'),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query('userBooks')
            .withIndex('by_user_book', (q) =>
                q.eq('userId', args.userId).eq('bookId', args.bookId)
            )
            .first();

        if (!existing) {
            throw new ConvexError('Book not on shelf');
        }

        await ctx.db.delete(existing._id);
    },
});

// Get a single shelf entry for a user+book pair
export const getByUserAndBook = query({
    args: {
        userId: v.string(),
        bookId: v.id('books'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('userBooks')
            .withIndex('by_user_book', (q) =>
                q.eq('userId', args.userId).eq('bookId', args.bookId)
            )
            .first();
    },
});

// List shelf entries filtered by status
export const listByUserStatus = query({
    args: {
        userId: v.string(),
        status: shelfStatus,
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('userBooks')
            .withIndex('by_user_status', (q) =>
                q.eq('userId', args.userId).eq('status', args.status)
            )
            .collect();
    },
});

// List all shelf entries for a user
export const listByUser = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('userBooks')
            .withIndex('by_user', (q) => q.eq('userId', args.userId))
            .collect();
    },
});
