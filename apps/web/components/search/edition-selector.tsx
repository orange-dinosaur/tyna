'use client';

import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@workspace/web-ui/components/dialog';
import { Button } from '@workspace/web-ui/components/button';
import { Badge } from '@workspace/web-ui/components/badge';

interface Edition {
    externalId: string;
    title: string;
    publisher?: string;
    publishedDate?: string;
    format?: string;
    pageCount?: number;
    language?: string;
    coverUrl?: string;
}

export interface EditionSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    work: {
        title: string;
        editions: Edition[];
    };
}

export function EditionSelector({
    open,
    onOpenChange,
    work,
}: EditionSelectorProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editions of {work.title}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                    {work.editions.map((edition) => {
                        const detailParts: string[] = [];
                        if (edition.publisher)
                            detailParts.push(edition.publisher);
                        if (edition.publishedDate)
                            detailParts.push(edition.publishedDate);
                        if (edition.pageCount)
                            detailParts.push(`${edition.pageCount} pages`);

                        return (
                            <div
                                key={edition.externalId}
                                className="flex gap-3 rounded-md border p-3">
                                <div className="shrink-0">
                                    {edition.coverUrl ? (
                                        <Image
                                            src={edition.coverUrl}
                                            alt={`Cover of ${edition.title}`}
                                            width={56}
                                            height={80}
                                            className="h-20 w-14 rounded object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-14 items-center justify-center rounded bg-gradient-to-br from-emerald-400 to-emerald-700 p-1">
                                            <span className="text-center text-[10px] font-medium text-white">
                                                {edition.title}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col gap-1">
                                    <p className="text-sm font-medium leading-tight">
                                        {edition.title}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {edition.format && (
                                            <Badge
                                                variant="secondary"
                                                className="text-[10px]">
                                                {edition.format}
                                            </Badge>
                                        )}
                                        {edition.language && (
                                            <Badge
                                                variant="outline"
                                                className="text-[10px]">
                                                {edition.language}
                                            </Badge>
                                        )}
                                    </div>
                                    {detailParts.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            {detailParts.join(' · ')}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    className="shrink-0 self-center bg-emerald-600 hover:bg-emerald-700">
                                    Add
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
