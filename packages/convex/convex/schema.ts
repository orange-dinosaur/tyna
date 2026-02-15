import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    searchHistory: defineTable({
        query: v.string(),
        searchedAt: v.number(), // timestamp
    }),

    works: defineTable({
        title: v.string(),
        authors: v.array(v.string()),
        description: v.optional(v.string()),
        originalPublishedYear: v.optional(v.number()),
        categories: v.array(v.string()),
        localWorkHash: v.string(),
        externalWorkId: v.optional(v.string()),
        externalSource: v.optional(v.string()),
        verificationStatus: v.union(
            v.literal('unverified'),
            v.literal('verified'),
            v.literal('not_found'),
            v.literal('pending_review')
        ),
        editionCount: v.number(),
        avgRating: v.optional(v.number()),
        ratingCount: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_local_hash', ['localWorkHash'])
        .index('by_external_work', ['externalSource', 'externalWorkId'])
        .index('by_verification', ['verificationStatus'])
        .searchIndex('search_title', { searchField: 'title' }),

    books: defineTable({
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
        dataHash: v.string(),
        lastFetchedAt: v.number(),
        lastCheckedAt: v.number(),
    })
        .index('by_work', ['workId'])
        .index('by_external', ['externalSource', 'externalId'])
        .index('by_isbn13', ['isbn13'])
        .index('by_isbn10', ['isbn10']),
});
