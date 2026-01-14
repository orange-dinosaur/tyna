import { AppSidebar } from '@/components/sidebar/app-sidebar';
import {
    SidebarInset,
    SidebarProvider,
} from '@workspace/ui-web/components/sidebar';
import { UserProvider } from '@/components/user-provider';
import { getServerUser } from '@/lib/auth-server';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch user server-side for optimal SSR performance
    const initialUser = await getServerUser();

    return (
        <UserProvider initialUser={initialUser}>
            <SidebarProvider
                style={
                    {
                        '--sidebar-width-icon': '3.5rem',
                    } as React.CSSProperties
                }>
                <AppSidebar />
                <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
        </UserProvider>
    );
}
