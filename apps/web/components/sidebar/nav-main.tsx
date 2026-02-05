'use client';

import { type LucideIcon } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@workspace/web-ui/components/sidebar';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@workspace/web-ui/lib/utils';

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
    }[];
}) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupLabel></SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                        <div key={item.title}>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className={cn('cursor-pointer', {
                                        'bg-green-500 text-white hover:bg-green-500 hover:text-white':
                                            isActive,
                                    })}
                                    tooltip={item.title}
                                    onClick={() => router.push(item.url)}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </div>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
