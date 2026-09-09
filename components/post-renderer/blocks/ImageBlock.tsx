import Image from 'next/image';
import { ed } from '@/lib/editorial';
import type { ImageBlock } from '@/types/content';

interface ImageBlockViewProps {
    block: ImageBlock;
}

/** Layout token → figure modifier class. The sole translation point. */
const figureLayoutClass: Record<NonNullable<ImageBlock['layout']>, string> = {
    'contained' : ed.figureContained,
    'wide'      : ed.figureWide,
    'full-bleed': ed.figureFull,
};

export function ImageBlockView({ block }: ImageBlockViewProps) {
    const layout      = block.layout ?? 'wide';
    const figureClass = `${ed.figure} ${figureLayoutClass[layout]}`;

    const imageEl = block.width && block.height ? (
        <Image
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            className={ed.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
    ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className={ed.image}
        />
    );

    if (!block.caption) {
        return (
            <div className={figureClass} role="img" aria-label={block.alt}>
                {imageEl}
            </div>
        );
    }

    return (
        <figure className={figureClass}>
            {imageEl}
            <figcaption className={ed.caption}>{block.caption}</figcaption>
        </figure>
    );
}
