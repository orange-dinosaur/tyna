'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronDown, Eye } from 'lucide-react';
import { Card, CardContent } from '@workspace/web-ui/components/card';
import { Button } from '@workspace/web-ui/components/button';
import { Badge } from '@workspace/web-ui/components/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@workspace/web-ui/components/dropdown-menu';
import { EditionSelector } from '@/components/search/edition-selector';

export interface WorkEdition {
    externalId: string;
    title: string;
    publisher?: string;
    publishedDate?: string;
    format?: string;
    pageCount?: number;
    language?: string;
    coverUrl?: string;
}

export interface WorkCardProps {
    work: {
        _id: string;
        title: string;
        authors: string[];
        avgRating?: number;
        ratingCount: number;
        editionCount: number;
        coverUrl?: string;
        editions: WorkEdition[];
    };
}

function CoverImage({ coverUrl, title }: { coverUrl?: string; title: string }) {
    if (coverUrl) {
        return (
            <Image
                src={coverUrl}
                alt={`Cover of ${title}`}
                width={128}
                height={192}
                className="h-48 w-32 rounded-md object-cover"
            />
        );
    }
    return (
        <div className="flex h-48 w-32 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-emerald-700 p-2">
            <span className="text-center text-sm font-medium text-white">
                {title}
            </span>
        </div>
    );
}

function AddToShelfDropdown() {
    return (
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
                <DropdownMenuItem>Currently Reading</DropdownMenuItem>
                <DropdownMenuItem>Finished</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function WorkCard({ work }: WorkCardProps) {
    const [editionSelectorOpen, setEditionSelectorOpen] = useState(false);
    const hasMultipleEditions = work.editionCount > 1;

    return (
        <>
            <Card className="flex-row gap-4 p-4">
                <div className="relative shrink-0">
                    <CoverImage coverUrl={work.coverUrl} title={work.title} />
                    {hasMultipleEditions && (
                        <Badge className="absolute top-1 right-1 bg-emerald-600">
                            {work.editionCount} editions
                        </Badge>
                    )}
                </div>
                <CardContent className="flex flex-1 flex-col gap-2 p-0">
                    <h3 className="text-lg font-semibold leading-tight">
                        {work.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {work.authors.join(', ')}
                    </p>
                    <div className="text-sm text-muted-foreground">
                        {work.avgRating != null ? (
                            <span className="inline-flex items-center gap-1">
                                <Star className="size-4 fill-amber-400 text-amber-400" />
                                {work.avgRating.toFixed(1)}
                                <span className="text-xs">
                                    ({work.ratingCount})
                                </span>
                            </span>
                        ) : (
                            <span>No ratings yet</span>
                        )}
                    </div>
                    <div className="mt-auto flex items-center gap-2">
                        <AddToShelfDropdown />
                        {hasMultipleEditions && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditionSelectorOpen(true)}>
                                <Eye className="size-4" /> View editions
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
            {hasMultipleEditions && (
                <EditionSelector
                    open={editionSelectorOpen}
                    onOpenChange={setEditionSelectorOpen}
                    work={{ title: work.title, editions: work.editions }}
                />
            )}
        </>
    );
}
