/**
 * Pure enrichment logic extracted for testability.
 * Encapsulates the retry/failure business rules from enrichment.ts
 * without Convex DB dependencies.
 */

export interface EnrichmentEntry {
    id: string;
    bookId: string;
    workId: string;
    isbn?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    attempts: number;
    lastAttemptAt?: number;
    error?: string;
    createdAt: number;
}

export interface EnrichmentStore {
    entries: EnrichmentEntry[];
}

export function createEnrichmentStore(): EnrichmentStore {
    return { entries: [] };
}

/**
 * Determine the outcome of a failed enrichment attempt.
 * If attempts >= 3, the entry should be marked as 'failed'.
 * Otherwise, it should be reset to 'pending' for retry.
 */
export function resolveFailure(
    entry: EnrichmentEntry,
    error: string
): { status: 'pending' | 'failed'; error: string } {
    if (entry.attempts >= 3) {
        return { status: 'failed', error };
    }
    return { status: 'pending', error };
}

/**
 * Apply a failure resolution to an enrichment entry in the store.
 */
export function applyFailure(
    store: EnrichmentStore,
    entryId: string,
    error: string
): { store: EnrichmentStore } {
    const entry = store.entries.find((e) => e.id === entryId);
    if (!entry) {
        throw new Error('Entry not found');
    }

    const resolution = resolveFailure(entry, error);
    const updated: EnrichmentEntry = {
        ...entry,
        status: resolution.status,
        error: resolution.error,
    };

    return {
        store: {
            entries: store.entries.map((e) => (e.id === entryId ? updated : e)),
        },
    };
}

/**
 * Mark an entry as processing and increment attempts.
 */
export function markProcessing(
    store: EnrichmentStore,
    entryId: string,
    now: number
): { store: EnrichmentStore } {
    const entry = store.entries.find((e) => e.id === entryId);
    if (!entry) {
        throw new Error('Entry not found');
    }

    const updated: EnrichmentEntry = {
        ...entry,
        status: 'processing',
        attempts: entry.attempts + 1,
        lastAttemptAt: now,
    };

    return {
        store: {
            entries: store.entries.map((e) => (e.id === entryId ? updated : e)),
        },
    };
}
