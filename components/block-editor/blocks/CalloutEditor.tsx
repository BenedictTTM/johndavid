'use client';

import type { CalloutBlock } from '@/types/content';
import { inlineToText, textToInline } from '../index';

interface CalloutEditorProps {
    block: CalloutBlock;
    onChange: (block: CalloutBlock) => void;
}

const variantLabel: Record<CalloutBlock['variant'], string> = {
    info   : '📋 Info',
    tip    : '💡 Tip',
    warning: '⚠️ Warning',
    caution: '🚨 Caution',
};

const variantAccent: Record<CalloutBlock['variant'], string> = {
    info   : 'border-[#713600]/30 bg-[#FAF7C8]',
    tip    : 'border-[#2D6A4F]/30 bg-[#2D6A4F]/[0.03]',
    warning: 'border-[#D97706]/30 bg-[#D97706]/[0.04]',
    caution: 'border-[#B91C1C]/30 bg-[#B91C1C]/[0.04]',
};

export function CalloutEditor({ block, onChange }: CalloutEditorProps) {
    return (
        <div className="px-4 py-3 space-y-3 w-full">
            {/* Variant + title row */}
            <div className="flex gap-3 items-start">
                <select
                    value={block.variant}
                    onChange={(e) =>
                        onChange({ ...block, variant: e.target.value as CalloutBlock['variant'] })
                    }
                    className="flex-shrink-0 px-2 py-1.5 bg-[#FDFBD4] border border-[#713600]/20 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-[#713600] outline-none cursor-pointer"
                >
                    {(Object.keys(variantLabel) as CalloutBlock['variant'][]).map((v) => (
                        <option key={v} value={v}>{variantLabel[v]}</option>
                    ))}
                </select>

                <input
                    type="text"
                    value={block.title ?? ''}
                    onChange={(e) => onChange({ ...block, title: e.target.value || undefined })}
                    placeholder="Title (optional)..."
                    className="flex-1 px-3 py-1.5 bg-transparent outline-none text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#38240D] placeholder-[#38240D]/25"
                />
            </div>

            {/* Body content */}
            <div className={`border rounded-lg p-3 ${variantAccent[block.variant]}`}>
                <textarea
                    value={inlineToText(block.content)}
                    onChange={(e) =>
                        onChange({ ...block, content: textToInline(e.target.value) })
                    }
                    placeholder="Callout body text..."
                    rows={3}
                    className="w-full bg-transparent outline-none text-[#38240D] placeholder-[#38240D]/30 text-sm leading-relaxed resize-none"
                />
            </div>
        </div>
    );
}
