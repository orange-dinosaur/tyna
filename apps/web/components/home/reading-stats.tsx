'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@workspace/ui-web/components/card';

interface ReadingStatsProps {
    booksThisYear?: number;
    pagesRead?: number;
    weeklyData?: number[];
    weeklyHours?: number;
}

export function ReadingStats({
    booksThisYear = 12,
    pagesRead = 3400,
    weeklyData = [30, 45, 20, 60, 75, 50, 40],
    weeklyHours = 4.5,
}: ReadingStatsProps) {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const maxValue = Math.max(...weeklyData);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Reading Stats</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Stats Row */}
                <div className="mb-6 flex flex-wrap gap-6 sm:gap-8">
                    <div>
                        <p className="text-2xl font-bold">{booksThisYear}</p>
                        <p className="text-xs uppercase text-muted-foreground">
                            Books in 2023
                        </p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-emerald-600">
                            {pagesRead >= 1000
                                ? `${(pagesRead / 1000).toFixed(1)}k`
                                : pagesRead}
                        </p>
                        <p className="text-xs uppercase text-muted-foreground">
                            Pages Read
                        </p>
                    </div>
                </div>

                {/* Weekly Chart */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">This Week</p>
                        <p className="text-sm text-emerald-600">
                            {weeklyHours} hrs
                        </p>
                    </div>
                    <div className="flex items-end justify-between gap-1">
                        {weeklyData.map((value, index) => (
                            <div
                                key={index}
                                className="flex flex-1 flex-col items-center gap-1">
                                <div
                                    className="w-full rounded-sm bg-emerald-400"
                                    style={{
                                        height: `${(value / maxValue) * 60}px`,
                                        minHeight: '8px',
                                    }}
                                />
                                <span className="text-xs text-muted-foreground">
                                    {days[index]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
