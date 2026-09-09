'use client';

import type { HeadingBlock } from '@/types/content';

interface HeadingEditorProps {
    block: HeadingBlock;
    onChange: (block: HeadingBlock) => void;
}

const levelStyle: Record<1 | 2 | 3, string> = {
    1: 'text-2xl font-bold font-serif',
    2: 'text-xl  font-bold font-serif',
    3: 'text-lg  font-semibold font-serif',
};

export function HeadingEditor({ block, onChange }: HeadingEditorProps) {
    return (
        <div className="flex items-center gap-3 flex-1 w-full">
            {/* Level selector */}
            <select
                value={block.level}
                onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 1 | 2 | 3 })}
                className="flex-shrink-0 px-2 py-1.5 bg-[#FDFBD4] border border-[#713600]/20 rounded text-[9px] font-mono font-bold uppercase tracking-wider text-[#713600] outline-none cursor-pointer"
            >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
            </select>

            {/* Heading text */}
            <input
                type="text"
                value={block.text}
                onChange={(e) => onChange({ ...block, text: e.target.value })}
                placeholder={`Heading ${block.level}...`}
                className={`flex-1 px-3 py-3 bg-transparent outline-none text-[#38240D] placeholder-[#38240D]/30 tracking-tight leading-tight ${levelStyle[block.level]}`}
            />
        </div>
    );
}
