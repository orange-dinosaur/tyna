/**
 * Book provider interface. Each API provider implements this to normalize
 * its responses into the common BookResult format.
 */

export interface BookResult {
    externalId: string;
    title: string;
    subtitle?: string;
    authors: string[];
    description?: string;
    coverUrl?: string;
    isbn10?: string;
    isbn13?: string;
    publisher?: string;
    publishedDate?: string;
    pageCount?: number;
    language?: string;
}

export interface BooksSearchResponse {
    results: BookResult[];
    totalItems: number;
}

export interface SearchOptions {
    startIndex?: number;
    maxResults?: number;
}

export interface BookProvider {
    search(
        query: string,
        options?: SearchOptions
    ): Promise<BooksSearchResponse>;
    parseItem(item: Record<string, unknown>): BookResult | null;
}
