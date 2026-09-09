import { ed } from '@/lib/editorial';
import type { QuoteBlock } from '@/types/content';
import { InlineRenderer } from '../InlineRenderer';

interface QuoteBlockViewProps {
    block: QuoteBlock;
}

export function QuoteBlockView({ block }: QuoteBlockViewProps) {
    return (
        <blockquote className={ed.blockquote}>
            <p className={ed.blockquoteText}>
                <InlineRenderer nodes={block.content} />
            </p>

            {block.attribution && (
                <footer>
                    <cite className={ed.attribution}>
                        — {block.attribution}
                    </cite>
                </footer>
            )}
        </blockquote>
    );
}
