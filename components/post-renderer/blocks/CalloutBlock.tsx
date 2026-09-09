import { Info, Lightbulb, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ed } from '@/lib/editorial';
import type { CalloutBlock } from '@/types/content';
import { InlineRenderer } from '../InlineRenderer';

interface CalloutBlockViewProps {
    block: CalloutBlock;
}

/** Icon component per variant. Variant → colour is handled entirely in CSS. */
const variantIcon = {
    info:    Info,
    tip:     Lightbulb,
    warning: AlertTriangle,
    caution: ShieldAlert,
} as const;

/** ARIA-visible label used when the block has no explicit title. */
const variantLabel = {
    info:    'Note',
    tip:     'Tip',
    warning: 'Warning',
    caution: 'Caution',
} as const;

/**
 * Callout / alert block.
 *
 * Variant colouring (border, background, icon colour, title colour) is handled
 * entirely by the CSS rules in globals.css:
 *   .ed-callout-info { ... }
 *   .ed-callout-tip  { ... }
 *   etc.
 *
 * This component only decides WHICH icon to render and which ARIA label to use.
 */
export function CalloutBlockView({ block }: CalloutBlockViewProps) {
    const Icon = variantIcon[block.variant];

    return (
        <aside
            role="note"
            aria-label={block.title ?? variantLabel[block.variant]}
            className={`${ed.calloutBase} ${ed.calloutVariant[block.variant]}`}
        >
            {/* Icon — colour applied via CSS .ed-callout-{variant} .ed-callout-icon */}
            <Icon
                className={ed.calloutIcon}
                aria-hidden="true"
                strokeWidth={2}
            />

            <div className={ed.calloutBody}>
                {block.title && (
                    <p className={ed.calloutTitle}>{block.title}</p>
                )}
                <p className={ed.calloutText}>
                    <InlineRenderer nodes={block.content} />
                </p>
            </div>
        </aside>
    );
}
