'use client';

import * as React from 'react';
import {
    BookHeart,
    Bookmark,
    ChartArea,
    Goal,
    House,
    Search,
} from 'lucide-react';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import { NavLogo } from '@/components/sidebar/nav-logo';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@workspace/web-ui/components/sidebar';

const data = {
    navMain: [
        {
            title: 'Home',
            url: '/home',
            icon: House,
            isActive: true,
        },
        {
            title: 'Search',
            url: '/search',
            icon: Search,
            isActive: true,
        },
        {
            title: 'Favorites',
            url: '/favorites',
            icon: BookHeart,
            isActive: true,
        },
        {
            title: 'Saved',
            url: '/saved',
            icon: Bookmark,
            isActive: true,
        },
        {
            title: 'Statistics',
            url: '/statistics',
            icon: ChartArea,
            isActive: true,
        },
        {
            title: 'Goals',
            url: '/goals',
            icon: Goal,
            isActive: true,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavLogo />
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
