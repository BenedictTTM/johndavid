"use client";

import React from "react";

/**
 * BlogCardSkeleton
 * Shimmer placeholder skeleton matching the Substack-style BlogCard layout.
 */
export default function BlogCardSkeleton() {
    return (
        <article className="flex flex-col w-full border-b border-[#713600]/10 pb-10 last:border-b-0 animate-pulse">
            {/* Header: Avatar + Author + Date */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar circle */}
                    <div className="w-8 h-8 rounded-full bg-[#713600]/10 shrink-0" />

                    {/* Author and Date lines */}
                    <div className="flex items-center gap-2">
                        <div className="h-3.5 w-20 bg-[#713600]/12 rounded-md" />
                        <div className="w-1 h-1 rounded-full bg-[#713600]/20" />
                        <div className="h-3 w-12 bg-[#713600]/08 rounded-md" />
                    </div>
                </div>

                {/* More options button placeholder */}
                <div className="w-6 h-6 rounded-full bg-[#713600]/08" />
            </div>

            {/* Main Post Card Box */}
            <div className="overflow-hidden rounded-2xl bg-[#28313A]/60 border border-[#713600]/12 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                {/* Media Aspect box */}
                <div className="w-full aspect-[16/9] sm:aspect-[1.85/1] bg-[#713600]/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>

                {/* Bottom title banner inside dark box */}
                <div className="p-3.5 sm:p-4 bg-[#28313A]/90 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-14 bg-white/10 rounded" />
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <div className="h-2.5 w-16 bg-white/10 rounded" />
                    </div>
                    <div className="h-4 w-3/4 bg-white/15 rounded" />
                </div>
            </div>

            {/* Social Action Bar Underneath */}
            <div className="flex items-center gap-6 pt-3 px-1">
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#713600]/10" />
                    <div className="h-3 w-4 bg-[#713600]/10 rounded" />
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#713600]/10" />
                    <div className="h-3 w-4 bg-[#713600]/10 rounded" />
                </div>
                <div className="w-4 h-4 rounded-full bg-[#713600]/10" />
            </div>
        </article>
    );
}
