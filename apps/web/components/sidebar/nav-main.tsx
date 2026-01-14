'use client';

import { type LucideIcon } from 'lucide-react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
} from '@workspace/ui-web/components/sidebar';
import { useRouter, usePathname } from 'next/navigation';

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
    const pathname = usePathname();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:items-center">
            <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                {items.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                        <SidebarMenuButton
                            isActive={isActive}
                            className={`cursor-pointer group-data-[collapsible=icon]:mx-auto h-11 py-3 text-base [&>svg]:size-5 [&>svg]:fill-current [&>svg]:stroke-current ${
                                isActive ? 'data-[active=true]:!bg-emerald-50 [&>svg]:text-emerald-600' : ''
                            }`}
                            tooltip={item.title}
                            key={item.title}
                            onClick={() => router.push(item.url)}>
                            {item.icon && <item.icon fill="currentColor" strokeWidth={2.5} />}
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
