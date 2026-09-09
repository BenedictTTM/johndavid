'use client';

import type { ImageBlock } from '@/types/content';

interface ImageEditorProps {
    block: ImageBlock;
    onChange: (block: ImageBlock) => void;
}

const fieldLabel = 'block text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-[#713600]/65 mb-1';
const fieldInput = 'w-full px-3 py-2 bg-[#FDFBD4] border border-[#713600]/15 rounded-md outline-none text-[#38240D] text-sm placeholder-[#38240D]/30 focus:border-[#713600]/40 transition-colors';

export function ImageEditor({ block, onChange }: ImageEditorProps) {
    return (
        <div className="px-4 py-3 space-y-3 w-full">

            {/* Image URL + preview */}
            <div>
                <label className={fieldLabel}>Image URL</label>
                <input
                    type="url"
                    value={block.src}
                    onChange={(e) => onChange({ ...block, src: e.target.value })}
                    placeholder="https://..."
                    className={fieldInput}
                />
            </div>

            {block.src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={block.src}
                    alt={block.alt || 'preview'}
                    className="w-full max-h-48 object-cover rounded-lg border border-[#713600]/10 shadow-sm"
                />
            )}

            {/* Alt text */}
            <div>
                <label className={fieldLabel}>Alt Text</label>
                <input
                    type="text"
                    value={block.alt}
                    onChange={(e) => onChange({ ...block, alt: e.target.value })}
                    placeholder="Describe the image for screen readers..."
                    className={fieldInput}
                />
            </div>

            {/* Caption */}
            <div>
                <label className={fieldLabel}>Caption (optional)</label>
                <input
                    type="text"
                    value={block.caption ?? ''}
                    onChange={(e) => onChange({ ...block, caption: e.target.value || undefined })}
                    placeholder="A caption displayed below the image..."
                    className={fieldInput}
                />
            </div>

            {/* Layout */}
            <div>
                <label className={fieldLabel}>Layout</label>
                <select
                    value={block.layout ?? 'wide'}
                    onChange={(e) =>
                        onChange({ ...block, layout: e.target.value as ImageBlock['layout'] })
                    }
                    className={`${fieldInput} cursor-pointer appearance-none`}
                >
                    <option value="contained">Contained (prose width)</option>
                    <option value="wide">Wide (default)</option>
                    <option value="full-bleed">Full bleed</option>
                </select>
            </div>
        </div>
    );
}
