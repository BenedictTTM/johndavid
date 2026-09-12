"use client";

import React, { useState, useEffect } from "react";
import { Send, Check, AlertCircle, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface AdminContactCardProps {
    className?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

/**
 * AdminContactCard
 * Editorial contact dispatch panel aligned with the blog's warm academic design system.
 */
export default function AdminContactCard({ className = "" }: AdminContactCardProps) {
    const [sender, setSender] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Reuse existing author/email from localStorage if available
    useEffect(() => {
        try {
            const author = localStorage.getItem("mba_comment_author");
            const email = localStorage.getItem("mba_comment_email");
            if (email) {
                setSender(email);
            } else if (author) {
                setSender(author);
            }
        } catch {
            // ignore localStorage errors
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = message.trim();
        if (!trimmedMessage || status === "submitting") return;

        setStatus("submitting");
        setErrorMessage(null);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sender: sender.trim() || undefined, message: trimmedMessage }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Failed to send note");
            }

            // Save contact preference if entered
            if (sender.trim()) {
                if (sender.includes("@")) {
                    localStorage.setItem("mba_comment_email", sender.trim());
                } else {
                    localStorage.setItem("mba_comment_author", sender.trim());
                }
            }

            setStatus("success");
            setMessage("");
        } catch (err: any) {
            console.error("Admin message submission error:", err);
            setErrorMessage(err.message || "Could not send note. Please try again.");
            setStatus("error");
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <aside
            className={`w-full lg:w-[220px] xl:w-[240px] shrink-0 lg:sticky lg:top-24 self-start flex flex-col gap-4 ${className}`}
            aria-label="Direct Dispatch"
        >
            <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
            >
                {/* ── Main Dispatch Card ────────────────────────── */}
                <div className="rounded-2xl border border-[#D8D0A6] bg-[#FFF8D8]/85 backdrop-blur-sm overflow-hidden shadow-[0_2px_12px_rgba(43,33,25,0.06)]">
                    {/* Header */}
                    <div className="px-4 pt-4 pb-3">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#542A00]/55 select-none">
                                Direct Dispatch
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D97932] animate-pulse" />
                                <span className="text-[9px] font-mono uppercase text-[#542A00]/55 font-bold tracking-wider">
                                    Open
                                </span>
                            </span>
                        </div>
                        <h3 className="text-sm font-serif font-bold text-[#2B2119] tracking-tight">
                            Note to Author
                        </h3>
                        <p className="text-[11px] text-[#2B2119]/65 leading-relaxed mt-1 font-serif italic">
                            Questions, discussions, or research inquiries sent straight to John David.
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="mx-4 h-px bg-[#D8D0A6]" />

                    {/* Content */}
                    <div className="p-4">
                        {status === "success" ? (
                            <div className="py-4 text-center flex flex-col items-center">
                                <div className="w-9 h-9 rounded-full bg-[#542A00]/10 text-[#542A00] flex items-center justify-center mb-2.5">
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                </div>
                                <p className="text-xs font-serif font-bold text-[#2B2119] mb-1">
                                    Note Dispatched
                                </p>
                                <p className="text-[11px] text-[#2B2119]/65 leading-normal mb-3">
                                    Thank you. John typically replies within 24–48 hours.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setStatus("idle")}
                                    className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#542A00] hover:text-[#3D1E00] transition-colors cursor-pointer"
                                >
                                    + Send another note
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                {/* Optional Contact Identifier */}
                                <div>
                                    <label
                                        htmlFor="admin-sender-input"
                                        className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-[#542A00]/65 mb-1.5 block select-none"
                                    >
                                        Your Email or Contact <span className="opacity-40 font-normal font-sans text-[8px] lowercase">(optional)</span>
                                    </label>
                                    <input
                                        id="admin-sender-input"
                                        type="text"
                                        value={sender}
                                        onChange={(e) => setSender(e.target.value)}
                                        placeholder="alex@example.com"
                                        disabled={status === "submitting"}
                                        className="w-full px-3 py-1.5 text-xs bg-[#F5F1D5]/60 border border-[#D8D0A6] rounded-lg text-[#2B2119] placeholder-[#2B2119]/40 focus:outline-none focus:ring-1 focus:ring-[#542A00] focus:border-[#542A00] transition-colors"
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label
                                        htmlFor="admin-message-input"
                                        className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-[#542A00]/65 mb-1.5 block select-none"
                                    >
                                        Your Note
                                    </label>
                                    <textarea
                                        id="admin-message-input"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="What would you like to share or ask?"
                                        rows={3}
                                        disabled={status === "submitting"}
                                        required
                                        aria-required="true"
                                        aria-invalid={status === "error"}
                                        aria-describedby={status === "error" ? "admin-message-error" : undefined}
                                        className="w-full px-3 py-2 text-xs bg-[#F5F1D5]/60 border border-[#D8D0A6] rounded-lg text-[#2B2119] placeholder-[#2B2119]/40 focus:outline-none focus:ring-1 focus:ring-[#542A00] focus:border-[#542A00] transition-colors resize-none leading-relaxed"
                                    />
                                </div>

                                {status === "error" && (
                                    <div
                                        id="admin-message-error"
                                        className="flex items-center gap-1.5 text-[11px] text-red-700 font-medium"
                                        role="alert"
                                    >
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        <span>{errorMessage || "Submission failed"}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[9px] text-[#2B2119]/50 font-mono select-none">
                                        ⌘+Enter
                                    </span>
                                    <button
                                        type="submit"
                                        disabled={!message.trim() || status === "submitting"}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                            message.trim() && status !== "submitting"
                                                ? "bg-[#542A00] text-[#FFF8D8] hover:bg-[#3D1E00] shadow-xs active:scale-95"
                                                : "bg-[#542A00]/10 text-[#542A00]/35 cursor-not-allowed"
                                        }`}
                                    >
                                        {status === "submitting" ? (
                                            <span>Sending...</span>
                                        ) : (
                                            <>
                                                <span>Send Note</span>
                                                <Send className="w-3 h-3 stroke-[2]" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* ── Direct Contact Coordinates (Mirrors Publication Stats on Left) ── */}
                <div className="rounded-2xl border border-[#D8D0A6] bg-[#FFF8D8]/70 backdrop-blur-sm p-4 shadow-[0_2px_12px_rgba(43,33,25,0.05)]">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-[#542A00]/55 mb-3 select-none">
                        Author Coordinates
                    </p>
                    <div className="flex flex-col gap-2.5 text-xs text-[#2B2119]/75">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[#2B2119]/60 text-[11px]">
                                <Mail className="w-3 h-3 text-[#542A00]/60" />
                                Email
                            </span>
                            <a
                                href="mailto:johndavid@yorku.ca"
                                className="font-mono text-[11px] font-semibold text-[#542A00] hover:text-[#3D1E00] transition-colors"
                            >
                                johndavid@yorku.ca
                            </a>
                        </div>
                        <div className="w-full h-px bg-[#D8D0A6]" />
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-[#2B2119]/60 text-[11px]">
                                <Clock className="w-3 h-3 text-[#542A00]/60" />
                                Cadence
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-[#542A00]">
                                24–48 Hours
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </aside>
    );
}
