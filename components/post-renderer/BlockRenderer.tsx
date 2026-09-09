import type { ContentBlock } from '@/types/content';
import { ParagraphBlockView } from './blocks/ParagraphBlock';
import { HeadingBlockView }   from './blocks/HeadingBlock';
import { ImageBlockView }     from './blocks/ImageBlock';
import { QuoteBlockView }     from './blocks/QuoteBlock';
import { CodeBlockView }      from './blocks/CodeBlock';
import { CalloutBlockView }   from './blocks/CalloutBlock';
import { DividerBlockView }   from './blocks/DividerBlock';
import { ListBlockView }      from './blocks/ListBlock';
import { LinkCardBlockView }  from './blocks/LinkCardBlock';

interface BlockRendererProps {
    block: ContentBlock;
}

/**
 * Exhaustive block dispatcher.
 *
 * The switch statement is guaranteed by TypeScript to handle every member of the
 * ContentBlock discriminated union. When a new block type is added to that union,
 * TypeScript will produce a compile error on the `default` branch (where `block`
 * becomes type `never`) until a matching case is added here.
 *
 * This is the ONLY place in the application that maps block types to components.
 * Individual block components are imported and composed here — never imported
 * directly by consumers.
 */
export function BlockRenderer({ block }: BlockRendererProps) {
    switch (block.type) {
        case 'paragraph':
            return <ParagraphBlockView block={block} />;

        case 'heading':
            return <HeadingBlockView block={block} />;

        case 'image':
            return <ImageBlockView block={block} />;

        case 'quote':
            return <QuoteBlockView block={block} />;

        case 'code':
            return <CodeBlockView block={block} />;

        case 'callout':
            return <CalloutBlockView block={block} />;

        case 'divider':
            return <DividerBlockView block={block} />;

        case 'list':
            return <ListBlockView block={block} />;

        case 'link_card':
            return <LinkCardBlockView block={block} />;

        default: {
            /**
             * Exhaustiveness guard.
             *
             * If a new ContentBlockType is added to the union without a
             * corresponding case above, TypeScript narrows `block` to `never` here
             * and raises a compile-time error. The build will not succeed until
             * the renderer handles the new type.
             *
             * At runtime (after a successful build), this branch is unreachable.
             * If it ever fires (e.g. stale client with new server data), we log
             * the unknown type and render nothing — no crash.
             */
            const _exhaustive: never = block;
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.warn('[BlockRenderer] Unknown block type received:', (_exhaustive as ContentBlock).type);
            }
            return null;
        }
    }
}
