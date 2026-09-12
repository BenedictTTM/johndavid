import { ExternalLink } from 'lucide-react';
import { ed } from '@/lib/editorial';
import type { LinkCardBlock } from '@/types/content';

interface LinkCardBlockViewProps {
    block: LinkCardBlock;
}

export function LinkCardBlockView({ block }: LinkCardBlockViewProps) {
    return (
        <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open external link: ${block.title}`}
            className={ed.linkCard}
        >
            {/* Optional thumbnail */}
            {block.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={block.imageUrl}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="flex-shrink-0 w-14 h-14 rounded-lg object-cover border border-[#D8D0A6]"
                />
            )}

            {/* Text content */}
            <div className="flex-1 min-w-0">
                <p className={ed.linkCardTitle}>{block.title}</p>

                {block.description && (
                    <p className={ed.linkCardDescription}>{block.description}</p>
                )}

                {block.host && (
                    <div className="flex items-center gap-1.5">
                        <span className={ed.linkCardHost}>{block.host}</span>
                        <ExternalLink
                            className="w-2.5 h-2.5"
                            style={{ color: 'rgba(84, 42, 0, 0.5)' }}
                            aria-hidden="true"
                            strokeWidth={2.5}
                        />
                    </div>
                )}
            </div>

            {/* Arrow indicator */}
            <div className="flex-shrink-0 self-center">
                <ExternalLink
                    className="w-4 h-4 transition-colors duration-200"
                    style={{ color: 'rgba(113, 54, 0, 0.3)' }}
                    aria-hidden="true"
                    strokeWidth={1.75}
                />
            </div>
        </a>
    );
}
