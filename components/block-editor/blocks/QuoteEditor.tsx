'use client';

import type { QuoteBlock } from '@/types/content';
import { inlineToText, textToInline } from '../index';

interface QuoteEditorProps {
    block: QuoteBlock;
    onChange: (block: QuoteBlock) => void;
}

export function QuoteEditor({ block, onChange }: QuoteEditorProps) {
    return (
        <div className="px-4 py-3 space-y-3 w-full">
            {/* Quote text */}
            <div className="border-l-2 border-[#713600]/40 pl-4">
                <textarea
                    value={inlineToText(block.content)}
                    onChange={(e) => onChange({ ...block, content: textToInline(e.target.value) })}
                    placeholder="Write a pull quote..."
                    rows={3}
                    className="w-full bg-transparent outline-none text-[#38240D] placeholder-[#38240D]/30 text-base font-serif italic leading-relaxed resize-none"
                />
            </div>

            {/* Attribution */}
            <input
                type="text"
                value={block.attribution ?? ''}
                onChange={(e) => onChange({ ...block, attribution: e.target.value || undefined })}
                placeholder="— Attribution (optional)"
                className="w-full bg-transparent outline-none text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#713600]/60 placeholder-[#713600]/25"
            />
        </div>
    );
}
