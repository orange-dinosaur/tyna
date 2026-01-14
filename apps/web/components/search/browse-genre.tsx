'use client';

import { Card, CardContent } from '@workspace/ui-web/components/card';

export interface Genre {
    id: string;
    name: string;
    color: string;
    coverColor?: string;
}

interface BrowseGenreProps {
    genres?: Genre[];
}

const defaultGenres: Genre[] = [
    {
        id: '1',
        name: 'Romance',
        color: 'bg-pink-500',
        coverColor: 'from-slate-700 to-slate-900',
    },
    {
        id: '2',
        name: 'Sci-Fi',
        color: 'bg-blue-500',
        coverColor: 'from-amber-700 to-amber-900',
    },
    {
        id: '3',
        name: 'Self Help',
        color: 'bg-orange-500',
        coverColor: 'from-lime-600 to-lime-800',
    },
    {
        id: '4',
        name: 'Business',
        color: 'bg-green-500',
        coverColor: 'from-teal-600 to-teal-800',
    },
    {
        id: '5',
        name: 'Fantasy',
        color: 'bg-purple-500',
        coverColor: 'from-orange-600 to-orange-800',
    },
    {
        id: '6',
        name: 'Mystery',
        color: 'bg-slate-700',
        coverColor: 'from-slate-600 to-slate-800',
    },
];

function GenreCard({ genre }: { genre: Genre }) {
    return (
        <Card
            className={`relative h-32 cursor-pointer overflow-hidden border-0 ${genre.color} transition-transform hover:scale-105`}>
            <CardContent className="relative flex h-full items-center justify-center p-0">
                {/* Blurred background effect */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${genre.coverColor || 'from-slate-600 to-slate-800'} opacity-30 blur-sm`}
                />
                <h3 className="relative z-10 text-lg font-semibold text-white">
                    {genre.name}
                </h3>
            </CardContent>
        </Card>
    );
}

export function BrowseGenre({ genres = defaultGenres }: BrowseGenreProps) {
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold">Browse by Genre</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {genres.map((genre) => (
                    <GenreCard key={genre.id} genre={genre} />
                ))}
            </div>
        </div>
    );
}
