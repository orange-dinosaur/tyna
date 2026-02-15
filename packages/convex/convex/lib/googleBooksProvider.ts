/**
 * Google Books API adapter implementing the BookProvider interface.
 */

import type {
    BookProvider,
    BookResult,
    BooksSearchResponse,
    SearchOptions,
} from './bookProvider.js';

interface BookIdentifier {
    type: string;
    identifier: string;
}

export function extractIsbns(identifiers?: BookIdentifier[]): {
    isbn10?: string;
    isbn13?: string;
} {
    if (!identifiers) return {};
    let isbn10: string | undefined;
    let isbn13: string | undefined;
    for (const id of identifiers) {
        if (id.type === 'ISBN_10') isbn10 = id.identifier;
        if (id.type === 'ISBN_13') isbn13 = id.identifier;
    }
    return { isbn10, isbn13 };
}

export function parseVolumeItem(
    item: Record<string, unknown>
): BookResult | null {
    const volumeInfo = item.volumeInfo as Record<string, unknown> | undefined;
    if (!volumeInfo) return null;

    const title = volumeInfo.title as string | undefined;
    if (!title) return null;

    const { isbn10, isbn13 } = extractIsbns(
        volumeInfo.industryIdentifiers as BookIdentifier[] | undefined
    );

    const imageLinks = volumeInfo.imageLinks as
        | Record<string, string>
        | undefined;
    let coverUrl = imageLinks?.thumbnail;
    if (coverUrl) {
        coverUrl = coverUrl.replace(/^http:/, 'https:');
    }

    return {
        externalId: item.id as string,
        title,
        subtitle: volumeInfo.subtitle as string | undefined,
        authors: (volumeInfo.authors as string[] | undefined) ?? [],
        description: volumeInfo.description as string | undefined,
        coverUrl,
        isbn10,
        isbn13,
        publisher: volumeInfo.publisher as string | undefined,
        publishedDate: volumeInfo.publishedDate as string | undefined,
        pageCount: volumeInfo.pageCount as number | undefined,
        language: volumeInfo.language as string | undefined,
    };
}

export const googleBooksProvider: BookProvider = {
    parseItem: parseVolumeItem,

    async search(
        query: string,
        options?: SearchOptions
    ): Promise<BooksSearchResponse> {
        const startIndex = options?.startIndex ?? 0;
        const maxResults = options?.maxResults ?? 20;

        const baseUrl = process.env.BOOKS_API_URL;
        if (!baseUrl) {
            throw new Error('BOOKS_API_URL environment variable is not set');
        }
        const url = new URL(baseUrl);
        url.searchParams.set('q', query);
        url.searchParams.set('startIndex', String(startIndex));
        url.searchParams.set('maxResults', String(maxResults));

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(
                `Books API error: ${response.status} ${response.statusText}`
            );
        }

        const data = (await response.json()) as Record<string, unknown>;
        const totalItems = (data.totalItems as number) ?? 0;
        const items = (data.items as Record<string, unknown>[]) ?? [];

        const results: BookResult[] = [];
        for (const item of items) {
            const parsed = parseVolumeItem(item);
            if (parsed) results.push(parsed);
        }

        return { results, totalItems };
    },
};
