'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import type {
    ContentBlock,
    ContentBlockType,
    InlineContent,
    PostDocument,
} from '@/types/content';
import { BlockEditorItem } from './BlockEditorItem';
import { AddBlockMenu } from './AddBlockMenu';

// ─── Inline Content Utilities ──────────────────────────────────────────────────

/**
 * Converts a plain string into a single-TextRun InlineContent array.
 * Phase-1 approach: no mark support in the editor UI, but the data model
 * fully supports marks for future use.
 */
export function textToInline(text: string): InlineContent[] {
    if (!text) return [];
    return [{ kind: 'text', text }];
}

/**
 * Extracts the readable plain-text string from an InlineContent array.
 * Used by block editors to populate their textarea / input values.
 */
export function inlineToText(nodes: InlineContent[]): string {
    return nodes
        .map((n) => {
            if (n.kind === 'text') return n.text;
            if (n.kind === 'link') return n.label;
            if (n.kind === 'code') return n.text;
            return '';
        })
        .join('');
}

/** Generates a stable unique block ID using the Web Crypto API. */
export function mkId(): string {
    return crypto.randomUUID();
}

// ─── Empty Block Factories ─────────────────────────────────────────────────────

/** Returns a fresh, empty block of the requested type. */
export function emptyBlock(type: ContentBlockType): ContentBlock {
    const id = mkId();
    switch (type) {
        case 'paragraph': return { id, type: 'paragraph', content: [] };
        case 'heading':   return { id, type: 'heading', level: 2, text: '' };
        case 'image':     return { id, type: 'image', src: '', alt: '' };
        case 'quote':     return { id, type: 'quote', content: [] };
        case 'code':      return { id, type: 'code', code: '' };
        case 'callout':   return { id, type: 'callout', variant: 'info', content: [] };
        case 'divider':   return { id, type: 'divider' };
        case 'list':      return { id, type: 'list', ordered: false, items: [{ id: mkId(), content: [] }] };
        case 'link_card': return { id, type: 'link_card', url: '', title: '' };
    }
}

// ─── BlockEditor ──────────────────────────────────────────────────────────────

interface BlockEditorProps {
    value   : PostDocument;
    onChange: (doc: PostDocument) => void;
    error  ?: string;
    /**
     * When true, removes the outer card border/background so the editor
     * integrates seamlessly with a full-screen white writing canvas.
     */
    clean  ?: boolean;
}

export function BlockEditor({ value, onChange, error, clean = false }: BlockEditorProps) {

    // ── Block array operations ─────────────────────────────────────────────

    const updateBlock = useCallback((updated: ContentBlock) => {
        onChange({ ...value, blocks: value.blocks.map((b) => (b.id === updated.id ? updated : b)) });
    }, [value, onChange]);

    const deleteBlock = useCallback((id: string) => {
        onChange({ ...value, blocks: value.blocks.filter((b) => b.id !== id) });
    }, [value, onChange]);

    const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
        const idx = value.blocks.findIndex((b) => b.id === id);
        if (direction === 'up' && idx === 0) return;
        if (direction === 'down' && idx === value.blocks.length - 1) return;
        const arr = [...value.blocks];
        const swap = direction === 'up' ? idx - 1 : idx + 1;
        [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
        onChange({ ...value, blocks: arr });
    }, [value, onChange]);

    const addBlock = useCallback((type: ContentBlockType) => {
        onChange({ ...value, blocks: [...value.blocks, emptyBlock(type)] });
    }, [value, onChange]);

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <div
            className={clean
                ? `overflow-hidden ${error ? 'ring-1 ring-red-500 rounded-sm' : ''}`
                : `rounded-lg border bg-[#FDFBD4] overflow-hidden ${
                    error ? 'border-red-600' : 'border-[#713600]/20'
                  }`
            }
        >
            {/* Block list */}
            {value.blocks.length === 0 ? (
                <div className="px-6 py-10 text-center">
                    <p className={`text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-1 ${
                        clean ? 'text-gray-300' : 'text-[#38240D]/35'
                    }`}>
                        No content blocks yet
                    </p>
                    <p className={`text-[10px] font-mono ${
                        clean ? 'text-gray-300' : 'text-[#38240D]/25'
                    }`}>
                        Type <kbd className="font-mono">/</kbd> or click &ldquo;Add block&rdquo; below
                    </p>
                </div>
            ) : (
                <div className={`divide-y ${ clean ? 'divide-gray-100' : 'divide-[#713600]/08' }`}>
                    {value.blocks.map((block, i) => (
                        <BlockEditorItem
                            key={block.id}
                            block={block}
                            onChange={updateBlock}
                            onDelete={() => deleteBlock(block.id)}
                            onMoveUp={() => moveBlock(block.id, 'up')}
                            onMoveDown={() => moveBlock(block.id, 'down')}
                            isFirst={i === 0}
                            isLast={i === value.blocks.length - 1}
                        />
                    ))}
                </div>
            )}

            {/* Add block footer */}
            <div className={`px-4 py-3 flex items-center justify-between ${
                clean
                    ? 'border-t border-gray-100'
                    : 'border-t border-[#713600]/10 bg-[#FAF7C8]'
            }`}>
                <AddBlockMenu onAdd={addBlock} />
                <span className={`text-[9px] font-mono uppercase tracking-[0.2em] ${
                    clean ? 'text-gray-300' : 'text-[#38240D]/30'
                }`}>
                    {value.blocks.length} block{value.blocks.length !== 1 ? 's' : ''}
                </span>
            </div>
        </div>
    );
}
