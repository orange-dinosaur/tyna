import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
    createRatingStore,
    rate,
    deleteRating,
    validateScore,
    recalculateWorkRating,
    type RatingStore,
} from '../lib/ratingLogic.js';

// --- Generators ---

const userIdArb = fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `user_${s}`);
const workIdArb = fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `work_${s}`);
const validScoreArb = fc.integer({ min: 1, max: 5 });
const timestampArb = fc.integer({
    min: 1_000_000_000_000,
    max: 2_000_000_000_000,
});

// --- Property 5: Rating aggregate consistency ---

describe('Feature: phase2-user-features, Property 5: Rating aggregate consistency', () => {
    it('after any sequence of rate/delete operations, avgRating equals the mean of remaining scores and ratingCount equals the count', () => {
        // Operation: either rate or delete
        const operationArb = fc.oneof(
            fc.record({
                type: fc.constant('rate' as const),
                userId: userIdArb,
                score: validScoreArb,
                now: timestampArb,
            }),
            fc.record({
                type: fc.constant('delete' as const),
                userId: userIdArb,
            })
        );

        fc.assert(
            fc.property(
                workIdArb,
                fc.array(operationArb, { minLength: 1, maxLength: 20 }),
                (workId, operations) => {
                    let store = createRatingStore();

                    for (const op of operations) {
                        try {
                            if (op.type === 'rate') {
                                const result = rate(
                                    store,
                                    op.userId,
                                    workId,
                                    op.score,
                                    op.now
                                );
                                store = result.store;
                            } else {
                                const result = deleteRating(
                                    store,
                                    op.userId,
                                    workId
                                );
                                store = result.store;
                            }
                        } catch {
                            // delete on non-existent rating throws — skip
                        }
                    }

                    // Verify aggregate matches actual ratings
                    const aggregate = recalculateWorkRating(store, workId);
                    const workRatings = store.ratings.filter(
                        (r) => r.workId === workId
                    );

                    expect(aggregate.ratingCount).toBe(workRatings.length);

                    if (workRatings.length === 0) {
                        expect(aggregate.avgRating).toBeUndefined();
                    } else {
                        const sum = workRatings.reduce(
                            (acc, r) => acc + r.score,
                            0
                        );
                        const expectedAvg = sum / workRatings.length;
                        expect(aggregate.avgRating).toBeCloseTo(
                            expectedAvg,
                            10
                        );
                    }
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 6: Rating validation rejects invalid scores ---

describe('Feature: phase2-user-features, Property 6: Rating validation rejects invalid scores', () => {
    it('any score that is not an integer in [1, 5] is rejected and leaves the store unchanged', () => {
        // Generate numbers that are NOT valid scores (not integers in [1,5])
        const invalidScoreArb = fc
            .oneof(
                // Floats (non-integer)
                fc
                    .double({ min: -100, max: 100, noNaN: true })
                    .filter((n) => !Number.isInteger(n)),
                // Integers outside [1,5]
                fc
                    .integer({ min: -1000, max: 1000 })
                    .filter((n) => n < 1 || n > 5),
                // Special values
                fc.constant(0),
                fc.constant(6),
                fc.constant(-1),
                fc.constant(1.5),
                fc.constant(2.5),
                fc.constant(NaN),
                fc.constant(Infinity),
                fc.constant(-Infinity)
            )
            .filter((n) => !(Number.isInteger(n) && n >= 1 && n <= 5));

        fc.assert(
            fc.property(
                userIdArb,
                workIdArb,
                invalidScoreArb,
                timestampArb,
                (userId, workId, invalidScore, now) => {
                    const store = createRatingStore();

                    // Attempting to rate with invalid score should throw
                    expect(() =>
                        rate(store, userId, workId, invalidScore, now)
                    ).toThrow('Score must be an integer between 1 and 5');

                    // Store should remain unchanged (empty)
                    expect(store.ratings.length).toBe(0);
                }
            ),
            { numRuns: 100 }
        );
    });
});
