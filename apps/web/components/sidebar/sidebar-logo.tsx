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
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                    onClick={() => router.push('/home')}>
                    <div className="flex aspect-square size-8 items-center justify-center">
                        <Image
                            src={images.logo}
                            alt="App Logo"
                            width={50}
                            height={50}
                            className="w-auto"
                        />
                    </div>

                    <h1 className="truncate text-lg font-semibold">
                        {process.env.NEXT_PUBLIC_APP_NAME}
                    </h1>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
