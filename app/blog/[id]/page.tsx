
import { prisma } from '@/lib/prisma';
import Link from "next/link";
import Footer from "@/components/Footer";
import BlogPostContent from './BlogPostContent';
import type { PostDocument } from '@/types/content';

export const dynamic = 'force-dynamic';

export default async function SingleBlogPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        const post = await prisma.post.findUnique({
            where: {
                id,
            },
            include: {
                _count: {
                    select: { comments: true },
                },
            },
        });

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
    } catch (error) {
        console.error("Error fetching post:", error);
        return (
            <>
                <main className="min-h-screen bg-[var(--color-mba-background)] pt-32 pb-24 flex items-center justify-center">
                    <div className="text-center section-padding">
                        <h1 className="text-4xl font-bold font-[family-name:var(--font-oswald)] mb-4">Error loading post</h1>
                        <Link href="/blog" className="text-[var(--color-mba-gold)] hover:underline">
                            Return to Blog
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }
}
