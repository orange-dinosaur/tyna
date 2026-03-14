/**
 * Pure review logic extracted for testability.
 * These functions encapsulate the core business rules from reviews.ts
 * without Convex DB dependencies.
 */

export interface ReviewEntry {
    id: string;
    userId: string;
    workId: string;
    content: string;
    isSpoiler: boolean;
    isPublic: boolean;
    likeCount: number;
    commentCount: number;
    createdAt: number;
    updatedAt: number;
}

export interface ReviewStore {
    reviews: ReviewEntry[];
}

export function createReviewStore(): ReviewStore {
    return { reviews: [] };
}

/**
 * Validate that review content is non-empty after trimming.
 * Throws if invalid.
 */
export function validateContent(content: string): void {
    if (content.trim().length === 0) {
        throw new Error('Review content cannot be empty');
    }
}

/**
 * Create a review. Validates content and enforces uniqueness per user+work.
 */
export function createReview(
    store: ReviewStore,
    userId: string,
    workId: string,
    content: string,
    isSpoiler: boolean,
    isPublic: boolean,
    now: number
): { store: ReviewStore; review: ReviewEntry } {
    validateContent(content);

    const existing = store.reviews.find(
        (r) => r.userId === userId && r.workId === workId
    );
    if (existing) {
        throw new Error('Review already exists');
    }

    const review: ReviewEntry = {
        id: `${userId}_${workId}`,
        userId,
        workId,
        content,
        isSpoiler,
        isPublic,
        likeCount: 0,
        commentCount: 0,
        createdAt: now,
        updatedAt: now,
    };

    return {
        store: { reviews: [...store.reviews, review] },
        review,
    };
}

/**
 * Delete a review. Verifies ownership before deleting.
 */
export function removeReview(
    store: ReviewStore,
    userId: string,
    reviewId: string
): { store: ReviewStore } {
    const idx = store.reviews.findIndex((r) => r.id === reviewId);
    if (idx === -1) {
        throw new Error('Review not found');
    }
    if (store.reviews[idx]!.userId !== userId) {
        throw new Error('Not authorized');
    }

    return {
        store: { reviews: store.reviews.filter((_, i) => i !== idx) },
    };
}

/**
 * Get a review by user and work.
 */
export function getByUserAndWork(
    store: ReviewStore,
    userId: string,
    workId: string
): ReviewEntry | null {
    return (
        store.reviews.find((r) => r.userId === userId && r.workId === workId) ??
        null
    );
}

/**
 * List public reviews for a work.
 */
export function listPublicByWork(
    store: ReviewStore,
    workId: string
): ReviewEntry[] {
    return store.reviews.filter((r) => r.workId === workId && r.isPublic);
}
