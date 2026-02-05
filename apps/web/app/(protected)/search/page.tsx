'use client';

import { Button } from '@workspace/web-ui/components/button';
import { Input } from '@workspace/web-ui/components/input';
import { useState, FormEvent } from 'react';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchHistory((prev) => [...prev, searchQuery.trim()]);
            setSearchQuery('');
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for books..."
                    className="flex-1"
                />
                <Button type="submit">Search</Button>
            </form>

            {searchHistory.length > 0 && (
                <div>
                    <h2 className="mb-2 text-lg font-semibold">
                        Search History
                    </h2>
                    <ul className="space-y-1">
                        {searchHistory.map((query, index) => (
                            <li
                                key={index}
                                className="rounded-md bg-gray-100 px-3 py-2">
                                {query}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
