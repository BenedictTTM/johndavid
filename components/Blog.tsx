"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { BlogPost } from "@/types/blog";

interface BlogProps {
    posts: BlogPost[];
}

export default function Blog({ posts }: BlogProps) {
    const [visibleCount, setVisibleCount] = useState(2);

    const visiblePosts = posts.slice(0, visibleCount);

    return (
        <section className="py-20 md:py-28 lg:py-36 px-4 md:px-6 lg:px-12 xl:px-20 bg-transparent" id="blog">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-14 text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-3 select-none">
                        <div className="w-6 h-[2px] bg-[#713600]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#713600]">
                            Publications & Thoughts
                        </span>
                        <div className="w-6 h-[2px] bg-[#713600]" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#38240D] uppercase tracking-tight">
                        Blog & Articles
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-12">
                    {visiblePosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <BlogCard post={post} />
                        </motion.div>
                    ))}
                </div>

                {visibleCount < posts.length && (
                    <div className="flex justify-center">
                        <Link
                            href="/blog"
                            className="px-8 py-3.5 text-xs font-bold text-[#713600] border border-[#713600]/30 bg-[#FAF7C8] rounded-full hover:bg-[#713600] hover:text-[#FDFBD4] hover:border-transparent transition-all duration-300 uppercase tracking-widest shadow-xs"
                        >
                            View All Articles
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
