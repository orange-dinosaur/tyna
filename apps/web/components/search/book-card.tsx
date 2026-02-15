'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@workspace/web-ui/components/card';
import { Button } from '@workspace/web-ui/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@workspace/web-ui/components/dropdown-menu';

export interface BookCardProps {
    book: {
        externalId: string;
        title: string;
        authors: string[];
        coverUrl?: string;
        publisher?: string;
        publishedDate?: string;
        pageCount?: number;
    };
}

export function BookCard({ book }: BookCardProps) {
    const metaParts: string[] = [];
    if (book.publisher) metaParts.push(book.publisher);
    if (book.publishedDate) metaParts.push(book.publishedDate);
    if (book.pageCount) metaParts.push(`${book.pageCount} pages`);

    return (
        <Card className="flex-row gap-4 p-4">
            <div className="shrink-0">
                {book.coverUrl ? (
                    <Image
                        src={book.coverUrl}
                        alt={`Cover of ${book.title}`}
                        width={96}
                        height={144}
                        className="h-36 w-24 rounded-md object-cover"
                    />
                ) : (
                    <div className="flex h-36 w-24 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-emerald-700 p-2">
                        <span className="text-center text-xs font-medium text-white">
                            {book.title}
                        </span>
                    </div>
                )}
            </div>
            <CardContent className="flex flex-1 flex-col gap-1.5 p-0">
                <h3 className="text-base font-semibold leading-tight">
                    {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {book.authors.join(', ')}
                </p>
                {metaParts.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                        {metaParts.join(' · ')}
                    </p>
                )}
                <div className="mt-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                                Add to shelf <ChevronDown className="size-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Want to Read</DropdownMenuItem>
                            <DropdownMenuItem>
                                Currently Reading
                            </DropdownMenuItem>
                            <DropdownMenuItem>Finished</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}
