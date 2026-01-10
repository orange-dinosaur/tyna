import { NextRequest, NextResponse } from 'next/server';
import { authClient } from '@/lib/auth-client';

export default async function middleware(request: NextRequest) {
    const session = await authClient.getSession();

    console.log('session: \n', session);

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/register'],
};
