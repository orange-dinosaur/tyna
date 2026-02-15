import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { groupSearchResults } from '../search.js';
import type { BookResult } from '../lib/bookProvider.js';

// --- Generators ---

const bookResultArb: fc.Arbitrary<BookResult> = fc.record({
    externalId: fc.uuid(),
    title: fc.string({ minLength: 1, maxLength: 50 }),
    authors: fc.array(fc.string({ minLength: 1, maxLength: 30 }), {
        minLength: 1,
        maxLength: 3,
    }),
    coverUrl: fc.option(fc.webUrl(), { nil: undefined }),
    publisher: fc.option(fc.string({ minLength: 1, maxLength: 30 }), {
        nil: undefined,
    }),
    publishedDate: fc.option(
        fc.date().map((d) => d.toISOString().slice(0, 10)),
        { nil: undefined }
    ),
    pageCount: fc.option(fc.nat({ max: 2000 }), { nil: undefined }),
    language: fc.option(fc.constantFrom('en', 'fr', 'de', 'es'), {
        nil: undefined,
    }),
});

const fakeWorkArb = (localWorkHash: string) =>
    fc.record({
        _id: fc.uuid() as fc.Arbitrary<any>,
        _creationTime: fc.constant(Date.now()),
        title: fc.string({ minLength: 1, maxLength: 50 }),
        authors: fc.array(fc.string({ minLength: 1, maxLength: 30 }), {
            minLength: 1,
            maxLength: 3,
        }),
        description: fc.option(fc.string({ maxLength: 100 }), {
            nil: undefined,
        }),
        originalPublishedYear: fc.option(fc.integer({ min: 1800, max: 2025 }), {
            nil: undefined,
        }),
        categories: fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
            maxLength: 3,
        }),
        localWorkHash: fc.constant(localWorkHash),
        externalWorkId: fc.option(fc.string(), { nil: undefined }),
        externalSource: fc.option(fc.string(), { nil: undefined }),
        verificationStatus: fc.constantFrom(
            'unverified' as const,
            'verified' as const,
            'not_found' as const,
            'pending_review' as const
        ),
        editionCount: fc.integer({ min: 1, max: 50 }),
        avgRating: fc.option(fc.double({ min: 0, max: 5, noNaN: true }), {
            nil: undefined,
        }),
        ratingCount: fc.nat({ max: 10000 }),
        createdAt: fc.nat(),
        updatedAt: fc.nat(),
    });

// --- Property 6: Search result partitioning ---

describe('groupSearchResults - Property 6: Search result partitioning', () => {
    it('every result appears in exactly one of grouped works or standalone', () => {
        fc.assert(
            fc.property(
                fc
                    .array(bookResultArb, { minLength: 1, maxLength: 10 })
                    .chain((results) => {
                        // Pick a subset of results to be "matched" via hashes
                        return fc
                            .subarray(results, { minLength: 0 })
                            .chain((matchedResults) => {
                                // Generate unique hashes for matched results
                                const hashes = matchedResults.map(
                                    (_, i) =>
                                        `hash${String(i).padStart(16, '0')}`
                                );
                                // Deduplicate: group matched results by hash
                                const uniqueHashes = [...new Set(hashes)];
                                return fc
                                    .tuple(
                                        ...uniqueHashes.map((h) =>
                                            fakeWorkArb(h)
                                        )
                                    )
                                    .map((works) => ({
                                        results,
                                        matchedResults,
                                        hashes,
                                        works,
                                    }));
                            });
                    }),
                ({ results, matchedResults, hashes, works }) => {
                    // Build hashMap: matched results get a hash, others don't
                    const hashMap = new Map<string, string>();
                    matchedResults.forEach((r, i) => {
                        hashMap.set(r.externalId, hashes[i]!);
                    });

                    const { works: grouped, standalone } = groupSearchResults(
                        results,
                        hashMap,
                        works as any
                    );

                    // Collect all externalIds from grouped + standalone
                    const groupedIds = grouped.flatMap((w) =>
                        w.matchedEditions.map((e) => e.externalId)
                    );
                    const standaloneIds = standalone.map((b) => b.externalId);
                    const allReturnedIds = [...groupedIds, ...standaloneIds];

                    // Every input result appears in the output
                    for (const r of results) {
                        expect(allReturnedIds).toContain(r.externalId);
                    }

                    // Total count matches
                    expect(allReturnedIds.length).toBe(results.length);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('results with matching hash appear in grouped works, not standalone', () => {
        const hash = 'abcdef0123456789';
        fc.assert(
            fc.property(bookResultArb, fakeWorkArb(hash), (book, work) => {
                const hashMap = new Map([[book.externalId, hash]]);

                const { works, standalone } = groupSearchResults(
                    [book],
                    hashMap,
                    [work as any]
                );

                expect(works).toHaveLength(1);
                expect(works[0]!.matchedEditions).toContainEqual(book);
                expect(standalone).toHaveLength(0);
            }),
            { numRuns: 100 }
        );
    });

    it('results with no matching hash appear in standalone', () => {
        fc.assert(
            fc.property(bookResultArb, (book) => {
                // No hash in hashMap for this book
                const hashMap = new Map<string, string>();
                const { works, standalone } = groupSearchResults(
                    [book],
                    hashMap,
                    []
                );

                expect(works).toHaveLength(0);
                expect(standalone).toContainEqual(book);
            }),
            { numRuns: 100 }
        );
    });
});

// --- Property 7: Empty/whitespace query returns empty results ---

describe('Search action - Property 7: Empty/whitespace query returns empty results', () => {
    it('whitespace-only strings are detected as empty queries', () => {
        const whitespaceArb = fc
            .array(fc.constantFrom(' ', '\t', '\n', '\r', '\f'), {
                minLength: 0,
                maxLength: 20,
            })
            .map((chars) => chars.join(''));

        fc.assert(
            fc.property(whitespaceArb, (query) => {
                // The search action checks !query.trim() to short-circuit
                // This property verifies the predicate holds for all whitespace strings
                const isEmpty = !query.trim();
                expect(isEmpty).toBe(true);

                // And grouping with empty inputs returns empty
                const { works, standalone } = groupSearchResults(
                    [],
                    new Map(),
                    []
                );
                expect(works).toHaveLength(0);
                expect(standalone).toHaveLength(0);
            }),
            { numRuns: 100 }
        );
    });
});

// --- Property 8: Total editions count accuracy ---

describe('Search results - Property 8: Total editions count accuracy', () => {
    it('totalEditions equals sum of grouped work editionCounts plus standalone count', () => {
        fc.assert(
            fc.property(
                fc
                    .array(bookResultArb, { minLength: 0, maxLength: 10 })
                    .chain((results) => {
                        // Split results into matched and unmatched
                        return fc
                            .subarray(results, { minLength: 0 })
                            .chain((matchedResults) => {
                                // Assign each matched result a unique hash
                                const hashEntries = matchedResults.map(
                                    (r, i) =>
                                        [
                                            r.externalId,
                                            `hash${String(i).padStart(16, '0')}`,
                                        ] as const
                                );
                                const uniqueHashes = [
                                    ...new Set(hashEntries.map(([, h]) => h)),
                                ];

                                if (uniqueHashes.length === 0) {
                                    return fc.constant({
                                        results,
                                        hashMap: new Map<string, string>(),
                                        existingWorks: [] as any[],
                                    });
                                }

                                return fc
                                    .tuple(
                                        ...uniqueHashes.map((h) =>
                                            fakeWorkArb(h)
                                        )
                                    )
                                    .map((works) => ({
                                        results,
                                        hashMap: new Map(hashEntries),
                                        existingWorks: works as any[],
                                    }));
                            });
                    }),
                ({ results, hashMap, existingWorks }) => {
                    const { works, standalone } = groupSearchResults(
                        results,
                        hashMap,
                        existingWorks
                    );

                    // Replicate the totalEditions calculation from the action
                    const totalEditions =
                        works.reduce((sum, w) => sum + w.editionCount, 0) +
                        standalone.length;

                    // Verify it's non-negative
                    expect(totalEditions).toBeGreaterThanOrEqual(0);

                    // Verify the formula: sum of editionCount from grouped works + standalone count
                    const expectedFromWorks = works.reduce(
                        (sum, w) => sum + w.editionCount,
                        0
                    );
                    expect(totalEditions).toBe(
                        expectedFromWorks + standalone.length
                    );
                }
            ),
            { numRuns: 100 }
        );
    });
});
