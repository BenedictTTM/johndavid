'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Edit, Trash2, Plus, Loader2, BookOpen, LogOut, ChevronDown,
    FileText, MessageSquareQuote, Mail, MailOpen, Circle, CheckCircle2,
    Inbox,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Post {
    id: string;
    title: string;
    date: string;
    image?: string;
    excerpt?: string;
    published: boolean;
}

interface Message {
    id: string;
    createdAt: string;
    sender: string | null;
    body: string;
    read: boolean;
}

type Tab = 'posts' | 'messages';

export default function AdminPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState<Tab>('posts');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const createMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
                setIsCreateOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ── Posts ──────────────────────────────────────────────────────────────
    const { data: posts = [], isLoading: postsLoading, isError: postsError, error: postsErrorObj } = useQuery<Post[]>({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await fetch('/api/posts');
            if (!response.ok) throw new Error('Failed to fetch posts');
            return response.json();
        },
    });

    const deletePostMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete post');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Post deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete post');
        },
    });

    const handleDelete = (id: string) => {
        toast('Confirm Deletion', {
            description: 'Are you sure you want to delete this post?',
            action: { label: 'Delete', onClick: () => deletePostMutation.mutate(id) },
            cancel: { label: 'Cancel', onClick: () => {} },
            duration: 8000,
        });
    };

    // ── Messages ───────────────────────────────────────────────────────────
    const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
        queryKey: ['messages'],
        queryFn: async () => {
            const response = await fetch('/api/messages');
            if (!response.ok) throw new Error('Failed to fetch messages');
            return response.json();
        },
        staleTime: 60_000,
    });

    const unreadCount = messages.filter((m) => !m.read).length;
    const badgeCount = unreadCount;


    const toggleReadMutation = useMutation({
        mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
            const response = await fetch(`/api/messages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read }),
            });
            if (!response.ok) throw new Error('Failed to update message');
            return response.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
        onError: (error: any) => toast.error(error.message || 'Failed to update message'),
    });

    const deleteMessageMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete message');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            toast.success('Message deleted');
        },
        onError: (error: any) => toast.error(error.message || 'Failed to delete message'),
    });

    const handleDeleteMessage = (id: string) => {
        toast('Delete Message?', {
            description: 'This action cannot be undone.',
            action: { label: 'Delete', onClick: () => deleteMessageMutation.mutate(id) },
            cancel: { label: 'Cancel', onClick: () => {} },
            duration: 8000,
        });
    };

    // ── Loading / Error states ─────────────────────────────────────────────
    if (postsLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBD4] font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="animate-spin h-10 w-10 text-[#713600]" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#38240D]/70 font-bold select-none">
                        Loading Ledger Data
                    </span>
                </motion.div>
            </div>
        );
    }

    if (postsError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBD4] font-sans px-4 text-center">
                <div className="border border-red-300 bg-[#FAF7C8] rounded-xl p-8 max-w-md shadow-sm">
                    <p className="text-red-700 font-serif italic text-lg mb-2">System Interruption</p>
                    <p className="text-xs text-[#38240D]/70 tracking-wide mb-6">{(postsErrorObj as Error).message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-md text-xs uppercase tracking-wider font-bold hover:bg-red-100 transition-all cursor-pointer"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBD4] text-[#38240D] font-sans relative overflow-hidden pb-16">

            {/* Fine grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(113,54,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,54,0,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none -z-10" />
            <div className="absolute top-0 left-[8%] right-[8%] h-[1px] bg-gradient-to-r from-transparent via-[#713600]/15 to-transparent pointer-events-none" />

            {/* Header Branding */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-20 pt-8 flex justify-between items-center text-[9px] text-[#38240D]/60 tracking-[0.3em] uppercase select-none pointer-events-none font-mono">
                <span>03 // SYSTEM_ADMIN</span>
                <span>SYS_VER: 2026.05</span>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-20 mt-8">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6 border-b border-[#713600]/15 pb-8"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2.5">
                            <div className="w-5 h-[2px] bg-[#713600]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#713600]">John David Ledger</span>
                        </div>
                        <h1 className="font-display font-extrabold uppercase leading-none tracking-tight select-none text-4xl sm:text-5xl lg:text-6xl text-[#38240D]">
                            Admin <span className="font-serif italic font-normal tracking-wide text-[#713600]">Dashboard</span>
                        </h1>
                    </div>

                    <div className="relative w-full lg:w-auto" ref={createMenuRef}>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setIsCreateOpen(!isCreateOpen)}
                            className="
                                relative group px-6 py-3.5 rounded-lg overflow-hidden
                                bg-[#713600] text-[#FDFBD4] text-[11px] uppercase tracking-[0.2em] font-bold
                                transition-all duration-300 flex items-center justify-center gap-2.5
                                cursor-pointer w-full lg:w-auto shadow-sm hover:bg-[#C05800]
                            "
                        >
                            <Plus size={15} className="text-[#FDFBD4]" />
                            <span>Create New Post</span>
                            <ChevronDown
                                size={14}
                                className={`text-[#FDFBD4] transition-transform duration-200 ${isCreateOpen ? 'rotate-180' : ''}`}
                            />
                        </motion.button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isCreateOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-72 bg-[#FAF7C8] border-2 border-[#713600]/25 rounded-xl shadow-[0_12px_36px_rgba(56,36,13,0.18)] p-2 z-50 overflow-hidden"
                                >
                                    <Link
                                        href="/admin/article"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#713600]/10 transition-colors group cursor-pointer"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-[#713600]/10 text-[#713600] flex items-center justify-center shrink-0 group-hover:bg-[#713600] group-hover:text-[#FDFBD4] transition-colors">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-[#38240D] group-hover:text-[#713600]">Article</div>
                                            <div className="text-[11px] text-[#38240D]/60 leading-snug mt-0.5 font-normal normal-case">
                                                Long-form editorial publication with rich editor &amp; imagery
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="h-[1px] bg-[#713600]/10 my-1" />

                                    <Link
                                        href="/admin/note"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#FF6719]/10 transition-colors group cursor-pointer"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-[#FF6719]/15 text-[#FF6719] flex items-center justify-center shrink-0 group-hover:bg-[#FF6719] group-hover:text-white transition-colors">
                                            <MessageSquareQuote className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-[#38240D] group-hover:text-[#FF6719]">Note</div>
                                            <div className="text-[11px] text-[#38240D]/60 leading-snug mt-0.5 font-normal normal-case">
                                                Quick short-form thought or update for your feed
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* ── Tab Navigation ──────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="flex items-center gap-1 mb-8 border-b border-[#713600]/12"
                >
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center gap-2 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] border-b-2 transition-all duration-200 cursor-pointer -mb-px ${
                            activeTab === 'posts'
                                ? 'border-[#713600] text-[#713600]'
                                : 'border-transparent text-[#38240D]/50 hover:text-[#38240D]/80'
                        }`}
                    >
                        <FileText className="w-3.5 h-3.5" />
                        Posts
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold ${
                            activeTab === 'posts' ? 'bg-[#713600] text-[#FDFBD4]' : 'bg-[#38240D]/10 text-[#38240D]/60'
                        }`}>
                            {posts.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`flex items-center gap-2 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] border-b-2 transition-all duration-200 cursor-pointer -mb-px ${
                            activeTab === 'messages'
                                ? 'border-[#713600] text-[#713600]'
                                : 'border-transparent text-[#38240D]/50 hover:text-[#38240D]/80'
                        }`}
                    >
                        <Inbox className="w-3.5 h-3.5" />
                        Messages
                        {badgeCount > 0 && (
                            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[9px] font-bold bg-[#FF6719] text-white animate-pulse">
                                {badgeCount}
                            </span>
                        )}
                    </button>
                </motion.div>

                {/* ── Posts Tab ───────────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {activeTab === 'posts' && (
                        <motion.div
                            key="posts"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Desktop View */}
                            <div className="hidden md:block bg-[#FAF7C8] rounded-xl shadow-[0_4px_20px_rgba(56,36,13,0.05)] overflow-hidden border border-[#713600]/15 relative group">
                                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#713600]" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#713600]" />
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#713600]" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#713600]" />

                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#713600]/15 bg-[#FDFBD4]/60">
                                            <th className="p-6 pb-4 text-[10px] font-bold text-[#713600] uppercase tracking-[0.25em] w-32">Resource</th>
                                            <th className="p-6 pb-4 text-[10px] font-bold text-[#713600] uppercase tracking-[0.25em]">Meta Details</th>
                                            <th className="p-6 pb-4 text-[10px] font-bold text-[#713600] uppercase tracking-[0.25em] w-36">Status</th>
                                            <th className="p-6 pb-4 text-[10px] font-bold text-[#713600] uppercase tracking-[0.25em] w-40">Date Released</th>
                                            <th className="p-6 pb-4 text-[10px] font-bold text-[#713600] uppercase tracking-[0.25em] text-right pr-10 w-44">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#713600]/10">
                                        {posts.map((post) => (
                                            <tr key={post.id} className="hover:bg-[#713600]/[0.03] transition-colors group/row">
                                                <td className="p-5 pl-6">
                                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#713600]/15 bg-[#FDFBD4] shadow-xs">
                                                        {post.image ? (
                                                            <Image
                                                                src={post.image}
                                                                alt={post.title}
                                                                fill
                                                                className="object-cover transition-transform duration-700 group-hover/row:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center text-[#38240D]/50 bg-[#FDFBD4]">
                                                                <BookOpen size={16} className="text-[#713600]/50 mb-1" />
                                                                <span className="text-[7px] uppercase tracking-widest font-bold font-mono">No Img</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <h3 className="font-serif text-[16px] text-[#38240D] font-semibold leading-snug group-hover/row:text-[#C05800] transition-colors duration-300 line-clamp-1">
                                                        {post.title}
                                                    </h3>
                                                    {post.excerpt ? (
                                                        <p className="text-[11px] text-[#38240D]/70 line-clamp-1 mt-1 font-sans font-normal">{post.excerpt}</p>
                                                    ) : (
                                                        <p className="text-[11px] text-[#38240D]/40 italic line-clamp-1 mt-1 font-sans font-light">No description provided.</p>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                        post.published
                                                            ? 'bg-[#2D6A4F]/15 text-[#2D6A4F] border border-[#2D6A4F]/30'
                                                            : 'bg-[#38240D]/10 text-[#38240D]/70 border border-[#38240D]/20'
                                                    }`}>
                                                        {post.published ? 'Published' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-[12px] text-[#38240D]/80 font-medium tracking-wide">
                                                    {new Date(post.date).toLocaleDateString('en-GB', {
                                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="p-5 pr-10 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={`/admin/edit/${post.id}`}
                                                            className="p-2 border border-[#713600]/20 hover:border-[#713600] text-[#713600] hover:bg-[#713600] hover:text-[#FDFBD4] rounded-md transition-all duration-300"
                                                            title="Edit Resource"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            className="p-2 border border-red-200 text-red-700 hover:bg-red-700 hover:text-[#FDFBD4] hover:border-transparent rounded-md transition-all duration-300 cursor-pointer"
                                                            disabled={deletePostMutation.isPending}
                                                            title="Delete Resource"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4">
                                {posts.map((post) => (
                                    <div key={post.id} className="bg-[#FAF7C8] rounded-xl shadow-xs border border-[#713600]/15 p-5 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#713600]" />
                                        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#713600]" />

                                        <div className="flex gap-4 items-start mb-4">
                                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-[#713600]/15 bg-[#FDFBD4]">
                                                {post.image ? (
                                                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#38240D]/50">
                                                        <BookOpen size={14} className="text-[#713600]/40" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                                                        post.published
                                                            ? 'bg-[#2D6A4F]/15 text-[#2D6A4F] border border-[#2D6A4F]/30'
                                                            : 'bg-[#38240D]/10 text-[#38240D]/70 border border-[#38240D]/20'
                                                    }`}>
                                                        {post.published ? 'Published' : 'Draft'}
                                                    </span>
                                                    <span className="text-[10px] text-[#38240D]/60 font-medium font-mono">
                                                        {new Date(post.date).toLocaleDateString('en-GB', {
                                                            day: '2-digit', month: '2-digit', year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <h3 className="font-serif text-base text-[#38240D] font-semibold leading-tight line-clamp-2">{post.title}</h3>
                                            </div>
                                        </div>

                                        {post.excerpt && (
                                            <p className="text-xs text-[#38240D]/75 leading-relaxed line-clamp-2 font-sans font-normal mb-4">{post.excerpt}</p>
                                        )}

                                        <div className="flex items-center justify-between border-t border-[#713600]/12 pt-3 mt-1">
                                            <Link
                                                href={`/admin/edit/${post.id}`}
                                                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713600] py-1.5 px-3 border border-[#713600]/25 rounded-md hover:bg-[#713600] hover:text-[#FDFBD4] transition-colors"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700 py-1.5 px-3 border border-red-200 rounded-md hover:bg-red-700 hover:text-[#FDFBD4] transition-colors"
                                                disabled={deletePostMutation.isPending}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {posts.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-24 text-center bg-[#FAF7C8] rounded-xl border border-[#713600]/15 relative"
                                >
                                    <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#713600]" />
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#713600]" />
                                    <p className="text-[#38240D]/70 text-lg font-serif italic mb-4">No editorial stories compiled yet.</p>
                                    <div className="flex items-center justify-center gap-4 flex-wrap">
                                        <Link href="/admin/article" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#713600] hover:text-[#C05800] border-b border-[#713600]/30 transition-all pb-1 cursor-pointer">
                                            <FileText className="w-3.5 h-3.5" />
                                            Compose Article
                                        </Link>
                                        <span className="text-[#38240D]/30">•</span>
                                        <Link href="/admin/note" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF6719] hover:text-[#e0540d] border-b border-[#FF6719]/30 transition-all pb-1 cursor-pointer">
                                            <MessageSquareQuote className="w-3.5 h-3.5" />
                                            Compose Note
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ── Messages Tab ─────────────────────────────────────────── */}
                    {activeTab === 'messages' && (
                        <motion.div
                            key="messages"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {messagesLoading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="animate-spin h-8 w-8 text-[#713600]" />
                                </div>
                            ) : messages.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-24 text-center bg-[#FAF7C8] rounded-xl border border-[#713600]/15 relative"
                                >
                                    <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#713600]" />
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#713600]" />
                                    <Inbox className="w-10 h-10 text-[#713600]/30 mx-auto mb-3" />
                                    <p className="text-[#38240D]/70 text-lg font-serif italic">No messages received yet.</p>
                                    <p className="text-[11px] text-[#38240D]/50 mt-2">Messages from the contact form will appear here.</p>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Summary bar */}
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <p className="text-[11px] text-[#38240D]/60 font-mono">
                                            {messages.length} total · <span className="text-[#FF6719] font-bold">{unreadCount} unread</span>
                                        </p>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={() => {
                                                    messages.filter(m => !m.read).forEach(m =>
                                                        toggleReadMutation.mutate({ id: m.id, read: true })
                                                    );
                                                }}
                                                className="text-[10px] font-bold uppercase tracking-wider text-[#713600] hover:text-[#C05800] transition-colors cursor-pointer"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    {/* Desktop Table */}
                                    <div className="hidden md:block bg-[#FAF7C8] rounded-xl shadow-[0_4px_20px_rgba(56,36,13,0.05)] overflow-hidden border border-[#713600]/15 relative">
                                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#713600]" />
                                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#713600]" />
                                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#713600]" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#713600]" />

                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#713600]/15 bg-[#FDFBD4]/60">
                                                    <th className="p-5 pl-6 text-[10px] font-bold text-[#713600] uppercase tracking-[0.25em] w-8"></th>
                                                    <th className="p-5 text-[10px] font-bold text-[#713600] uppercase tracking-[0.25em] w-52">Sender</th>
                                                    <th className="p-5 text-[10px] font-bold text-[#713600] uppercase tracking-[0.25em]">Message</th>
                                                    <th className="p-5 text-[10px] font-bold text-[#713600] uppercase tracking-[0.25em] w-40">Received</th>
                                                    <th className="p-5 text-[10px] font-bold text-[#713600] uppercase tracking-[0.25em] text-right pr-8 w-36">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#713600]/10">
                                                {messages.map((msg) => (
                                                    <tr key={msg.id} className={`hover:bg-[#713600]/[0.03] transition-colors group/row ${!msg.read ? 'bg-[#FF6719]/[0.04]' : ''}`}>
                                                        <td className="p-5 pl-6">
                                                            {!msg.read ? (
                                                                <Circle className="w-2 h-2 fill-[#FF6719] text-[#FF6719]" />
                                                            ) : (
                                                                <Circle className="w-2 h-2 text-[#38240D]/20" />
                                                            )}
                                                        </td>
                                                        <td className="p-5">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-7 h-7 rounded-full bg-[#713600]/10 text-[#713600] flex items-center justify-center shrink-0 text-[10px] font-bold font-mono uppercase">
                                                                    {msg.sender ? msg.sender[0] : '?'}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-[13px] font-semibold leading-tight ${!msg.read ? 'text-[#38240D]' : 'text-[#38240D]/70'}`}>
                                                                        {msg.sender || <span className="italic font-normal text-[#38240D]/40 text-[11px]">Anonymous</span>}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-5">
                                                            <p className={`text-[13px] leading-relaxed line-clamp-2 ${!msg.read ? 'text-[#38240D] font-medium' : 'text-[#38240D]/65 font-normal'}`}>
                                                                {msg.body}
                                                            </p>
                                                        </td>
                                                        <td className="p-5 text-[11px] text-[#38240D]/60 font-mono">
                                                            {new Date(msg.createdAt).toLocaleDateString('en-GB', {
                                                                day: '2-digit', month: '2-digit', year: 'numeric'
                                                            })}
                                                            <div className="text-[10px] text-[#38240D]/40 mt-0.5">
                                                                {new Date(msg.createdAt).toLocaleTimeString('en-GB', {
                                                                    hour: '2-digit', minute: '2-digit'
                                                                })}
                                                            </div>
                                                        </td>
                                                        <td className="p-5 pr-8 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => toggleReadMutation.mutate({ id: msg.id, read: !msg.read })}
                                                                    className="p-2 border border-[#713600]/20 hover:border-[#713600] text-[#713600] hover:bg-[#713600] hover:text-[#FDFBD4] rounded-md transition-all duration-300 cursor-pointer"
                                                                    title={msg.read ? 'Mark as unread' : 'Mark as read'}
                                                                >
                                                                    {msg.read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                                    className="p-2 border border-red-200 text-red-700 hover:bg-red-700 hover:text-[#FDFBD4] hover:border-transparent rounded-md transition-all duration-300 cursor-pointer"
                                                                    disabled={deleteMessageMutation.isPending}
                                                                    title="Delete Message"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden space-y-3">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`bg-[#FAF7C8] rounded-xl border p-5 relative overflow-hidden ${!msg.read ? 'border-[#FF6719]/30 bg-[#FF6719]/[0.03]' : 'border-[#713600]/15'}`}
                                            >
                                                {!msg.read && (
                                                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FF6719]" />
                                                )}
                                                <div className="flex items-center gap-2.5 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#713600]/10 text-[#713600] flex items-center justify-center shrink-0 text-[11px] font-bold font-mono uppercase">
                                                        {msg.sender ? msg.sender[0] : '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-[#38240D]">
                                                            {msg.sender || <span className="italic font-normal text-[#38240D]/50">Anonymous</span>}
                                                        </p>
                                                        <p className="text-[10px] text-[#38240D]/50 font-mono">
                                                            {new Date(msg.createdAt).toLocaleDateString('en-GB', {
                                                                day: '2-digit', month: '2-digit', year: 'numeric'
                                                            })} · {new Date(msg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-[13px] text-[#38240D]/80 leading-relaxed mb-4 font-serif">
                                                    {msg.body}
                                                </p>
                                                <div className="flex items-center justify-between border-t border-[#713600]/10 pt-3">
                                                    <button
                                                        onClick={() => toggleReadMutation.mutate({ id: msg.id, read: !msg.read })}
                                                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#713600] py-1.5 px-3 border border-[#713600]/25 rounded-md hover:bg-[#713600] hover:text-[#FDFBD4] transition-colors cursor-pointer"
                                                    >
                                                        {msg.read ? <Mail className="w-3 h-3" /> : <MailOpen className="w-3 h-3" />}
                                                        {msg.read ? 'Mark Unread' : 'Mark Read'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-700 py-1.5 px-3 border border-red-200 rounded-md hover:bg-red-700 hover:text-[#FDFBD4] transition-colors cursor-pointer"
                                                        disabled={deleteMessageMutation.isPending}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* System Logout Button */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => {
                            localStorage.removeItem('admin_token');
                            router.push('/admin/auth');
                        }}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#38240D]/70 hover:text-red-700 transition-colors border border-[#713600]/20 hover:border-red-300 px-6 py-3 rounded-lg shadow-xs bg-[#FAF7C8] cursor-pointer"
                    >
                        <LogOut size={14} />
                        System Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

