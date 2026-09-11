'use client';

import { useState, useEffect } from 'react';
import { FileText, Trash2, Calendar, Image as ImageIcon, X, Loader2, ArrowRight, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export interface DraftPost {
    id: string;
    title: string;
    content?: string;
    excerpt?: string;
    category: string;
    published: boolean;
    date: string;
    image?: string;
    contentBlocks?: any;
}

interface DraftsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDraft: (draft: DraftPost) => void;
    onSaveCurrentDraft: () => Promise<void>;
    isSubmitting: boolean;
    hasCurrentContent: boolean;
}

export function DraftsModal({
    isOpen,
    onClose,
    onSelectDraft,
    onSaveCurrentDraft,
    isSubmitting,
    hasCurrentContent,
}: DraftsModalProps) {
    const [drafts, setDrafts] = useState<DraftPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchDrafts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/posts');
            if (!res.ok) throw new Error('Failed to fetch drafts');
            const data: DraftPost[] = await res.json();
            // Filter for unpublished posts (drafts) and specifically Note or all drafts
            const noteDrafts = data.filter(
                p => !p.published && (p.category === 'Note' || !p.category || p.category === 'Uncategorized')
            );
            setDrafts(noteDrafts);
        } catch (err: any) {
            toast.error(err.message || 'Error fetching drafts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDrafts();
        }
    }, [isOpen]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeletingId(id);
        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete draft');
            toast.success('Draft deleted');
            setDrafts(prev => prev.filter(d => d.id !== id));
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete draft');
        } finally {
            setDeletingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="w-full max-w-lg bg-[#161719] border border-white/10 rounded-2xl shadow-2xl p-5 text-white flex flex-col max-h-[85vh] overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5 mb-3">
                    <div className="flex items-center gap-2.5">
                        <Bookmark className="w-5 h-5 text-[#FF6719]" />
                        <h3 className="text-base font-semibold text-white">Saved Drafts</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/10 text-white/70">
                            {drafts.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasCurrentContent && (
                            <button
                                type="button"
                                onClick={async () => {
                                    await onSaveCurrentDraft();
                                    await fetchDrafts();
                                }}
                                disabled={isSubmitting}
                                className="px-3 py-1.5 rounded-lg bg-[#FF6719]/15 hover:bg-[#FF6719]/25 text-[#FF6719] text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                            >
                                {isSubmitting ? 'Saving…' : 'Save Current Note'}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-white/40 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Drafts List */}
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-white/40 gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-[#FF6719]" />
                            <span className="text-xs">Loading drafts…</span>
                        </div>
                    ) : drafts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-white/40 gap-2">
                            <FileText className="w-8 h-8 stroke-[1.25] text-white/20" />
                            <p className="text-sm font-medium text-white/70">No saved drafts</p>
                            <p className="text-xs text-white/40 max-w-xs">
                                Notes you save as drafts will appear here so you can finish writing them later.
                            </p>
                        </div>
                    ) : (
                        drafts.map(draft => {
                            const dateObj = new Date(draft.date);
                            const formattedDate = !isNaN(dateObj.getTime())
                                ? dateObj.toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: 'numeric',
                                      minute: '2-digit',
                                  })
                                : '';

                            return (
                                <div
                                    key={draft.id}
                                    onClick={() => {
                                        onSelectDraft(draft);
                                        onClose();
                                    }}
                                    className="group p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/15 transition-all cursor-pointer flex items-start justify-between gap-3"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white line-clamp-2 leading-snug group-hover:text-[#FF6719] transition-colors">
                                            {draft.content?.trim() || draft.title || 'Untitled note draft'}
                                        </p>

                                        <div className="flex items-center gap-3 mt-2 text-[11px] text-white/40">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formattedDate}
                                            </span>

                                            {draft.image && (
                                                <span className="flex items-center gap-1 text-white/60">
                                                    <ImageIcon className="w-3 h-3 text-[#FF6719]" />
                                                    Media
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                                        <button
                                            type="button"
                                            onClick={e => handleDelete(e, draft.id)}
                                            disabled={deletingId === draft.id}
                                            className="text-white/30 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                                            title="Delete draft"
                                        >
                                            {deletingId === draft.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                        <div className="text-white/30 group-hover:text-white p-1 transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </motion.div>
        </div>
    );
}
