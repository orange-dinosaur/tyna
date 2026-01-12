import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const protectedRoutes = [
    '/home',
    '/search',
    '/favorites',
    '/saved',
    '/statistics',
    '/goals',
];
const authRoutes = ['/login', '/signup'];

export default async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const pathname = request.nextUrl.pathname;

    // Not logged in trying to access protected route -> redirect to login
    if (
        !sessionCookie &&
        protectedRoutes.some((route) => pathname.startsWith(route))
    ) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Already logged in trying to access auth routes -> redirect to home
    if (
        sessionCookie &&
        (authRoutes.some((route) => pathname.startsWith(route)) ||
            pathname === '/')
    ) {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
        '/home/:path*',
        '/search/:path*',
        '/favorites/:path*',
        '/saved/:path*',
        '/statistics/:path*',
        '/goals/:path*',
    ],
};
