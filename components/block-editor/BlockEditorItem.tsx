'use client';

import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import type { ContentBlock, ContentBlockType, InlineContent } from '@/types/content';

import { ParagraphEditor } from './blocks/ParagraphEditor';
import { HeadingEditor }   from './blocks/HeadingEditor';
import { ImageEditor }     from './blocks/ImageEditor';
import { QuoteEditor }     from './blocks/QuoteEditor';
import { CodeEditor }      from './blocks/CodeEditor';
import { CalloutEditor }   from './blocks/CalloutEditor';
import { DividerEditor }   from './blocks/DividerEditor';
import { ListEditor }      from './blocks/ListEditor';
import { LinkEditor }      from './blocks/LinkEditor';
import { textToInline, mkId }    from './index';

// ─── Block type selector options ──────────────────────────────────────────────

const TYPE_LABELS: Record<ContentBlockType, string> = {
    paragraph : '¶  Para',
    heading   : 'H  Head',
    image     : '⊞  Image',
    quote     : '"  Quote',
    code      : '{}  Code',
    callout   : '!  Call',
    divider   : '—  Div',
    list      : '≡  List',
    link_card : '↗  Link',
};

// ─── Block type converter ────────────────────────────────────────────────────

/**
 * Converts a block to a different type, preserving text where semantically sensible.
 * This is the only place where cross-type text mapping lives.
 */
function convertBlock(block: ContentBlock, newType: ContentBlockType): ContentBlock {
    const id = block.id;

    // Extract plain text from the source block
    const getText = (nodes: InlineContent[]) =>
        nodes.map((n) => (n.kind === 'text' ? n.text : n.kind === 'link' ? n.label : n.text)).join('');

    let text = '';
    if (block.type === 'paragraph' || block.type === 'quote' || block.type === 'callout') {
        text = getText(block.content);
    } else if (block.type === 'heading') {
        text = block.text;
    } else if (block.type === 'code') {
        text = block.code;
    } else if (block.type === 'link_card') {
        text = block.title;
    }

    const inline = textToInline(text);

    switch (newType) {
        case 'paragraph' : return { id, type: 'paragraph', content: inline };
        case 'heading'   : return { id, type: 'heading', level: 2, text };
        case 'quote'     : return { id, type: 'quote', content: inline };
        case 'code'      : return { id, type: 'code', code: text };
        case 'callout'   : return { id, type: 'callout', variant: 'info', content: inline };
        case 'divider'   : return { id, type: 'divider' };
        case 'image'     : return { id, type: 'image', src: '', alt: '' };
        case 'list'      : return { id, type: 'list', ordered: false, items: [{ id: mkId(), content: inline }] };
        case 'link_card' : return { id, type: 'link_card', url: '', title: text };
    }
}

// ─── Editor dispatcher ────────────────────────────────────────────────────────

/**
 * @param block    - The current block to render an editor for.
 * @param onChange - Replaces this block in the parent array (same id, any type).
 * @param onConvertType - Only provided for paragraph: called by the slash command
 *                        to swap to a different block type.
 */
function renderEditor(
    block         : ContentBlock,
    onChange      : (b: ContentBlock) => void,
    onConvertType : (type: ContentBlockType) => void,
): React.ReactNode {
    switch (block.type) {
        case 'paragraph' : return <ParagraphEditor block={block} onChange={onChange} onConvertTo={onConvertType} />;
        case 'heading'   : return <HeadingEditor   block={block} onChange={onChange} />;
        case 'image'     : return <ImageEditor     block={block} onChange={onChange} />;
        case 'quote'     : return <QuoteEditor     block={block} onChange={onChange} />;
        case 'code'      : return <CodeEditor      block={block} onChange={onChange} />;
        case 'callout'   : return <CalloutEditor   block={block} onChange={onChange} />;
        case 'divider'   : return <DividerEditor   block={block} />;
        case 'list'      : return <ListEditor      block={block} onChange={onChange} />;
        case 'link_card' : return <LinkEditor      block={block} onChange={onChange} />;
        default: {
            const _exhaustive: never = block;
            return null;
        }
    }
}

// ─── BlockEditorItem ─────────────────────────────────────────────────────────

interface BlockEditorItemProps {
    block    : ContentBlock;
    onChange : (block: ContentBlock) => void;
    onDelete : () => void;
    onMoveUp : () => void;
    onMoveDown: () => void;
    isFirst  : boolean;
    isLast   : boolean;
}

export function BlockEditorItem({
    block, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast,
}: BlockEditorItemProps) {

    const handleTypeChange = (newType: ContentBlockType) => {
        if (newType === block.type) return;
        onChange(convertBlock(block, newType));
    };

    return (
        <div className="group relative flex items-start bg-[#FDFBD4] hover:bg-[#FDFBD4] transition-colors">

            {/* ── Left gutter: type selector ────────────────────────────── */}
            <div className="flex-shrink-0 px-3 pt-3 border-r border-[#713600]/08">
                <select
                    value={block.type}
                    onChange={(e) => handleTypeChange(e.target.value as ContentBlockType)}
                    title="Change block type"
                    className="w-[4.5rem] px-1.5 py-1 bg-[#FAF7C8] border border-[#713600]/15 rounded text-[8px] font-mono font-bold uppercase tracking-wider text-[#713600] outline-none cursor-pointer hover:border-[#713600]/35 transition-colors"
                >
                    {(Object.entries(TYPE_LABELS) as [ContentBlockType, string][]).map(([type, label]) => (
                        <option key={type} value={type}>{label}</option>
                    ))}
                </select>
            </div>

            {/* ── Center: block-specific editor ─────────────────────────── */}
            <div className="flex-1 min-w-0">
                {renderEditor(block, onChange, (type) => onChange(convertBlock(block, type)))}
            </div>

            {/* ── Right gutter: move/delete controls ────────────────────── */}
            <div className="flex-shrink-0 flex flex-col items-center gap-0.5 pt-2.5 pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                    type="button"
                    onClick={onMoveUp}
                    disabled={isFirst}
                    aria-label="Move block up"
                    className="p-1 text-[#38240D]/30 hover:text-[#713600] disabled:opacity-20 disabled:cursor-not-allowed transition-colors rounded"
                >
                    <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                    type="button"
                    onClick={onMoveDown}
                    disabled={isLast}
                    aria-label="Move block down"
                    className="p-1 text-[#38240D]/30 hover:text-[#713600] disabled:opacity-20 disabled:cursor-not-allowed transition-colors rounded"
                >
                    <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    aria-label="Delete block"
                    className="p-1 text-[#38240D]/25 hover:text-red-600 transition-colors rounded mt-0.5"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
