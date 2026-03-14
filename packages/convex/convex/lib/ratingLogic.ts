/**
 * Pure rating logic extracted for testability.
 * These functions encapsulate the core business rules from ratings.ts
 * without Convex DB dependencies.
 */

export interface RatingEntry {
    id: string;
    userId: string;
    workId: string;
    score: number;
    createdAt: number;
    updatedAt: number;
}

export interface WorkAggregate {
    avgRating: number | undefined;
    ratingCount: number;
}

export interface RatingStore {
    ratings: RatingEntry[];
}

export function createRatingStore(): RatingStore {
    return { ratings: [] };
}

/**
 * Validate that a score is an integer in [1, 5].
 * Throws if invalid.
 */
export function validateScore(score: number): void {
    if (!Number.isInteger(score) || score < 1 || score > 5) {
        throw new Error('Score must be an integer between 1 and 5');
    }
}

/**
 * Recalculate the aggregate rating for a work based on all ratings in the store.
 */
export function recalculateWorkRating(
    store: RatingStore,
    workId: string
): WorkAggregate {
    const workRatings = store.ratings.filter((r) => r.workId === workId);
    if (workRatings.length === 0) {
        return { avgRating: undefined, ratingCount: 0 };
    }
    const sum = workRatings.reduce((acc, r) => acc + r.score, 0);
    return {
        avgRating: sum / workRatings.length,
        ratingCount: workRatings.length,
    };
}

/**
 * Rate a work (upsert). Returns the updated store and the aggregate.
 */
export function rate(
    store: RatingStore,
    userId: string,
    workId: string,
    score: number,
    now: number
): { store: RatingStore; aggregate: WorkAggregate } {
    validateScore(score);

    const existingIdx = store.ratings.findIndex(
        (r) => r.userId === userId && r.workId === workId
    );

    let newRatings: RatingEntry[];
    if (existingIdx !== -1) {
        // Update existing
        newRatings = [...store.ratings];
        newRatings[existingIdx] = {
            ...newRatings[existingIdx]!,
            score,
            updatedAt: now,
        };
    } else {
        // Create new
        const entry: RatingEntry = {
            id: `${userId}_${workId}`,
            userId,
            workId,
            score,
            createdAt: now,
            updatedAt: now,
        };
        newRatings = [...store.ratings, entry];
    }

    const newStore: RatingStore = { ratings: newRatings };
    const aggregate = recalculateWorkRating(newStore, workId);
    return { store: newStore, aggregate };
}

/**
 * Delete a rating. Returns the updated store and the aggregate.
 */
export function deleteRating(
    store: RatingStore,
    userId: string,
    workId: string
): { store: RatingStore; aggregate: WorkAggregate } {
    const idx = store.ratings.findIndex(
        (r) => r.userId === userId && r.workId === workId
    );
    if (idx === -1) {
        throw new Error('Rating not found');
    }

    const newStore: RatingStore = {
        ratings: store.ratings.filter((_, i) => i !== idx),
    };
    const aggregate = recalculateWorkRating(newStore, workId);
    return { store: newStore, aggregate };
}

/**
 * Get a rating by user and work.
 */
export function getByUserAndWork(
    store: RatingStore,
    userId: string,
    workId: string
): RatingEntry | null {
    return (
        store.ratings.find((r) => r.userId === userId && r.workId === workId) ??
        null
    );
}

/**
 * List all ratings for a work.
 */
export function listByWork(store: RatingStore, workId: string): RatingEntry[] {
    return store.ratings.filter((r) => r.workId === workId);
}
