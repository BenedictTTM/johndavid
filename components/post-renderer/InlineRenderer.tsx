import { ed } from '@/lib/editorial';
import type { InlineContent, TextRun } from '@/types/content';

/**
 * Renders a single TextRun, applying formatting marks in order:
 * bold → italic → underline → strikethrough (outermost → innermost).
 */
function TextRunNode({ node }: { node: TextRun }): React.ReactNode {
    let content: React.ReactNode = node.text;
    const marks = node.marks ?? [];

    if (marks.includes('strikethrough')) content = <s>{content}</s>;
    if (marks.includes('underline'))     content = <u className="underline underline-offset-[3px]">{content}</u>;
    if (marks.includes('italic'))        content = <em className="italic">{content}</em>;
    if (marks.includes('bold'))          content = <strong className="font-semibold" style={{ color: 'var(--ed-text, #38240D)' }}>{content}</strong>;

    return content;
}

interface InlineRendererProps {
    /** Inline content nodes. Pass an empty array for blank content. */
    nodes: InlineContent[];
}

/**
 * Shared inline content renderer — used by ParagraphBlock, QuoteBlock,
 * CalloutBlock, and ListItem. Returns a React Fragment; callers wrap in
 * their semantic container element (<p>, <li>, etc.).
 */
export function InlineRenderer({ nodes }: InlineRendererProps) {
    return (
        <>
            {nodes.map((node, i) => {
                switch (node.kind) {
                    case 'text':
                        return <TextRunNode key={i} node={node} />;

                    case 'link':
                        return (
                            <a
                                key={i}
                                href={node.href}
                                target={node.external ? '_blank' : undefined}
                                rel={node.external ? 'noopener noreferrer' : undefined}
                                className={ed.link}
                            >
                                {node.label}
                            </a>
                        );

                    case 'code':
                        return (
                            <code key={i} className={ed.inlineCode}>
                                {node.text}
                            </code>
                        );

                    default: {
                        const _exhaustive: never = node;
                        return null;
                    }
                }
            })}
        </>
    );
}
