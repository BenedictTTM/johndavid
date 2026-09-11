'use client';

import { useState } from 'react';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    FileCode,
    Quote,
    List,
    ListOrdered,
    Link as LinkIcon,
    Hash,
    AtSign,
    X,
    Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormattingToolbarProps {
    isOpen: boolean;
    onApplyFormat: (prefix: string, suffix?: string, defaultText?: string) => void;
    onClose: () => void;
}

export function FormattingToolbar({ isOpen, onApplyFormat, onClose }: FormattingToolbarProps) {
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [linkText, setLinkText] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    if (!isOpen) return null;

    const handleInsertLink = () => {
        if (!linkUrl.trim()) return;
        const text = linkText.trim() || linkUrl.trim();
        const cleanUrl = linkUrl.trim().startsWith('http')
            ? linkUrl.trim()
            : 'https://' + linkUrl.trim();
        onApplyFormat('[' + text + '](', cleanUrl + ')');
        setLinkText('');
        setLinkUrl('');
        setIsLinkDialogOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full pt-2 pb-1 border-t border-white/[0.06] flex flex-col gap-2"
        >
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-1 text-white/70">
                    <button
                        type="button"
                        onClick={() => onApplyFormat('**', '**', 'bold text')}
                        className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onApplyFormat('*', '*', 'italic text')}
                        className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onApplyFormat('~~', '~~', 'strikethrough')}
                        className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        title="Strikethrough"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </button>

                    <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

                    <button
                        type="button"
                        onClick={() => onApplyFormat('`', '`', 'code')}
                        className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        title="Inline Code"
                    >
                        <Code className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onApplyFormat('```\n', '\n```', 'code block')}
                        className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        title="Code Block"
                    >
                        <FileCode className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onApplyFormat('> ', '', 'quote')}
                        className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        title="Blockquote"
                    >
                        <Quote className="w-4 h-4" />
                    </button>

                    <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

                    <button
                        type="button"
                        onClick={() => onApplyFormat('- ', '', 'list item')}
                        className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onApplyFormat('1. ', '', 'first item')}
                        className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>

                    <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

                    <button
                        type="button"
                        onClick={() => setIsLinkDialogOpen(!isLinkDialogOpen)}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            isLinkDialogOpen ? 'bg-[#FF6719]/20 text-[#FF6719]' : 'hover:bg-white/10 hover:text-white'
                        }`}
                        title="Insert Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onApplyFormat('#', '', 'tag')}
                        className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        title="Hashtag"
                    >
                        <Hash className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onApplyFormat('@', '', 'username')}
                        className="p-1.5 rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        title="Mention"
                    >
                        <AtSign className="w-4 h-4" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="text-white/40 hover:text-white p-1 rounded transition-colors cursor-pointer text-xs"
                    title="Hide formatting"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Inline Link Dialog */}
            <AnimatePresence>
                {isLinkDialogOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex flex-wrap items-center gap-2 p-2 bg-black/40 border border-white/10 rounded-lg text-xs"
                    >
                        <input
                            type="text"
                            placeholder="Text (optional)"
                            value={linkText}
                            onChange={e => setLinkText(e.target.value)}
                            className="bg-[#1e2023] border border-white/10 rounded px-2 py-1 text-white placeholder:text-white/30 focus:border-[#FF6719] focus:outline-none"
                        />
                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={linkUrl}
                            onChange={e => setLinkUrl(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleInsertLink();
                            }}
                            className="flex-1 min-w-[160px] bg-[#1e2023] border border-white/10 rounded px-2 py-1 text-white placeholder:text-white/30 focus:border-[#FF6719] focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleInsertLink}
                            className="px-2.5 py-1 bg-[#FF6719] hover:bg-[#E5570F] text-white rounded font-medium flex items-center gap-1 cursor-pointer"
                        >
                            <Check className="w-3 h-3" />
                            <span>Add</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
