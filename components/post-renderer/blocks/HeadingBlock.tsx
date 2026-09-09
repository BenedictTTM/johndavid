import { ed } from '@/lib/editorial';
import type { HeadingBlock } from '@/types/content';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

interface HeadingBlockViewProps {
    block: HeadingBlock;
}

/** Level → token mapping — the only place level is translated to a class. */
const headingClass: Record<1 | 2 | 3, string> = {
    1: ed.h1,
    2: ed.h2,
    3: ed.h3,
};

export function HeadingBlockView({ block }: HeadingBlockViewProps) {
    const anchor = block.anchor ?? slugify(block.text);
    const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3';

    return (
        <Tag id={anchor} className={headingClass[block.level]}>
            <a
                href={`#${anchor}`}
                aria-label={`Link to section: ${block.text}`}
                className={ed.headingAnchor}
            >
                {block.text}
            </a>
        </Tag>
    );
}
