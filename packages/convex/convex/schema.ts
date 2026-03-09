import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    searchHistory: defineTable({
        query: v.string(),
        userId: v.string(),
        searchedAt: v.number(), // timestamp
    }).index('by_user', ['userId', 'searchedAt']),

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

    userBooks: defineTable({
        userId: v.string(),
        bookId: v.id('books'),
        status: v.union(
            v.literal('want_to_read'),
            v.literal('reading'),
            v.literal('finished'),
            v.literal('dnf')
        ),
        isFavorite: v.boolean(),
        currentPage: v.optional(v.number()),
        startedAt: v.optional(v.number()),
        finishedAt: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_user', ['userId'])
        .index('by_user_book', ['userId', 'bookId'])
        .index('by_user_status', ['userId', 'status'])
        .index('by_user_favorite', ['userId', 'isFavorite']),

    ratings: defineTable({
        userId: v.string(),
        workId: v.id('works'),
        score: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_user_work', ['userId', 'workId'])
        .index('by_work', ['workId']),

    reviews: defineTable({
        userId: v.string(),
        workId: v.id('works'),
        content: v.string(),
        isSpoiler: v.boolean(),
        isPublic: v.boolean(),
        likeCount: v.number(),
        commentCount: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_user_work', ['userId', 'workId'])
        .index('by_work_public', ['workId', 'isPublic'])
        .index('by_work_popular', ['workId', 'likeCount']),

    bookNotes: defineTable({
        userId: v.string(),
        bookId: v.id('books'),
        content: v.string(),
        noteType: v.union(
            v.literal('translation'),
            v.literal('quality'),
            v.literal('format'),
            v.literal('other')
        ),
        isPublic: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_user_book', ['userId', 'bookId'])
        .index('by_book_public', ['bookId', 'isPublic']),

    libraries: defineTable({
        userId: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        isPublic: v.boolean(),
        color: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index('by_user', ['userId']),

    libraryBooks: defineTable({
        libraryId: v.id('libraries'),
        bookId: v.id('books'),
        addedAt: v.number(),
        sortOrder: v.optional(v.number()),
    })
        .index('by_library', ['libraryId'])
        .index('by_book', ['bookId'])
        .index('by_library_book', ['libraryId', 'bookId']),

    enrichmentQueue: defineTable({
        bookId: v.id('books'),
        workId: v.id('works'),
        isbn: v.optional(v.string()),
        status: v.union(
            v.literal('pending'),
            v.literal('processing'),
            v.literal('completed'),
            v.literal('failed')
        ),
        attempts: v.number(),
        lastAttemptAt: v.optional(v.number()),
        error: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index('by_status', ['status'])
        .index('by_book', ['bookId']),
});
