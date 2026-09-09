import { ed } from '@/lib/editorial';
import type { ListBlock, ListItem } from '@/types/content';
import { InlineRenderer } from '../InlineRenderer';

// ─── ListItem ─────────────────────────────────────────────────────────────────

interface ListItemViewProps {
    item: ListItem;
    ordered: boolean;
    depth?: number;
}

function ListItemView({ item, ordered, depth = 0 }: ListItemViewProps) {
    const hasChildren = item.children && item.children.length > 0;

    return (
        <li className={ed.listItem}>
            <InlineRenderer nodes={item.content} />

            {/* Nested sub-list — one level only */}
            {hasChildren && depth < 1 && (
                <ul className={ed.listNested}>
                    {item.children!.map((child) => (
                        <ListItemView
                            key={child.id}
                            item={child}
                            ordered={ordered}
                            depth={depth + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

// ─── ListBlock ────────────────────────────────────────────────────────────────

interface ListBlockViewProps {
    block: ListBlock;
}

export function ListBlockView({ block }: ListBlockViewProps) {
    const listClass = block.ordered ? ed.listOrdered : ed.listUnordered;

    if (block.ordered) {
        return (
            <ol className={listClass}>
                {block.items.map((item) => (
                    <ListItemView key={item.id} item={item} ordered={true} />
                ))}
            </ol>
        );
    }

    return (
        <ul className={listClass}>
            {block.items.map((item) => (
                <ListItemView key={item.id} item={item} ordered={false} />
            ))}
        </ul>
    );
}
