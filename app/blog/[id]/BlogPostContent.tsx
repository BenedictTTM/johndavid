"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { BlogPost } from "@/types/blog";
import { useRef, useState } from "react";
import LikeButton from "@/components/LikeButton";

interface BlogPostContentProps {
    post: BlogPost;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
    const targetRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress: heroScrollProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });
    const y = useTransform(heroScrollProgress, [0, 1], ["0%", "15%"]);

    const { scrollYProgress: pageScrollProgress } = useScroll();
    const scaleX = useSpring(pageScrollProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const [backCoords, setBackCoords] = useState({ x: 0, y: 0 });
    const handleBackMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setBackCoords({ x: x * 0.25, y: y * 0.25 });
    };
    const handleBackMouseLeave = () => {
        setBackCoords({ x: 0, y: 0 });
    };

    if (!post) return null;

    const dateObj = new Date(post.date);

    return (
        <div
            className="min-h-screen bg-[#FDFBD4] text-[#38240D] font-sans relative overflow-x-hidden antialiased w-full"
        >
            {/* Satin Reading Progress Line */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-[#713600] z-50 origin-left"
                style={{ scaleX }}
            />

            {/* Fine grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(113,54,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,54,0,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none -z-10" />

            {/* Index Markers */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-24 md:pt-24 flex justify-between items-center text-[9px] text-[#38240D]/60 tracking-[0.35em] uppercase select-none pointer-events-none font-mono">
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#713600] animate-pulse" />
                    Seq. 06 <span className="hidden sm:inline">// Editorial Journal</span>
                </span>
                <span>Index Ledger <span className="hidden sm:inline">// Vol. 2.6</span></span>
            </div>

            <main className="pb-24 relative w-full overflow-x-hidden">
                {/* Back navigation */}
                <nav className="absolute top-0 left-0 w-full z-30 px-4 md:px-12 flex justify-between items-center pointer-events-none py-6">
                    <Link
                        href="/blog"
                        onMouseMove={handleBackMouseMove}
                        onMouseLeave={handleBackMouseLeave}
                        className="group pointer-events-auto inline-flex items-center text-[10px] font-semibold tracking-[0.25em] text-[#38240D] hover:text-[#713600] transition-all duration-300 uppercase py-2"
                    >
                        <motion.span
                            animate={{ x: backCoords.x, y: backCoords.y }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.1 }}
                            className="relative flex items-center justify-center w-6 h-6 mr-3 rounded-full border border-[#713600]/20 bg-[#FAF7C8] group-hover:border-[#713600] transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#713600]" />
                        </motion.span>
                        Back to Journal
                    </Link>
                </nav>

                <article className="pt-16 md:pt-24 w-full overflow-x-hidden">
                    {/* Header Title Section */}
                    <div className="max-w-[1200px] mx-auto px-4 md:px-6 mb-12 md:mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <div className="flex items-center justify-center gap-3 mb-6 select-none font-mono text-[10px] tracking-[0.35em] text-[#713600] uppercase font-bold">
                                <span>{post.category || "Editorial"}</span>
                            </div>

                            <h1 className="font-serif font-semibold text-[clamp(2rem,5vw,3.75rem)] text-[#38240D] tracking-tight leading-[1.15] mb-6 md:mb-8 px-2 md:px-0">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] text-[#38240D]/70 font-mono uppercase tracking-widest">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-[#713600] stroke-[1.75]" />
                                    {dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-[#713600]/30" />
                                <span className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-[#713600] stroke-[1.75]" />
                                    {post.readTime || "5 min"} read
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Parallax Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-12 md:mb-20"
                    >
                        <div
                            ref={targetRef}
                            className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] overflow-hidden rounded-xl bg-[#FAF7C8] border border-[#713600]/15 p-1.5 group/image shadow-[0_12px_40px_rgba(56,36,13,0.06)]"
                        >
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#713600]/40 z-20 pointer-events-none" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#713600]/40 z-20 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#713600]/40 z-20 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#713600]/40 z-20 pointer-events-none" />

                            <div className="relative w-full h-full overflow-hidden rounded-lg">
                                <motion.div style={{ y }} className="relative w-full h-[120%] -top-[10%]">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/image:scale-[1.03]"
                                        priority
                                        sizes="100vw"
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Dual-Column Reading Structure */}
                    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 relative overflow-x-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                            {/* Sticky Sidebar */}
                            <div className="hidden lg:block lg:col-span-3 sticky top-32 space-y-8 text-[#38240D]">
                                <div className="space-y-2 border-l-2 border-[#713600] pl-4 font-mono">
                                    <span className="text-[10px] text-[#38240D]/60 tracking-wider uppercase block">Reading Status</span>
                                    <span className="text-xs font-semibold uppercase tracking-widest text-[#713600]">In Progress</span>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-mono tracking-widest uppercase text-[#38240D]/60">Author</h4>
                                    <p className="text-sm font-serif font-semibold text-[#38240D]">John David</p>
                                    <p className="text-[11px] text-[#38240D]/60 leading-normal">Bioengineering Scholar</p>
                                </div>

                                <div className="pt-6 border-t border-[#713600]/15 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <LikeButton postId={post.id} initialLikes={post.likesCount || 0} className="scale-110" />
                                        <span className="text-[10px] font-mono tracking-widest uppercase text-[#38240D]/70 font-semibold">Appreciate</span>
                                    </div>
                                </div>
                            </div>

                            {/* Article Body Column */}
                            <div className="col-span-1 lg:col-span-9 w-full min-w-0 overflow-x-hidden">

                                {/* Excerpt */}
                                {post.excerpt && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                        className="relative pl-5 md:pl-8 border-l-3 border-[#713600] mb-10 md:mb-14"
                                    >
                                        <p className="text-[1.2rem] md:text-[1.4rem] leading-relaxed text-[#38240D] font-serif italic font-normal tracking-wide">
                                            {post.excerpt}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Main Body Content */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.1 }}
                                    className={`
                                        prose prose-neutral
                                        w-full max-w-full overflow-x-hidden
                                        break-words
                                        [word-break:break-word]
                                        [overflow-wrap:anywhere]

                                        prose-headings:font-serif prose-headings:text-[#38240D] prose-headings:font-semibold prose-headings:tracking-tight
                                        prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-[#713600]/15
                                        prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3

                                        prose-p:font-sans prose-p:text-[16px] md:prose-p:text-[17px] prose-p:leading-[1.8] prose-p:text-[#38240D]/85 prose-p:mb-6 prose-p:font-normal

                                        prose-a:text-[#713600] prose-a:font-semibold prose-a:no-underline prose-a:border-b prose-a:border-[#713600]/30 hover:prose-a:border-[#C05800] hover:prose-a:text-[#C05800] prose-a:transition-all

                                        prose-blockquote:border-l-3 prose-blockquote:border-[#713600] prose-blockquote:pl-5 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-lg prose-blockquote:font-serif prose-blockquote:text-[#38240D] prose-blockquote:bg-[#FAF7C8] prose-blockquote:rounded-r-lg

                                        prose-strong:font-semibold prose-strong:text-[#38240D]

                                        prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-6 prose-ul:space-y-2 prose-ul:text-[#38240D]/85
                                        prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-6 prose-ol:space-y-2 prose-ol:text-[#38240D]/85

                                        prose-code:text-[#713600] prose-code:bg-[#FAF7C8] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs

                                        prose-pre:bg-[#FAF7C8] prose-pre:border prose-pre:border-[#713600]/15 prose-pre:p-4 prose-pre:rounded-lg prose-pre:font-mono prose-pre:text-xs md:prose-pre:text-sm prose-pre:overflow-x-auto

                                        prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg
                                    `}
                                >
                                    <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}