'use client';

import { Book, BookCard } from './book-card';

interface TopPicksProps {
    books?: Book[];
}

const defaultBooks: Book[] = [
    {
        id: '1',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        rating: 4.8,
        coverColor: 'from-slate-700 to-slate-900',
    },
    {
        id: '2',
        title: 'Atomic Habits',
        author: 'James Clear',
        rating: 4.9,
        coverColor: 'from-lime-600 to-lime-800',
    },
    {
        id: '3',
        title: 'Dune',
        author: 'Frank Herbert',
        rating: 4.7,
        coverColor: 'from-amber-700 to-amber-900',
    },
    {
        id: '4',
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        rating: 4.9,
        coverColor: 'from-orange-600 to-orange-800',
    },
    {
        id: '5',
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        rating: 4.6,
        coverColor: 'from-teal-600 to-teal-800',
    },
];

export function TopPicks({ books = defaultBooks }: TopPicksProps) {
    return (
        <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Top Picks for You</h2>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    Explore All →
                </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
}
