'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import type { ContentBlockType } from '@/types/content';
import { BlockCommandMenu, filterBlocks } from './BlockCommandMenu';

interface AddBlockMenuProps {
    onAdd: (type: ContentBlockType) => void;
}

export function AddBlockMenu({ onAdd }: AddBlockMenuProps) {

    const [open,        setOpen]        = useState(false);
    const [query,       setQuery]       = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef    = useRef<HTMLInputElement>(null);

    const filteredItems = filterBlocks(query);

    // ── Close on click outside ──────────────────────────────────────────────

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // ── Focus search input and reset state when opening ─────────────────────

    useEffect(() => {
        if (!open) return;
        setQuery('');
        setActiveIndex(0);
        // requestAnimationFrame so the input is painted before focus
        requestAnimationFrame(() => searchRef.current?.focus());
    }, [open]);

    // ── Escape closes from anywhere inside the menu ─────────────────────────

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeMenu();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open]);

    // ── Helpers ─────────────────────────────────────────────────────────────

    const closeMenu = () => {
        setOpen(false);
        setQuery('');
    };

    const handleAdd = (type: ContentBlockType) => {
        onAdd(type);
        closeMenu();
    };

    // ── Search input keyboard nav ────────────────────────────────────────────

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
                if (item) handleAdd(item.type);
                break;
            }
            case 'Tab': {
                e.preventDefault();
                const item = filteredItems[activeIndex];
                if (item) handleAdd(item.type);
                break;
            }
        }
    };

    return (
        <div className="relative" ref={containerRef}>

            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Insert a new content block"
                className={[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md border',
                    'text-[10px] font-mono font-bold uppercase tracking-[0.2em]',
                    'transition-all duration-150',
                    open
                        ? 'bg-[#713600] text-[#FDFBD4] border-[#713600]'
                        : 'bg-[#FDFBD4] text-[#713600] border-[#713600]/20 hover:bg-[#713600]/08 hover:border-[#713600]/40',
                ].join(' ')}
            >
                <Plus
                    className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
                    strokeWidth={2.5}
                />
                Add block
            </button>

            {/* Dropdown menu — renders above the footer bar */}
            {open && (
                <div
                    className="absolute bottom-full left-0 mb-2 w-72 bg-[#FDFBD4] border border-[#713600]/22 rounded-xl shadow-[0_12px_40px_rgba(56,36,13,0.13)] overflow-hidden z-50"
                    role="dialog"
                    aria-label="Insert block"
                >
                    {/* Search header */}
                    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#713600]/10">
                        <Search
                            className="w-3 h-3 flex-shrink-0 text-[#713600]/45"
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                        <input
                            ref={searchRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setActiveIndex(0);
                            }}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search blocks…"
                            className="flex-1 bg-transparent outline-none text-[12px] text-[#38240D] placeholder-[#38240D]/32 font-sans"
                            aria-label="Search block types"
                            aria-controls="add-block-list"
                        />
                        <kbd className="flex-shrink-0 text-[9px] font-mono bg-[#FAF7C8] border border-[#713600]/15 text-[#713600]/50 px-1.5 py-0.5 rounded leading-none hidden sm:block">
                            esc
                        </kbd>
                    </div>

                    {/* Block list */}
                    <div id="add-block-list">
                        <BlockCommandMenu
                            items={filteredItems}
                            activeIndex={activeIndex}
                            onSelect={handleAdd}
                            onHover={setActiveIndex}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
