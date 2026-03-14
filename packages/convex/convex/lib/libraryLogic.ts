/**
 * Pure library logic extracted for testability.
 * These functions encapsulate the core business rules from libraries.ts
 * and libraryBooks.ts without Convex DB dependencies.
 */

export interface LibraryEntry {
    id: string;
    userId: string;
    name: string;
    description?: string;
    isPublic: boolean;
    color?: string;
    createdAt: number;
    updatedAt: number;
}

export interface LibraryBookEntry {
    id: string;
    libraryId: string;
    bookId: string;
    addedAt: number;
}

export interface LibraryStore {
    libraries: LibraryEntry[];
    libraryBooks: LibraryBookEntry[];
}

export function createLibraryStore(): LibraryStore {
    return { libraries: [], libraryBooks: [] };
}

let idCounter = 0;
function nextId(prefix: string): string {
    return `${prefix}_${++idCounter}`;
}

/**
 * Create a library.
 */
export function createLibrary(
    store: LibraryStore,
    userId: string,
    name: string,
    isPublic: boolean,
    now: number,
    description?: string,
    color?: string
): { store: LibraryStore; library: LibraryEntry } {
    const library: LibraryEntry = {
        id: nextId('lib'),
        userId,
        name,
        description,
        isPublic,
        color,
        createdAt: now,
        updatedAt: now,
    };

    return {
        store: { ...store, libraries: [...store.libraries, library] },
        library,
    };
}

/**
 * Remove a library and all associated libraryBooks entries (cascade).
 */
export function removeLibrary(
    store: LibraryStore,
    userId: string,
    libraryId: string
): { store: LibraryStore } {
    const library = store.libraries.find((l) => l.id === libraryId);
    if (!library) {
        throw new Error('Library not found');
    }
    if (library.userId !== userId) {
        throw new Error('Not authorized');
    }

    return {
        store: {
            libraries: store.libraries.filter((l) => l.id !== libraryId),
            libraryBooks: store.libraryBooks.filter(
                (lb) => lb.libraryId !== libraryId
            ),
        },
    };
}

/**
 * List all libraries for a user.
 */
export function listByUser(
    store: LibraryStore,
    userId: string
): LibraryEntry[] {
    return store.libraries.filter((l) => l.userId === userId);
}

/**
 * Add a book to a library. Verifies ownership and uniqueness.
 */
export function addBookToLibrary(
    store: LibraryStore,
    userId: string,
    libraryId: string,
    bookId: string,
    now: number
): { store: LibraryStore; entry: LibraryBookEntry } {
    const library = store.libraries.find((l) => l.id === libraryId);
    if (!library) {
        throw new Error('Library not found');
    }
    if (library.userId !== userId) {
        throw new Error('Not authorized');
    }

    const existing = store.libraryBooks.find(
        (lb) => lb.libraryId === libraryId && lb.bookId === bookId
    );
    if (existing) {
        throw new Error('Book already in library');
    }

    const entry: LibraryBookEntry = {
        id: nextId('lb'),
        libraryId,
        bookId,
        addedAt: now,
    };

    return {
        store: {
            ...store,
            libraryBooks: [...store.libraryBooks, entry],
        },
        entry,
    };
}

/**
 * Remove a book from a library. Verifies ownership.
 */
export function removeBookFromLibrary(
    store: LibraryStore,
    userId: string,
    libraryId: string,
    bookId: string
): { store: LibraryStore } {
    const library = store.libraries.find((l) => l.id === libraryId);
    if (!library) {
        throw new Error('Library not found');
    }
    if (library.userId !== userId) {
        throw new Error('Not authorized');
    }

    const entry = store.libraryBooks.find(
        (lb) => lb.libraryId === libraryId && lb.bookId === bookId
    );
    if (!entry) {
        throw new Error('Book not in library');
    }

    return {
        store: {
            ...store,
            libraryBooks: store.libraryBooks.filter((lb) => lb.id !== entry.id),
        },
    };
}

/**
 * List all books in a library.
 */
export function listByLibrary(
    store: LibraryStore,
    libraryId: string
): LibraryBookEntry[] {
    return store.libraryBooks.filter((lb) => lb.libraryId === libraryId);
}
