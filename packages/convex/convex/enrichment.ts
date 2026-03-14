import {
    internalMutation,
    internalAction,
    internalQuery,
} from './_generated/server.js';
import { v } from 'convex/values';
import { internal } from './_generated/api.js';
import { lookupByIsbn } from './lib/openLibrary.js';

/**
 * Enqueue a book for Open Library enrichment.
 * Called by userBooks.addToShelf when a book is first shelved.
 */
export const enqueue = internalMutation({
    args: {
        bookId: v.id('books'),
        workId: v.id('works'),
        isbn: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('enrichmentQueue', {
            bookId: args.bookId,
            workId: args.workId,
            isbn: args.isbn,
            status: 'pending',
            attempts: 0,
            createdAt: Date.now(),
        });
    },
});

/**
 * Internal query to get the oldest pending enrichment entry.
 */
export const getOldestPending = internalQuery({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query('enrichmentQueue')
            .withIndex('by_status', (q) => q.eq('status', 'pending'))
            .order('asc')
            .first();
    },
});

/**
 * Mark a queue entry as processing and increment attempts.
 */
export const markProcessing = internalMutation({
    args: {
        entryId: v.id('enrichmentQueue'),
    },
    handler: async (ctx, args) => {
        const entry = await ctx.db.get(args.entryId);
        if (!entry) return;
        await ctx.db.patch(args.entryId, {
            status: 'processing',
            attempts: entry.attempts + 1,
            lastAttemptAt: Date.now(),
        });
    },
});

/**
 * Complete an enrichment entry.
 * Updates the work with external data and marks the queue entry as completed.
 */
export const completeEntry = internalMutation({
    args: {
        entryId: v.id('enrichmentQueue'),
        workId: v.id('works'),
        externalWorkId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Update the work record
        if (args.externalWorkId) {
            await ctx.db.patch(args.workId, {
                externalWorkId: args.externalWorkId,
                externalSource: 'open_library',
                verificationStatus: 'verified',
                updatedAt: Date.now(),
            });
        } else {
            await ctx.db.patch(args.workId, {
                verificationStatus: 'not_found',
                updatedAt: Date.now(),
            });
        }

        // Mark queue entry as completed
        await ctx.db.patch(args.entryId, {
            status: 'completed',
        });
    },
});

/**
 * Fail an enrichment entry.
 * If attempts >= 3, marks as failed. Otherwise resets to pending for retry.
 */
export const failEntry = internalMutation({
    args: {
        entryId: v.id('enrichmentQueue'),
        error: v.string(),
    },
    handler: async (ctx, args) => {
        const entry = await ctx.db.get(args.entryId);
        if (!entry) return;

        if (entry.attempts >= 3) {
            await ctx.db.patch(args.entryId, {
                status: 'failed',
                error: args.error,
            });
        } else {
            await ctx.db.patch(args.entryId, {
                status: 'pending',
                error: args.error,
            });
        }
    },
});

/**
 * Process the next pending enrichment queue entry.
 * Picks the oldest pending entry, sets it to processing,
 * calls Open Library, then completes or fails the entry.
 */
export const processNext = internalAction({
    args: {},
    handler: async (ctx) => {
        const entry = await ctx.runQuery(
            internal.enrichment.getOldestPending,
            {}
        );

        if (!entry) {
            return;
        }

        // Set to processing and increment attempts
        await ctx.runMutation(internal.enrichment.markProcessing, {
            entryId: entry._id,
        });

        try {
            if (!entry.isbn) {
                // No ISBN available, mark as not_found
                await ctx.runMutation(internal.enrichment.completeEntry, {
                    entryId: entry._id,
                    workId: entry.workId,
                });
                return;
            }

            const result = await lookupByIsbn(entry.isbn);

            if (result) {
                await ctx.runMutation(internal.enrichment.completeEntry, {
                    entryId: entry._id,
                    workId: entry.workId,
                    externalWorkId: result.workId,
                });
            } else {
                // ISBN not found on Open Library
                await ctx.runMutation(internal.enrichment.completeEntry, {
                    entryId: entry._id,
                    workId: entry.workId,
                });
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            await ctx.runMutation(internal.enrichment.failEntry, {
                entryId: entry._id,
                error: errorMessage,
            });
        }
    },
});
