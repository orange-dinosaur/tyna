'use client';

import { useAction, useMutation } from 'convex/react';
import { api } from '@workspace/convex/api';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useUser } from '@/components/user-provider';
import { WorkCard } from '@/components/search/work-card';
import { BookCard } from '@/components/search/book-card';

interface BookResult {
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

interface GroupedWork {
    _id: string;
    title: string;
    authors: string[];
    description?: string;
    avgRating?: number;
    ratingCount: number;
    editionCount: number;
    coverUrl?: string;
    matchedEditions: BookResult[];
}

interface SearchResultResponse {
    works: GroupedWork[];
    standalone: BookResult[];
    totalEditions: number;
    totalItems: number;
}

interface SearchResultsProps {
    query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
    const searchAction = useAction(api.search.search);
    const { user } = useUser();
    const saveSearch = useMutation(api.searchHistory.create);
    const lastSavedQuery = useRef<string>('');
    const [results, setResults] = useState<SearchResultResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const performSearch = useCallback(
        async (q: string) => {
            if (!q.trim()) return;
            setLoading(true);
            setError(null);
            try {
                const data = await searchAction({ query: q });
                setResults(data);
                if (user?.id && q !== lastSavedQuery.current) {
                    lastSavedQuery.current = q;
                    saveSearch({ query: q, userId: user.id }).catch(() => {});
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'An error occurred while searching'
                );
            } finally {
                setLoading(false);
            }
        },
        [searchAction, saveSearch, user]
    );

    useEffect(() => {
        performSearch(query);
    }, [query, performSearch]);

    if (loading) {
        return <SearchResultsSkeleton />;
    }

    if (error) {
        return (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
            </div>
        );
    }

    if (!results) return null;

    const hasWorks = results.works.length > 0;
    const hasStandalone = results.standalone.length > 0;
    const isEmpty = !hasWorks && !hasStandalone;

    if (isEmpty) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <p>No books found for &ldquo;{query}&rdquo;</p>
                <p className="mt-1 text-sm">Try different keywords</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                {results.works.length}{' '}
                {results.works.length === 1 ? 'work' : 'works'},{' '}
                {results.totalEditions}{' '}
                {results.totalEditions === 1 ? 'edition' : 'editions'},{' '}
                {results.standalone.length} new{' '}
                {results.standalone.length === 1 ? 'book' : 'books'}
            </p>

            {hasWorks && (
                <div className="space-y-4">
                    {results.works.map((work) => (
                        <WorkCard
                            key={work._id}
                            work={{
                                ...work,
                                editions: work.matchedEditions.map((e) => ({
                                    externalId: e.externalId,
                                    title: e.title,
                                    publisher: e.publisher,
                                    publishedDate: e.publishedDate,
                                    pageCount: e.pageCount,
                                    language: e.language,
                                    coverUrl: e.coverUrl,
                                })),
                            }}
                        />
                    ))}
                </div>
            )}

            {hasStandalone && (
                <div className="space-y-4">
                    {hasWorks && (
                        <h2 className="text-lg font-semibold">Other results</h2>
                    )}
                    {results.standalone.map((book) => (
                        <BookCard key={book.externalId} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}

function SearchResultsSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 rounded-lg border p-4">
                    <div className="h-48 w-32 shrink-0 animate-pulse rounded-md bg-muted" />
                    <div className="flex flex-1 flex-col gap-3">
                        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                        <div className="mt-auto h-8 w-28 animate-pulse rounded bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}
