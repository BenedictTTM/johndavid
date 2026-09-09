'use client';

import { type Editor } from '@tiptap/react';
import {
    Link2,
    Image as ImageIcon,
    Headphones,
    Video,
    MessageSquareQuote,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Highlighter,
    Undo2,
    Redo2,
    ChevronDown,
    Minus,
    Code2,
    RemoveFormatting,
    Info,
    Upload,
    Check,
    Trash2,
    X,
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
    return <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" aria-hidden="true" />;
}

// ─── Focus-preserving tool button ─────────────────────────────────────────────

function ToolBtn({
    active = false,
    disabled = false,
    onClick,
    title,
    children,
    className = '',
}: {
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                if (!disabled) onClick();
            }}
            disabled={disabled}
            title={title}
            aria-label={title}
            aria-pressed={active}
            className={[
                'flex items-center justify-center h-7 px-1.5 min-w-[28px] rounded-md text-[13px] transition-colors flex-shrink-0 select-none',
                active
                    ? 'bg-gray-200/90 text-gray-900 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
                className,
            ].join(' ')}
        >
            {children}
        </button>
    );
}

// ─── Style dropdown ───────────────────────────────────────────────────────────

const STYLE_OPTIONS = [
    { label: 'Paragraph', action: (e: Editor) => e.chain().focus().setParagraph().run(), isActive: (e: Editor) => e.isActive('paragraph') && !e.isActive('heading') },
    { label: 'Heading 1', action: (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run(), isActive: (e: Editor) => e.isActive('heading', { level: 1 }) },
    { label: 'Heading 2', action: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (e: Editor) => e.isActive('heading', { level: 2 }) },
    { label: 'Heading 3', action: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run(), isActive: (e: Editor) => e.isActive('heading', { level: 3 }) },
    { label: 'Quote', action: (e: Editor) => e.chain().focus().toggleBlockquote().run(), isActive: (e: Editor) => e.isActive('blockquote') },
    { label: 'Code block', action: (e: Editor) => e.chain().focus().toggleCodeBlock().run(), isActive: (e: Editor) => e.isActive('codeBlock') },
];

function StyleDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const activeOption = STYLE_OPTIONS.find(o => o.isActive(editor));
    const currentLabel = activeOption?.label ?? 'Style';

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                className={`flex items-center gap-1 h-7 px-2 rounded-md text-[13px] font-medium transition-colors select-none ${
                    open ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-expanded={open}
            >
                <span>{currentLabel}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden z-50 py-1">
                    {STYLE_OPTIONS.map(opt => {
                        const active = opt.isActive(editor);
                        return (
                            <button
                                key={opt.label}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    opt.action(editor);
                                    setOpen(false);
                                }}
                                className={`w-full text-left px-3 py-1.5 text-[13px] transition-colors flex items-center justify-between ${
                                    active ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span>{opt.label}</span>
                                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6719]" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Text Color Picker ────────────────────────────────────────────────────────

const COLOR_PALETTE = [
    { label: 'Default', value: 'inherit', color: '#1a1a1a' },
    { label: 'Substack Orange', value: '#FF6719', color: '#FF6719' },
    { label: 'Crimson Red', value: '#DC2626', color: '#DC2626' },
    { label: 'Forest Green', value: '#059669', color: '#059669' },
    { label: 'Royal Blue', value: '#2563EB', color: '#2563EB' },
    { label: 'Deep Purple', value: '#7C3AED', color: '#7C3AED' },
    { label: 'Slate Gray', value: '#6B7280', color: '#6B7280' },
];

function TextColorPicker({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                title="Text color"
                aria-label="Text color"
                className={`flex flex-col items-center justify-center w-7 h-7 rounded-md transition-colors ${
                    open ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
                <span className="font-serif font-bold text-[13px] leading-none">T</span>
                <span className="w-3.5 h-[3px] bg-red-600 rounded-full mt-[2px]" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50 flex items-center gap-1.5">
                    {COLOR_PALETTE.map(c => (
                        <button
                            key={c.value}
                            type="button"
                            title={c.label}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                if (c.value === 'inherit') {
                                    editor.chain().focus().unsetColor().run();
                                } else {
                                    editor.chain().focus().setColor(c.value).run();
                                }
                                setOpen(false);
                            }}
                            className="w-5 h-5 rounded-full border border-black/10 transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
                            style={{ backgroundColor: c.color }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Font Family Dropdown ─────────────────────────────────────────────────────

const FONT_OPTIONS = [
    { label: 'Default (Sans)', value: 'var(--font-inter, sans-serif)' },
    { label: 'Serif (Editorial)', value: 'var(--font-cormorant, Georgia, serif)' },
    { label: 'Monospace', value: 'Menlo, Consolas, monospace' },
];

function FontFamilyDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                className={`flex items-center gap-0.5 h-7 px-1.5 rounded-md text-[13px] font-medium transition-colors ${
                    open ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Font family"
            >
                <span className="font-serif italic font-bold">A</span>
                <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden z-50 py-1">
                    {FONT_OPTIONS.map(font => (
                        <button
                            key={font.label}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                editor.chain().focus().setFontFamily(font.value).run();
                                setOpen(false);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                            style={{ fontFamily: font.value }}
                        >
                            {font.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Inline Link Popover ──────────────────────────────────────────────────────

function LinkPopover({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isLinkActive = editor.isActive('link');

    useEffect(() => {
        if (!open) return;
        const currentHref = editor.getAttributes('link').href ?? '';
        setUrl(currentHref);
        setTimeout(() => inputRef.current?.focus(), 50);

        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, editor]);

    const handleApply = () => {
        if (!url || url.trim() === '') {
            editor.chain().focus().unsetLink().run();
        } else {
            const formatted = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')
                ? url.trim()
                : `https://${url.trim()}`;
            editor.chain().focus().extendMarkRange('link').setLink({ href: formatted, target: '_blank' }).run();
        }
        setOpen(false);
    };

    const handleRemove = () => {
        editor.chain().focus().unsetLink().run();
        setOpen(false);
    };

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                className={`flex items-center justify-center h-7 px-1.5 min-w-[28px] rounded-md text-[13px] transition-colors select-none ${
                    isLinkActive || open
                        ? 'bg-gray-200/90 text-gray-900 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Add link (Ctrl+K)"
            >
                <Link2 className="w-3.5 h-3.5" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.15)] z-50 p-3 space-y-2">
                    <p className="text-[11px] font-semibold text-gray-700">Add or edit link</p>
                    <div className="flex gap-1.5">
                        <input
                            ref={inputRef}
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleApply();
                                } else if (e.key === 'Escape') {
                                    setOpen(false);
                                }
                            }}
                            placeholder="https://example.com"
                            className="flex-1 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-gray-400 text-gray-800"
                        />
                        <button
                            type="button"
                            onClick={handleApply}
                            className="px-3 py-1.5 bg-[#FF6719] hover:bg-[#e65a12] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                            Apply
                        </button>
                    </div>
                    {isLinkActive && (
                        <div className="pt-1 flex justify-end">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="text-[11px] text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <Trash2 className="w-3 h-3" />
                                Remove link
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Inline Image Popover ─────────────────────────────────────────────────────

function ImagePopover({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        setUrl('');
        setTimeout(() => inputRef.current?.focus(), 50);

        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleApplyUrl = () => {
        if (url.trim()) {
            editor.chain().focus().setImage({ src: url.trim() }).run();
            setOpen(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                editor.chain().focus().setImage({ src: reader.result }).run();
                setOpen(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                className={`flex items-center justify-center h-7 px-1.5 min-w-[28px] rounded-md text-[13px] transition-colors select-none ${
                    open
                        ? 'bg-gray-200/90 text-gray-900 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Insert image"
            >
                <ImageIcon className="w-3.5 h-3.5" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.15)] z-50 p-3.5 space-y-3">
                    <p className="text-[11px] font-semibold text-gray-700">Insert Image</p>
                    <div className="flex gap-1.5">
                        <input
                            ref={inputRef}
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleApplyUrl();
                                }
                            }}
                            placeholder="Paste image URL…"
                            className="flex-1 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-gray-400 text-gray-800"
                        />
                        <button
                            type="button"
                            onClick={handleApplyUrl}
                            className="px-3 py-1.5 bg-[#FF6719] hover:bg-[#e65a12] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                            Insert
                        </button>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <div className="w-full border-t border-gray-100" />
                        <span className="absolute px-2 bg-white text-[10px] uppercase tracking-wider text-gray-400 font-medium">or</span>
                    </div>
                    <label className="flex items-center justify-center gap-1.5 w-full py-2 px-3 border border-dashed border-gray-300 hover:border-gray-400 bg-gray-50/60 hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-gray-500" />
                        <span>Upload from computer</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>
            )}
        </div>
    );
}

// ─── Inline Audio / Podcast Popover ───────────────────────────────────────────

function AudioPopover({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        setUrl('');
        setTimeout(() => inputRef.current?.focus(), 50);

        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleApply = () => {
        if (url.trim()) {
            editor.chain().focus().insertContent(`
<p style="margin: 1.75rem 0; padding: 1.25rem; background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
    <span style="font-size: 24px;">🎧</span>
    <span>
        <strong style="display: block; font-size: 14px; color: #111;">Audio & Podcast Episode</strong>
        <a href="${url.trim()}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: #FF6719; text-decoration: underline;">Listen to audio (${url.trim()}) →</a>
    </span>
</p>
<p></p>
`).run();
            setOpen(false);
        }
    };

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                className={`flex items-center justify-center h-7 px-1.5 min-w-[28px] rounded-md text-[13px] transition-colors select-none ${
                    open
                        ? 'bg-gray-200/90 text-gray-900 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Insert audio or podcast"
            >
                <Headphones className="w-3.5 h-3.5" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.15)] z-50 p-3.5 space-y-2">
                    <p className="text-[11px] font-semibold text-gray-700">Insert Audio / Podcast Link</p>
                    <div className="flex gap-1.5">
                        <input
                            ref={inputRef}
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleApply();
                                }
                            }}
                            placeholder="Spotify, Apple Music, or MP3 URL"
                            className="flex-1 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-gray-400 text-gray-800"
                        />
                        <button
                            type="button"
                            onClick={handleApply}
                            className="px-3 py-1.5 bg-[#FF6719] hover:bg-[#e65a12] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                            Insert
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Inline Video Popover ─────────────────────────────────────────────────────

function VideoPopover({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        setUrl('');
        setTimeout(() => inputRef.current?.focus(), 50);

        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleApply = () => {
        if (url.trim()) {
            editor.chain().focus().insertContent(`
<p style="margin: 1.75rem 0; padding: 1.25rem; background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
    <span style="font-size: 24px;">📹</span>
    <span>
        <strong style="display: block; font-size: 14px; color: #111;">Video Feature</strong>
        <a href="${url.trim()}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: #FF6719; text-decoration: underline;">Watch video (${url.trim()}) →</a>
    </span>
</p>
<p></p>
`).run();
            setOpen(false);
        }
    };

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                className={`flex items-center justify-center h-7 px-1.5 min-w-[28px] rounded-md text-[13px] transition-colors select-none ${
                    open
                        ? 'bg-gray-200/90 text-gray-900 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Insert video"
            >
                <Video className="w-3.5 h-3.5" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.15)] z-50 p-3.5 space-y-2">
                    <p className="text-[11px] font-semibold text-gray-700">Embed Video Link</p>
                    <div className="flex gap-1.5">
                        <input
                            ref={inputRef}
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleApply();
                                }
                            }}
                            placeholder="YouTube, Vimeo, or Loom URL"
                            className="flex-1 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-gray-400 text-gray-800"
                        />
                        <button
                            type="button"
                            onClick={handleApply}
                            className="px-3 py-1.5 bg-[#FF6719] hover:bg-[#e65a12] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                            Embed
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Alignment Dropdown ───────────────────────────────────────────────────────

function AlignDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const icons = {
        left: <AlignLeft className="w-3.5 h-3.5" />,
        center: <AlignCenter className="w-3.5 h-3.5" />,
        right: <AlignRight className="w-3.5 h-3.5" />,
    };

    const current = (['center', 'right'] as const).find(a => editor.isActive({ textAlign: a })) ?? 'left';

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                className="flex items-center gap-0.5 w-8 h-7 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors justify-center"
                title="Text alignment"
            >
                {icons[current]}
                <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden z-50 p-1 flex gap-0.5">
                    {(['left', 'center', 'right'] as const).map(align => (
                        <button
                            key={align}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                editor.chain().focus().setTextAlign(align).run();
                                setOpen(false);
                            }}
                            className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${
                                current === align ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title={`Align ${align}`}
                        >
                            {icons[align]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Button Dropdown (Substack Buttons) ────────────────────────────────────────

function ButtonDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const insertButton = (text: string, href: string) => {
        editor.chain().focus().insertContent(`
<p style="text-align: center; margin: 2rem 0;">
    <a href="${href}" class="substack-button" style="display:inline-block; background-color:#FF6719; color:#ffffff; font-weight:600; font-size:14px; padding:10px 24px; border-radius:9999px; text-decoration:none; text-align:center;">
        ${text}
    </a>
</p>
<p></p>
`).run();
        setOpen(false);
    };

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                className={`flex items-center gap-1 h-7 px-2 rounded-md text-[13px] font-medium transition-colors ${
                    open ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Insert button"
            >
                <span>Button</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden z-50 py-1">
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); insertButton('Subscribe now', '#subscribe'); }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                    >
                        Subscribe now
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); insertButton('Leave a comment', '#comments'); }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                    >
                        Leave a comment
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); insertButton('Share post', '#share'); }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                    >
                        Share this post
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            const title = window.prompt('Button Label', 'Read More');
                            if (!title) return;
                            const url = window.prompt('Button Link URL', 'https://');
                            if (!url) return;
                            insertButton(title, url);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors border-t border-gray-100 cursor-pointer"
                    >
                        Custom button…
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Template Dropdown ────────────────────────────────────────────────────────

function TemplateDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const applyTemplate = (contentHtml: string) => {
        editor.chain().focus().insertContent(contentHtml).run();
        setOpen(false);
    };

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                className={`flex items-center gap-1 h-7 px-2 rounded-md text-[13px] font-medium transition-colors ${
                    open ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Insert editorial template"
            >
                <span>Template</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden z-50 py-1">
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            applyTemplate(`
<h2>Executive Summary</h2>
<p>An overview of the core insight or finding explored in this edition.</p>
<h2>Key Takeaways</h2>
<ul>
    <li>First critical perspective or data point</li>
    <li>Second strategic implication</li>
    <li>Looking forward: where this leads next</li>
</ul>
<h2>In-Depth Analysis</h2>
<p>Delve into the technical mechanics, experimental results, and context.</p>
<blockquote>"The simplest explanation that accounts for all observations is usually the closest to the truth."</blockquote>
<p></p>
`);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                    >
                        Deep Dive / Essay
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            applyTemplate(`
<h2>Q: What inspired this breakthrough?</h2>
<p><strong>Benedict:</strong> When we first examined the problem, existing frameworks assumed static latency. We realized dynamic pipelining could eliminate that bottleneck.</p>
<h2>Q: What surprised you most during testing?</h2>
<p><strong>Benedict:</strong> The divergence was far more pronounced at scale than in simulation.</p>
`);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                    >
                        Interview / Q&A
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            applyTemplate(`
<h2>📢 Major Announcement</h2>
<p>We are excited to share a major milestone in our ongoing research and development.</p>
<hr />
<p>Here is what you need to know about what's coming next and how to get involved.</p>
`);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                    >
                        Announcement
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── More Options Dropdown ────────────────────────────────────────────────────

function MoreDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setOpen(o => !o);
                }}
                className={`flex items-center gap-1.5 h-7 px-2 rounded-md text-[13px] font-medium transition-colors ${
                    open ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="More formatting options"
            >
                <span>More</span>
                <span className="w-2 h-2 rounded-full bg-[#FF6719]" />
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden z-50 py-1">
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            editor.chain().focus().setHorizontalRule().run();
                            setOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <Minus className="w-3.5 h-3.5 text-gray-400" />
                        <span>Divider line</span>
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleCodeBlock().run();
                            setOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <Code2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>Code block</span>
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            editor.chain().focus().insertContent(`
<blockquote style="border-left: 4px solid #3b82f6; background-color: #f8fafc; padding: 1rem 1.25rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; font-style: normal;">
    <p style="margin: 0; color: #1e293b; font-size: 0.95rem;">💡 <strong>Note:</strong> Add relevant highlight, callout, or aside information here.</p>
</blockquote>
<p></p>
`).run();
                            setOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <Info className="w-3.5 h-3.5 text-gray-400" />
                        <span>Callout box</span>
                    </button>

                    <div className="my-1 border-t border-gray-100" />

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            editor.chain().focus().unsetAllMarks().clearNodes().run();
                            setOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <RemoveFormatting className="w-3.5 h-3.5 text-gray-400" />
                        <span>Clear formatting</span>
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Main Substack Toolbar Component ──────────────────────────────────────────

export function TiptapToolbar({ editor }: { editor: Editor | null }) {
    // Force component re-render when editor selection or content changes
    const [, setTick] = useState(0);

    useEffect(() => {
        if (!editor) return;
        const updateListener = () => setTick(t => t + 1);
        editor.on('transaction', updateListener);
        return () => {
            editor.off('transaction', updateListener);
        };
    }, [editor]);

    if (!editor) {
        return (
            <div className="flex items-center px-4 h-[44px] text-xs text-gray-400">
                Loading formatting tools…
            </div>
        );
    }

    return (
        <div
            className="flex items-center gap-0.5 px-4 h-[44px] overflow-x-auto scrollbar-none select-none"
            role="toolbar"
            aria-label="Text formatting"
        >
            {/* 1. History: Undo / Redo */}
            <ToolBtn
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo (Ctrl+Z)"
            >
                <Undo2 className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo (Ctrl+Y)"
            >
                <Redo2 className="w-3.5 h-3.5" />
            </ToolBtn>

            <Divider />

            {/* 2. Block Style (Paragraph, H1, H2, H3, Quote, Code) */}
            <StyleDropdown editor={editor} />

            <Divider />

            {/* 3. Inline formatting */}
            <ToolBtn
                active={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold (Ctrl+B)"
            >
                <span className="font-bold text-[14px]">B</span>
            </ToolBtn>
            <ToolBtn
                active={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic (Ctrl+I)"
            >
                <span className="italic font-serif font-bold text-[14px]">I</span>
            </ToolBtn>
            <ToolBtn
                active={editor.isActive('strike')}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough"
            >
                <span className="line-through text-[13px] font-semibold">S</span>
            </ToolBtn>
            <ToolBtn
                active={editor.isActive('code')}
                onClick={() => editor.chain().focus().toggleCode().run()}
                title="Inline code"
            >
                <span className="font-mono text-[12px] font-semibold">&lt;&gt;</span>
            </ToolBtn>

            {/* Text Color picker */}
            <TextColorPicker editor={editor} />

            {/* Highlight */}
            <ToolBtn
                active={editor.isActive('highlight')}
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                title="Highlight text"
                className="flex flex-col items-center justify-center"
            >
                <Highlighter className="w-3.5 h-3.5" />
                <span className="w-3.5 h-[2px] bg-yellow-400 rounded-full mt-[1px]" />
            </ToolBtn>

            {/* Font family */}
            <FontFamilyDropdown editor={editor} />

            <Divider />

            {/* 4. Media tools */}
            <LinkPopover editor={editor} />
            <ImagePopover editor={editor} />
            <AudioPopover editor={editor} />
            <VideoPopover editor={editor} />
            <ToolBtn
                active={editor.isActive('blockquote')}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Quote"
            >
                <MessageSquareQuote className="w-3.5 h-3.5" />
            </ToolBtn>

            <Divider />

            {/* 5. Lists & Alignment */}
            <ToolBtn
                active={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bulleted list"
            >
                <List className="w-3.5 h-3.5" />
            </ToolBtn>
            <ToolBtn
                active={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Numbered list"
            >
                <ListOrdered className="w-3.5 h-3.5" />
            </ToolBtn>
            <AlignDropdown editor={editor} />

            <Divider />

            {/* 6. Substack Button / Template / More dropdowns */}
            <ButtonDropdown editor={editor} />
            <TemplateDropdown editor={editor} />
            <MoreDropdown editor={editor} />
        </div>
    );
}
