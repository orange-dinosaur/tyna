'use client';

import { Edit, Share2 } from 'lucide-react';
import { Badge } from '@workspace/ui-web/components/badge';
import { Button } from '@workspace/ui-web/components/button';
import { Card, CardContent } from '@workspace/ui-web/components/card';
import { Progress } from '@workspace/ui-web/components/progress';

interface CurrentlyReadingProps {
    title?: string;
    author?: string;
    coverUrl?: string;
    currentChapter?: number;
    totalChapters?: number;
    lastRead?: string;
}

export function CurrentlyReading({
    title = 'The Midnight Library',
    author = 'Matt Haig',
    coverUrl = '/book-cover.jpg',
    currentChapter = 12,
    totalChapters = 20,
    lastRead = '2 hours ago',
}: CurrentlyReadingProps) {
    const progress = Math.round((currentChapter / totalChapters) * 100);

    return (
        <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Currently Reading</h2>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    View All
                </button>
            </div>

            <Card className="overflow-hidden">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6">
                    {/* Book Cover */}
                    <div className="relative h-48 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg">
                        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                            <span className="text-xs text-slate-400">THE</span>
                            <span className="mt-1 text-sm font-bold text-white">
                                MIDNIGHT
                            </span>
                            <span className="text-sm font-bold text-white">
                                LIBRARY
                            </span>
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="flex flex-1 flex-col">
                        <Badge
                            variant="secondary"
                            className="mb-2 w-fit bg-emerald-100 text-emerald-700">
                            Reading Now
                        </Badge>

                        <h3 className="text-xl font-bold">{title}</h3>
                        <p className="text-sm text-muted-foreground">
                            by {author}
                        </p>

                        <div className="mt-4 flex-1">
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span>
                                    Chapter {currentChapter} of {totalChapters}
                                </span>
                                <span className="font-medium text-emerald-600">
                                    {progress}%
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <p className="mt-1 text-xs text-muted-foreground">
                                Last read: {lastRead}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                                <Edit className="mr-2 h-4 w-4" />
                                Update Progress
                            </Button>
                            <Button variant="outline" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
