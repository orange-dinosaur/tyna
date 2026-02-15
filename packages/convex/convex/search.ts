import { action, internalQuery } from './_generated/server.js';
import { v } from 'convex/values';
import { internal } from './_generated/api.js';
import { searchBooks } from './lib/books.js';
import type { BookResult } from './lib/bookProvider.js';
import { generateLocalWorkHash } from './lib/workMatcher.js';
import type { Doc } from './_generated/dataModel.js';

// --- Internal query: batch lookup works by localWorkHash values ---

export const getWorksByHashes = internalQuery({
    args: { hashes: v.array(v.string()) },
    handler: async (ctx, { hashes }) => {
        const works: Doc<'works'>[] = [];
        for (const hash of hashes) {
            const work = await ctx.db
                .query('works')
                .withIndex('by_local_hash', (q) => q.eq('localWorkHash', hash))
                .first();
            if (work) works.push(work);
        }
        return works;
    },
});

// --- Pure grouping logic (exported for testability) ---

export interface GroupedWork {
    _id: string;
    title: string;
    authors: string[];
    description?: string;
    avgRating?: number;
    ratingCount: number;
    editionCount: number;
    coverUrl?: string;
    matchedEditions: BookResult[];
}

export interface SearchResultResponse {
    works: GroupedWork[];
    standalone: BookResult[];
    totalEditions: number;
    totalItems: number;
}

export function groupSearchResults(
    results: BookResult[],
    hashMap: Map<string, string>, // externalId -> localWorkHash
    existingWorks: Doc<'works'>[]
): { works: GroupedWork[]; standalone: BookResult[] } {
    const worksByHash = new Map<string, Doc<'works'>>();
    for (const work of existingWorks) {
        worksByHash.set(work.localWorkHash, work);
    }

    const groupedEditions = new Map<string, BookResult[]>();
    const standalone: BookResult[] = [];

    for (const result of results) {
        const hash = hashMap.get(result.externalId);
        if (hash && worksByHash.has(hash)) {
            const existing = groupedEditions.get(hash) ?? [];
            existing.push(result);
            groupedEditions.set(hash, existing);
        } else {
            standalone.push(result);
        }
    }

    const works: GroupedWork[] = [];
    for (const [hash, editions] of groupedEditions) {
        const work = worksByHash.get(hash)!;
        works.push({
            _id: work._id,
            title: work.title,
            authors: work.authors,
            description: work.description,
            avgRating: work.avgRating,
            ratingCount: work.ratingCount,
            editionCount: work.editionCount,
            coverUrl: editions[0]?.coverUrl,
            matchedEditions: editions,
        });
    }

    return { works, standalone };
}

// --- Main search action ---

export const search = action({
    args: {
        query: v.string(),
        startIndex: v.optional(v.number()),
    },
    handler: async (ctx, args): Promise<SearchResultResponse> => {
        if (!args.query.trim()) {
            return {
                works: [],
                standalone: [],
                totalEditions: 0,
                totalItems: 0,
            };
        }

        const { results, totalItems } = await searchBooks(args.query, {
            startIndex: args.startIndex,
        });

        const hashMap = new Map<string, string>();
        const uniqueHashes = new Set<string>();

        for (const result of results) {
            const primaryAuthor = result.authors[0] ?? '';
            const hash = await generateLocalWorkHash(
                result.title,
                primaryAuthor
            );
            hashMap.set(result.externalId, hash);
            uniqueHashes.add(hash);
        }

        const existingWorks: Doc<'works'>[] = await ctx.runQuery(
            internal.search.getWorksByHashes,
            { hashes: [...uniqueHashes] }
        );

        const { works, standalone } = groupSearchResults(
            results,
            hashMap,
            existingWorks
        );

        const totalEditions =
            works.reduce((sum, w) => sum + w.editionCount, 0) +
            standalone.length;

        return { works, standalone, totalEditions, totalItems };
    },
});
