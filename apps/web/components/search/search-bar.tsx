'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@workspace/ui-web/components/input';
import { Button } from '@workspace/ui-web/components/button';

export function SearchBar() {
    return (
        <div className="relative mb-6">
            <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by title, author, or ISBN..."
                    className="h-12 w-full rounded-lg pl-10 pr-12"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 h-10 w-10">
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
