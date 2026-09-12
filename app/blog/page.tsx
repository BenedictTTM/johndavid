import Link from "next/link";
import Footer from "@/components/Footer";
import Blog from "@/components/Blog";
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    let posts: any[] = [];
    try {
        posts = await prisma.post.findMany({
            where: {
                published: true,
            },
            include: {
                _count: {
                    select: { comments: true },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
    } catch (error) {
        console.error("Error fetching posts on blog page:", error);
        posts = [];
    }

    const blogPosts = posts.map(post => ({
        ...post,
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: post.image || '',
        category: post.category || 'Uncategorized',
        date: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
        likesCount: typeof post.likesCount === 'number' ? post.likesCount : 0,
        commentsCount: post._count?.comments ?? post.commentsCount ?? 0,
    }));

    return (
        <div 
            className="min-h-screen bg-[#FDFBD4] text-[#38240D] font-sans relative overflow-hidden"
        >
            {/* Fine grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(113,54,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,54,0,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none -z-10" />

            <main className="pt-24 md:pt-28 pb-16">
                <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-12 xl:px-20 mb-2">
                    {/* Back to Home Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center text-[10px] font-bold tracking-[0.25em] text-[#38240D] hover:text-[#713600] transition-all duration-300 uppercase py-2 group"
                    >
                        <span className="relative flex items-center justify-center w-6 h-6 mr-3 rounded-full border border-[#713600]/20 group-hover:border-[#713600] transition-colors bg-[#FAF7C8]">
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#713600]" />
                        </span>
                        Back to Home
                    </Link>
                </div>

                {/* Harmonized 3-column Blog Layout (Sidebar + Feed + Admin Dispatch) */}
                <Blog posts={blogPosts} />
            </main>
            
            <Footer />
        </div>
    );
}

