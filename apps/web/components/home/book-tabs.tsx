'use client';

import { Plus } from 'lucide-react';
import { Card, CardContent } from '@workspace/ui-web/components/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@workspace/ui-web/components/tabs';

interface Book {
    id: string;
    title: string;
    author: string;
    coverColor?: string;
}

interface BookTabsProps {
    nextUp?: Book[];
    finished?: Book[];
    wishlist?: Book[];
}

const defaultNextUp: Book[] = [
    {
        id: '1',
        title: 'Atomic Habits',
        author: 'James Clear',
        coverColor: 'from-lime-600 to-lime-800',
    },
    {
        id: '2',
        title: 'Dune',
        author: 'Frank Herbert',
        coverColor: 'from-amber-700 to-amber-900',
    },
    {
        id: '3',
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        coverColor: 'from-orange-600 to-orange-800',
    },
];

function BookCard({ book }: { book: Book }) {
    return (
        <div className="w-28 flex-shrink-0 sm:w-32">
            <div
                className={`mb-2 h-40 w-full rounded-lg bg-gradient-to-br sm:h-44 ${book.coverColor || 'from-slate-600 to-slate-800'} flex items-center justify-center p-3 shadow-md`}>
                <span className="text-center text-xs font-semibold text-white">
                    {book.title.toUpperCase()}
                </span>
            </div>
            <h4 className="truncate text-sm font-medium">{book.title}</h4>
            <p className="truncate text-xs text-muted-foreground">
                {book.author}
            </p>
        </div>
    );
}

function AddBookCard() {
    return (
        <div className="w-28 flex-shrink-0 sm:w-32">
            <Card className="mb-2 flex h-40 w-full cursor-pointer items-center justify-center border-dashed hover:border-emerald-400 hover:bg-emerald-50/50 sm:h-44">
                <CardContent className="flex flex-col items-center p-0">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                    <span className="mt-1 text-xs text-muted-foreground">
                        Add Book
                    </span>
                </CardContent>
            </Card>
        </div>
    );
}

export function BookTabs({
    nextUp = defaultNextUp,
    finished = [],
    wishlist = [],
}: BookTabsProps) {
    return (
        <div>
            <Tabs defaultValue="next-up">
                <TabsList className="mb-4 w-full justify-start bg-transparent p-0">
                    <TabsTrigger
                        value="next-up"
                        className="rounded-none border-b-2 border-transparent px-2 pb-2 text-sm sm:px-4 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                        Next Up
                    </TabsTrigger>
                    <TabsTrigger
                        value="finished"
                        className="rounded-none border-b-2 border-transparent px-2 pb-2 text-sm sm:px-4 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                        Finished
                    </TabsTrigger>
                    <TabsTrigger
                        value="wishlist"
                        className="rounded-none border-b-2 border-transparent px-2 pb-2 text-sm sm:px-4 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                        Wishlist
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="next-up">
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {nextUp.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                        <AddBookCard />
                    </div>
                </TabsContent>

                <TabsContent value="finished">
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {finished.length > 0 ? (
                            finished.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No finished books yet.
                            </p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="wishlist">
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {wishlist.length > 0 ? (
                            wishlist.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Your wishlist is empty.
                            </p>
                        )}
                        <AddBookCard />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
