'use client';

import { useState, useRef } from 'react';
import type { ParagraphBlock, ContentBlockType } from '@/types/content';
import { inlineToText, textToInline } from '../index';
import { BlockCommandMenu, filterBlocks } from '../BlockCommandMenu';

interface ParagraphEditorProps {
    block       : ParagraphBlock;
    onChange    : (block: ParagraphBlock) => void;
    /** Called by the slash command when the author selects a different block type. */
    onConvertTo?: (type: ContentBlockType) => void;
}

export function ParagraphEditor({ block, onChange, onConvertTo }: ParagraphEditorProps) {

    const [menuOpen,    setMenuOpen]    = useState(false);
    const [query,       setQuery]       = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    // Re-computed on every render so keyboard nav always sees current list
    const filteredItems = filterBlocks(query);

    // ── Slash detection ─────────────────────────────────────────────────────

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;

        if (val === '/') {
            // Author just typed '/' — open menu, clear query
            setMenuOpen(true);
            setQuery('');
            setActiveIndex(0);
        } else if (menuOpen && val.startsWith('/')) {
            // Author is searching: update query with text after '/'
            setQuery(val.slice(1));
            setActiveIndex(0);
        } else if (menuOpen && !val.startsWith('/')) {
            // Author deleted the '/' — close menu
            setMenuOpen(false);
        }

        onChange({ ...block, content: textToInline(val) });
    };

    // ── Keyboard navigation (captured while textarea is focused) ────────────

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!menuOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, filteredItems.length - 1));
                break;

            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
                break;

            case 'Enter': {
                e.preventDefault();
                const item = filteredItems[activeIndex];
                if (item) selectBlock(item.type);
                break;
            }

            case 'Escape':
                e.preventDefault();
                // Clear the stray '/' and close
                onChange({ ...block, content: [] });
                setMenuOpen(false);
                break;

            case 'Tab': {
                // Tab selects the active item (convenience shortcut)
                e.preventDefault();
                const item = filteredItems[activeIndex];
                if (item) selectBlock(item.type);
                break;
            }
        }
    };

    // ── Block selection ─────────────────────────────────────────────────────

    const selectBlock = (type: ContentBlockType) => {
        setMenuOpen(false);
        setQuery('');

        if (type === 'paragraph') {
            // Same type: just clear the '/' the author typed
            onChange({ ...block, content: [] });
        } else if (onConvertTo) {
            onConvertTo(type);
        }
    };

    // ── Blur handling ───────────────────────────────────────────────────────
    // onMouseDown on the menu container uses e.preventDefault() to keep focus
    // in the textarea, so onBlur only fires on genuine blur-away events.

    const handleBlur = () => {
        // Short timeout so item onMouseDown fires before we close
        setTimeout(() => setMenuOpen(false), 120);
    };

    const text = inlineToText(block.content);

    return (
        <div className="relative w-full">
            <textarea
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={menuOpen ? '' : "Write a paragraph or type '/' for blocks…"}
                rows={4}
                className="w-full px-4 py-3 bg-transparent outline-none text-[#38240D] placeholder-[#38240D]/28 text-base leading-relaxed font-sans resize-none"
                aria-haspopup={onConvertTo ? 'listbox' : undefined}
                aria-expanded={menuOpen}
                aria-autocomplete="list"
            />

            {/* Slash command menu */}
            {menuOpen && (
                // onMouseDown prevents blur, keeping the textarea focused
                <div
                    onMouseDown={(e) => e.preventDefault()}
                    className="absolute left-4 top-full z-50 mt-1 w-72 bg-[#FDFBD4] border border-[#713600]/22 rounded-xl shadow-[0_12px_40px_rgba(56,36,13,0.13)] overflow-hidden"
                    role="presentation"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[#713600]/10">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-[#38240D]/40">
                            {query ? `/ ${query}` : 'Insert block'}
                        </span>
                        <span className="text-[9px] font-mono text-[#38240D]/28 hidden sm:block">
                            ↑↓ navigate · ↵ select · esc cancel
                        </span>
                    </div>

                    <BlockCommandMenu
                        items={filteredItems}
                        activeIndex={activeIndex}
                        onSelect={selectBlock}
                        onHover={setActiveIndex}
                        useMouseDown
                    />
                </div>
            )}
        </div>
    );
}
