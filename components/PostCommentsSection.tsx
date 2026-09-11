"use client";

import { useState, useEffect } from "react";
import { Send, MessageCircle, User, Loader2 } from "lucide-react";
import { BlogComment } from "@/types/blog";

interface PostCommentsSectionProps {
    postId: string;
    initialCommentsCount?: number;
}

export default function PostCommentsSection({
    postId,
    initialCommentsCount = 0,
}: PostCommentsSectionProps) {
    const [comments, setComments] = useState<BlogComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [body, setBody] = useState("");
    const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
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
                    const list = Array.isArray(data) ? data : [];
                    setComments(list);
                    setCommentsCount(list.length);
                }
            })
            .catch((err) => {
                console.error("Error loading comments:", err);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [postId]);

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
            setCommentsCount((prev) => prev + 1);
            setBody("");
            setSuccessMessage("Your comment has been posted.");
            setTimeout(() => setSuccessMessage(null), 3000);

            try {
                localStorage.setItem("mba_comment_author", trimmedName);
            } catch {}
        } catch (err: any) {
            console.error("Error submitting comment:", err);
            setError(err.message || "Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="comments" className="mt-16 pt-12 border-t border-[#713600]/15">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#713600]/10 flex items-center justify-center text-[#713600]">
                        <MessageCircle className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#38240D]">
                            Discussion &amp; Perspectives
                        </h3>
                        <p className="text-xs font-mono text-[#38240D]/60 uppercase tracking-wider">
                            {commentsCount} comment{commentsCount !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </div>

            {/* Comment Submission Form */}
            <form
                onSubmit={handleSubmit}
                className="mb-12 p-6 rounded-2xl bg-[#FAF7C8]/70 border border-[#713600]/15 shadow-[0_4px_20px_rgba(56,36,13,0.04)] space-y-4"
            >
                <h4 className="text-xs font-bold font-mono tracking-widest uppercase text-[#713600]">
                    Join the Conversation
                </h4>

                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                {successMessage && (
                    <p className="text-xs text-emerald-700 font-medium">{successMessage}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#713600]/50">
                            <User className="w-3.5 h-3.5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={60}
                            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#FDFBD4] border border-[#713600]/20 rounded-xl text-[#38240D] placeholder-[#38240D]/40 focus:outline-none focus:ring-1 focus:ring-[#713600] transition-colors"
                        />
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        placeholder="Write your reflection, questions, or perspectives..."
                        rows={3}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        maxLength={2000}
                        className="w-full px-4 py-3 text-xs bg-[#FDFBD4] border border-[#713600]/20 rounded-xl text-[#38240D] placeholder-[#38240D]/40 focus:outline-none focus:ring-1 focus:ring-[#713600] transition-colors resize-none leading-relaxed"
                    />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-[#38240D]/40">
                        {body.length}/2000
                    </span>
                    <button
                        type="submit"
                        disabled={submitting || !body.trim() || !name.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#FF6719] hover:bg-[#E5570F] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer uppercase tracking-wider"
                    >
                        {submitting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Submit Perspective</span>
                    </button>
                </div>
            </form>

            {/* List of comments */}
            {loading ? (
                <div className="flex items-center justify-center py-12 text-[#713600]/60">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span className="text-xs font-mono">Loading perspectives...</span>
                </div>
            ) : comments.length === 0 ? (
                <div className="py-10 text-center bg-[#FAF7C8]/40 rounded-2xl border border-[#713600]/10">
                    <p className="text-sm font-serif italic text-[#38240D]/70">
                        No perspectives recorded yet. Share your thoughts above.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="p-5 rounded-2xl bg-[#FAF7C8]/60 border border-[#713600]/12 space-y-2.5"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-[#713600]/15 flex items-center justify-center text-[11px] font-bold text-[#713600]">
                                        {comment.name?.[0]?.toUpperCase() || "A"}
                                    </div>
                                    <span className="text-sm font-bold text-[#38240D]">
                                        {comment.name}
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-[#38240D]/50 uppercase tracking-widest">
                                    {comment.createdAt
                                        ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                          })
                                        : ""}
                                </span>
                            </div>
                            <p className="text-xs sm:text-[13px] text-[#38240D]/85 pl-9 leading-relaxed whitespace-pre-line font-sans">
                                {comment.body}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
