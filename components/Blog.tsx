"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BlogCard from "./BlogCard";
import BlogCardSkeleton from "./BlogCardSkeleton";
import BlogSidebar from "./BlogSidebar";
import AdminContactCard from "./AdminContactCard";
import { BlogPost } from "@/types/blog";

interface BlogProps {
    posts: BlogPost[];
}

const INITIAL_COUNT = 3;
const SCROLL_LIMIT = 10;
const BATCH_SIZE = 3;

export function getPostType(post: BlogPost): "article" | "note" {
    if (post.category?.toLowerCase() === "note") return "note";
    if (post.contentBlocks && Object.keys(post.contentBlocks).length > 0) return "note";
    return "article";
}

export default function Blog({ posts }: BlogProps) {
    const pathname = usePathname();
    const isBlogPage = pathname === "/blog";

    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeType, setActiveType] = useState<"all" | "article" | "note">("all");
    const observerRef = useRef<HTMLDivElement>(null);

    // Calculate format counts accurately
    const articlesCount = useMemo(() => posts.filter((p) => getPostType(p) === "article").length, [posts]);
    const notesCount = useMemo(() => posts.filter((p) => getPostType(p) === "note").length, [posts]);

    // Reset visible count whenever filters change
    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setVisibleCount(INITIAL_COUNT);
    };

    const handleTypeChange = (type: "all" | "article" | "note") => {
        setActiveType(type);
        setVisibleCount(INITIAL_COUNT);
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

    // On-scroll infinite loading with skeletons up to SCROLL_LIMIT (10)
    useEffect(() => {
        if (visibleCount >= SCROLL_LIMIT || visibleCount >= filteredPosts.length || isLoadingMore) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (
                    entry.isIntersecting &&
                    !isLoadingMore &&
                    visibleCount < Math.min(SCROLL_LIMIT, filteredPosts.length)
                ) {
                    setIsLoadingMore(true);
                    setTimeout(() => {
                        setVisibleCount((prev) =>
                            Math.min(prev + BATCH_SIZE, Math.min(SCROLL_LIMIT, filteredPosts.length))
                        );
                        setIsLoadingMore(false);
                    }, 650);
                }
            },
            {
                root: null,
                rootMargin: "250px",
                threshold: 0.1,
            }
        );

        const target = observerRef.current;
        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, [visibleCount, filteredPosts.length, isLoadingMore]);

    const handleManualLoadMore = () => {
        if (isLoadingMore || visibleCount >= filteredPosts.length) return;
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 5, filteredPosts.length));
            setIsLoadingMore(false);
        }, 650);
    };

    const visiblePosts = filteredPosts.slice(0, visibleCount);

    // Shape for the sidebar (only need category)
    const sidebarPosts = posts.map((p) => ({
        category: p.category || "Uncategorized",
    }));

    return (
        <section
            className="pt-6 md:pt-10 pb-14 md:pb-18 px-4 md:px-6 lg:px-12 xl:px-20 bg-transparent"
            id="blog"
        >
            <div className="max-w-[1240px] mx-auto">
                {/* ── Section heading ──────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-6 md:mb-8 text-center"
                >
                    <div className="flex items-center justify-center gap-2.5 mb-2 select-none">
                        <div className="w-5 h-[1.5px] bg-[#713600]" />
                        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#713600]">
                            Publications &amp; Thoughts
                        </span>
                        <div className="w-5 h-[1.5px] bg-[#713600]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-[42px] font-display font-extrabold text-[#38240D] uppercase tracking-tight leading-tight">
                        Blog &amp; Articles
                    </h2>
                </motion.div>

                {/* ── Three-column layout: Left Sidebar + Center Posts + Right Admin Contact ── */}
                <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start justify-center">
                    {/* Left Sidebar with the section label sitting at the absolute far left */}
                    <BlogSidebar
                        posts={sidebarPosts}
                        activeCategory={activeCategory}
                        onCategoryChange={handleCategoryChange}
                        activeType={activeType}
                        onTypeChange={handleTypeChange}
                        articlesCount={articlesCount}
                        notesCount={notesCount}
                    />

                    {/* Posts feed (Center Column) */}
                    <div className="flex-1 min-w-0 max-w-[540px]">
                        {/* Active filter pill */}
                        {(activeCategory !== "all" || activeType !== "all") && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-wrap items-center gap-2 mb-5"
                            >
                                {activeType !== "all" && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#713600] text-[#FDFBD4] shadow-xs">
                                        {activeType === "article" ? "Articles" : "Notes"}
                                        <button
                                            type="button"
                                            onClick={() => handleTypeChange("all")}
                                            className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-sm leading-none"
                                            aria-label="Remove format filter"
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
                                            className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-sm leading-none"
                                            aria-label="Remove category filter"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                <span className="text-xs text-[#38240D]/50 font-mono">
                                    {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}
                                </span>
                            </motion.div>
                        )}

                        {/* Empty state */}
                        {filteredPosts.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                <div className="w-11 h-11 rounded-full bg-[#713600]/08 flex items-center justify-center mb-3">
                                    <span className="text-xl">📭</span>
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
                                    className="mt-3.5 text-xs font-semibold text-[#713600] hover:text-[#C05800] transition-colors cursor-pointer"
                                >
                                    Clear filters
                                </button>
                            </motion.div>
                        )}

                        {/* Post cards */}
                        <div className="max-w-[540px] flex flex-col gap-6 md:gap-7 mb-5">
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
                                            delay: index * 0.05,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                    >
                                        <BlogCard post={post} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Shimmer Skeleton Loaders ("Schemas") while auto-loading or on click */}
                            {isLoadingMore && (
                                <div className="flex flex-col gap-8">
                                    <BlogCardSkeleton />
                                </div>
                            )}
                        </div>

                        {/* Sentinel element for infinite scroll observer (auto-loads up to SCROLL_LIMIT) */}
                        {visibleCount < Math.min(SCROLL_LIMIT, filteredPosts.length) && (
                            <div ref={observerRef} className="h-6 w-full" aria-hidden="true" />
                        )}

                        {/* Bottom Actions: Load More / View All */}
                        {filteredPosts.length > 0 && (
                            <div className="flex flex-wrap items-center gap-4 mt-2 mb-10">
                                {/* Manual Load More: becomes visible when 10 posts are loaded and more exist */}
                                {visibleCount >= SCROLL_LIMIT && visibleCount < filteredPosts.length && (
                                    <button
                                        type="button"
                                        onClick={handleManualLoadMore}
                                        disabled={isLoadingMore}
                                        className="px-7 py-3 text-xs font-bold text-[#713600] border border-[#713600]/30 hover:bg-[#713600]/[0.06] rounded-full transition-all duration-200 uppercase tracking-widest cursor-pointer disabled:opacity-50 shadow-2xs"
                                    >
                                        {isLoadingMore ? "Loading Stories..." : "Load More Stories"}
                                    </button>
                                )}

                                {/* "View All Articles" link only shown on Homepage */}
                                {!isBlogPage && (
                                    <Link
                                        href="/blog"
                                        className="px-7 py-3.5 text-xs font-bold text-[#FDFBD4] bg-[#713600] hover:bg-[#C05800] rounded-full hover:shadow-[0_6px_24px_rgba(192,88,0,0.3)] transition-all duration-300 uppercase tracking-widest shadow-[0_4px_16px_rgba(113,54,0,0.25)]"
                                    >
                                        View All Articles
                                    </Link>
                                )}

                                {/* End of feed marker when all stories are loaded */}
                                {visibleCount >= filteredPosts.length && (
                                    <div className="py-2 text-[11px] font-mono uppercase tracking-wider text-[#713600]/50 select-none flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#713600]/30" />
                                        <span>All {filteredPosts.length} publications displayed</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Ask the Admin Contact Panel */}
                    <AdminContactCard className="mt-8 lg:mt-0" />
                </div>
            </div>
        </section>
    );
}
