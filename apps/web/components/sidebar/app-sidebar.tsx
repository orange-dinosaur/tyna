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
} from '@workspace/ui-web/components/sidebar';
import { SidebarLogo } from '@/components/sidebar/sidebar-logo';

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },

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
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarLogo />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
