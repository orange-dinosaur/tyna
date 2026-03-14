import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseOpenLibraryResponse } from '../lib/openLibrary.js';
import {
    createEnrichmentStore,
    markProcessing,
    applyFailure,
    resolveFailure,
    type EnrichmentEntry,
} from '../lib/enrichmentLogic.js';

// --- Generators ---

const workKeyArb = fc
    .string({ minLength: 1, maxLength: 30 })
    .map((s) => `/works/OL${s}`);

const timestampArb = fc.integer({
    min: 1_000_000_000_000,
    max: 2_000_000_000_000,
});

const errorMessageArb = fc.string({ minLength: 1, maxLength: 100 });

// --- Property 24: Open Library response parsing ---

describe('Feature: phase2-user-features, Property 24: Open Library response parsing', () => {
    it('for any valid response with a works array containing a key string, the parser extracts the work ID; for empty/missing works, it returns null', () => {
        fc.assert(
            fc.property(workKeyArb, (workKey) => {
                // Valid response with works array
                const validResponse = {
                    works: [{ key: workKey }],
                };
                const result = parseOpenLibraryResponse(validResponse);
                expect(result).not.toBeNull();
                expect(result!.workId).toBe(workKey);
            }),
            { numRuns: 100 }
        );
    });

    it('returns null for responses without a valid works array', () => {
        fc.assert(
            fc.property(
                fc.oneof(
                    // Empty object
                    fc.constant({}),
                    // works is not an array
                    fc.constant({ works: 'not-an-array' }),
                    // works is an empty array
                    fc.constant({ works: [] }),
                    // works[0] has no key
                    fc.constant({ works: [{ title: 'something' }] }),
                    // works[0].key is not a string
                    fc.constant({ works: [{ key: 123 }] }),
                    // works is null
                    fc.constant({ works: null }),
                    // Random object without works
                    fc.dictionary(
                        fc.string().filter((s) => s !== 'works'),
                        fc.string()
                    )
                ),
                (response) => {
                    const result = parseOpenLibraryResponse(
                        response as Record<string, unknown>
                    );
                    expect(result).toBeNull();
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 26: Enrichment failure retry with max attempts ---

describe('Feature: phase2-user-features, Property 26: Enrichment failure retry with max attempts', () => {
    it('if attempts < 3, failure resets status to pending; if attempts >= 3, status is set to failed', () => {
        const attemptsArb = fc.integer({ min: 0, max: 10 });

        fc.assert(
            fc.property(
                attemptsArb,
                errorMessageArb,
                timestampArb,
                (attempts, error, now) => {
                    const entry: EnrichmentEntry = {
                        id: 'entry_1',
                        bookId: 'book_1',
                        workId: 'work_1',
                        isbn: '978-0-123456-78-9',
                        status: 'processing',
                        attempts,
                        lastAttemptAt: now,
                        createdAt: now - 10000,
                    };

                    const resolution = resolveFailure(entry, error);

                    if (attempts >= 3) {
                        expect(resolution.status).toBe('failed');
                    } else {
                        expect(resolution.status).toBe('pending');
                    }
                    expect(resolution.error).toBe(error);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('applying failure through the store correctly updates the entry status based on attempts', () => {
        const attemptsArb = fc.integer({ min: 0, max: 10 });

        fc.assert(
            fc.property(
                attemptsArb,
                errorMessageArb,
                timestampArb,
                (attempts, error, now) => {
                    const entry: EnrichmentEntry = {
                        id: 'entry_1',
                        bookId: 'book_1',
                        workId: 'work_1',
                        status: 'processing',
                        attempts,
                        lastAttemptAt: now,
                        createdAt: now - 10000,
                    };

                    let store = createEnrichmentStore();
                    store = { entries: [entry] };

                    const result = applyFailure(store, 'entry_1', error);
                    const updated = result.store.entries.find(
                        (e) => e.id === 'entry_1'
                    );

                    expect(updated).toBeDefined();
                    expect(updated!.error).toBe(error);

                    if (attempts >= 3) {
                        expect(updated!.status).toBe('failed');
                    } else {
                        expect(updated!.status).toBe('pending');
                    }
                }
            ),
            { numRuns: 100 }
        );
    });
});
