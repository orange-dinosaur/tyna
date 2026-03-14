import { mutation, query } from './_generated/server.js';
import { v } from 'convex/values';
import { ConvexError } from 'convex/values';

// Add a book to a library
export const add = mutation({
    args: {
        userId: v.string(),
        libraryId: v.id('libraries'),
        bookId: v.id('books'),
    },
    handler: async (ctx, args) => {
        // Verify library ownership
        const library = await ctx.db.get(args.libraryId);
        if (!library) {
            throw new ConvexError('Library not found');
        }
        if (library.userId !== args.userId) {
            throw new ConvexError('Not authorized');
        }

        // Check uniqueness via by_library_book index
        const existing = await ctx.db
            .query('libraryBooks')
            .withIndex('by_library_book', (q) =>
                q.eq('libraryId', args.libraryId).eq('bookId', args.bookId)
            )
            .first();

        if (existing) {
            throw new ConvexError('Book already in library');
        }

        return await ctx.db.insert('libraryBooks', {
            libraryId: args.libraryId,
            bookId: args.bookId,
            addedAt: Date.now(),
        });
    },
});

// Remove a book from a library
export const remove = mutation({
    args: {
        userId: v.string(),
        libraryId: v.id('libraries'),
        bookId: v.id('books'),
    },
    handler: async (ctx, args) => {
        // Verify library ownership
        const library = await ctx.db.get(args.libraryId);
        if (!library) {
            throw new ConvexError('Library not found');
        }
        if (library.userId !== args.userId) {
            throw new ConvexError('Not authorized');
        }

        const entry = await ctx.db
            .query('libraryBooks')
            .withIndex('by_library_book', (q) =>
                q.eq('libraryId', args.libraryId).eq('bookId', args.bookId)
            )
            .first();

        if (!entry) {
            throw new ConvexError('Book not in library');
        }

        await ctx.db.delete(entry._id);
    },
});

// List all books in a library
export const listByLibrary = query({
    args: {
        libraryId: v.id('libraries'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('libraryBooks')
            .withIndex('by_library', (q) => q.eq('libraryId', args.libraryId))
            .collect();
    },
});
