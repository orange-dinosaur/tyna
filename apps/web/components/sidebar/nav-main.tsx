'use client';

import { type LucideIcon } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@workspace/web-ui/components/sidebar';
import { useRouter } from 'next/navigation';

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

    return (
        <SidebarGroup>
            <SidebarGroupLabel></SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => (
                    <div key={item.title}>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className="cursor-pointer"
                                tooltip={item.title}
                                onClick={() => router.push(item.url)}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
