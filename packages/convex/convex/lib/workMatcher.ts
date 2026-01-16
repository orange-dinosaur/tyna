import { createHash } from 'node:crypto';

export function normalizeForMatching(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/^(the|a|an)\s+/i, '')
        .trim();
}

export function generateLocalWorkHash(
    title: string,
    primaryAuthor: string
): string {
    const normalized =
        normalizeForMatching(title) +
        '|' +
        normalizeForMatching(primaryAuthor);
    return createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

export function getPrimaryAuthor(authors: string[]): string {
    return authors[0] ?? '';
}
