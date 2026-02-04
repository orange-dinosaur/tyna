'use client';

import * as React from 'react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@workspace/web-ui/components/sidebar';
import { images } from '@workspace/assets';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function NavLogo() {
    const router = useRouter();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
                    <div
                        className="flex aspect-square size-8 items-center justify-center rounded-lg"
                        onClick={() => router.push('/home')}>
                        <Image
                            src={images.logo}
                            alt="App Logo"
                            width={50}
                            height={50}
                            className="w-auto"
                        />
                    </div>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                            {process.env.NEXT_PUBLIC_APP_NAME}
                        </span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
