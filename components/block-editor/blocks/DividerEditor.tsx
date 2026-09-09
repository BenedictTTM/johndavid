'use client';

import type { DividerBlock } from '@/types/content';

interface DividerEditorProps {
    block: DividerBlock;
}

/** Divider has no configurable content — only shows a visual preview. */
export function DividerEditor({ block: _ }: DividerEditorProps) {
    return (
        <div className="px-4 py-5 w-full flex items-center gap-4" aria-hidden="true">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#713600]/20 to-transparent" />
            <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#713600]/25" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#713600]/25" />
                <span className="w-1 h-1 rounded-full bg-[#713600]/25" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#713600]/20 to-transparent" />
        </div>
    );
}
