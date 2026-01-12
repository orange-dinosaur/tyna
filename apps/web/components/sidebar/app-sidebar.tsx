'use client';

import * as React from 'react';
import {
    Bookmark,
    ChartArea,
    Heart,
    House,
    Search,
    Target,
} from 'lucide-react';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarTrigger,
} from '@workspace/ui-web/components/sidebar';
import { SidebarLogo } from '@/components/sidebar/sidebar-logo';

const data = {
    navMain: [
        {
            title: 'Home',
            url: '/home',
            icon: House,
        },
        {
            title: 'Search',
            url: '/search',
            icon: Search,
        },
        {
            title: 'Favorites',
            url: '/favorites',
            icon: Heart,
        },
        {
            title: 'Saved',
            url: '/saved',
            icon: Bookmark,
        },
        {
            title: 'Statistics',
            url: '/statistics',
            icon: ChartArea,
        },
        {
            title: 'Goals',
            url: '/goals',
            icon: Target,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible="icon"
            style={
                {
                    '--sidebar-width-icon': '5.5rem',
                } as React.CSSProperties
            }
            {...props}>
            <SidebarHeader>
                <div className="flex items-center justify-between gap-2 px-2 py-2 group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:px-1">
                    <SidebarLogo />
                    <SidebarTrigger className="ml-auto" />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
