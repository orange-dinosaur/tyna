/**
 * Book search module. Delegates to the configured provider adapter.
 */

export type {
    BookResult,
    BooksSearchResponse,
    BookProvider,
    SearchOptions,
} from './bookProvider.js';

import type {
    BookProvider,
    BooksSearchResponse,
    SearchOptions,
} from './bookProvider.js';
import { googleBooksProvider } from './googleBooksProvider.js';

const providers: Record<string, BookProvider> = {
    google_books: googleBooksProvider,
};

function getProvider(): BookProvider {
    const name = process.env.BOOKS_PROVIDER!;
    const provider = providers[name];
    if (!provider) {
        throw new Error(
            `Unknown book provider "${name}". Available: ${Object.keys(providers).join(', ')}`
        );
    }
    return provider;
}

export async function searchBooks(
    query: string,
    options?: SearchOptions
): Promise<BooksSearchResponse> {
    return getProvider().search(query, options);
}
