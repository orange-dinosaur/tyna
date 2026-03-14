import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
    createLibraryStore,
    createLibrary,
    removeLibrary,
    listByUser,
    addBookToLibrary,
    removeBookFromLibrary,
    listByLibrary,
} from '../lib/libraryLogic.js';

// --- Generators ---

const userIdArb = fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `user_${s}`);
const bookIdArb = fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `book_${s}`);
const libraryNameArb = fc.string({ minLength: 1, maxLength: 100 });
const descriptionArb = fc.option(fc.string({ minLength: 1, maxLength: 200 }), {
    nil: undefined,
});
const colorArb = fc.option(
    fc.string({ minLength: 6, maxLength: 6 }).map((s: string) => `#${s}`),
    {
        nil: undefined,
    }
);
const timestampArb = fc.integer({
    min: 1_000_000_000_000,
    max: 2_000_000_000_000,
});

// --- Property 17: Library create and list round-trip ---

describe('Feature: phase2-user-features, Property 17: Library create and list round-trip', () => {
    it('creating a library and listing by user includes it with correct fields', () => {
        fc.assert(
            fc.property(
                userIdArb,
                libraryNameArb,
                fc.boolean(),
                descriptionArb,
                colorArb,
                timestampArb,
                (userId, name, isPublic, description, color, now) => {
                    let store = createLibraryStore();

                    const result = createLibrary(
                        store,
                        userId,
                        name,
                        isPublic,
                        now,
                        description,
                        color
                    );
                    store = result.store;

                    const libraries = listByUser(store, userId);
                    expect(libraries.length).toBe(1);
                    expect(libraries[0]!.userId).toBe(userId);
                    expect(libraries[0]!.name).toBe(name);
                    expect(libraries[0]!.isPublic).toBe(isPublic);
                    expect(libraries[0]!.description).toBe(description);
                    expect(libraries[0]!.color).toBe(color);
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 19: Library cascade delete ---

describe('Feature: phase2-user-features, Property 19: Library cascade delete', () => {
    it('deleting a library removes it and all associated libraryBooks entries', () => {
        fc.assert(
            fc.property(
                userIdArb,
                libraryNameArb,
                fc.array(bookIdArb, { minLength: 0, maxLength: 10 }),
                timestampArb,
                (userId, name, bookIds, baseTime) => {
                    let store = createLibraryStore();

                    // Create library
                    const libResult = createLibrary(
                        store,
                        userId,
                        name,
                        true,
                        baseTime
                    );
                    store = libResult.store;
                    const libraryId = libResult.library.id;

                    // Add unique books to library
                    const uniqueBookIds = [...new Set(bookIds)];
                    for (let i = 0; i < uniqueBookIds.length; i++) {
                        const addResult = addBookToLibrary(
                            store,
                            userId,
                            libraryId,
                            uniqueBookIds[i]!,
                            baseTime + i + 1
                        );
                        store = addResult.store;
                    }

                    // Verify books are in library
                    expect(listByLibrary(store, libraryId).length).toBe(
                        uniqueBookIds.length
                    );

                    // Delete library
                    const deleteResult = removeLibrary(
                        store,
                        userId,
                        libraryId
                    );
                    store = deleteResult.store;

                    // Library should be gone
                    expect(listByUser(store, userId).length).toBe(0);

                    // All libraryBooks should be gone
                    expect(listByLibrary(store, libraryId).length).toBe(0);
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 20: Library book add/remove round-trip ---

describe('Feature: phase2-user-features, Property 20: Library book add/remove round-trip', () => {
    it('adding a book to a library and querying includes it; removing and querying does not', () => {
        fc.assert(
            fc.property(
                userIdArb,
                libraryNameArb,
                bookIdArb,
                timestampArb,
                (userId, name, bookId, baseTime) => {
                    let store = createLibraryStore();

                    // Create library
                    const libResult = createLibrary(
                        store,
                        userId,
                        name,
                        true,
                        baseTime
                    );
                    store = libResult.store;
                    const libraryId = libResult.library.id;

                    // Add book
                    const addResult = addBookToLibrary(
                        store,
                        userId,
                        libraryId,
                        bookId,
                        baseTime + 1
                    );
                    store = addResult.store;

                    // Query should include the book
                    const books = listByLibrary(store, libraryId);
                    expect(books.length).toBe(1);
                    expect(books[0]!.bookId).toBe(bookId);
                    expect(books[0]!.libraryId).toBe(libraryId);

                    // Remove book
                    const removeResult = removeBookFromLibrary(
                        store,
                        userId,
                        libraryId,
                        bookId
                    );
                    store = removeResult.store;

                    // Query should be empty
                    expect(listByLibrary(store, libraryId).length).toBe(0);
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 21: Library book uniqueness ---

describe('Feature: phase2-user-features, Property 21: Library book uniqueness', () => {
    it('adding the same book twice to a library should fail on the second attempt', () => {
        fc.assert(
            fc.property(
                userIdArb,
                libraryNameArb,
                bookIdArb,
                timestampArb,
                (userId, name, bookId, baseTime) => {
                    let store = createLibraryStore();

                    // Create library
                    const libResult = createLibrary(
                        store,
                        userId,
                        name,
                        true,
                        baseTime
                    );
                    store = libResult.store;
                    const libraryId = libResult.library.id;

                    // Add book first time — should succeed
                    const addResult = addBookToLibrary(
                        store,
                        userId,
                        libraryId,
                        bookId,
                        baseTime + 1
                    );
                    store = addResult.store;

                    // Add same book again — should throw
                    expect(() =>
                        addBookToLibrary(
                            store,
                            userId,
                            libraryId,
                            bookId,
                            baseTime + 2
                        )
                    ).toThrow('Book already in library');

                    // Should still have exactly one entry
                    expect(listByLibrary(store, libraryId).length).toBe(1);
                }
            ),
            { numRuns: 100 }
        );
    });
});
