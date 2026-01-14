'use client';

import { SidebarTrigger } from '@workspace/ui-web/components/sidebar';

export function SearchHeader() {
    return (
        <div className="mb-6 flex items-start gap-3">
            <SidebarTrigger className="mt-1 md:hidden" />
            <h1 className="text-3xl font-bold text-foreground">
                What would you like to read next?
            </h1>
        </div>
    );
}
