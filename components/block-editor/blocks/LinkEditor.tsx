'use client';

import { ExternalLink } from 'lucide-react';
import type { LinkCardBlock } from '@/types/content';

interface LinkEditorProps {
    block: LinkCardBlock;
    onChange: (block: LinkCardBlock) => void;
}

const fieldLabel = 'block text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-[#713600]/65 mb-1';
const fieldInput = 'w-full px-3 py-2 bg-[#FDFBD4] border border-[#713600]/15 rounded-md outline-none text-[#38240D] text-sm placeholder-[#38240D]/30 focus:border-[#713600]/40 transition-colors';

/** Auto-extracts a clean host label from a URL (e.g. "nature.com"). */
function extractHost(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return '';
    }
}

export function LinkEditor({ block, onChange }: LinkEditorProps) {

    const handleUrlBlur = () => {
        // Auto-populate host from URL if the author hasn't typed one
        if (block.url && !block.host) {
            const host = extractHost(block.url);
            if (host) onChange({ ...block, host });
        }
    };

    return (
        <div className="px-4 py-3 space-y-3 w-full">
            {/* URL */}
            <div>
                <label className={fieldLabel}>
                    <ExternalLink className="inline w-3 h-3 mr-1 -mt-0.5" />
                    URL
                </label>
                <input
                    type="url"
                    value={block.url}
                    onChange={(e) => onChange({ ...block, url: e.target.value })}
                    onBlur={handleUrlBlur}
                    placeholder="https://..."
                    className={fieldInput}
                />
            </div>

            {/* Title */}
            <div>
                <label className={fieldLabel}>Title</label>
                <input
                    type="text"
                    value={block.title}
                    onChange={(e) => onChange({ ...block, title: e.target.value })}
                    placeholder="Article or resource title..."
                    className={fieldInput}
                />
            </div>

            {/* Description */}
            <div>
                <label className={fieldLabel}>Description (optional)</label>
                <textarea
                    value={block.description ?? ''}
                    onChange={(e) => onChange({ ...block, description: e.target.value || undefined })}
                    placeholder="A short description of the linked resource..."
                    rows={2}
                    className={`${fieldInput} resize-none`}
                />
            </div>

            {/* Host label */}
            <div>
                <label className={fieldLabel}>Source host (optional)</label>
                <input
                    type="text"
                    value={block.host ?? ''}
                    onChange={(e) => onChange({ ...block, host: e.target.value || undefined })}
                    placeholder="nature.com (auto-filled from URL)"
                    className={fieldInput}
                />
            </div>
        </div>
    );
}
