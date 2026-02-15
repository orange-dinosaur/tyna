import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { googleBooksProvider } from '../googleBooksProvider.js';

describe('googleBooksProvider.search - error handling and pagination', () => {
    const BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

    beforeEach(() => {
        vi.stubEnv('BOOKS_API_URL', BOOKS_API_URL);
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    // --- Error handling ---

    it('throws when BOOKS_API_URL env var is not set', async () => {
        vi.stubEnv('BOOKS_API_URL', '');
        await expect(googleBooksProvider.search('test')).rejects.toThrow(
            'BOOKS_API_URL environment variable is not set'
        );
    });

    it('throws descriptive error on 400 response', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(
            new Response(null, { status: 400, statusText: 'Bad Request' })
        );
        await expect(googleBooksProvider.search('test')).rejects.toThrow(
            'Books API error: 400 Bad Request'
        );
    });

    it('throws descriptive error on 500 response', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(
            new Response(null, {
                status: 500,
                statusText: 'Internal Server Error',
            })
        );
        await expect(googleBooksProvider.search('test')).rejects.toThrow(
            'Books API error: 500 Internal Server Error'
        );
    });

    it('throws on network error', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new TypeError('fetch failed'));
        await expect(googleBooksProvider.search('test')).rejects.toThrow(
            'fetch failed'
        );
    });

    // --- Pagination ---

    it('passes startIndex parameter to the API URL', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(
            new Response(JSON.stringify({ totalItems: 0, items: [] }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        );

        await googleBooksProvider.search('javascript', { startIndex: 40 });

        const calledUrl = new URL(vi.mocked(fetch).mock.calls[0]![0] as string);
        expect(calledUrl.searchParams.get('startIndex')).toBe('40');
        expect(calledUrl.searchParams.get('q')).toBe('javascript');
    });

    it('defaults startIndex to 0 when not provided', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(
            new Response(JSON.stringify({ totalItems: 0, items: [] }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        );

        await googleBooksProvider.search('python');

        const calledUrl = new URL(vi.mocked(fetch).mock.calls[0]![0] as string);
        expect(calledUrl.searchParams.get('startIndex')).toBe('0');
    });

    it('passes maxResults parameter to the API URL', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(
            new Response(JSON.stringify({ totalItems: 0, items: [] }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        );

        await googleBooksProvider.search('rust', { maxResults: 10 });

        const calledUrl = new URL(vi.mocked(fetch).mock.calls[0]![0] as string);
        expect(calledUrl.searchParams.get('maxResults')).toBe('10');
    });
});
