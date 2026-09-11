'use client';

import { useMutation } from '@tanstack/react-query';
import { useState, useRef, useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft,
    Loader2,
    Settings2,
    Upload,
    Clock,
    Folder,
    Eye,
    X,
    History,
    Info,
    Mail,
    UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Editor } from '@tiptap/react';

import { TiptapEditor } from '@/components/tiptap/TiptapEditor';
import { TiptapToolbar } from '@/components/tiptap/TiptapToolbar';
import { createPostSchema, postSchema } from '@/lib/schemas';
import { CategorySelect } from '@/components/admin/CategorySelect';

// ─── Save Status Chip ─────────────────────────────────────────────────────────

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function StatusChip({ status }: { status: SaveStatus }) {
    if (status === 'idle') {
        return (
            <div className="flex items-center gap-1.5 select-none text-[12px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Saved</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1.5 select-none text-[12px]">
            {status === 'saving' && (
                <>
                    <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                    <span className="text-gray-400">Saving…</span>
                </>
            )}
            {status === 'saved' && (
                <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-gray-400">Saved</span>
                </>
            )}
            {status === 'error' && (
                <>
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-red-500 font-medium">Save error</span>
                </>
            )}
        </div>
    );
}

// ─── Settings Constants ───────────────────────────────────────────────────────

const CATEGORIES = [
    'Uncategorized',
    'Research',
    'Mentorship',
    'Bioinformatics',
    'Engineering',
    'AI & Health',
    'Community',
];

// ─── Edit Page Component ──────────────────────────────────────────────────────

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    // Editor instance state (drives toolbar and reactive content)
    const [editor, setEditor] = useState<Editor | null>(null);
    const contentRef = useRef<string>('');
    const [contentHtml, setContentHtml] = useState<string>('');

    // Document fields
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [authors, setAuthors] = useState<string[]>(['Benedict Afotey']);

    // Post settings
    const [readTime, setReadTime] = useState('3');
    const [category, setCategory] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [featuredFile, setFeaturedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // UI overlays and modals
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [statsOpen, setStatsOpen] = useState(false);
    const [emailSettingsOpen, setEmailSettingsOpen] = useState(false);
    const [addAuthorOpen, setAddAuthorOpen] = useState(false);
    const [newAuthorName, setNewAuthorName] = useState('');
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const titleRef = useRef<HTMLTextAreaElement>(null);

    // ── Fetch Post Data ──────────────────────────────────────────────────────

    useEffect(() => {
        let isMounted = true;

        async function fetchPost() {
            try {
                const response = await fetch(`/api/posts/${id}`);
                if (!response.ok) {
                    toast.error('Failed to load post');
                    router.push('/admin');
                    return;
                }
                const data = await response.json();
                if (!isMounted) return;

                setTitle(data.title || '');
                setExcerpt(data.excerpt || '');
                setContentHtml(data.content || '');
                contentRef.current = data.content || '';
                setCategory(data.category === 'Uncategorized' ? '' : (data.category || ''));
                setReadTime(data.readTime?.replace(/[^0-9]/g, '') || '3');
                setVisibility(data.published ? 'public' : 'private');
                if (data.image) {
                    setImagePreview(data.image);
                }

                // If editor is already instantiated, load the initial content
                if (editor && data.content) {
                    editor.commands.setContent(data.content);
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                toast.error('Error loading post data');
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchPost();

        return () => {
            isMounted = false;
        };
    }, [id, router, editor]);

    // ── Content Statistics ───────────────────────────────────────────────────

    const stats = useMemo(() => {
        const text = (title + ' ' + excerpt + ' ' + (editor?.getText() ?? '')).trim();
        const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
        const chars = text.length;
        const estMinutes = Math.max(1, Math.ceil(words / 200));
        return { words, chars, estMinutes };
    }, [title, excerpt, editor, contentHtml]);

    // Keep readTime synced if not manually edited
    useEffect(() => {
        if (stats.estMinutes > 0 && !loading) {
            setReadTime(String(stats.estMinutes));
        }
    }, [stats.estMinutes, loading]);

    // ── Mutation ─────────────────────────────────────────────────────────────

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await fetch(`/api/posts/${id}`, { method: 'PUT', body: formData });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update post');
            }
            return res.json();
        },
        onMutate: () => setSaveStatus('saving'),
        onSuccess: (_d, vars) => {
            setSaveStatus('saved');
            const isPublished = vars.get('published') === 'true';
            toast.success(isPublished ? 'Post updated & published!' : 'Draft updated successfully');
            router.push('/admin');
        },
        onError: (err: Error) => {
            setSaveStatus('error');
            toast.error(err.message || 'Failed to update post');
        },
    });

    // ── Save Handler ─────────────────────────────────────────────────────────

    const handleSave = (published: boolean) => {
        setErrors({});

        const effectivePublished = visibility === 'private' ? false : published;
        const content = editor?.getHTML() ?? contentRef.current ?? '';

        const data = {
            title,
            excerpt,
            content,
            readTime,
            category,
            image: featuredFile ?? imagePreview ?? undefined,
            published: effectivePublished,
        };

        const schema = effectivePublished ? createPostSchema : postSchema;
        const result = schema.safeParse(data);

        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                errs[issue.path[0] as string] = issue.message;
            });
            setErrors(errs);
            if (errs.image || errs.category) {
                setSettingsOpen(true);
            }
            toast.error('Please complete required fields');
            return;
        }

        const formData = new FormData();
        formData.set('title', title);
        formData.set('excerpt', excerpt);
        formData.set('content', content);
        formData.set('readTime', readTime);
        formData.set('category', category);
        formData.set('published', String(effectivePublished));
        if (featuredFile) {
            formData.set('image', featuredFile);
        }

        mutation.mutate(formData);
    };

    // ── Image Picker ─────────────────────────────────────────────────────────

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setFeaturedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // ── Title Auto-resize ────────────────────────────────────────────────────

    const resizeTextarea = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };

    // ── Author Management ────────────────────────────────────────────────────

    const openAddAuthor = () => {
        setNewAuthorName('');
        setAddAuthorOpen(true);
    };

    const handleAddAuthorSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = newAuthorName.trim();
        if (trimmed) {
            setAuthors(prev => [...prev, trimmed]);
            setNewAuthorName('');
            setAddAuthorOpen(false);
        }
    };

    const removeAuthor = (index: number) => {
        if (authors.length <= 1) {
            toast.info('Post must have at least one author');
            return;
        }
        setAuthors(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Loading draft…</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-[#FF6719]/20 selection:text-black">

            {/* ═══════════════════════════════════════════════════════════════
                TOP BAR — Global Header
            ════════════════════════════════════════════════════════════════ */}
            <header className="fixed top-0 inset-x-0 z-40 h-[50px] bg-white border-b border-gray-100 flex items-center px-4 sm:px-6 gap-3">
                {/* Left: Back chevron + Status */}
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        href="/admin"
                        className="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors flex-shrink-0"
                        title="Back to admin"
                        aria-label="Back to admin"
                    >
                        <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                    </Link>
                    <StatusChip status={saveStatus} />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right: Preview & Continue */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="flex items-center px-3.5 h-8 rounded-md border border-gray-200 text-[13px] font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all select-none cursor-pointer"
                    >
                        Preview
                    </button>

                    <button
                        type="button"
                        onClick={() => setSettingsOpen(true)}
                        disabled={mutation.isPending}
                        className="flex items-center gap-1.5 px-4 h-8 rounded-md bg-[#FF6719] hover:bg-[#e65a12] text-white text-[13px] font-semibold transition-all shadow-xs disabled:opacity-50 select-none cursor-pointer"
                    >
                        {mutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        ) : null}
                        Continue
                    </button>
                </div>
            </header>

            {/* ═══════════════════════════════════════════════════════════════
                FORMATTING TOOLBAR — Second Fixed Row
            ════════════════════════════════════════════════════════════════ */}
            <div className="fixed top-[50px] inset-x-0 z-30 bg-white border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="max-w-[860px] mx-auto">
                    <TiptapToolbar editor={editor} />
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                WRITING CANVAS
            ════════════════════════════════════════════════════════════════ */}
            <main
                className="flex-1 flex flex-col items-center"
                style={{ paddingTop: '94px' /* 50px header + 44px toolbar */ }}
            >
                <div className="w-full max-w-[720px] px-6 sm:px-10 py-12 pb-36">

                    {/* Email header / footer badge */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => setEmailSettingsOpen(true)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-800 transition-colors border border-gray-200/60 select-none cursor-pointer"
                        >
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>Email header / footer</span>
                        </button>
                    </div>

                    {/* ── Title ── */}
                    <textarea
                        ref={titleRef}
                        value={title}
                        onChange={e => {
                            setTitle(e.target.value);
                            resizeTextarea(e.target);
                        }}
                        onInput={e => resizeTextarea(e.currentTarget)}
                        placeholder="Title"
                        rows={1}
                        aria-label="Post title"
                        className={`w-full bg-transparent border-0 outline-none resize-none overflow-hidden mb-2 font-bold leading-[1.15] text-[40px] sm:text-[48px] text-gray-900 placeholder:text-gray-300 placeholder:font-bold min-h-[58px] ${
                            errors.title ? 'placeholder:text-red-300' : ''
                        }`}
                        style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)' }}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-xs mb-3 font-medium">{errors.title}</p>
                    )}

                    {/* ── Subtitle / Excerpt ── */}
                    <textarea
                        value={excerpt}
                        onChange={e => {
                            setExcerpt(e.target.value);
                            resizeTextarea(e.target);
                        }}
                        onInput={e => resizeTextarea(e.currentTarget)}
                        placeholder="Add a subtitle…"
                        rows={1}
                        aria-label="Post subtitle"
                        className="w-full bg-transparent border-0 outline-none resize-none text-[18px] sm:text-[20px] leading-relaxed text-gray-500 placeholder:text-gray-300 mb-6 min-h-[36px]"
                    />

                    {/* ── Author Chips ── */}
                    <div className="flex items-center gap-2 mb-8 flex-wrap">
                        {authors.map((author, index) => (
                            <div
                                key={index}
                                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-[#f2f2f2] text-[12px] font-medium text-gray-700 select-none"
                            >
                                <span>{author}</span>
                                <button
                                    type="button"
                                    onClick={() => removeAuthor(index)}
                                    className="w-3.5 h-3.5 rounded-full hover:bg-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                                    title="Remove author"
                                    aria-label={`Remove ${author}`}
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={openAddAuthor}
                            className="w-6 h-6 rounded-full border border-gray-300 text-gray-400 hover:text-gray-700 hover:border-gray-500 transition-colors flex items-center justify-center text-sm leading-none cursor-pointer"
                            title="Add contributor"
                            aria-label="Add contributor"
                        >
                            +
                        </button>
                    </div>

                    {/* ── Tiptap Body ── */}
                    <TiptapEditor
                        initialContent={contentHtml}
                        placeholder="Start writing…"
                        onReady={inst => {
                            setEditor(inst);
                            if (contentHtml) {
                                inst.commands.setContent(contentHtml);
                            }
                        }}
                        onUpdate={html => {
                            contentRef.current = html;
                            setContentHtml(html);
                        }}
                    />

                    {errors.content && (
                        <p className="text-red-500 text-xs mt-4 font-medium">{errors.content}</p>
                    )}
                </div>
            </main>

            {/* ═══════════════════════════════════════════════════════════════
                FLOATING BOTTOM CONTROLS
            ════════════════════════════════════════════════════════════════ */}

            {/* Bottom Left: History & Stats */}
            <div className="fixed bottom-5 left-14 sm:left-6 z-30 flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => toast.info('All revisions are saved automatically to your editing session.')}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:shadow transition-all cursor-pointer"
                    title="Version history"
                >
                    <History className="w-3.5 h-3.5" />
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setStatsOpen(o => !o)}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:shadow transition-all cursor-pointer"
                        title="Document info & statistics"
                    >
                        <Info className="w-3.5 h-3.5" />
                    </button>

                    {statsOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-52 p-3 bg-white border border-gray-200 rounded-xl shadow-lg text-xs space-y-1.5 z-50">
                            <p className="font-semibold text-gray-800 border-b border-gray-100 pb-1">Document Stats</p>
                            <div className="flex justify-between text-gray-600">
                                <span>Words:</span>
                                <span className="font-medium text-gray-900">{stats.words}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Characters:</span>
                                <span className="font-medium text-gray-900">{stats.chars}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Reading time:</span>
                                <span className="font-medium text-gray-900">{stats.estMinutes} min</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Right: Floating Settings Gear */}
            <div className="fixed bottom-5 right-5 z-30">
                <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-medium text-gray-600 hover:text-gray-900 hover:shadow transition-all cursor-pointer select-none"
                    title="Post settings"
                >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Settings</span>
                </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SETTINGS SLIDE-IN DRAWER
            ════════════════════════════════════════════════════════════════ */}

            {settingsOpen && (
                <div
                    className="fixed inset-0 bg-black/15 backdrop-blur-[1px] z-50 transition-opacity"
                    onClick={() => setSettingsOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                aria-label="Post settings"
                className={`fixed top-0 right-0 h-full w-84 sm:w-96 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    settingsOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Post Settings
                    </h2>
                    <button
                        type="button"
                        onClick={() => setSettingsOpen(false)}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Close settings"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

                    {/* Featured Image */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                            Cover Image
                        </label>
                        <div className={`relative border border-dashed rounded-xl min-h-[150px] flex flex-col items-center justify-center text-center transition-colors hover:bg-gray-50 overflow-hidden ${
                            errors.image ? 'border-red-400' : 'border-gray-200'
                        }`}>
                            {imagePreview ? (
                                <div className="w-full relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setImagePreview(null); setFeaturedFile(null); }}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="p-6 flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                        <Upload className="w-4 h-4 text-gray-400" strokeWidth={2} />
                                    </div>
                                    <p className="text-[12px] font-medium text-gray-700">Add a cover image</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 font-mono">PNG · JPG · WEBP · max 5 MB</p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        {errors.image && <p className="text-red-500 text-[11px]">{errors.image}</p>}
                    </div>

                    {/* Read time */}
                    <div className="space-y-2">
                        <label htmlFor="readTime" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>Reading Time</span>
                        </label>
                        <div className="relative">
                            <input
                                id="readTime"
                                type="text"
                                value={readTime}
                                onChange={e => setReadTime(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-gray-400 focus:bg-white transition-colors pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">min</span>
                        </div>
                    </div>

                    {/* Category */}
                    <CategorySelect
                        value={category}
                        onChange={val => {
                            setCategory(val);
                            if (errors.category) {
                                setErrors(prev => {
                                    const next = { ...prev };
                                    delete next.category;
                                    return next;
                                });
                            }
                        }}
                        error={errors.category}
                    />

                    {/* Visibility */}
                    <div className="space-y-2.5">
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                            <span>Visibility</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['public', 'private'] as const).map(v => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => setVisibility(v)}
                                    className={`py-2 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                        visibility === v
                                            ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Authors in drawer */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                                Authors & Contributors
                            </label>
                            <button
                                type="button"
                                onClick={openAddAuthor}
                                className="text-[11px] text-[#FF6719] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <UserPlus className="w-3 h-3" />
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {authors.map((a, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                                    {a}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer CTAs */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 space-y-2 bg-gray-50/50">
                    <button
                        type="button"
                        onClick={() => {
                            setSettingsOpen(false);
                            handleSave(true);
                        }}
                        disabled={mutation.isPending}
                        className="w-full py-2.5 rounded-lg bg-[#FF6719] hover:bg-[#e65a12] text-white text-[13px] font-semibold transition-all shadow-sm disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                        Update & publish now
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSettingsOpen(false);
                            handleSave(false);
                        }}
                        disabled={mutation.isPending}
                        className="w-full py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-[13px] font-semibold hover:bg-gray-50 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                        Save as draft
                    </button>
                </div>
            </aside>

            {/* ═══════════════════════════════════════════════════════════════
                PREVIEW MODAL (Reader Experience)
            ════════════════════════════════════════════════════════════════ */}
            {previewOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Preview Top Header */}
                        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 flex-shrink-0 bg-gray-50/70">
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                Reader Preview
                            </span>
                            <button
                                type="button"
                                onClick={() => setPreviewOpen(false)}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Preview Content */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-12">
                            {/* Featured Image */}
                            {imagePreview && (
                                <div className="mb-8 rounded-xl overflow-hidden border border-gray-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={imagePreview} alt="Cover" className="w-full max-h-96 object-cover" />
                                </div>
                            )}

                            {/* Title */}
                            <h1
                                className="text-3xl sm:text-4xl font-bold text-gray-900 leading-[1.18] mb-3"
                                style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)' }}
                            >
                                {title || 'Untitled Post'}
                            </h1>

                            {/* Subtitle */}
                            {excerpt && (
                                <p className="text-lg text-gray-500 leading-relaxed mb-6 font-normal">
                                    {excerpt}
                                </p>
                            )}

                            {/* Author & Meta */}
                            <div className="flex items-center gap-3 py-4 border-y border-gray-100 mb-8 text-xs text-gray-500">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF6719] font-bold flex items-center justify-center">
                                    {authors[0]?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{authors.join(', ')}</p>
                                    <p className="text-gray-400">{readTime} min read · Today</p>
                                </div>
                            </div>

                            {/* Rendered HTML */}
                            <div
                                className="tiptap-editor-root prose prose-neutral max-w-none"
                                dangerouslySetInnerHTML={{ __html: editor?.getHTML() || contentRef.current || '<p class="text-gray-400 italic">No content written yet.</p>' }}
                            />
                        </div>

                        {/* Preview Footer */}
                        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                            <span className="text-xs text-gray-400">Draft preview mode</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewOpen(false);
                                    setSettingsOpen(true);
                                }}
                                className="px-4 py-1.5 rounded-md bg-[#FF6719] text-white text-xs font-semibold hover:bg-[#e65a12] transition-colors cursor-pointer"
                            >
                                Continue to Publish →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                EMAIL HEADER / FOOTER MODAL
            ════════════════════════════════════════════════════════════════ */}
            {emailSettingsOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#FF6719]" />
                                Email Header & Footer
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEmailSettingsOpen(false)}
                                className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Substack newsletters include your publication's standard email header (logo and publication name) and footer (unsubscribe link and author profile).
                        </p>
                        <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1 text-gray-600">
                            <p className="font-medium text-gray-800">Newsletter Delivery:</p>
                            <p>• Header banner: John David Ledger</p>
                            <p>• Author signature: {authors.join(', ')}</p>
                            <p>• Reply-to: Enabled for active subscribers</p>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setEmailSettingsOpen(false)}
                                className="px-4 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                ADD CONTRIBUTOR MODAL
            ════════════════════════════════════════════════════════════════ */}
            {addAuthorOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setAddAuthorOpen(false);
                    }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6719]">
                                    <UserPlus className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900 leading-none">
                                        Add Contributor
                                    </h3>
                                    <span className="text-[11px] text-gray-400">Co-author or researcher</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAddAuthorOpen(false)}
                                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Enter the contributor's name to display their byline on this article.
                        </p>

                        <form onSubmit={handleAddAuthorSubmit} className="space-y-4">
                            <input
                                type="text"
                                autoFocus
                                value={newAuthorName}
                                onChange={(e) => setNewAuthorName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') setAddAuthorOpen(false);
                                }}
                                placeholder="e.g. Dr. Jane Doe"
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-gray-400 focus:bg-white transition-all placeholder:text-gray-400"
                            />

                            <div className="flex justify-end items-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setAddAuthorOpen(false)}
                                    className="px-3.5 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newAuthorName.trim()}
                                    className="px-4 py-2 rounded-lg bg-[#FF6719] hover:bg-[#e65a12] text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                                >
                                    Add Contributor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
