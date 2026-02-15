import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { normalizeForMatching, generateLocalWorkHash } from '../workMatcher.js';

describe('normalizeForMatching - Property 1: Normalization output invariants', () => {
    it('output is entirely lowercase', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const result = normalizeForMatching(input);
                expect(result).toBe(result.toLowerCase());
            }),
            { numRuns: 100 }
        );
    });

    it('output contains only lowercase alphanumeric characters and spaces', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const result = normalizeForMatching(input);
                expect(result).toMatch(/^[a-z0-9 ]*$/);
            }),
            { numRuns: 100 }
        );
    });

    it('output contains no consecutive spaces', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const result = normalizeForMatching(input);
                expect(result).not.toMatch(/  /);
            }),
            { numRuns: 100 }
        );
    });

    it('output does not start with a leading article', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const result = normalizeForMatching(input);
                expect(result).not.toMatch(/^(the|an|a) /);
            }),
            { numRuns: 100 }
        );
    });

    it('output has no leading or trailing whitespace', () => {
        fc.assert(
            fc.property(fc.string(), (input) => {
                const result = normalizeForMatching(input);
                expect(result).toBe(result.trim());
            }),
            { numRuns: 100 }
        );
    });
});

describe('generateLocalWorkHash - Property 2: Hash format and determinism', () => {
    it('returns a 16-character hexadecimal string', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string(),
                fc.string(),
                async (title, author) => {
                    const hash = await generateLocalWorkHash(title, author);
                    expect(hash).toHaveLength(16);
                    expect(hash).toMatch(/^[0-9a-f]{16}$/);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('is deterministic - same inputs produce same output', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string(),
                fc.string(),
                async (title, author) => {
                    const hash1 = await generateLocalWorkHash(title, author);
                    const hash2 = await generateLocalWorkHash(title, author);
                    expect(hash1).toBe(hash2);
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('generateLocalWorkHash - Property 3: Hash equivalence under normalization variants', () => {
    it('produces same hash regardless of casing', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string(),
                fc.string(),
                async (title, author) => {
                    const hash1 = await generateLocalWorkHash(title, author);
                    const hash2 = await generateLocalWorkHash(
                        title.toUpperCase(),
                        author.toUpperCase()
                    );
                    expect(hash1).toBe(hash2);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('produces same hash regardless of extra whitespace', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string(),
                fc.string(),
                async (title, author) => {
                    const hash1 = await generateLocalWorkHash(title, author);
                    const hash2 = await generateLocalWorkHash(
                        `  ${title}  `,
                        `  ${author}  `
                    );
                    expect(hash1).toBe(hash2);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('produces same hash regardless of leading articles', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc
                    .string({ minLength: 1 })
                    .map((s) => s.replace(/[^a-zA-Z ]/g, 'x').trim() || 'book'),
                fc
                    .string({ minLength: 1 })
                    .map(
                        (s) => s.replace(/[^a-zA-Z ]/g, 'x').trim() || 'author'
                    ),
                fc.constantFrom('The ', 'A ', 'An '),
                async (title, author, article) => {
                    const hash1 = await generateLocalWorkHash(title, author);
                    const hash2 = await generateLocalWorkHash(
                        article + title,
                        author
                    );
                    expect(hash1).toBe(hash2);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('produces same hash regardless of punctuation', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string(),
                fc.string(),
                async (title, author) => {
                    const hash1 = await generateLocalWorkHash(title, author);
                    const hash2 = await generateLocalWorkHash(
                        title + '!@#$%',
                        author + '.,;:'
                    );
                    expect(hash1).toBe(hash2);
                }
            ),
            { numRuns: 100 }
        );
    });
});
