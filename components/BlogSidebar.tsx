"use client";

import { motion } from "framer-motion";
import { BookOpen, FileText, Layers, Tag, ChevronRight } from "lucide-react";

interface BlogSidebarProps {
    posts: Array<{ category: string }>;
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    activeType: "all" | "blog" | "article";
    onTypeChange: (type: "all" | "blog" | "article") => void;
}

const SECTION_LABEL = "03 // BLOG";

const TYPE_FILTERS = [
    { id: "all" as const, label: "All Posts", icon: Layers },
    { id: "blog" as const, label: "Blogs", icon: BookOpen },
    { id: "article" as const, label: "Articles", icon: FileText },
];

export default function BlogSidebar({
    posts,
    activeCategory,
    onCategoryChange,
    activeType,
    onTypeChange,
}: BlogSidebarProps) {
    // Derive unique categories from posts
    const allCategories = Array.from(
        new Set(
            posts
                .map((p) => p.category || "Uncategorized")
                .filter(Boolean)
        )
    ).sort();

    const categoryCounts: Record<string, number> = {};
    posts.forEach((p) => {
        const cat = p.category || "Uncategorized";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return (
        <aside className="relative w-full lg:w-[220px] xl:w-[240px] shrink-0">
            {/* Section coordinate label — far left, vertical */}
            <div
                className="absolute -left-8 top-0 hidden lg:flex items-center justify-center"
                style={{ height: "100%", width: "24px" }}
                aria-hidden="true"
            >
                <span
                    className="text-[9px] font-mono font-bold tracking-[0.35em] uppercase text-[#713600]/30 select-none"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    {SECTION_LABEL}
                </span>
            </div>

            <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="sticky top-24 flex flex-col gap-6"
            >
                {/* ── Type filter ────────────────────────────────── */}
                <div className="rounded-2xl border border-[#713600]/12 bg-[#FAF7C8]/70 backdrop-blur-sm overflow-hidden shadow-[0_2px_12px_rgba(56,36,13,0.06)]">
                    <div className="px-4 pt-4 pb-2">
                        <p className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#713600]/50 mb-3 select-none">
                            Filter by Type
                        </p>
                        <div className="flex flex-col gap-1">
                            {TYPE_FILTERS.map(({ id, label, icon: Icon }) => {
                                const active = activeType === id;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => onTypeChange(id)}
                                        className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-left group ${
                                            active
                                                ? "bg-[#713600] text-[#FDFBD4] shadow-sm"
                                                : "text-[#38240D]/70 hover:bg-[#713600]/[0.08] hover:text-[#38240D]"
                                        }`}
                                    >
                                        <Icon
                                            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                                                active ? "scale-110" : "group-hover:scale-110"
                                            }`}
                                        />
                                        <span className="flex-1">{label}</span>
                                        {active && (
                                            <ChevronRight className="w-3 h-3 shrink-0 opacity-70" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-4 my-3 h-px bg-[#713600]/10" />

                    {/* ── Category filter ────────────────────────── */}
                    <div className="px-4 pb-4">
                        <p className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#713600]/50 mb-3 select-none">
                            Categories
                        </p>
                        <div className="flex flex-col gap-1">
                            {/* "All" option */}
                            <button
                                type="button"
                                onClick={() => onCategoryChange("all")}
                                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-left group ${
                                    activeCategory === "all"
                                        ? "bg-[#FF6719]/15 text-[#C05800] font-semibold"
                                        : "text-[#38240D]/65 hover:bg-[#FF6719]/[0.08] hover:text-[#38240D]"
                                }`}
                            >
                                <Tag className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                <span className="flex-1">All Categories</span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                                    activeCategory === "all"
                                        ? "bg-[#FF6719]/20 text-[#C05800]"
                                        : "bg-[#38240D]/[0.08] text-[#38240D]/50"
                                }`}>
                                    {posts.length}
                                </span>
                            </button>

                            {allCategories.map((cat) => {
                                const active = activeCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => onCategoryChange(cat)}
                                        className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-left group ${
                                            active
                                                ? "bg-[#FF6719]/15 text-[#C05800] font-semibold"
                                                : "text-[#38240D]/65 hover:bg-[#FF6719]/[0.08] hover:text-[#38240D]"
                                        }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${
                                                active
                                                    ? "bg-[#FF6719] scale-125"
                                                    : "bg-[#713600]/30 group-hover:bg-[#713600]/60"
                                            }`}
                                        />
                                        <span className="flex-1 truncate">{cat}</span>
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                                            active
                                                ? "bg-[#FF6719]/20 text-[#C05800]"
                                                : "bg-[#38240D]/[0.08] text-[#38240D]/50"
                                        }`}>
                                            {categoryCounts[cat] || 0}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Quick stats ────────────────────────────────── */}
                <div className="rounded-2xl border border-[#713600]/12 bg-[#FAF7C8]/50 backdrop-blur-sm p-4 shadow-[0_2px_12px_rgba(56,36,13,0.05)]">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#713600]/50 mb-3 select-none">
                        Publication Stats
                    </p>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[#38240D]/60">Total Posts</span>
                            <span className="text-sm font-bold font-mono text-[#713600]">{posts.length}</span>
                        </div>
                        <div className="w-full h-px bg-[#713600]/[0.08]" />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[#38240D]/60">Categories</span>
                            <span className="text-sm font-bold font-mono text-[#713600]">{allCategories.length}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </aside>
    );
}
