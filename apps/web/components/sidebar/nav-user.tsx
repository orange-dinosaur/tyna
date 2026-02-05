'use client';

import { ChevronsUpDown, LogOut } from 'lucide-react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@workspace/web-ui/components/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@workspace/web-ui/components/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@workspace/web-ui/components/sidebar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/lib/actions/auth/logout';
import { toast } from '@workspace/web-ui/components/sonner';
import { useUser } from '@/components/user-provider';
import { Skeleton } from '@workspace/web-ui/components/skeleton';

export function NavUser() {
    const { user, isLoading } = useUser();
    const { isMobile } = useSidebar();

    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPending(true);

        const result = await logout();

        if (result.status !== 200) {
            toast.error(result.message || 'Logout failed');
            setPending(false);
            return;
        }

        router.push('/login');
    }

    // Loading state
    if (isLoading) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="flex items-center gap-2 px-2 py-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    // Not logged in
    if (!user) {
        return null;
    }

    // Get initials for avatar fallback
    const initials = user.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'U';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user?.image || ''}
                                    alt={user?.name || ''}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user?.name || ''}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.email || ''}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}>
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user?.image || ''}
                                        alt={user?.name || ''}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user?.name || ''}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user?.email || ''}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="cursor-pointer">
                            <form onSubmit={handleSubmit} className="w-full">
                                <button
                                    type="submit"
                                    disabled={pending}
                                    className="flex w-full items-center gap-2 cursor-pointer">
                                    <LogOut />
                                    Log out
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
