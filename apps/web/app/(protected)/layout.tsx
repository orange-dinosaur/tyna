import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { UserProvider } from '@/components/user-provider';
import { getServerUser } from '@/lib/auth-server';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@workspace/web-ui/components/sidebar';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const initialUser = await getServerUser();

    return (
        <UserProvider initialUser={initialUser}>
            <SidebarProvider>
                <AppSidebar />

                <SidebarInset className="max-h-svh flex flex-col overflow-hidden">
                    <header className="bg-background flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1 cursor-pointer" />
                        </div>
                    </header>

                    <div className="flex-1 min-h-0 overflow-auto p-4">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </UserProvider>
    );
}
