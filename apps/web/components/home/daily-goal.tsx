'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@workspace/ui-web/components/card';

interface DailyGoalProps {
    targetMinutes?: number;
    currentMinutes?: number;
}

export function DailyGoal({
    targetMinutes = 30,
    currentMinutes = 22,
}: DailyGoalProps) {
    const remaining = Math.max(0, targetMinutes - currentMinutes);
    const progress = Math.min(100, (currentMinutes / targetMinutes) * 100);
    const circumference = 2 * Math.PI * 36;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <Card className="bg-slate-800 text-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Daily Goal</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-sm text-slate-300">
                    Read {targetMinutes} minutes every day to build a habit.
                </p>

                <div className="flex items-center gap-4">
                    {/* Circular Progress */}
                    <div className="relative">
                        <svg
                            width="80"
                            height="80"
                            viewBox="0 0 80 80"
                            className="-rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke="#475569"
                                strokeWidth="6"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium">
                                {currentMinutes}/{targetMinutes}
                            </span>
                        </div>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">
                            {currentMinutes} mins
                        </p>
                        <p className="text-sm text-emerald-400">
                            {remaining} mins left
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
