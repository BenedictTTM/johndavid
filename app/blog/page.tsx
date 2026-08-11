import Link from "next/link";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import BlogRow from "@/components/BlogRow";
import { prisma } from '@/lib/prisma';
import { Sparkles, ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    let posts: any[] = [];
    try {
        posts = await prisma.post.findMany({
            where: {
                published: true,
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
    }));

    return (
        <div 
            className="min-h-screen bg-[#FDFBD4] text-[#38240D] font-sans relative overflow-hidden"
        >
            {/* Fine grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(113,54,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,54,0,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none -z-10" />
            <div className="absolute top-0 left-[8%] right-[8%] h-[1px] bg-gradient-to-r from-transparent via-[#713600]/15 to-transparent pointer-events-none" />

            {/* Header Markers */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-20 pt-24 md:pt-20 flex justify-between items-center text-[9px] text-[#38240D]/60 tracking-[0.3em] uppercase select-none pointer-events-none font-mono">
                <span>06 // KNOWLEDGE_ARCHIVE</span>
                <span>SYS_VER: 2026.05</span>
            </div>

            <main className="pb-16">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-20 mt-4">
                    {/* Back to Home Button */}
                    <div className="mb-6 flex justify-start">
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
                    
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-3 select-none">
                            <div className="w-5 h-[2px] bg-[#713600]" />
                            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#713600] font-mono">
                                John David Publications
                            </span>
                            <div className="w-5 h-[2px] bg-[#713600]" />
                        </div>

                        <h1 
                            className="font-serif font-light leading-[1.05] tracking-tight select-none text-4xl sm:text-6xl lg:text-7xl text-[#38240D] mb-6 text-balance"
                        >
                            Blog & <span className="font-serif italic font-normal tracking-wide text-[#713600]">Articles</span>
                        </h1>

                        <p className="text-[14px] md:text-[16px] text-[#38240D]/80 max-w-2xl mx-auto leading-relaxed font-sans font-normal tracking-wide">
                            Insights on bioengineering, medical innovations, computational technology, and scholarly discovery 
                            from my academic and laboratory journey.
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="flex flex-col gap-10">

                        {/* Hero Section: Featured + Sidebar */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                            
                            {/* Featured Post (Left) */}
                            <div className="lg:col-span-7">
                                {blogPosts.length > 0 && (
                                    <div className="relative group bg-[#FAF7C8] border border-[#713600]/15 rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(56,36,13,0.05)] transition-all duration-500 hover:border-[#713600]/30 h-full">
                                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#713600]" />
                                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#713600]" />
                                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#713600]" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#713600]" />
                                        
                                        <div className="flex items-center gap-2 mb-4 text-[#713600] font-mono text-[10px] uppercase tracking-widest font-bold">
                                            <Sparkles size={12} />
                                            Featured Research
                                        </div>
                                        <BlogCard post={blogPosts[0]} />
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Recent Stories (Right) */}
                            <div className="lg:col-span-5 bg-[#FAF7C8] border border-[#713600]/15 rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(56,36,13,0.05)] relative flex flex-col h-fit self-start justify-start">
                                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#713600]" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#713600]" />
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#713600]" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#713600]" />

                                <div>
                                    <h3 className="text-[10px] font-bold text-[#713600] mb-6 uppercase tracking-[0.25em] flex items-center gap-2 select-none border-b border-[#713600]/12 pb-3 font-mono">
                                        <Sparkles size={12} className="text-[#713600]" />
                                        Recent Stories
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {blogPosts.slice(1, 4).map((post) => (
                                            <div key={post.id} className="border-b border-[#713600]/10 pb-4 last:border-0 last:pb-0">
                                                <BlogRow post={post} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="hidden lg:flex justify-between items-center text-[8px] text-[#38240D]/50 font-mono tracking-widest uppercase mt-6 pt-4 border-t border-[#713600]/10 select-none">
                                    <span>SEQ // RCN_STORIES_03</span>
                                    <span>SYS_VER // 2.6</span>
                                </div>
                            </div>
                        </div>

                        {/* Remaining Posts Grid */}
                        {blogPosts.length > 4 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                                {blogPosts.slice(4).map((post) => (
                                    <div 
                                        key={post.id} 
                                        className="relative group bg-[#FAF7C8] border border-[#713600]/15 rounded-xl p-6 shadow-[0_4px_20px_rgba(56,36,13,0.05)] transition-all duration-500 hover:border-[#713600]/30 h-full"
                                    >
                                        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#713600]" />
                                        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#713600]" />
                                        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#713600]" />
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#713600]" />
                                        
                                        <BlogCard post={post} />
                                    </div>
                                ))}
                            </div>
                        ) : blogPosts.length <= 1 ? (
                            <div className="py-12 text-center bg-[#FAF7C8] border border-[#713600]/15 rounded-xl relative shadow-xs">
                                <p className="text-[#38240D]/70 text-sm font-serif italic">More articles will be published soon.</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
