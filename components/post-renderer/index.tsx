import { ed } from '@/lib/editorial';
import type { PostDocument } from '@/types/content';
import { BlockRenderer } from './BlockRenderer';

interface PostRendererProps {
    content: PostDocument;
}

/**
 * PostRenderer — public entry point for the structured content system.
 *
 * Usage:
 *   <PostRenderer content={post.contentBlocks} />
 *
 * The `ed.article` class on the root div establishes scoped CSS custom
 * properties (--ed-w-content, --ed-text, --ed-sp-block, etc.) that all
 * descendant .ed-* classes inherit. Without this wrapper the child tokens
 * fall back to their hardcoded fallback values.
 */
export function PostRenderer({ content }: PostRendererProps) {
    if (!content?.blocks?.length) return null;

    return (
        <div className={ed.article}>
            {content.blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
            ))}
        </div>
    );
}
