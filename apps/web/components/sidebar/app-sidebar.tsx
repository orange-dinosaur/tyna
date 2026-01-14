'use client';

import * as React from 'react';
import {
    Bookmark,
    ChartArea,
    Flag,
    Heart,
    House,
    PanelLeftIcon,
    PanelRightIcon,
    Search,
} from 'lucide-react';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
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
            icon: Flag,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
        <Sidebar
            collapsible="icon"
            style={
                {
                    '--sidebar-width-icon': '3.5rem',
                } as React.CSSProperties
            }
            {...props}>
            <SidebarHeader>
                <div className="flex items-center justify-between gap-2 py-2 transition-[justify-content,gap,padding] duration-200 ease-in-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:px-1">
                    <SidebarLogo />
                    {!isCollapsed && <SidebarTrigger className="ml-auto text-emerald-600" />}
                </div>
            </SidebarHeader>

            <SidebarContent>
                {isCollapsed && (
                    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Toggle Sidebar"
                                onClick={toggleSidebar}
                                className="group-data-[collapsible=icon]:mx-auto cursor-pointer text-emerald-600">
                                <PanelRightIcon />
                                <span>Toggle Sidebar</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
                <NavMain items={data.navMain} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
