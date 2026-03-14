import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
    createNoteStore,
    createNote,
    removeNote,
    listPublicByBook,
    listByUserAndBook,
    type NoteType,
} from '../lib/bookNoteLogic.js';

// --- Generators ---

const userIdArb = fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `user_${s}`);
const bookIdArb = fc
    .string({ minLength: 1, maxLength: 20 })
    .map((s) => `book_${s}`);
const nonEmptyContentArb = fc
    .string({ minLength: 1, maxLength: 500 })
    .filter((s) => s.trim().length > 0);
const noteTypeArb = fc.constantFrom<NoteType>(
    'translation',
    'quality',
    'format',
    'other'
);
const timestampArb = fc.integer({
    min: 1_000_000_000_000,
    max: 2_000_000_000_000,
});

// --- Property 12: Note create/query/delete round-trip ---

describe('Feature: phase2-user-features, Property 12: Note create/query/delete round-trip', () => {
    it('creating a note and querying by user+book includes it; deleting and querying again does not', () => {
        fc.assert(
            fc.property(
                userIdArb,
                bookIdArb,
                nonEmptyContentArb,
                noteTypeArb,
                fc.boolean(),
                timestampArb,
                (userId, bookId, content, noteType, isPublic, now) => {
                    let store = createNoteStore();

                    // Create note
                    const result = createNote(
                        store,
                        userId,
                        bookId,
                        content,
                        noteType,
                        isPublic,
                        now
                    );
                    store = result.store;

                    // Query by user+book should include the note
                    const found = listByUserAndBook(store, userId, bookId);
                    expect(found.length).toBe(1);
                    expect(found[0]!.userId).toBe(userId);
                    expect(found[0]!.bookId).toBe(bookId);
                    expect(found[0]!.content).toBe(content);
                    expect(found[0]!.noteType).toBe(noteType);

                    // Delete note
                    const afterDelete = removeNote(
                        store,
                        userId,
                        result.note.id
                    );
                    store = afterDelete.store;

                    // Query should return empty
                    const notFound = listByUserAndBook(store, userId, bookId);
                    expect(notFound.length).toBe(0);
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 14: Note empty content rejection ---

describe('Feature: phase2-user-features, Property 14: Note empty content rejection', () => {
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
                bookIdArb,
                whitespaceArb,
                noteTypeArb,
                fc.boolean(),
                timestampArb,
                (userId, bookId, emptyContent, noteType, isPublic, now) => {
                    const store = createNoteStore();

                    expect(() =>
                        createNote(
                            store,
                            userId,
                            bookId,
                            emptyContent,
                            noteType,
                            isPublic,
                            now
                        )
                    ).toThrow('Note content cannot be empty');

                    // Store should remain unchanged
                    expect(store.notes.length).toBe(0);
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 15: Note public filtering ---

describe('Feature: phase2-user-features, Property 15: Note public filtering', () => {
    it('querying public notes returns only notes where isPublic is true', () => {
        const noteDataArb = fc.record({
            userId: userIdArb,
            content: nonEmptyContentArb,
            noteType: noteTypeArb,
            isPublic: fc.boolean(),
        });

        fc.assert(
            fc.property(
                bookIdArb,
                fc.array(noteDataArb, { minLength: 1, maxLength: 15 }),
                timestampArb,
                (bookId, notesData, baseTime) => {
                    let store = createNoteStore();

                    // Create notes (no uniqueness constraint per user, so all can be added)
                    for (let i = 0; i < notesData.length; i++) {
                        const n = notesData[i]!;
                        const result = createNote(
                            store,
                            n.userId,
                            bookId,
                            n.content,
                            n.noteType,
                            n.isPublic,
                            baseTime + i
                        );
                        store = result.store;
                    }

                    // Query public notes
                    const publicNotes = listPublicByBook(store, bookId);
                    const expectedPublicCount = notesData.filter(
                        (n) => n.isPublic
                    ).length;

                    expect(publicNotes.length).toBe(expectedPublicCount);
                    for (const note of publicNotes) {
                        expect(note.isPublic).toBe(true);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });
});

// --- Property 16: Note user query returns all visibility levels ---

describe('Feature: phase2-user-features, Property 16: Note user query returns all visibility levels', () => {
    it('querying by user+book returns all notes regardless of isPublic value', () => {
        fc.assert(
            fc.property(
                userIdArb,
                bookIdArb,
                fc.array(
                    fc.record({
                        content: nonEmptyContentArb,
                        noteType: noteTypeArb,
                        isPublic: fc.boolean(),
                    }),
                    { minLength: 1, maxLength: 10 }
                ),
                timestampArb,
                (userId, bookId, notesData, baseTime) => {
                    let store = createNoteStore();

                    // Create multiple notes for the same user+book
                    for (let i = 0; i < notesData.length; i++) {
                        const n = notesData[i]!;
                        const result = createNote(
                            store,
                            userId,
                            bookId,
                            n.content,
                            n.noteType,
                            n.isPublic,
                            baseTime + i
                        );
                        store = result.store;
                    }

                    // Query by user+book should return ALL notes
                    const allNotes = listByUserAndBook(store, userId, bookId);
                    expect(allNotes.length).toBe(notesData.length);

                    // Verify both public and private notes are included
                    const publicCount = allNotes.filter(
                        (n) => n.isPublic
                    ).length;
                    const privateCount = allNotes.filter(
                        (n) => !n.isPublic
                    ).length;
                    const expectedPublic = notesData.filter(
                        (n) => n.isPublic
                    ).length;
                    const expectedPrivate = notesData.filter(
                        (n) => !n.isPublic
                    ).length;

                    expect(publicCount).toBe(expectedPublic);
                    expect(privateCount).toBe(expectedPrivate);
                }
            ),
            { numRuns: 100 }
        );
    });
});
