import { mutation, query } from './_generated/server.js';
import { v } from 'convex/values';
import { ConvexError } from 'convex/values';

const noteTypeValidator = v.union(
    v.literal('translation'),
    v.literal('quality'),
    v.literal('format'),
    v.literal('other')
);

// Create a note for a book edition
export const create = mutation({
    args: {
        userId: v.string(),
        bookId: v.id('books'),
        content: v.string(),
        noteType: noteTypeValidator,
        isPublic: v.boolean(),
    },
    handler: async (ctx, args) => {
        if (args.content.trim().length === 0) {
            throw new ConvexError('Note content cannot be empty');
        }

        const now = Date.now();

        return await ctx.db.insert('bookNotes', {
            userId: args.userId,
            bookId: args.bookId,
            content: args.content,
            noteType: args.noteType,
            isPublic: args.isPublic,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update an existing note
export const update = mutation({
    args: {
        userId: v.string(),
        noteId: v.id('bookNotes'),
        content: v.string(),
        noteType: noteTypeValidator,
        isPublic: v.boolean(),
    },
    handler: async (ctx, args) => {
        if (args.content.trim().length === 0) {
            throw new ConvexError('Note content cannot be empty');
        }

        const existing = await ctx.db.get(args.noteId);
        if (!existing) {
            throw new ConvexError('Note not found');
        }

        if (existing.userId !== args.userId) {
            throw new ConvexError('Not authorized');
        }

        await ctx.db.patch(args.noteId, {
            content: args.content,
            noteType: args.noteType,
            isPublic: args.isPublic,
            updatedAt: Date.now(),
        });
    },
});

// Remove a note
export const remove = mutation({
    args: {
        userId: v.string(),
        noteId: v.id('bookNotes'),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.noteId);
        if (!existing) {
            throw new ConvexError('Note not found');
        }

        if (existing.userId !== args.userId) {
            throw new ConvexError('Not authorized');
        }

        await ctx.db.delete(args.noteId);
    },
});

// List public notes for a book
export const listPublicByBook = query({
    args: {
        bookId: v.id('books'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('bookNotes')
            .withIndex('by_book_public', (q) =>
                q.eq('bookId', args.bookId).eq('isPublic', true)
            )
            .collect();
    },
});

// List all notes by a user for a book (regardless of isPublic)
export const listByUserAndBook = query({
    args: {
        userId: v.string(),
        bookId: v.id('books'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('bookNotes')
            .withIndex('by_user_book', (q) =>
                q.eq('userId', args.userId).eq('bookId', args.bookId)
            )
            .collect();
    },
});
