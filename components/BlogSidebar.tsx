"use client";

import { motion } from "framer-motion";
import { FileText, MessageSquareQuote, Layers, Tag, ChevronRight } from "lucide-react";

export type PublicationType = "all" | "article" | "note";

interface BlogSidebarProps {
    posts: Array<{ category: string }>;
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    activeType: PublicationType;
    onTypeChange: (type: PublicationType) => void;
    articlesCount: number;
    notesCount: number;
}

const SECTION_LABEL = "03 // BLOG";

export default function BlogSidebar({
    posts,
    activeCategory,
    onCategoryChange,
    activeType,
    onTypeChange,
    articlesCount,
    notesCount,
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
        <aside className="relative w-full lg:w-[220px] xl:w-[240px] shrink-0 lg:sticky lg:top-24 self-start">
            {/* Section coordinate label — far left, vertical (desktop only) */}
            <div
                className="absolute -left-8 top-0 hidden lg:flex items-center justify-center"
                style={{ height: "100%", width: "24px" }}
                aria-hidden="true"
            >
                <span
                    className="text-[9px] font-mono font-bold tracking-[0.35em] uppercase text-[#542A00]/35 select-none"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    {SECTION_LABEL}
                </span>
            </div>

            {/* ══════════════════════════════════════════════════════════════════════
                MOBILE FILTER BAR (< lg): Sleek 2-tier bar (~78px total)
                Tier 1: Format pills (All, Articles, Notes)
                Tier 2: Topic chips (All, INNATE, Pasion, nana kojo, etc.)
                ══════════════════════════════════════════════════════════════════════ */}
            <div className="block lg:hidden w-full mb-6">
                <div className="rounded-2xl border border-[#D8D0A6] bg-[#FFF8D8]/90 backdrop-blur-md p-2 shadow-[0_2px_12px_rgba(43,33,25,0.04)] flex flex-col gap-1.5">
                    {/* Tier 1: Format Selector */}
                    <div className="flex items-center gap-1 p-0.5 bg-[#542A00]/[0.06] rounded-xl">
                        {[
                            { id: "all" as const, label: "All", count: posts.length, icon: Layers },
                            { id: "article" as const, label: "Articles", count: articlesCount, icon: FileText },
                            { id: "note" as const, label: "Notes", count: notesCount, icon: MessageSquareQuote },
                        ].map(({ id, label, count, icon: Icon }) => {
                            const active = activeType === id;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => onTypeChange(id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                        active
                                            ? "bg-[#542A00] text-[#FFF8D8] shadow-xs"
                                            : "text-[#2B2119]/70 hover:text-[#2B2119]"
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5 shrink-0" />
                                    <span>{label}</span>
                                    <span className={`text-[10px] font-mono ${active ? "opacity-90" : "opacity-50"}`}>
                                        ({count})
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tier 2: Category Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
                        <button
                            type="button"
                            onClick={() => onCategoryChange("all")}
                            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                                activeCategory === "all"
                                    ? "bg-[#D97932]/12 text-[#542A00] border border-[#D97932]/35 font-semibold"
                                    : "bg-white/70 text-[#2B2119]/70 border border-[#D8D0A6] hover:bg-white/95"
                            }`}
                        >
                            <Tag className="w-3 h-3 shrink-0" />
                            <span>All Topics</span>
                        </button>
                        {allCategories.map((cat) => {
                            const active = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => onCategoryChange(cat)}
                                    className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                                        active
                                            ? "bg-[#D97932]/12 text-[#542A00] border border-[#D97932]/35 font-semibold"
                                            : "bg-white/70 text-[#2B2119]/70 border border-[#D8D0A6] hover:bg-white/95"
                                    }`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                            active ? "bg-[#D97932]" : "bg-[#542A00]/30"
                                        }`}
                                    />
                                    <span className="whitespace-nowrap">{cat}</span>
                                    <span className="text-[10px] font-mono opacity-60">
                                        ({categoryCounts[cat] || 0})
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════════
                DESKTOP DESIGN (lg: and above): Full Vertical Sticky Sidebar + Stats
                ══════════════════════════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:flex flex-col gap-6"
            >
                {/* ── Format Selector ────────────────────────── */}
                <div className="rounded-2xl border border-[#D8D0A6] bg-[#FFF8D8]/75 backdrop-blur-sm overflow-hidden shadow-[0_2px_12px_rgba(43,33,25,0.05)]">
                    <div className="p-4">
                        <p className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#542A00]/55 mb-3 select-none">
                            Format
                        </p>
                        <div className="flex flex-col gap-1">
                            {[
                                { id: "all" as const, label: "All Posts", count: posts.length, icon: Layers },
                                { id: "article" as const, label: "Articles", count: articlesCount, icon: FileText },
                                { id: "note" as const, label: "Notes", count: notesCount, icon: MessageSquareQuote },
                            ].map(({ id, label, count, icon: Icon }) => {
                                const active = activeType === id;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => onTypeChange(id)}
                                        className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-left group ${
                                            active
                                                ? "bg-[#542A00] text-[#FFF8D8] font-semibold shadow-xs"
                                                : "text-[#2B2119]/70 hover:bg-[#542A00]/[0.06] hover:text-[#2B2119]"
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                        <span className="flex-1">{label}</span>
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                                            active ? "bg-white/20 text-[#FFF8D8]" : "bg-[#2B2119]/[0.06] text-[#2B2119]/50"
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Category filter ────────────────────────── */}
                <div className="rounded-2xl border border-[#D8D0A6] bg-[#FFF8D8]/75 backdrop-blur-sm overflow-hidden shadow-[0_2px_12px_rgba(43,33,25,0.05)]">
                    <div className="p-4">
                        <p className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#542A00]/55 mb-3 select-none">
                            Topics
                        </p>
                        <div className="flex flex-col gap-1">
                            {/* "All" option */}
                            <button
                                type="button"
                                onClick={() => onCategoryChange("all")}
                                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-left group ${
                                    activeCategory === "all"
                                        ? "bg-[#542A00] text-[#FFF8D8] font-semibold shadow-xs"
                                        : "text-[#2B2119]/65 hover:bg-[#542A00]/[0.06] hover:text-[#2B2119]"
                                }`}
                            >
                                <Tag className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                <span className="flex-1">All Topics</span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                                    activeCategory === "all"
                                        ? "bg-white/20 text-[#FFF8D8]"
                                        : "bg-[#2B2119]/[0.06] text-[#2B2119]/50"
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
                                                ? "bg-[#542A00] text-[#FFF8D8] font-semibold shadow-xs"
                                                : "text-[#2B2119]/65 hover:bg-[#542A00]/[0.06] hover:text-[#2B2119]"
                                        }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${
                                                active
                                                    ? "bg-[#FFF8D8] scale-125"
                                                    : "bg-[#542A00]/30 group-hover:bg-[#542A00]/60"
                                            }`}
                                        />
                                        <span className="flex-1 truncate">{cat}</span>
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                                            active
                                                ? "bg-white/20 text-[#FFF8D8]"
                                                : "bg-[#2B2119]/[0.06] text-[#2B2119]/50"
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
                <div className="rounded-2xl border border-[#D8D0A6] bg-[#FFF8D8]/55 backdrop-blur-sm p-4 shadow-[0_2px_12px_rgba(43,33,25,0.04)]">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#542A00]/55 mb-3 select-none">
                        Publication Stats
                    </p>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[#2B2119]/65">Total Posts</span>
                            <span className="text-sm font-bold font-mono text-[#542A00]">{posts.length}</span>
                        </div>
                        <div className="w-full h-px bg-[#542A00]/[0.08]" />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[#2B2119]/65">Categories</span>
                            <span className="text-sm font-bold font-mono text-[#542A00]">{allCategories.length}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </aside>
    );
}
