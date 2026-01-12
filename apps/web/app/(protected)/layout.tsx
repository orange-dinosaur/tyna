import { AppSidebar } from '@/components/sidebar/app-sidebar';
import {
    SidebarInset,
    SidebarProvider,
} from '@workspace/ui-web/components/sidebar';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width-icon': '5.5rem',
                } as React.CSSProperties
            }>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
