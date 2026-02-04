'use client';

import * as React from 'react';
import { useSession } from '@/lib/auth-client';
import type { User } from '@/lib/auth-server';

interface UserContextValue {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
}

const UserContext = React.createContext<UserContextValue | undefined>(
    undefined
);

interface UserProviderProps {
    children: React.ReactNode;
    initialUser?: User | null;
}

/**
 * UserProvider component that provides user data globally via React Context.
 * Accepts initial user data from server-side rendering for optimal performance.
 * Falls back to client-side useSession hook for reactivity and updates.
 */
export function UserProvider({
    children,
    initialUser = null,
}: UserProviderProps) {
    const { data: session, isPending } = useSession();
    const [serverUser] = React.useState<User | null>(initialUser);

    // Use client-side session as source of truth (more reactive)
    // Only fall back to server user while client session is still loading
    // Once loaded, trust the client session result (even if null) to handle logout
    const user = isPending
        ? (session?.user ?? serverUser)
        : (session?.user ?? null);
    const isLoading = isPending;
    const error = null; // better-auth handles errors internally

    const value: UserContextValue = React.useMemo(
        () => ({
            user: user as User | null,
            isLoading,
            error,
        }),
        [user, isLoading, error]
    );

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
}

/**
 * Hook to access user data from UserContext.
 * Must be used within a UserProvider.
 *
 * @example
 * ```tsx
 * const { user, isLoading } = useUser();
 * if (isLoading) return <Skeleton />;
 * if (!user) return <div>Not logged in</div>;
 * return <div>Hello, {user.name}!</div>;
 * ```
 */
export function useUser(): UserContextValue {
    const context = React.useContext(UserContext);

    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
}
