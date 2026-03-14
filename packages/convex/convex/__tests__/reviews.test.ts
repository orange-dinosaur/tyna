import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
    createReviewStore,
    createReview,
    removeReview,
    getByUserAndWork,
    listPublicByWork,
} from '../lib/reviewLogic.js';

// --- Generators ---

const userIdArb = fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `user_${s}`);
const workIdArb = fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `work_${s}`);
const nonEmptyContentArb = fc
    .string({ minLength: 1, maxLength: 500 })
    .filter((s) => s.trim().length > 0);
const timestampArb = fc.integer({
    min: 1_000_000_000_000,
    max: 2_000_000_000_000,
});

// --- Property 7: Review create/query/delete round-trip ---

describe('Feature: phase2-user-features, Property 7: Review create/query/delete round-trip', () => {
    it('creating a review and querying returns it with likeCount=0 and commentCount=0; deleting and querying returns null', () => {
        fc.assert(
            fc.property(
                userIdArb,
                workIdArb,
                nonEmptyContentArb,
                fc.boolean(),
                fc.boolean(),
                timestampArb,
                (userId, workId, content, isSpoiler, isPublic, now) => {
                    let store = createReviewStore();

                    // Create review
                    const result = createReview(
                        store,
                        userId,
                        workId,
                        content,
                        isSpoiler,
                        isPublic,
                        now
                    );
                    store = result.store;

                    // Query should return the review
                    const found = getByUserAndWork(store, userId, workId);
                    expect(found).not.toBeNull();
                    expect(found!.userId).toBe(userId);
                    expect(found!.workId).toBe(workId);
                    expect(found!.content).toBe(content);
                    expect(found!.likeCount).toBe(0);
                    expect(found!.commentCount).toBe(0);

                    // Delete review
                    const afterDelete = removeReview(
                        store,
                        userId,
                        result.review.id
                    );
                    store = afterDelete.store;

                    // Query should return null
                    const notFound = getByUserAndWork(store, userId, workId);
                    expect(notFound).toBeNull();
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 9: Review empty content rejection ---

describe('Feature: phase2-user-features, Property 9: Review empty content rejection', () => {
    it('any string composed entirely of whitespace is rejected with a validation error', () => {
        const whitespaceArb = fc.oneof(
            fc.constant(''),
            fc.constant(' '),
            fc.constant('  '),
            fc.constant('\t'),
            fc.constant('\n'),
            fc.constant('\t\n '),
            fc
                .array(fc.constantFrom(' ', '\t', '\n', '\r'), {
                    minLength: 0,
                    maxLength: 50,
                })
                .map((chars) => chars.join(''))
        );

        fc.assert(
            fc.property(
                userIdArb,
                workIdArb,
                whitespaceArb,
                fc.boolean(),
                fc.boolean(),
                timestampArb,
                (userId, workId, emptyContent, isSpoiler, isPublic, now) => {
                    const store = createReviewStore();

                    expect(() =>
                        createReview(
                            store,
                            userId,
                            workId,
                            emptyContent,
                            isSpoiler,
                            isPublic,
                            now
                        )
                    ).toThrow('Review content cannot be empty');

                    // Store should remain unchanged
                    expect(store.reviews.length).toBe(0);
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 10: Review public filtering ---

describe('Feature: phase2-user-features, Property 10: Review public filtering', () => {
    it('querying public reviews returns only reviews where isPublic is true', () => {
        const reviewDataArb = fc.record({
            userId: userIdArb,
            content: nonEmptyContentArb,
            isSpoiler: fc.boolean(),
            isPublic: fc.boolean(),
        });

        fc.assert(
            fc.property(
                workIdArb,
                fc.array(reviewDataArb, { minLength: 1, maxLength: 15 }),
                timestampArb,
                (workId, reviewsData, baseTime) => {
                    let store = createReviewStore();

                    // Deduplicate by userId to avoid uniqueness violations
                    const seen = new Set<string>();
                    const uniqueReviews = reviewsData.filter((r) => {
                        if (seen.has(r.userId)) return false;
                        seen.add(r.userId);
                        return true;
                    });

                    // Create reviews
                    for (let i = 0; i < uniqueReviews.length; i++) {
                        const r = uniqueReviews[i]!;
                        const result = createReview(
                            store,
                            r.userId,
                            workId,
                            r.content,
                            r.isSpoiler,
                            r.isPublic,
                            baseTime + i
                        );
                        store = result.store;
                    }

                    // Query public reviews
                    const publicReviews = listPublicByWork(store, workId);
                    const expectedPublicCount = uniqueReviews.filter(
                        (r) => r.isPublic
                    ).length;

                    expect(publicReviews.length).toBe(expectedPublicCount);
                    for (const review of publicReviews) {
                        expect(review.isPublic).toBe(true);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 11: Review uniqueness per user per work ---

describe('Feature: phase2-user-features, Property 11: Review uniqueness per user per work', () => {
    it('creating a second review for the same user+work pair throws an error', () => {
        fc.assert(
            fc.property(
                userIdArb,
                workIdArb,
                nonEmptyContentArb,
                nonEmptyContentArb,
                fc.boolean(),
                fc.boolean(),
                timestampArb,
                (
                    userId,
                    workId,
                    content1,
                    content2,
                    isSpoiler,
                    isPublic,
                    now
                ) => {
                    let store = createReviewStore();

                    // First review should succeed
                    const result = createReview(
                        store,
                        userId,
                        workId,
                        content1,
                        isSpoiler,
                        isPublic,
                        now
                    );
                    store = result.store;

                    // Second review for same user+work should fail
                    expect(() =>
                        createReview(
                            store,
                            userId,
                            workId,
                            content2,
                            isSpoiler,
                            isPublic,
                            now + 1
                        )
                    ).toThrow('Review already exists');

                    // Store should still have exactly one review
                    const found = store.reviews.filter(
                        (r) => r.userId === userId && r.workId === workId
                    );
                    expect(found.length).toBe(1);
                }
            ),
            { numRuns: 100 }
        );
    });
});
