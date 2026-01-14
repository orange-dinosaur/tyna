'use client';

import * as React from 'react';
import Image from 'next/image';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@workspace/ui-web/components/sidebar';
import { images } from '@workspace/assets';
import { useRouter } from 'next/navigation';

export function SidebarLogo() {
    const router = useRouter();

    return (
        <SidebarMenu className="group-data-[collapsible=icon]:items-center transition-[align-items] duration-200 ease-in-out">
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:transition-[margin] group-data-[collapsible=icon]:duration-200 group-data-[collapsible=icon]:ease-in-out"
                    onClick={() => router.push('/home')}>
                    <div className="flex aspect-square size-8 shrink-0 items-center justify-center">
                        <Image
                            src={images.logo}
                            alt="App Logo"
                            width={50}
                            height={50}
                            className="w-auto"
                        />
                    </div>

                    <h1 className="truncate text-lg font-semibold transition-[opacity,width,max-width] duration-200 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:overflow-hidden">
                        {process.env.NEXT_PUBLIC_APP_NAME}
                    </h1>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
