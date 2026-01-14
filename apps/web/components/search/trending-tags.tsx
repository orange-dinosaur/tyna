'use client';

import { Badge } from '@workspace/ui-web/components/badge';

interface TrendingTagsProps {
    tags?: string[];
}

const defaultTags = ['Sci-Fi', 'Biographies', 'Productivity', 'Thrillers'];

export function TrendingTags({ tags = defaultTags }: TrendingTagsProps) {
    return (
        <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
                Trending:
            </span>
            {tags.map((tag) => (
                <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer rounded-full px-4 py-1.5 hover:bg-emerald-100 hover:text-emerald-700">
                    {tag}
                </Badge>
            ))}
        </div>
    );
}
