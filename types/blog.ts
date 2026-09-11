import type { PostDocument } from './content';

export interface BlogPost {
    // ── Existing fields (unchanged) ──────────────────────────────────────────
    id: string;
    title: string;
    excerpt: string;
    /** Legacy Quill HTML content. Used as a render fallback for pre-migration posts. */
    content: string;
    date: Date | string;
    image: string;
    readTime: string;
    category: string;
    likesCount?: number;
    commentsCount?: number;
    published?: boolean;
    updatedAt?: string;

    // ── Structured content (new, all optional) ───────────────────────────────
    /**
     * Structured block document. When present and non-empty, takes precedence
     * over the legacy `content` HTML string during rendering.
     */
    contentBlocks?: PostDocument | null;
    /** Multi-value taxonomy — future replacement for single `category`. */
    tags?: string[];
    /** ISO timestamp for scheduled publishing. null = immediate. */
    publishedAt?: string | null;
    /** Per-post SEO meta description. Falls back to `excerpt` when absent. */
    seoDescription?: string | null;
}

export interface BlogComment {
    id: string;
    postId: string;
    name: string;
    email?: string | null;
    body: string;
    createdAt: string;
}
