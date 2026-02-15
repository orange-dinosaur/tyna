import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseVolumeItem, extractIsbns } from '../googleBooksProvider.js';

const volumeItemArb = fc.record({
    id: fc.string({ minLength: 1 }),
    volumeInfo: fc.record({
        title: fc.string({ minLength: 1 }),
        subtitle: fc.option(fc.string(), { nil: undefined }),
        authors: fc.option(
            fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
            { nil: undefined }
        ),
        description: fc.option(fc.string(), { nil: undefined }),
        imageLinks: fc.option(fc.record({ thumbnail: fc.webUrl() }), {
            nil: undefined,
        }),
        industryIdentifiers: fc.option(
            fc.array(
                fc.record({
                    type: fc.constantFrom('ISBN_10', 'ISBN_13', 'OTHER'),
                    identifier: fc.string({ minLength: 1 }),
                }),
                { minLength: 0, maxLength: 3 }
            ),
            { nil: undefined }
        ),
        publisher: fc.option(fc.string(), { nil: undefined }),
        publishedDate: fc.option(fc.string(), { nil: undefined }),
        pageCount: fc.option(fc.nat({ max: 10000 }), { nil: undefined }),
        language: fc.option(fc.constantFrom('en', 'fr', 'de', 'es', 'ja'), {
            nil: undefined,
        }),
    }),
});

describe('parseVolumeItem - Property 4: Google Books response field extraction', () => {
    it('extracts all present fields into BookResult structure', () => {
        fc.assert(
            fc.property(volumeItemArb, (item) => {
                const result = parseVolumeItem(item as Record<string, unknown>);
                expect(result).not.toBeNull();
                if (!result) return;

                const vol = item.volumeInfo;

                // Required fields
                expect(result.externalId).toBe(item.id);
                expect(result.title).toBe(vol.title);

                // Authors default to empty array when missing
                expect(result.authors).toEqual(vol.authors ?? []);

                // Optional string fields
                expect(result.subtitle).toBe(vol.subtitle);
                expect(result.description).toBe(vol.description);
                expect(result.publisher).toBe(vol.publisher);
                expect(result.publishedDate).toBe(vol.publishedDate);
                expect(result.language).toBe(vol.language);

                // Optional number field
                expect(result.pageCount).toBe(vol.pageCount);

                // Cover URL extracted from imageLinks.thumbnail
                if (vol.imageLinks?.thumbnail) {
                    expect(result.coverUrl).toBe(
                        vol.imageLinks.thumbnail.replace(/^http:/, 'https:')
                    );
                } else {
                    expect(result.coverUrl).toBeUndefined();
                }
            }),
            { numRuns: 100 }
        );
    });

    it('returns null when volumeInfo is missing', () => {
        fc.assert(
            fc.property(fc.record({ id: fc.string() }), (item) => {
                const result = parseVolumeItem(item as Record<string, unknown>);
                expect(result).toBeNull();
            }),
            { numRuns: 100 }
        );
    });

    it('returns null when title is missing', () => {
        fc.assert(
            fc.property(
                fc.record({
                    id: fc.string(),
                    volumeInfo: fc.record({
                        authors: fc.array(fc.string()),
                    }),
                }),
                (item) => {
                    const result = parseVolumeItem(
                        item as Record<string, unknown>
                    );
                    expect(result).toBeNull();
                }
            ),
            { numRuns: 100 }
        );
    });
});

const identifiersArb = fc.array(
    fc.record({
        type: fc.constantFrom('ISBN_10', 'ISBN_13', 'OTHER', 'ISSN'),
        identifier: fc.string({ minLength: 1, maxLength: 20 }),
    }),
    { minLength: 0, maxLength: 5 }
);

describe('extractIsbns - Property 5: ISBN extraction from industryIdentifiers', () => {
    it('extracts ISBN_10 and ISBN_13 correctly from identifiers', () => {
        fc.assert(
            fc.property(identifiersArb, (identifiers) => {
                const result = extractIsbns(identifiers);

                // Implementation iterates and overwrites, so last match wins
                const isbn10Matches = identifiers.filter(
                    (id) => id.type === 'ISBN_10'
                );
                const expectedIsbn10 =
                    isbn10Matches.length > 0
                        ? isbn10Matches[isbn10Matches.length - 1]
                        : undefined;
                const isbn13Matches = identifiers.filter(
                    (id) => id.type === 'ISBN_13'
                );
                const expectedIsbn13 =
                    isbn13Matches.length > 0
                        ? isbn13Matches[isbn13Matches.length - 1]
                        : undefined;

                if (expectedIsbn10) {
                    expect(result.isbn10).toBe(expectedIsbn10.identifier);
                } else {
                    expect(result.isbn10).toBeUndefined();
                }

                if (expectedIsbn13) {
                    expect(result.isbn13).toBe(expectedIsbn13.identifier);
                } else {
                    expect(result.isbn13).toBeUndefined();
                }
            }),
            { numRuns: 100 }
        );
    });

    it('returns empty object when identifiers is undefined', () => {
        const result = extractIsbns(undefined);
        expect(result.isbn10).toBeUndefined();
        expect(result.isbn13).toBeUndefined();
    });

    it('returns empty object when no ISBN types are present', () => {
        fc.assert(
            fc.property(
                fc.array(
                    fc.record({
                        type: fc.constantFrom('OTHER', 'ISSN', 'ASIN'),
                        identifier: fc.string({ minLength: 1 }),
                    }),
                    { minLength: 1, maxLength: 5 }
                ),
                (identifiers) => {
                    const result = extractIsbns(identifiers);
                    expect(result.isbn10).toBeUndefined();
                    expect(result.isbn13).toBeUndefined();
                }
            ),
            { numRuns: 100 }
        );
    });
});
