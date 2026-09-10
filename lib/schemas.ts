import { z } from 'zod';

// ── Base schema: loose validation for saving drafts ───────────────────────────
export const postSchema = z.object({
    title         : z.string().min(1, 'Title is required'),
    excerpt       : z.string().optional(),
    content       : z.string().optional(),
    /** Structured PostDocument — validated loosely here, typed on the client */
    contentBlocks : z.any().optional(),
    readTime      : z.string().optional(),
    category      : z.string().optional().default('Uncategorized'),
    image         : z.any().optional(),
    published     : z.boolean().optional().default(false),
});

// ── Strict validation for publishing ─────────────────────────────────────────
// Only title is required for publishing; excerpt, content, and image are optional
export const publishSchema = postSchema;

export const createPostSchema = postSchema;
