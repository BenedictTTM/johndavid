import { ed } from '@/lib/editorial';
import type { ParagraphBlock } from '@/types/content';
import { InlineRenderer } from '../InlineRenderer';

interface ParagraphBlockViewProps {
    block: ParagraphBlock;
}

export function ParagraphBlockView({ block }: ParagraphBlockViewProps) {
    if (!block.content?.length) return null;
    return (
        <p className={ed.paragraph}>
            <InlineRenderer nodes={block.content} />
        </p>
    );
}
