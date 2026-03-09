/**
 * Pure shelf management logic extracted for testability.
 * These functions encapsulate the core business rules from userBooks.ts
 * without Convex DB dependencies.
 */

export type ShelfStatus = 'want_to_read' | 'reading' | 'finished' | 'dnf';

export interface ShelfEntry {
    id: string;
    userId: string;
    bookId: string;
    status: ShelfStatus;
    isFavorite: boolean;
    startedAt?: number;
    finishedAt?: number;
    createdAt: number;
    updatedAt: number;
}

export interface ShelfStore {
    entries: ShelfEntry[];
}

export function createShelfStore(): ShelfStore {
    return { entries: [] };
}

export function addToShelf(
    store: ShelfStore,
    userId: string,
    bookId: string,
    status: ShelfStatus,
    now: number
): { store: ShelfStore; entry: ShelfEntry } {
    const existing = store.entries.find(
        (e) => e.userId === userId && e.bookId === bookId
    );
    if (existing) {
        throw new Error('Book already on shelf');
    }

    const entry: ShelfEntry = {
        id: `${userId}_${bookId}`,
        userId,
        bookId,
        status,
        isFavorite: false,
        startedAt: status === 'reading' ? now : undefined,
        finishedAt: undefined,
        createdAt: now,
        updatedAt: now,
    };

    return {
        store: { entries: [...store.entries, entry] },
        entry,
    };
}

export function updateShelfStatus(
    store: ShelfStore,
    userId: string,
    bookId: string,
    newStatus: ShelfStatus,
    now: number
): ShelfStore {
    const idx = store.entries.findIndex(
        (e) => e.userId === userId && e.bookId === bookId
    );
    if (idx === -1) {
        throw new Error('Book not on shelf');
    }

    const existing = store.entries[idx]!;
    const updated: ShelfEntry = {
        ...existing,
        status: newStatus,
        updatedAt: now,
        startedAt:
            newStatus === 'reading' && !existing.startedAt
                ? now
                : existing.startedAt,
        finishedAt: newStatus === 'finished' ? now : existing.finishedAt,
    };

    const newEntries = [...store.entries];
    newEntries[idx] = updated;
    return { entries: newEntries };
}

export function removeFromShelf(
    store: ShelfStore,
    userId: string,
    bookId: string
): ShelfStore {
    const idx = store.entries.findIndex(
        (e) => e.userId === userId && e.bookId === bookId
    );
    if (idx === -1) {
        throw new Error('Book not on shelf');
    }
    return { entries: store.entries.filter((_, i) => i !== idx) };
}

export function getByUserAndBook(
    store: ShelfStore,
    userId: string,
    bookId: string
): ShelfEntry | null {
    return (
        store.entries.find((e) => e.userId === userId && e.bookId === bookId) ??
        null
    );
}

export function listByUserStatus(
    store: ShelfStore,
    userId: string,
    status: ShelfStatus
): ShelfEntry[] {
    return store.entries.filter(
        (e) => e.userId === userId && e.status === status
    );
}
