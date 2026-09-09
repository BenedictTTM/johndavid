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
export const publishSchema = postSchema.refine((data) => {
    if (data.published) {
        // Accept either legacy HTML content or at least one structured block
        const hasContent =
            !!data.content ||
            (Array.isArray(data.contentBlocks?.blocks) && data.contentBlocks.blocks.length > 0);

        return !!data.excerpt && hasContent && (!!data.image || data.image instanceof File);
    }
    return true;
}, {
    message: 'Excerpt, Content blocks, and Image are required to publish.',
    path   : ['content'],
});

export const createPostSchema = publishSchema;
