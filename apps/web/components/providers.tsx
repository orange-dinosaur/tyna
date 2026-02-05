'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ConvexClientProvider } from './convex-client-provider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ConvexClientProvider>
            <NextThemesProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
                enableColorScheme>
                {children}
            </NextThemesProvider>
        </ConvexClientProvider>
    );
}
