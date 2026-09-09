import { ed } from '@/lib/editorial';
import type { DividerBlock } from '@/types/content';

interface DividerBlockViewProps {
    block: DividerBlock;
}

export function DividerBlockView({ block: _ }: DividerBlockViewProps) {
    return (
        <div className={ed.divider} role="separator" aria-hidden="true">
            <hr className={ed.dividerLine} />
            <span className="flex items-center gap-1.5" aria-hidden="true">
                <span className={`${ed.dividerDot} w-1 h-1`} />
                <span className={`${ed.dividerDot} w-1.5 h-1.5`} />
                <span className={`${ed.dividerDot} w-1 h-1`} />
            </span>
            <hr className={ed.dividerLine} />
        </div>
    );
}
