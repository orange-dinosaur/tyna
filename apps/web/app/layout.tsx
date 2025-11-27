import { Geist, Geist_Mono } from 'next/font/google';

import '@workspace/ui-web/globals.css';
import { ThemeProvider } from '@workspace/ui-web/components/theme-provider';

const fontSans = Geist({
    subsets: ['latin'],
    variable: '--font-sans',
});

const fontMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
