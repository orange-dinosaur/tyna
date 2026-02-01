import { cookies } from 'next/headers';

export interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    user: User;
    session: {
        id: string;
        expiresAt: Date;
        token: string;
        createdAt: Date;
        updatedAt: Date;
    };
}

/**
 * Server-side function to fetch the current user session from the auth server.
 * Returns null if no valid session exists.
 */
export async function getServerSession(): Promise<Session | null> {
    try {
        const cookieStore = await cookies();
        const authServerUrl = process.env.NEXT_PUBLIC_AUTH_SERVER_BASE_URL;

        if (!authServerUrl) {
            console.error('NEXT_PUBLIC_AUTH_SERVER_BASE_URL is not set');
            return null;
        }

        // Get all cookies to forward to auth server
        const cookieHeader = cookieStore
            .getAll()
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join('; ');

        // Fetch session from auth server
        const response = await fetch(`${authServerUrl}/api/auth/session`, {
            method: 'GET',
            headers: {
                Cookie: cookieHeader,
            },
            credentials: 'include',
            cache: 'no-store',
        });

        if (!response.ok) {
            return null;
        }

        const session = await response.json();

        // Validate that we have a user in the session
        if (!session?.user) {
            return null;
        }

        return session as Session;
    } catch (error) {
        console.error('Error fetching server session:', error);
        return null;
    }
}

/**
 * Server-side function to get just the user from the session.
 * Returns null if no valid session exists.
 */
export async function getServerUser(): Promise<User | null> {
    const session = await getServerSession();
    return session?.user ?? null;
}
