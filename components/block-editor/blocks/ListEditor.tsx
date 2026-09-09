'use client';

import { Plus, Minus } from 'lucide-react';
import type { ListBlock, ListItem } from '@/types/content';
import { inlineToText, textToInline, mkId } from '../index';

interface ListEditorProps {
    block: ListBlock;
    onChange: (block: ListBlock) => void;
}

export function ListEditor({ block, onChange }: ListEditorProps) {

    const setItemText = (id: string, text: string) => {
        onChange({
            ...block,
            items: block.items.map((item) =>
                item.id === id ? { ...item, content: textToInline(text) } : item
            ),
        });
    };

    const addItem = () => {
        onChange({
            ...block,
            items: [...block.items, { id: mkId(), content: [] }],
        });
    };

    const removeItem = (id: string) => {
        if (block.items.length <= 1) return; // always keep at least one item
        onChange({ ...block, items: block.items.filter((item) => item.id !== id) });
    };

    return (
        <div className="px-4 py-3 space-y-2 w-full">
            {/* Ordered / Unordered toggle */}
            <div className="flex items-center gap-2 mb-3">
                <button
                    type="button"
                    onClick={() => onChange({ ...block, ordered: false })}
                    className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded border transition-colors ${
                        !block.ordered
                            ? 'bg-[#713600] text-[#FDFBD4] border-[#713600]'
                            : 'bg-[#FDFBD4] text-[#713600] border-[#713600]/25 hover:border-[#713600]/50'
                    }`}
                >
                    • Bullet
                </button>
                <button
                    type="button"
                    onClick={() => onChange({ ...block, ordered: true })}
                    className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded border transition-colors ${
                        block.ordered
                            ? 'bg-[#713600] text-[#FDFBD4] border-[#713600]'
                            : 'bg-[#FDFBD4] text-[#713600] border-[#713600]/25 hover:border-[#713600]/50'
                    }`}
                >
                    1. Numbered
                </button>
            </div>

            {/* Item list */}
            <div className="space-y-2">
                {block.items.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-2">
                        {/* List marker */}
                        <span className="flex-shrink-0 w-5 text-[11px] font-mono text-[#713600]/50 text-right select-none">
                            {block.ordered ? `${i + 1}.` : '•'}
                        </span>

                        {/* Item text */}
                        <input
                            type="text"
                            value={inlineToText(item.content)}
                            onChange={(e) => setItemText(item.id, e.target.value)}
                            placeholder={`List item ${i + 1}...`}
                            className="flex-1 px-3 py-2 bg-[#FDFBD4] border border-[#713600]/12 rounded-md outline-none text-[#38240D] text-sm placeholder-[#38240D]/30 focus:border-[#713600]/30 transition-colors"
                            onKeyDown={(e) => {
                                // Enter = add new item
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addItem();
                                }
                                // Backspace on empty = remove item
                                if (e.key === 'Backspace' && inlineToText(item.content) === '') {
                                    e.preventDefault();
                                    removeItem(item.id);
                                }
                            }}
                        />

                        {/* Remove button */}
                        <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            disabled={block.items.length <= 1}
                            className="flex-shrink-0 p-1 text-[#38240D]/30 hover:text-red-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            aria-label="Remove item"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add item */}
            <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#713600]/60 hover:text-[#713600] transition-colors pt-1"
            >
                <Plus className="w-3 h-3" />
                Add item
            </button>
        </div>
    );
}
