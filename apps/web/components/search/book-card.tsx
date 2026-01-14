'use client';

import { Star } from 'lucide-react';

export interface Book {
    id: string;
    title: string;
    author: string;
    rating: number;
    coverColor?: string;
}

interface BookCardProps {
    book: Book;
}

export function BookCard({ book }: BookCardProps) {
    const fullStars = Math.floor(book.rating);
    const hasHalfStar = book.rating % 1 >= 0.5;

    return (
        <div className="w-28 flex-shrink-0 sm:w-32">
            <div
                className={`mb-2 h-40 w-full rounded-lg bg-gradient-to-br sm:h-44 ${book.coverColor || 'from-slate-600 to-slate-800'} flex items-center justify-center p-3 shadow-md`}>
                <span className="text-center text-xs font-semibold text-white">
                    {book.title.toUpperCase()}
                </span>
            </div>
            <h4 className="truncate text-sm font-medium">{book.title}</h4>
            <p className="truncate text-xs text-muted-foreground">
                {book.author}
            </p>
            <div className="mt-1 flex items-center gap-1">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                        if (i < fullStars) {
                            return (
                                <Star
                                    key={i}
                                    className="h-3 w-3 fill-emerald-500 text-emerald-500"
                                />
                            );
                        } else if (i === fullStars && hasHalfStar) {
                            return (
                                <Star
                                    key={i}
                                    className="h-3 w-3 fill-emerald-500/50 text-emerald-500"
                                />
                            );
                        } else {
                            return (
                                <Star
                                    key={i}
                                    className="h-3 w-3 fill-none text-emerald-500/30"
                                />
                            );
                        }
                    })}
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                    {book.rating.toFixed(1)}
                </span>
            </div>
        </div>
    );
}
