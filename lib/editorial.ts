/**
 * Editorial Design System — TypeScript Token Map
 *
 * Single source of truth for class names used throughout the blog reading experience.
 * All class names resolve to rules defined in app/globals.css under @layer utilities.
 *
 * Usage:
 *   import { ed } from '@/lib/editorial';
 *   <p className={ed.paragraph}>...</p>
 *
 * Design system documentation: app/globals.css §EDITORIAL DESIGN SYSTEM
 */
export const ed = {

    // ── 1. Article container ────────────────────────────────────────────────
    /** Root wrapper for all PostRenderer output. Sets scoped CSS tokens. */
    article: 'ed-article',

    // ── 2. Body paragraph ───────────────────────────────────────────────────
    /** Standard prose paragraph — 18px / 1.85 lh desktop, 16px mobile. */
    paragraph: 'ed-paragraph',

    // ── 3. Section headings ─────────────────────────────────────────────────
    /** H1 within article body. Use sparingly — article title is handled externally. */
    h1: 'ed-h1-body',
    /** H2 section heading — with bottom border. */
    h2: 'ed-h2',
    /** H3 sub-section heading — no border. */
    h3: 'ed-h3',
    /** Anchor wrapper inside headings — exposes #-glyph on hover. */
    headingAnchor: 'ed-heading-anchor',

    // ── 4. Inline elements ──────────────────────────────────────────────────
    /** Inline hyperlink — primary colour + bottom-border hover effect. */
    link: 'ed-link',
    /** Inline code span — monospace, tinted background. */
    inlineCode: 'ed-inline-code',

    // ── 5. Blockquote ───────────────────────────────────────────────────────
    /** Pull-quote container — left accent border + cream background. */
    blockquote: 'ed-blockquote',
    /** The quoted text itself — serif italic. */
    blockquoteText: 'ed-blockquote-text',
    /** Attribution / cite line beneath the quote. */
    attribution: 'ed-attribution',

    // ── 6. Code block ───────────────────────────────────────────────────────
    /** Outer shell — rounded card with shadow. */
    codeContainer: 'ed-code-container',
    /** Header bar — filename + language badge row. */
    codeHeader: 'ed-code-header',
    /** Decorative traffic-light dot cluster (aria-hidden). */
    codeDots: 'ed-code-dots',
    /** Individual traffic-light dot. */
    codeDot: 'ed-code-dot',
    /** Filename label in the header bar. */
    codeFilename: 'ed-code-filename',
    /** Language pill in the header bar. */
    codeBadge: 'ed-code-badge',
    /** Scrollable code area containing the <pre><code>. */
    codeBody: 'ed-code-body',
    /** Copy-to-clipboard button — appears on container hover. */
    codeCopy: 'ed-code-copy',

    // ── 7. Callout ──────────────────────────────────────────────────────────
    /** Base callout container. Combine with a variant modifier (see below). */
    calloutBase: 'ed-callout',
    /** Variant modifier classes — apply ONE alongside calloutBase. */
    calloutVariant: {
        info:    'ed-callout-info',
        tip:     'ed-callout-tip',
        warning: 'ed-callout-warning',
        caution: 'ed-callout-caution',
    } as const,
    /** Icon wrapper inside the callout. */
    calloutIcon: 'ed-callout-icon',
    /** Content area (title + body) inside the callout. */
    calloutBody: 'ed-callout-body',
    /** Optional title label — monospace uppercase. */
    calloutTitle: 'ed-callout-title',
    /** Body prose text inside the callout. */
    calloutText: 'ed-callout-text',

    // ── 8. Figure & Image ───────────────────────────────────────────────────
    /** <figure> element wrapper — controls margin. */
    figure: 'ed-figure',
    /** Layout modifier: constrain to content width. */
    figureContained: 'ed-figure-contained',
    /** Layout modifier: allow wider than content width. */
    figureWide: 'ed-figure-wide',
    /** Layout modifier: edge-to-edge within the content column. */
    figureFull: 'ed-figure-full',
    /** The <img> element — rounded, subtle shadow. */
    image: 'ed-image',
    /** <figcaption> — italic, muted, centred. */
    caption: 'ed-caption',

    // ── 9. Lists ────────────────────────────────────────────────────────────
    /** Ordered list wrapper. */
    listOrdered: 'ed-list ed-list-ordered',
    /** Unordered list wrapper. */
    listUnordered: 'ed-list ed-list-unordered',
    /** List item <li>. */
    listItem: 'ed-list-item',
    /** Nested sub-list inside a list item. */
    listNested: 'ed-list-nested',

    // ── 10. Divider ─────────────────────────────────────────────────────────
    /** Thematic break container — flex row with gradient lines. */
    divider: 'ed-divider',
    /** Gradient horizontal rule on each side of the ornament. */
    dividerLine: 'ed-divider-line',
    /** Decorative dot ornament. */
    dividerDot: 'ed-divider-dot',

    // ── 11. Link card ───────────────────────────────────────────────────────
    /** Full-surface clickable citation card. */
    linkCard: 'ed-link-card',
    /** Card title — serif, line-clamped to 2 rows. */
    linkCardTitle: 'ed-link-card-title',
    /** Card description — sans, muted, line-clamped. */
    linkCardDescription: 'ed-link-card-description',
    /** Source host badge — monospace uppercase. */
    linkCardHost: 'ed-link-card-host',

} as const;

/** Union type of every editorial class name. Useful for function signatures. */
export type EdToken = (typeof ed)[keyof typeof ed];
