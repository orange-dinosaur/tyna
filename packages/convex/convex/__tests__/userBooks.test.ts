import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
    type ShelfStatus,
    type ShelfStore,
    createShelfStore,
    addToShelf,
    updateShelfStatus,
    removeFromShelf,
    getByUserAndBook,
    listByUserStatus,
} from '../lib/shelfLogic.js';

// --- Generators ---

const shelfStatusArb: fc.Arbitrary<ShelfStatus> = fc.constantFrom(
    'want_to_read',
    'reading',
    'finished',
    'dnf'
);

const userIdArb = fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `user_${s}`);
const bookIdArb = fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `book_${s}`);
const timestampArb = fc.integer({
    min: 1_000_000_000_000,
    max: 2_000_000_000_000,
});

// --- Property 1: Shelf add/query round-trip ---

describe('Feature: phase2-user-features, Property 1: Shelf add/query round-trip', () => {
    it('adding a book to shelf and querying returns the correct entry; removing and querying returns null', () => {
        fc.assert(
            fc.property(
                userIdArb,
                bookIdArb,
                shelfStatusArb,
                timestampArb,
                (userId, bookId, status, now) => {
                    const store = createShelfStore();

                    // Add to shelf
                    const { store: storeAfterAdd, entry } = addToShelf(
                        store,
                        userId,
                        bookId,
                        status,
                        now
                    );

                    // Query should return the entry with correct fields
                    const found = getByUserAndBook(
                        storeAfterAdd,
                        userId,
                        bookId
                    );
                    expect(found).not.toBeNull();
                    expect(found!.userId).toBe(userId);
                    expect(found!.bookId).toBe(bookId);
                    expect(found!.status).toBe(status);
                    expect(found!.createdAt).toBe(now);

                    // Remove from shelf
                    const storeAfterRemove = removeFromShelf(
                        storeAfterAdd,
                        userId,
                        bookId
                    );

                    // Query should return null
                    const notFound = getByUserAndBook(
                        storeAfterRemove,
                        userId,
                        bookId
                    );
                    expect(notFound).toBeNull();
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 2: Shelf status update reflects correctly ---

describe('Feature: phase2-user-features, Property 2: Shelf status update reflects correctly', () => {
    it('updating status changes the status and sets updatedAt >= createdAt', () => {
        fc.assert(
            fc.property(
                userIdArb,
                bookIdArb,
                shelfStatusArb,
                shelfStatusArb,
                timestampArb,
                timestampArb,
                (
                    userId,
                    bookId,
                    initialStatus,
                    newStatus,
                    createTime,
                    updateTime
                ) => {
                    // Ensure updateTime >= createTime
                    const t0 = Math.min(createTime, updateTime);
                    const t1 = Math.max(createTime, updateTime);

                    const store = createShelfStore();
                    const { store: storeAfterAdd } = addToShelf(
                        store,
                        userId,
                        bookId,
                        initialStatus,
                        t0
                    );

                    const storeAfterUpdate = updateShelfStatus(
                        storeAfterAdd,
                        userId,
                        bookId,
                        newStatus,
                        t1
                    );

                    const found = getByUserAndBook(
                        storeAfterUpdate,
                        userId,
                        bookId
                    );
                    expect(found).not.toBeNull();
                    expect(found!.status).toBe(newStatus);
                    expect(found!.updatedAt).toBe(t1);
                    expect(found!.updatedAt).toBeGreaterThanOrEqual(
                        found!.createdAt
                    );
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 3: Shelf filtering by status ---

describe('Feature: phase2-user-features, Property 3: Shelf filtering by status', () => {
    it('querying by status returns exactly the books with that status', () => {
        fc.assert(
            fc.property(
                userIdArb,
                fc.array(fc.tuple(bookIdArb, shelfStatusArb), {
                    minLength: 1,
                    maxLength: 15,
                }),
                shelfStatusArb,
                timestampArb,
                (userId, bookStatusPairs, queryStatus, now) => {
                    // Deduplicate bookIds
                    const seen = new Set<string>();
                    const uniquePairs = bookStatusPairs.filter(([bookId]) => {
                        if (seen.has(bookId)) return false;
                        seen.add(bookId);
                        return true;
                    });

                    // Build store with all entries
                    let store: ShelfStore = createShelfStore();
                    for (const [bookId, status] of uniquePairs) {
                        const result = addToShelf(
                            store,
                            userId,
                            bookId,
                            status,
                            now
                        );
                        store = result.store;
                    }

                    // Query by status
                    const filtered = listByUserStatus(
                        store,
                        userId,
                        queryStatus
                    );

                    // Expected: entries whose status matches queryStatus
                    const expected = uniquePairs.filter(
                        ([, status]) => status === queryStatus
                    );

                    expect(filtered.length).toBe(expected.length);

                    // Every returned entry has the correct status
                    for (const entry of filtered) {
                        expect(entry.status).toBe(queryStatus);
                        expect(entry.userId).toBe(userId);
                    }

                    // Every expected bookId is in the result
                    const filteredBookIds = new Set(
                        filtered.map((e) => e.bookId)
                    );
                    for (const [bookId, status] of uniquePairs) {
                        if (status === queryStatus) {
                            expect(filteredBookIds.has(bookId)).toBe(true);
                        }
                    }
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 4: Shelf uniqueness invariant ---

describe('Feature: phase2-user-features, Property 4: Shelf uniqueness invariant', () => {
    it('adding the same user+book twice throws, maintaining at most one entry', () => {
        fc.assert(
            fc.property(
                userIdArb,
                bookIdArb,
                shelfStatusArb,
                shelfStatusArb,
                timestampArb,
                timestampArb,
                (userId, bookId, status1, status2, t1, t2) => {
                    const store = createShelfStore();
                    const { store: storeAfterFirst } = addToShelf(
                        store,
                        userId,
                        bookId,
                        status1,
                        t1
                    );

                    // Second add with same user+book should throw
                    expect(() =>
                        addToShelf(storeAfterFirst, userId, bookId, status2, t2)
                    ).toThrow('Book already on shelf');

                    // Still only one entry for this user+book
                    const allEntries = storeAfterFirst.entries.filter(
                        (e) => e.userId === userId && e.bookId === bookId
                    );
                    expect(allEntries.length).toBe(1);
                }
            ),
            { numRuns: 100 }
        );
    });
});
