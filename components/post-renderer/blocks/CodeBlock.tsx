'use client';

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { ed } from '@/lib/editorial';
import type { CodeBlock } from '@/types/content';

interface CodeBlockViewProps {
    block: CodeBlock;
}

/**
 * Code block with filename header, language badge, and copy-to-clipboard button.
 * Marked 'use client' solely for the copy button's useState.
 *
 * All visual tokens (colours, spacing, typography, copy-button hover) are
 * defined in globals.css under the Editorial Design System section.
 */
export function CodeBlockView({ block }: CodeBlockViewProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(block.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard API may be blocked in some contexts — fail silently.
        }
    }, [block.code]);

    const hasHeader = block.filename || block.language;

    return (
        <div className={ed.codeContainer}>

            {/* ── Header bar ─────────────────────────────────────────────── */}
            {hasHeader && (
                <div className={ed.codeHeader}>
                    <div className="flex items-center">
                        {/* Decorative dots */}
                        <div className={ed.codeDots} aria-hidden="true">
                            <span className={ed.codeDot} />
                            <span className={ed.codeDot} />
                            <span className={ed.codeDot} />
                        </div>
                        {block.filename && (
                            <span className={ed.codeFilename}>{block.filename}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {block.language && (
                            <span className={ed.codeBadge}>{block.language}</span>
                        )}
                    </div>
                </div>
            )}

            {/* ── Code area ──────────────────────────────────────────────── */}
            <div className="relative">
                <div className={ed.codeBody}>
                    <pre><code>{block.code}</code></pre>
                </div>

                {/* Copy button — appears via CSS on container hover */}
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
                    className={`absolute top-3 right-3 ${ed.codeCopy}`}
                >
                    {copied ? (
                        <><Check className="w-3 h-3" aria-hidden="true" />Copied</>
                    ) : (
                        <><Copy className="w-3 h-3" aria-hidden="true" />Copy</>
                    )}
                </button>
            </div>
        </div>
    );
}
