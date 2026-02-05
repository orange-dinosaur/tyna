'use client';

import { Button } from '@workspace/web-ui/components/button';
import { Input } from '@workspace/web-ui/components/input';
import { useState, FormEvent } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/convex/api';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const searchHistory = useQuery(api.searchHistory.list);
    const saveSearch = useMutation(api.searchHistory.create);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Save to Convex database
            await saveSearch({ query: searchQuery.trim() });
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
                    placeholder="Search..."
                    className="flex-1"
                />
                <Button type="submit">Search</Button>
            </form>

            {searchHistory && searchHistory.length > 0 && (
                <div>
                    <h2 className="mb-2 text-lg font-semibold">
                        Search History
                    </h2>
                    <ul className="space-y-1">
                        {searchHistory.map((item) => (
                            <li
                                key={item._id}
                                className="rounded-md bg-gray-100 px-3 py-2">
                                {item.query}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
