'use client';

import { Flame } from 'lucide-react';
import { SidebarTrigger } from '@workspace/ui-web/components/sidebar';

interface WelcomeHeaderProps {
    userName?: string;
    streakDays?: number;
}

export function WelcomeHeader({
    userName = 'Alex',
    streakDays = 5,
}: WelcomeHeaderProps) {
    return (
        <div className="mb-6 flex items-start gap-3">
            <SidebarTrigger className="mt-1 md:hidden" />
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome back, {userName}!
                </h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Flame className="h-4 w-4 text-emerald-500" />
                    <span>
                        You're on a {streakDays}-day reading streak. Keep it up!
                    </span>
                </div>
            </div>
        </div>
    );
}
