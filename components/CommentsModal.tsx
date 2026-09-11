"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, User, Loader2 } from "lucide-react";
import { BlogComment } from "@/types/blog";

interface CommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: string;
    postTitle: string;
    onCommentAdded?: (newCount: number) => void;
}

export default function CommentsModal({
    isOpen,
    onClose,
    postId,
    postTitle,
    onCommentAdded,
}: CommentsModalProps) {
    const [comments, setComments] = useState<BlogComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch existing comments on open
    useEffect(() => {
        if (!isOpen || !postId) return;

        let isMounted = true;
        setLoading(true);
        setError(null);

        // Load saved author name from localStorage if available
        try {
            const savedName = localStorage.getItem("mba_comment_author");
            if (savedName) setName(savedName);
        } catch {}

        fetch(`/api/posts/${postId}/comments`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch comments");
                return res.json();
            })
            .then((data) => {
                if (isMounted) {
                    setComments(Array.isArray(data) ? data : []);
                }
            })
            .catch((err) => {
                console.error("Error loading comments:", err);
                if (isMounted) setError("Could not load comments.");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen, postId]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedBody = body.trim();

        if (!trimmedName) {
            setError("Please enter your name.");
            return;
        }
        if (!trimmedBody) {
            setError("Please enter a comment.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: trimmedName, body: trimmedBody }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to post comment");
            }

            const data = await res.json();
            setComments((prev) => [data.comment, ...prev]);
            setBody("");
            setSuccessMessage("Comment published!");
            setTimeout(() => setSuccessMessage(null), 3000);

            try {
                localStorage.setItem("mba_comment_author", trimmedName);
            } catch {}

            if (onCommentAdded && typeof data.commentsCount === "number") {
                onCommentAdded(data.commentsCount);
            }
        } catch (err: any) {
            console.error("Error submitting comment:", err);
            setError(err.message || "Failed to submit comment");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#1D1308]/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-lg bg-[#FDFBD4] rounded-3xl border border-[#713600]/20 shadow-[0_24px_60px_rgba(56,36,13,0.25)] overflow-hidden z-10 flex flex-col max-h-[88vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#713600]/12 bg-[#FAF7C8]/80">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-[#713600]/10 flex items-center justify-center text-[#713600]">
                                    <MessageCircle className="w-4 h-4 stroke-[2]" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-[#38240D] uppercase tracking-wide truncate">
                                        Comments
                                    </h3>
                                    <p className="text-[11px] text-[#38240D]/60 truncate max-w-[280px]">
                                        {postTitle}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[#38240D]/60 hover:text-[#38240D] hover:bg-[#713600]/10 transition-colors cursor-pointer"
                                aria-label="Close comments"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-[#713600]/08">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-[#713600]/60">
                                    <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#713600]" />
                                    <span className="text-xs font-mono">Loading discussion...</span>
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-10 h-10 rounded-full bg-[#713600]/08 flex items-center justify-center mb-2.5 text-lg">
                                        💬
                                    </div>
                                    <p className="text-xs font-semibold text-[#38240D]">No comments yet</p>
                                    <p className="text-[11px] text-[#38240D]/60 mt-0.5">
                                        Be the first to start the conversation!
                                    </p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="pt-4 first:pt-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#713600]/15 flex items-center justify-center text-[10px] font-bold text-[#713600]">
                                                    {comment.name?.[0]?.toUpperCase() || "A"}
                                                </div>
                                                <span className="text-xs font-semibold text-[#38240D]">
                                                    {comment.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-[#38240D]/50">
                                                {comment.createdAt
                                                    ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                                                          month: "short",
                                                          day: "numeric",
                                                      })
                                                    : ""}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#38240D]/85 pl-8 leading-relaxed whitespace-pre-line">
                                            {comment.body}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Comment Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-5 border-t border-[#713600]/12 bg-[#FAF7C8]/90 flex flex-col gap-3"
                        >
                            {error && (
                                <p className="text-[11px] text-red-600 font-medium px-1">{error}</p>
                            )}
                            {successMessage && (
                                <p className="text-[11px] text-emerald-700 font-medium px-1">
                                    {successMessage}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#713600]/50">
                                        <User className="w-3.5 h-3.5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        maxLength={60}
                                        className="w-full pl-8.5 pr-3 py-2 text-xs bg-white/70 border border-[#713600]/20 rounded-xl text-[#38240D] placeholder-[#38240D]/40 focus:outline-none focus:ring-1 focus:ring-[#713600] focus:border-[#713600] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <textarea
                                    placeholder="Write a thought or reply..."
                                    rows={2}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    maxLength={2000}
                                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-[#713600]/20 rounded-xl text-[#38240D] placeholder-[#38240D]/40 focus:outline-none focus:ring-1 focus:ring-[#713600] focus:border-[#713600] transition-colors resize-none leading-relaxed"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-0.5">
                                <span className="text-[10px] font-mono text-[#38240D]/40">
                                    {body.length}/2000
                                </span>
                                <button
                                    type="submit"
                                    disabled={submitting || !body.trim() || !name.trim()}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#FF6719] hover:bg-[#E5570F] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer uppercase tracking-wider"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Send className="w-3.5 h-3.5" />
                                    )}
                                    <span>Post</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
