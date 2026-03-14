/**
 * Pure book note logic extracted for testability.
 * These functions encapsulate the core business rules from bookNotes.ts
 * without Convex DB dependencies.
 */

export type NoteType = 'translation' | 'quality' | 'format' | 'other';

const VALID_NOTE_TYPES: NoteType[] = [
    'translation',
    'quality',
    'format',
    'other',
];

export interface NoteEntry {
    id: string;
    userId: string;
    bookId: string;
    content: string;
    noteType: NoteType;
    isPublic: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface NoteStore {
    notes: NoteEntry[];
}

export function createNoteStore(): NoteStore {
    return { notes: [] };
}

/**
 * Validate that note content is non-empty after trimming.
 */
export function validateContent(content: string): void {
    if (content.trim().length === 0) {
        throw new Error('Note content cannot be empty');
    }
}

/**
 * Validate that noteType is one of the allowed values.
 */
export function validateNoteType(
    noteType: string
): asserts noteType is NoteType {
    if (!VALID_NOTE_TYPES.includes(noteType as NoteType)) {
        throw new Error(`Invalid note type: ${noteType}`);
    }
}

/**
 * Create a note. Validates content and noteType.
 * Unlike reviews, a user can have multiple notes per book.
 */
export function createNote(
    store: NoteStore,
    userId: string,
    bookId: string,
    content: string,
    noteType: NoteType,
    isPublic: boolean,
    now: number
): { store: NoteStore; note: NoteEntry } {
    validateContent(content);
    validateNoteType(noteType);

    const note: NoteEntry = {
        id: `${userId}_${bookId}_${now}`,
        userId,
        bookId,
        content,
        noteType,
        isPublic,
        createdAt: now,
        updatedAt: now,
    };

    return {
        store: { notes: [...store.notes, note] },
        note,
    };
}

/**
 * Delete a note. Verifies ownership before deleting.
 */
export function removeNote(
    store: NoteStore,
    userId: string,
    noteId: string
): { store: NoteStore } {
    const idx = store.notes.findIndex((n) => n.id === noteId);
    if (idx === -1) {
        throw new Error('Note not found');
    }
    if (store.notes[idx]!.userId !== userId) {
        throw new Error('Not authorized');
    }

    return {
        store: { notes: store.notes.filter((_, i) => i !== idx) },
    };
}

/**
 * List public notes for a book.
 */
export function listPublicByBook(
    store: NoteStore,
    bookId: string
): NoteEntry[] {
    return store.notes.filter((n) => n.bookId === bookId && n.isPublic);
}

/**
 * List all notes by a user for a book (regardless of isPublic).
 */
export function listByUserAndBook(
    store: NoteStore,
    userId: string,
    bookId: string
): NoteEntry[] {
    return store.notes.filter(
        (n) => n.userId === userId && n.bookId === bookId
    );
}
