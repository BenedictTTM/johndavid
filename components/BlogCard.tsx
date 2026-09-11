"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, MessageCircle, Repeat2, MoreHorizontal, X, ExternalLink, Share2, Check, Copy } from "lucide-react";
import LikeButton from "./LikeButton";
import CommentsModal from "./CommentsModal";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
    post: BlogPost;
}

function cleanText(htmlOrText: string): string {
    if (!htmlOrText) return "";
    return htmlOrText
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
}

export default function BlogCard({ post }: BlogCardProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isReposted, setIsReposted] = useState(false);
    const [repostCount, setRepostCount] = useState(5);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 3);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // If post has a specific category, use it; otherwise default to "Pasion" to match the user's publication styling
    const displayAuthor = (post.category && post.category !== "Note" && post.category !== "Uncategorized")
        ? post.category
        : "Pasion";
    const authorInitial = displayAuthor[0]?.toUpperCase() || "P";
    const quoteText = cleanText(post.content) || cleanText(post.excerpt) || post.title;

    // Load persisted user preferences (bookmarks, reposts, subscriptions)
    useEffect(() => {
        try {
            const bookmarks = JSON.parse(localStorage.getItem("mba_bookmarks") || "[]");
            if (bookmarks.includes(post.id)) {
                setIsBookmarked(true);
            }
            const reposts = JSON.parse(localStorage.getItem("mba_reposts") || "[]");
            if (reposts.includes(post.id)) {
                setIsReposted(true);
                setRepostCount(prev => prev + 1);
            }
            const subscriptions = JSON.parse(localStorage.getItem("mba_subscriptions") || "[]");
            if (subscriptions.includes(displayAuthor)) {
                setIsSubscribed(true);
            }
        } catch {
            // ignore localStorage errors
        }
    }, [post.id, displayAuthor]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const bookmarks = JSON.parse(localStorage.getItem("mba_bookmarks") || "[]");
            let updated: string[];
            if (bookmarks.includes(post.id)) {
                updated = bookmarks.filter((id: string) => id !== post.id);
                setIsBookmarked(false);
            } else {
                updated = [...bookmarks, post.id];
                setIsBookmarked(true);
            }
            localStorage.setItem("mba_bookmarks", JSON.stringify(updated));
        } catch {
            setIsBookmarked(!isBookmarked);
        }
    };

    const handleSubscribe = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const subscriptions = JSON.parse(localStorage.getItem("mba_subscriptions") || "[]");
            let updated: string[];
            if (isSubscribed) {
                updated = subscriptions.filter((key: string) => key !== displayAuthor);
                setIsSubscribed(false);
            } else {
                updated = [...subscriptions, displayAuthor];
                setIsSubscribed(true);
            }
            localStorage.setItem("mba_subscriptions", JSON.stringify(updated));
        } catch {
            setIsSubscribed(!isSubscribed);
        }
    };

    const handleRepost = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const reposts = JSON.parse(localStorage.getItem("mba_reposts") || "[]");
            let updated: string[];
            if (isReposted) {
                updated = reposts.filter((id: string) => id !== post.id);
                setIsReposted(false);
                setRepostCount(prev => Math.max(0, prev - 1));
            } else {
                updated = [...reposts, post.id];
                setIsReposted(true);
                setRepostCount(prev => prev + 1);
            }
            localStorage.setItem("mba_reposts", JSON.stringify(updated));
        } catch {
            setIsReposted(!isReposted);
            setRepostCount(prev => (isReposted ? prev - 1 : prev + 1));
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${post.id}` : "";
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    url,
                });
                return;
            } catch {
                // fall back to clipboard
            }
        }
        if (url && typeof navigator !== "undefined" && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                // clipboard failed
            }
        }
    };

    const handleCopyLink = async () => {
        setIsMenuOpen(false);
        const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${post.id}` : "";
        if (url && typeof navigator !== "undefined" && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {}
        }
    };

    const formattedDate = post.date
        ? new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "Sep 10";

    if (isDismissed) {
        return (
            <motion.div
                initial={{ opacity: 1, height: "auto" }}
                animate={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.3 }}
                className="py-1"
            />
        );
    }

    return (
        <>
            <article className="group flex flex-col w-full border-b border-[#713600]/10 pb-10 last:border-b-0">
                {/* ── Substack Note Header: Author + Timestamp + Substack Orange Subscribe Button ── */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Circular Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#713600]/10 flex items-center justify-center font-bold text-sm text-[#713600] shrink-0 border border-[#713600]/15 shadow-2xs">
                            {authorInitial}
                        </div>

                        {/* Author Name and Date */}
                        <div className="flex items-center gap-2 min-w-0 text-sm">
                            <span className="font-semibold text-[#38240D] hover:underline cursor-pointer truncate">
                                {displayAuthor}
                            </span>
                            <span className="text-[#38240D]/40 text-xs shrink-0">•</span>
                            <span className="text-[#38240D]/60 text-xs font-normal shrink-0">
                                {formattedDate}
                            </span>
                        </div>
                    </div>

                    {/* Right Header Actions */}
                    <div className="flex items-center gap-3.5 shrink-0 relative">
                        <button
                            type="button"
                            onClick={handleSubscribe}
                            className={`text-sm font-semibold transition-colors cursor-pointer ${
                                isSubscribed
                                    ? "text-[#38240D]/60 hover:text-[#38240D]"
                                    : "text-[#FF6719] hover:text-[#E5570F]"
                            }`}
                        >
                            {isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>

                        {/* More Options Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-[#38240D]/40 hover:text-[#38240D] transition-colors p-0.5 cursor-pointer rounded-full"
                                aria-label="More options"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-1.5 w-44 bg-[#FDFBD4] border border-[#713600]/15 rounded-2xl shadow-[0_8px_30px_rgba(56,36,13,0.15)] py-1.5 z-40 overflow-hidden text-xs"
                                    >
                                        <button
                                            type="button"
                                            onClick={handleCopyLink}
                                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#38240D] hover:bg-[#713600]/08 transition-colors cursor-pointer text-left"
                                        >
                                            <Copy className="w-3.5 h-3.5 text-[#713600]" />
                                            <span>Copy link</span>
                                        </button>
                                        <Link
                                            href={`/blog/${post.id}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#38240D] hover:bg-[#713600]/08 transition-colors cursor-pointer text-left"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5 text-[#713600]" />
                                            <span>Open full post</span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleShare}
                                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#38240D] hover:bg-[#713600]/08 transition-colors cursor-pointer text-left"
                                        >
                                            <Share2 className="w-3.5 h-3.5 text-[#713600]" />
                                            <span>Share post</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Dismiss card button */}
                        <button
                            type="button"
                            onClick={() => setIsDismissed(true)}
                            className="text-[#38240D]/40 hover:text-[#38240D] transition-colors p-0.5 cursor-pointer rounded-full"
                            aria-label="Dismiss post"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Main Post Card Container ── */}
                {post.image ? (
                    /* ── Image Post: Dark media card (matching Substack article cards) ── */
                    <div className="overflow-hidden rounded-2xl bg-[#28313A] border border-[#713600]/15 shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-300 group/card">
                        {/* Media / Image Container */}
                        <Link
                            href={`/blog/${post.id}`}
                            className="block relative w-full aspect-[16/9] sm:aspect-[1.85/1] overflow-hidden bg-black/20"
                        >
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                                sizes="(max-width: 768px) 100vw, 600px"
                            />
                        </Link>

                        {/* Dark Slate Info Banner */}
                        <div className="px-5 py-3.5 bg-[#28313A] border-t border-white/[0.08]">
                            {/* Top Row: Avatar Badge + Channel / Category & Bookmark */}
                            <div className="flex items-center justify-between gap-3 mb-1.5">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-4.5 h-4.5 rounded-[4px] bg-[#1A2129] flex items-center justify-center shrink-0 border border-white/10 text-[10px] font-bold text-slate-300">
                                        {authorInitial}
                                    </div>

                                    <span className="text-xs font-medium text-slate-300 truncate tracking-tight">
                                        {displayAuthor}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleBookmark}
                                    aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
                                    className="text-slate-300 hover:text-white transition-colors p-0.5 cursor-pointer"
                                >
                                    <Bookmark
                                        className={`w-4.5 h-4.5 transition-all duration-200 ${
                                            isBookmarked
                                                ? "fill-white text-white scale-105"
                                                : "stroke-[1.75] hover:scale-105"
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Bottom Row: Bold Title */}
                            <h3 className="text-base sm:text-[17px] font-bold text-white tracking-tight leading-snug line-clamp-2">
                                <Link
                                    href={`/blog/${post.id}`}
                                    className="hover:text-slate-200 transition-colors"
                                >
                                    {post.title}
                                </Link>
                            </h3>
                        </div>
                    </div>
                ) : (
                    /* ── Substack Quote Card (Matches user reference screenshot) ── */
                    <div className="rounded-2xl bg-[#312C25] p-6 sm:p-7 border border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col justify-between group/card">
                        {/* Top Quotation Mark Icon */}
                        <div className="select-none mb-3">
                            <svg
                                className="w-7 h-6 text-[#F5F2EB] opacity-90"
                                viewBox="0 0 24 18"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M0 11.25C0 5.035 3.84 0 9.6 0v3.6C6.4 3.6 4.32 6.075 4.16 8.775H9.6V18H0v-6.75zm14.4 0C14.4 5.035 18.24 0 24 0v3.6c-3.2 0-5.28 2.475-5.44 5.175H24V18H14.4v-6.75z" />
                            </svg>
                        </div>

                        {/* Body Text in Serif */}
                        <Link href={`/blog/${post.id}`} className="block my-2 group-hover/card:opacity-95 transition-opacity">
                            <p className="font-serif text-[#F5F2EB] text-[17px] sm:text-[19px] leading-relaxed font-normal tracking-normal whitespace-pre-line line-clamp-6">
                                {quoteText}
                            </p>
                        </Link>

                        {/* Bottom Row: Author + Bookmark */}
                        <div className="flex items-center justify-between pt-5 mt-2 text-[#9E9689]">
                            <span className="text-sm font-sans text-[#9E9689] font-normal tracking-wide">
                                {displayAuthor.toLowerCase()}
                            </span>

                            <button
                                type="button"
                                onClick={handleBookmark}
                                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
                                className="text-[#9E9689] hover:text-[#F5F2EB] transition-colors p-1 cursor-pointer"
                            >
                                <Bookmark
                                    className={`w-4 h-4 transition-all duration-200 ${
                                        isBookmarked
                                            ? "fill-[#F5F2EB] text-[#F5F2EB] scale-105"
                                            : "stroke-[1.75] hover:scale-105"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Social Action Bar Underneath Card ── */}
                <div className="flex items-center gap-6 sm:gap-7 pt-3 px-1 text-[#38240D]/65 select-none">
                    {/* Likes (Heart with Substack Red #FF3040) */}
                    <LikeButton
                        postId={post.id}
                        initialLikes={typeof post.likesCount === 'number' ? post.likesCount : 61}
                        variant="heart"
                        className="hover:text-[#FF3040] transition-colors"
                    />

                    {/* Comment (Speech bubble) */}
                    <button
                        type="button"
                        onClick={() => setIsCommentsOpen(true)}
                        className="flex items-center gap-1.5 p-1 group hover:text-[#38240D] transition-colors cursor-pointer"
                        aria-label="Comments"
                    >
                        <MessageCircle className="w-[18px] h-[18px] stroke-[1.75] transition-transform group-hover:scale-110" />
                        <span className="text-[12px] font-medium text-[#38240D]/70 group-hover:text-[#38240D]">
                            {commentsCount}
                        </span>
                    </button>

                    {/* Repost (Retweet) */}
                    <button
                        type="button"
                        onClick={handleRepost}
                        className={`flex items-center gap-1.5 p-1 group transition-colors cursor-pointer ${
                            isReposted ? "text-emerald-600 font-medium" : "hover:text-emerald-600"
                        }`}
                        aria-label="Repost"
                    >
                        <Repeat2 className={`w-[18px] h-[18px] stroke-[1.75] transition-transform duration-300 ${
                            isReposted ? "rotate-180" : "group-hover:rotate-180"
                        }`} />
                        <span className="text-[12px] font-medium">{repostCount}</span>
                    </button>

                    {/* Share Tray */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex items-center p-1 hover:text-[#38240D] transition-colors group cursor-pointer"
                            aria-label="Share post"
                        >
                            <svg
                                className="w-[18px] h-[18px] stroke-[1.75] transition-transform group-hover:-translate-y-0.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </button>
                        {copied && (
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 text-[10px] font-medium bg-[#38240D] text-[#FDFBD4] rounded shadow-md whitespace-nowrap flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" />
                                Copied!
                            </span>
                        )}
                    </div>
                </div>
            </article>

            {/* Interactive Comments Modal */}
            <CommentsModal
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
                postId={post.id}
                postTitle={post.title}
                onCommentAdded={(newCount) => setCommentsCount(newCount)}
            />
        </>
    );
}
