'use client';

import { type LucideIcon } from 'lucide-react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
} from '@workspace/ui-web/components/sidebar';
import { useRouter } from 'next/navigation';

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
    }[];
}) {
    const router = useRouter();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuButton
                        className="cursor-pointer"
                        tooltip={item.title}
                        key={item.title}
                        onClick={() => router.push(item.url)}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
