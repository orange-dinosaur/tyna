'use client';

import { Button } from '@workspace/web-ui/components/button';
import { Input } from '@workspace/web-ui/components/input';
import { useState, FormEvent } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { SearchResults } from '@/components/search/search-results';

export default function Search() {
    const [inputValue, setInputValue] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (trimmed) {
            setSubmittedQuery(trimmed);
        }
    };

    return (
        <div className="-m-4 flex h-[calc(100%+2rem)] flex-col">
            <form
                onSubmit={handleSubmit}
                className="flex shrink-0 items-center gap-2 bg-background px-4 py-4">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search for books..."
                        className="pl-9"
                    />
                </div>
                <Button
                    type="submit"
                    className="bg-green-500 text-white hover:bg-green-500 text-white">
                    Search
                </Button>
            </form>

            <div className="flex-1 overflow-auto p-4">
                {submittedQuery && <SearchResults query={submittedQuery} />}
            </div>
        </div>
    );
}
