"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import BlogSidebar from "./BlogSidebar";
import { BlogPost } from "@/types/blog";

interface BlogProps {
    posts: BlogPost[];
}

// Heuristic: treat posts whose category is "Article" (case-insensitive) as articles,
// everything else as a blog post.
function getPostType(post: BlogPost): "blog" | "article" {
    const cat = (post.category || "").toLowerCase();
    return cat === "article" || cat === "articles" ? "article" : "blog";
}

export default function Blog({ posts }: BlogProps) {
    const [visibleCount, setVisibleCount] = useState(5);
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeType, setActiveType] = useState<"all" | "blog" | "article">("all");

    // Reset visible count whenever filters change
    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setVisibleCount(5);
    };

    const handleTypeChange = (type: "all" | "blog" | "article") => {
        setActiveType(type);
        setVisibleCount(5);
    };

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const catMatch =
                activeCategory === "all" ||
                (post.category || "Uncategorized") === activeCategory;
            const typeMatch =
                activeType === "all" || getPostType(post) === activeType;
            return catMatch && typeMatch;
        });
    }, [posts, activeCategory, activeType]);

    const visiblePosts = filteredPosts.slice(0, visibleCount);

    // Shape for the sidebar (only need category)
    const sidebarPosts = posts.map((p) => ({
        category: p.category || "Uncategorized",
    }));

    return (
        <section
            className="py-20 md:py-28 lg:py-36 px-4 md:px-6 lg:px-12 xl:px-20 bg-transparent"
            id="blog"
        >
            <div className="max-w-[1200px] mx-auto">
                {/* ── Section heading ──────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-14 text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-3 select-none">
                        <div className="w-6 h-[2px] bg-[#713600]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#713600]">
                            Publications &amp; Thoughts
                        </span>
                        <div className="w-6 h-[2px] bg-[#713600]" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#38240D] uppercase tracking-tight">
                        Blog &amp; Articles
                    </h2>
                </motion.div>

                {/* ── Two-column layout: Sidebar + Posts ────────── */}
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-start pl-0 lg:pl-10">
                    {/* Sidebar with the section label sitting at the absolute far left */}
                    <BlogSidebar
                        posts={sidebarPosts}
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                        activeType={activeType}
                        onTypeChange={handleTypeChange}
                    />

                    {/* Posts feed */}
                    <div className="flex-1 min-w-0">
                        {/* Active filter pill */}
                        {(activeCategory !== "all" || activeType !== "all") && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-wrap gap-2 mb-8"
                            >
                                {activeType !== "all" && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#713600] text-[#FDFBD4]">
                                        {activeType === "blog" ? "Blogs" : "Articles"}
                                        <button
                                            type="button"
                                            onClick={() => handleTypeChange("all")}
                                            className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                            aria-label="Remove type filter"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {activeCategory !== "all" && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6719]/15 text-[#C05800] border border-[#FF6719]/20">
                                        {activeCategory}
                                        <button
                                            type="button"
                                            onClick={() => handleCategoryChange("all")}
                                            className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                            aria-label="Remove category filter"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                <span className="text-xs text-[#38240D]/50 self-center font-mono">
                                    {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}
                                </span>
                            </motion.div>
                        )}

                        {/* Empty state */}
                        {filteredPosts.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#713600]/08 flex items-center justify-center mb-4">
                                    <span className="text-2xl">📭</span>
                                </div>
                                <p className="text-sm font-medium text-[#38240D]/60">
                                    No posts found for this filter.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleCategoryChange("all");
                                        handleTypeChange("all");
                                    }}
                                    className="mt-4 text-xs font-semibold text-[#FF6719] hover:text-[#C05800] transition-colors cursor-pointer"
                                >
                                    Clear filters
                                </button>
                            </motion.div>
                        )}

                        {/* Post cards */}
                        <div className="max-w-[540px] flex flex-col gap-8 md:gap-10 mb-12">
                            <AnimatePresence mode="popLayout">
                                {visiblePosts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12, scale: 0.97 }}
                                        transition={{
                                            duration: 0.35,
                                            delay: index * 0.06,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                    >
                                        <BlogCard post={post} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Load more / View all */}
                        {filteredPosts.length > 0 && (
                            <div className="flex items-center gap-4">
                                {visibleCount < filteredPosts.length && (
                                    <button
                                        type="button"
                                        onClick={() => setVisibleCount((c) => c + 5)}
                                        className="px-7 py-3 text-xs font-bold text-[#713600] border border-[#713600]/30 hover:bg-[#713600]/[0.06] rounded-full transition-all duration-200 uppercase tracking-widest cursor-pointer"
                                    >
                                        Load More
                                    </button>
                                )}
                                <Link
                                    href="/blog"
                                    className="px-7 py-3.5 text-xs font-bold text-white bg-[#FF6719] hover:bg-[#E5570F] rounded-full hover:shadow-[0_4px_16px_rgba(255,103,25,0.3)] transition-all duration-300 uppercase tracking-widest shadow-xs"
                                >
                                    View All Articles
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
