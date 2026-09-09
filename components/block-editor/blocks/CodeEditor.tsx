'use client';

import type { CodeBlock } from '@/types/content';

interface CodeEditorProps {
    block: CodeBlock;
    onChange: (block: CodeBlock) => void;
}

const metaInput = 'px-3 py-2 bg-[#FDFBD4] border border-[#713600]/15 rounded-md outline-none text-[#38240D] text-xs font-mono placeholder-[#38240D]/30 focus:border-[#713600]/40 transition-colors w-full';

export function CodeEditor({ block, onChange }: CodeEditorProps) {
    return (
        <div className="w-full">
            {/* Filename + language meta bar */}
            <div className="flex gap-3 px-4 pt-3 pb-2">
                <div className="flex-1">
                    <label className="block text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-[#713600]/65 mb-1">
                        Filename (optional)
                    </label>
                    <input
                        type="text"
                        value={block.filename ?? ''}
                        onChange={(e) => onChange({ ...block, filename: e.target.value || undefined })}
                        placeholder="index.ts"
                        className={metaInput}
                    />
                </div>
                <div className="w-28">
                    <label className="block text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-[#713600]/65 mb-1">
                        Language
                    </label>
                    <input
                        type="text"
                        value={block.language ?? ''}
                        onChange={(e) => onChange({ ...block, language: e.target.value || undefined })}
                        placeholder="typescript"
                        className={metaInput}
                    />
                </div>
            </div>

            {/* Code textarea */}
            <div className="border-t border-[#713600]/10 bg-[#FAF7C8]">
                <textarea
                    value={block.code}
                    onChange={(e) => onChange({ ...block, code: e.target.value })}
                    placeholder="// Paste or type code here..."
                    rows={8}
                    spellCheck={false}
                    className="w-full px-4 py-3 bg-transparent outline-none text-[#38240D] placeholder-[#38240D]/25 font-mono text-sm leading-[1.75] resize-y tab-size-2"
                    onKeyDown={(e) => {
                        // Insert 2 spaces on Tab instead of losing focus
                        if (e.key === 'Tab') {
                            e.preventDefault();
                            const { selectionStart, selectionEnd, value } = e.currentTarget;
                            const updated = value.slice(0, selectionStart) + '  ' + value.slice(selectionEnd);
                            onChange({ ...block, code: updated });
                            // Restore caret after state update
                            requestAnimationFrame(() => {
                                e.currentTarget.selectionStart = selectionStart + 2;
                                e.currentTarget.selectionEnd = selectionStart + 2;
                            });
                        }
                    }}
                />
            </div>
        </div>
    );
}
