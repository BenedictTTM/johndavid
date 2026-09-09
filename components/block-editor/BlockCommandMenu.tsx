'use client';

import type { ContentBlockType } from '@/types/content';
import {
    AlignLeft,
    Heading,
    Image,
    Quote,
    Code2,
    Info,
    SeparatorHorizontal,
    List,
    ExternalLink,
    type LucideProps,
} from 'lucide-react';

// ─── Block Definition Registry ────────────────────────────────────────────────

export interface BlockDefinition {
    type       : ContentBlockType;
    icon       : React.ComponentType<LucideProps>;
    label      : string;
    description: string;
    /** Extra terms that a fuzzy search should match against. */
    keywords   : string[];
}

/**
 * Ordered list of all supported block types, with their icon, copy, and
 * search keywords. This is the single source of truth for the command palette.
 */
export const BLOCK_DEFINITIONS: BlockDefinition[] = [
    {
        type       : 'paragraph',
        icon       : AlignLeft,
        label      : 'Text',
        description: 'Plain paragraph text',
        keywords   : ['text', 'para', 'paragraph', 'body', 'write', 'prose'],
    },
    {
        type       : 'heading',
        icon       : Heading,
        label      : 'Heading',
        description: 'Section heading — H1, H2, or H3',
        keywords   : ['heading', 'title', 'h1', 'h2', 'h3', 'section'],
    },
    {
        type       : 'image',
        icon       : Image,
        label      : 'Image',
        description: 'Image with optional caption',
        keywords   : ['image', 'photo', 'picture', 'img', 'figure', 'media'],
    },
    {
        type       : 'quote',
        icon       : Quote,
        label      : 'Quote',
        description: 'Pull quote with attribution',
        keywords   : ['quote', 'blockquote', 'cite', 'pullquote'],
    },
    {
        type       : 'code',
        icon       : Code2,
        label      : 'Code',
        description: 'Syntax-highlighted code block',
        keywords   : ['code', 'snippet', 'terminal', 'programming', 'monospace'],
    },
    {
        type       : 'callout',
        icon       : Info,
        label      : 'Callout',
        description: 'Info, tip, warning, or caution note',
        keywords   : ['callout', 'note', 'info', 'tip', 'warning', 'caution', 'alert', 'aside'],
    },
    {
        type       : 'divider',
        icon       : SeparatorHorizontal,
        label      : 'Divider',
        description: 'Thematic section break',
        keywords   : ['divider', 'separator', 'rule', 'hr', 'break', 'section'],
    },
    {
        type       : 'list',
        icon       : List,
        label      : 'List',
        description: 'Bullet or numbered list',
        keywords   : ['list', 'bullet', 'ordered', 'unordered', 'ul', 'ol', 'items'],
    },
    {
        type       : 'link_card',
        icon       : ExternalLink,
        label      : 'Link',
        description: 'Cited external link preview card',
        keywords   : ['link', 'card', 'url', 'citation', 'reference', 'external'],
    },
];

/**
 * Returns BLOCK_DEFINITIONS filtered by `query` — case-insensitive substring
 * match against label, description, and keywords.
 * Returns the full list when query is empty/whitespace.
 */
export function filterBlocks(query: string): BlockDefinition[] {
    const q = query.trim().toLowerCase();
    if (!q) return BLOCK_DEFINITIONS;
    return BLOCK_DEFINITIONS.filter(
        (b) =>
            b.label.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q) ||
            b.keywords.some((k) => k.includes(q)),
    );
}

// ─── BlockCommandMenu Display ─────────────────────────────────────────────────

interface BlockCommandMenuProps {
    items      : BlockDefinition[];
    activeIndex: number;
    onSelect   : (type: ContentBlockType) => void;
    /** Called when the pointer enters an item row — lets the parent sync activeIndex. */
    onHover    ?: (index: number) => void;
    /** When true, items receive onMouseDown (keep textarea focus); otherwise onClick. */
    useMouseDown?: boolean;
}

/**
 * Pure display component for the command palette item list.
 * Handles NO keyboard state — that lives in the parent (slash command in
 * ParagraphEditor, or AddBlockMenu trigger). This keeps the component
 * predictable and reusable.
 */
export function BlockCommandMenu({
    items,
    activeIndex,
    onSelect,
    onHover,
    useMouseDown = false,
}: BlockCommandMenuProps) {

    if (items.length === 0) {
        return (
            <div className="px-4 py-5 text-center">
                <p className="text-[10px] font-mono text-[#38240D]/40">
                    No blocks match your search
                </p>
            </div>
        );
    }

    return (
        <div role="listbox" aria-label="Block types" className="py-1 max-h-72 overflow-y-auto">
            {items.map((item, i) => {
                const Icon     = item.icon;
                const isActive = i === activeIndex;

                const handler = useMouseDown
                    ? { onMouseDown: (e: React.MouseEvent) => { e.preventDefault(); onSelect(item.type); } }
                    : { onClick: () => onSelect(item.type) };

                return (
                    <div
                        key={item.type}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => onHover?.(i)}
                        {...handler}
                        className={[
                            'flex items-center gap-3 px-3 py-2 cursor-pointer select-none transition-colors duration-75',
                            'border-l-2',
                            isActive
                                ? 'bg-[#713600]/07 border-[#713600]'
                                : 'border-transparent hover:bg-[#713600]/04',
                        ].join(' ')}
                    >
                        {/* Icon box */}
                        <div
                            className={[
                                'flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md border transition-colors duration-75',
                                isActive
                                    ? 'bg-[#713600]/10 border-[#713600]/25'
                                    : 'bg-[#FDFBD4] border-[#713600]/12',
                            ].join(' ')}
                        >
                            <Icon
                                className="w-3.5 h-3.5 text-[#713600]"
                                strokeWidth={1.75}
                                aria-hidden="true"
                            />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className={`text-[12px] font-bold leading-tight ${isActive ? 'text-[#713600]' : 'text-[#38240D]'}`}>
                                {item.label}
                            </p>
                            <p className="text-[10px] text-[#38240D]/48 leading-tight mt-0.5 truncate">
                                {item.description}
                            </p>
                        </div>

                        {/* Enter hint on active row */}
                        {isActive && (
                            <kbd
                                className="flex-shrink-0 text-[9px] font-mono bg-[#FDFBD4] border border-[#713600]/15 text-[#713600]/55 px-1.5 py-0.5 rounded leading-none"
                                aria-label="Press Enter to select"
                            >
                                ↵
                            </kbd>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
