'use client';

import { Flame } from 'lucide-react';
import { SidebarTrigger } from '@workspace/ui-web/components/sidebar';
import { useUser } from '@/components/user-provider';
import { Skeleton } from '@workspace/ui-web/components/skeleton';

interface WelcomeHeaderProps {
    streakDays?: number;
}

export function WelcomeHeader({ streakDays = 5 }: WelcomeHeaderProps) {
    const { user, isLoading } = useUser();

    // Show loading state while fetching user
    if (isLoading) {
        return (
            <div className="mb-6 flex items-start gap-3">
                <SidebarTrigger className="mt-1 md:hidden" />
                <div className="flex-1">
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-48" />
                </div>
            </div>
        );
    }

    // Fallback if no user (shouldn't happen in protected routes, but good to handle)
    const userName = user?.name || user?.email?.split('@')[0] || 'there';

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
