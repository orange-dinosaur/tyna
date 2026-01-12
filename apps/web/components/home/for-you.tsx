'use client';

import { Plus } from 'lucide-react';
import { Button } from '@workspace/ui-web/components/button';

interface Recommendation {
    id: string;
    title: string;
    author: string;
}

interface ForYouProps {
    recommendations?: Recommendation[];
}

const defaultRecommendations: Recommendation[] = [
    { id: '1', title: 'The Psychology...', author: 'Morgan Housel' },
    { id: '2', title: 'Deep Work', author: 'Cal Newport' },
];

export function ForYou({
    recommendations = defaultRecommendations,
}: ForYouProps) {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">For You</h3>
                <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                    SEE ALL
                </button>
            </div>

            <div className="space-y-3">
                {recommendations.map((book) => (
                    <div key={book.id} className="flex items-center gap-3">
                        {/* Book Thumbnail */}
                        <div className="h-12 w-9 flex-shrink-0 rounded bg-gradient-to-br from-slate-600 to-slate-800" />

                        {/* Book Info */}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {book.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {book.author}
                            </p>
                        </div>

                        {/* Add Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
