'use client';

import * as React from 'react';
import { ConvexProvider, ConvexReactClient } from '@workspace/convex/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl || convexUrl.trim().length === 0) {
    throw new Error(
        'Missing NEXT_PUBLIC_CONVEX_URL. Set it in your environment to the Convex deployment URL.'
    );
}

const convex = new ConvexReactClient(convexUrl);

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ConvexProvider client={convex}>
            <NextThemesProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
                enableColorScheme>
                {children}
            </NextThemesProvider>
        </ConvexProvider>
    );
}
