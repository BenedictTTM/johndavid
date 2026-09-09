// ─── Base ──────────────────────────────────────────────────────────────────────

/**
 * Every block must declare a stable unique id (cuid / nanoid) and a discriminant
 * `type` string. The id enables keyed rendering, drag-to-reorder, and deep-linking.
 */
interface BlockBase {
    /** Stable unique identifier. Never regenerate on save — only on create. */
    id: string;
    type: ContentBlockType;
}

/**
 * Complete catalogue of supported block types.
 * Adding a new literal here causes a compile error in BlockRenderer until handled.
 */
export type ContentBlockType =
    | 'paragraph'
    | 'heading'
    | 'image'
    | 'quote'
    | 'code'
    | 'callout'
    | 'divider'
    | 'list'
    | 'link_card';

// ─── Inline Content ────────────────────────────────────────────────────────────

/** Formatting marks that can be applied to a TextRun. */
export type TextMark = 'bold' | 'italic' | 'underline' | 'strikethrough';

/** A run of text with optional formatting marks. The atomic inline unit. */
export interface TextRun {
    kind: 'text';
    text: string;
    marks?: TextMark[];
}

/** An inline hyperlink. Not a standalone block — wraps text within a paragraph. */
export interface InlineLink {
    kind: 'link';
    href: string;
    /** Display label — plain string, not recursive InlineContent. */
    label: string;
    /** When true, opens in a new tab with rel="noopener noreferrer". */
    external?: boolean;
}

/** An inline code span — e.g. `const x = 1`. */
export interface InlineCode {
    kind: 'code';
    text: string;
}

/** Union of all node kinds that can appear inside rich-text fields. */
export type InlineContent = TextRun | InlineLink | InlineCode;

// ─── Block Definitions ─────────────────────────────────────────────────────────

/** Standard prose paragraph. Supports full inline formatting. */
export interface ParagraphBlock extends BlockBase {
    type: 'paragraph';
    content: InlineContent[];
}

/**
 * Section heading at level 1, 2, or 3.
 * Uses a single block type + `level` discriminant to keep the catalogue lean.
 * The renderer maps level → h1/h2/h3 element.
 */
export interface HeadingBlock extends BlockBase {
    type: 'heading';
    level: 1 | 2 | 3;
    /** Plain text — headings do not support inline formatting. */
    text: string;
    /**
     * Optional slug used as the element's `id` for anchor deep-linking.
     * Derived from `text` at render time if absent.
     */
    anchor?: string;
}

/**
 * Standalone image block with an optional caption.
 * Caption is co-located here — not a separate sibling — to prevent orphaning.
 */
export interface ImageBlock extends BlockBase {
    type: 'image';
    src: string;
    alt: string;
    /** Visible caption rendered below the image. */
    caption?: string;
    /** Intrinsic width in pixels — used for Next.js Image optimisation. */
    width?: number;
    /** Intrinsic height in pixels — used for Next.js Image optimisation. */
    height?: number;
    /**
     * Layout intent — a semantic token, NOT a CSS class.
     * The renderer maps this to its presentational implementation.
     * - 'contained': max-width ~prose width
     * - 'wide': max-width wider than prose (default)
     * - 'full-bleed': edge-to-edge within the content column
     */
    layout?: 'contained' | 'wide' | 'full-bleed';
}

/** Pull quote. Supports rich inline content and an optional plain-text attribution. */
export interface QuoteBlock extends BlockBase {
    type: 'quote';
    content: InlineContent[];
    /** Author or source — plain text only. */
    attribution?: string;
}

/** Syntax-highlighted code block. Language tag drives the renderer; no CSS stored here. */
export interface CodeBlock extends BlockBase {
    type: 'code';
    /** Raw source code as a plain string — no HTML escaping applied here. */
    code: string;
    /** IANA/Prism language identifier e.g. "typescript", "python", "bash". */
    language?: string;
    /** Optional filename label shown in the block's header bar. */
    filename?: string;
}

/**
 * Callout / alert box.
 * `variant` is a semantic token — the renderer owns all colour and icon decisions.
 */
export interface CalloutBlock extends BlockBase {
    type: 'callout';
    variant: 'info' | 'warning' | 'tip' | 'caution';
    /** Optional title rendered in a bolder weight above the body. */
    title?: string;
    content: InlineContent[];
}

/** Visual thematic break. No content — the presence of the block is the content. */
export interface DividerBlock extends BlockBase {
    type: 'divider';
}

/** A single list item, optionally with nested children for indented sub-lists. */
export interface ListItem {
    id: string;
    content: InlineContent[];
    /** Nested sub-items — max one level of nesting is rendered. */
    children?: ListItem[];
}

/**
 * Ordered (ol) or unordered (ul) list.
 * A single type with a boolean discriminant avoids two near-identical block types.
 */
export interface ListBlock extends BlockBase {
    type: 'list';
    ordered: boolean;
    items: ListItem[];
}

/**
 * Rich link preview card — for citing papers, articles, and external resources.
 * Renders as a bordered card with title, description, and source host label.
 * Distinct from an inline link: it is a standalone block-level element.
 */
export interface LinkCardBlock extends BlockBase {
    type: 'link_card';
    url: string;
    title: string;
    description?: string;
    /** Preview thumbnail URL (optional). */
    imageUrl?: string;
    /** Human-readable host label e.g. "nature.com". Shown as a source badge. */
    host?: string;
}

// ─── Master Union ──────────────────────────────────────────────────────────────

/**
 * Discriminated union of all supported block types.
 * TypeScript's exhaustiveness checker in BlockRenderer will flag any missing case
 * if a new type is added here without a corresponding renderer branch.
 */
export type ContentBlock =
    | ParagraphBlock
    | HeadingBlock
    | ImageBlock
    | QuoteBlock
    | CodeBlock
    | CalloutBlock
    | DividerBlock
    | ListBlock
    | LinkCardBlock;

// ─── Document ──────────────────────────────────────────────────────────────────

/**
 * The top-level structured content document stored in Post.contentBlocks.
 * `version` enables future breaking schema changes to be migrated via a transformer
 * without touching old persisted data.
 */
export interface PostDocument {
    version: 1;
    blocks: ContentBlock[];
}
