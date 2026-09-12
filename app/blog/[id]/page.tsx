import { Metadata } from 'next';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import Link from "next/link";
import Footer from "@/components/Footer";
import BlogPostContent from './BlogPostContent';
import type { PostDocument } from '@/types/content';
import { getBaseUrl } from '@/lib/siteUrl';

export const dynamic = 'force-dynamic';

function cleanDescription(rawText: string | null | undefined): string {
    if (!rawText) return '';
    return rawText
        .replace(/<br\s*[\/]?>/gi, ' ')
        .replace(/<\/p>/gi, ' ')
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Deduplicated post fetcher shared between generateMetadata and SingleBlogPage
 */
const getPost = cache(async (id: string) => {
    try {
        return await prisma.post.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { comments: true },
                },
            },
        });
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
});

/**
 * Dynamic OpenGraph / Twitter / WhatsApp metadata generator
 */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const baseUrl = getBaseUrl();
    const post = await getPost(id);

    if (!post) {
        return {
            title: 'Post Not Found | John David',
            description: 'The requested post or dispatch could not be found.',
        };
    }

    const title = post.title || 'Untitled Post';
    const rawExcerpt = cleanDescription(post.excerpt) || cleanDescription(post.content);
    const description = rawExcerpt
        ? (rawExcerpt.length > 180 ? `${rawExcerpt.substring(0, 177)}...` : rawExcerpt)
        : `Read "${title}" by John David on John David Ledger.`;

    const postUrl = `${baseUrl}/blog/${post.id}`;

    // Resolve post image to absolute HTTPS URL (critical for WhatsApp previews)
    let imageUrl = '';
    if (post.image && post.image.trim()) {
        const trimmed = post.image.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            // WhatsApp prefers HTTPS for image previews
            imageUrl = trimmed.replace(/^http:\/\//i, 'https://');
        } else {
            const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
            imageUrl = `${baseUrl}${cleanPath}`;
        }
    } else {
        // Fallback to dynamic editorial social card generated for this post
        imageUrl = `${baseUrl}/blog/${post.id}/opengraph-image`;
    }

    let mimeType = 'image/jpeg';
    if (imageUrl.toLowerCase().includes('.png') || imageUrl.includes('opengraph-image')) {
        mimeType = 'image/png';
    } else if (imageUrl.toLowerCase().includes('.webp')) {
        mimeType = 'image/webp';
    }

    const authorName = (post.category && post.category !== 'Uncategorized' && post.category !== 'Note')
        ? post.category
        : 'John David';

    return {
        title,
        description,
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title,
            description,
            url: postUrl,
            siteName: 'John David Ledger',
            locale: 'en_US',
            type: 'article',
            publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
            modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
            authors: [authorName],
            images: [
                {
                    url: imageUrl,
                    secureUrl: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                    type: mimeType,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
            creator: '@johndavid',
        },
        other: {
            'og:image': imageUrl,
            'og:image:secure_url': imageUrl,
            'og:image:type': mimeType,
            'og:image:width': '1200',
            'og:image:height': '630',
            'og:image:alt': title,
        },
    };
}

export default async function SingleBlogPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        return (
            <>
                <main className="min-h-screen bg-[var(--color-mba-background)] pt-32 pb-24 flex items-center justify-center">
                    <div className="text-center section-padding">
                        <h1 className="text-4xl font-bold font-[family-name:var(--font-oswald)] mb-4">Post Not Found</h1>
                        <Link href="/blog" className="text-[var(--color-mba-gold)] hover:underline">
                            Return to Blog
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const serializedPost = {
        ...post,
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: post.image || '',
        category: post.category || 'Uncategorized',
        date: post.date.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        likesCount: typeof post.likesCount === 'number' ? post.likesCount : 61,
        commentsCount: post._count?.comments ?? post.commentsCount ?? 3,
        // Prisma returns Json as JsonValue; we own the write path so this cast is safe.
        contentBlocks: (post.contentBlocks ?? null) as PostDocument | null,
    };

    return <BlogPostContent post={serializedPost} />;
}
