'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Image as ImageIcon,
    Video,
    Smile,
    Calendar,
    MoreHorizontal,
    X,
    Loader2,
    CalendarCheck,
    Bookmark,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { EmojiPicker } from '@/components/admin/note/EmojiPicker';
import { PollBuilder, type PollData } from '@/components/admin/note/PollBuilder';
import { SchedulePopover } from '@/components/admin/note/SchedulePopover';
import { FormattingToolbar } from '@/components/admin/note/FormattingToolbar';
import { VideoAttachmentModal } from '@/components/admin/note/VideoAttachmentModal';
import { DraftsModal, type DraftPost } from '@/components/admin/note/DraftsModal';
import { CharacterProgressRing } from '@/components/admin/note/CharacterProgressRing';
import type { PostDocument, ContentBlock } from '@/types/content';

export default function CreateNotePage() {
    const router = useRouter();

    // Text Content & Selection
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Media Attachments
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Poll State
    const [isPollActive, setIsPollActive] = useState(false);
    const [poll, setPoll] = useState<PollData>({
        options: ['', ''],
        durationDays: 1,
    });

    // Schedule State
    const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    // UI Popovers & Modals
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [isFormattingOpen, setIsFormattingOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);

    // Submission & Draft Editing
    const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            if (videoPreview && videoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [videoPreview]);

    // ── Image Attachment Handling ─────────────────────────────────────────────
    const handleImageSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be under 10MB');
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = e => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ── Video Attachment Handling ─────────────────────────────────────────────
    const handleAttachVideoFile = (file: File) => {
        setVideoFile(file);
        setVideoUrl(null);
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
    };

    const handleAttachVideoUrl = (url: string) => {
        setVideoUrl(url);
        setVideoFile(null);
        setVideoPreview(url);
    };

    const handleRemoveVideo = () => {
        if (videoPreview && videoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(videoPreview);
        }
        setVideoFile(null);
        setVideoPreview(null);
        setVideoUrl(null);
    };

    // ── Textarea Formatting & Insertion Helpers ───────────────────────────────
    const insertTextAtCursor = (prefix: string, suffix: string = '', defaultText: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) {
            setContent(prev => prev + prefix + defaultText + suffix);
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.substring(start, end);
        const replacement = selected ? `${prefix}${selected}${suffix}` : `${prefix}${defaultText}${suffix}`;

        const newContent = content.substring(0, start) + replacement + content.substring(end);
        setContent(newContent);

        // Restore focus and cursor
        setTimeout(() => {
            textarea.focus();
            const newCursor = selected
                ? start + replacement.length
                : start + prefix.length + defaultText.length;
            textarea.setSelectionRange(newCursor, newCursor);
        }, 0);
    };

    const handleSelectEmoji = (emoji: string) => {
        insertTextAtCursor(emoji, '', '');
    };

    // ── Drag and Drop & Paste ────────────────────────────────────────────────
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        if (file.type.startsWith('image/')) {
            handleImageSelect(file);
            toast.success('Image attached');
        } else if (file.type.startsWith('video/')) {
            handleAttachVideoFile(file);
            toast.success('Video attached');
        } else {
            toast.error('Please drop an image or video file');
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                    handleImageSelect(file);
                    toast.success('Image pasted from clipboard');
                    break;
                }
            } else if (item.type.startsWith('video/')) {
                const file = item.getAsFile();
                if (file) {
                    handleAttachVideoFile(file);
                    toast.success('Video pasted from clipboard');
                    break;
                }
            }
        }
    };

    // ── Draft Loading & Reset ────────────────────────────────────────────────
    const handleSelectDraft = (draft: DraftPost) => {
        setActiveDraftId(draft.id);
        setContent(draft.content || '');
        if (draft.image) {
            setImagePreview(draft.image);
            setImageFile(null);
        } else {
            setImagePreview(null);
            setImageFile(null);
        }
        setVideoFile(null);
        setVideoPreview(null);
        setVideoUrl(null);
        setIsPollActive(false);
        setScheduledDate(null);
        toast.info('Draft loaded into editor');
    };

    // ── Submit Note (Publish, Draft, or Schedule) ────────────────────────────
    const submitPost = async (publishStatus: boolean) => {
        const trimmedContent = content.trim();
        const hasMedia = imageFile !== null || imagePreview !== null || videoFile !== null || videoUrl !== null;
        const validPollOptions = poll.options.filter(o => o.trim().length > 0);

        if (!trimmedContent && !hasMedia && (!isPollActive || validPollOptions.length < 2)) {
            toast.error('Cannot submit an empty note');
            return;
        }

        if (isPollActive && validPollOptions.length < 2) {
            toast.error('Please provide at least 2 poll options');
            return;
        }

        setIsSubmitting(true);

        // Derive note title
        const firstLine = trimmedContent.split('\n')[0] || '';
        let title = firstLine.slice(0, 75);
        if (!title && isPollActive && validPollOptions.length >= 2) {
            title = `Poll: ${validPollOptions[0]} vs ${validPollOptions[1]}`;
        }
        if (!title) title = 'Note';

        // Format body content including poll details if active
        let finalContent = trimmedContent;
        if (isPollActive && validPollOptions.length >= 2) {
            finalContent = [
                trimmedContent,
                trimmedContent ? '\n\n' : '',
                `📊 Poll (${poll.durationDays} ${poll.durationDays === 1 ? 'day' : 'days'}):`,
                ...validPollOptions.map((opt, i) => `${i + 1}. ${opt.trim()}`),
            ].join('\n');
        }

        if (videoUrl && !videoFile) {
            finalContent = [finalContent, finalContent ? '\n\n' : '', `🎥 Video: ${videoUrl}`].join('\n');
        }

        // Build structured PostDocument blocks
        const blocks: ContentBlock[] = [];
        if (trimmedContent) {
            const paragraphs = trimmedContent.split('\n\n').filter(Boolean);
            paragraphs.forEach((p, idx) => {
                blocks.push({
                    id: `p-${Date.now()}-${idx}`,
                    type: 'paragraph',
                    content: [{ kind: 'text', text: p }],
                });
            });
        }

        if (isPollActive && validPollOptions.length >= 2) {
            blocks.push({
                id: `poll-${Date.now()}`,
                type: 'callout',
                variant: 'info',
                title: `📊 Poll (${poll.durationDays} ${poll.durationDays === 1 ? 'day' : 'days'})`,
                content: validPollOptions.map((opt, i) => ({
                    kind: 'text',
                    text: `${i + 1}. ${opt.trim()}${i < validPollOptions.length - 1 ? '\n' : ''}`,
                })),
            });
        }

        if (videoUrl && !videoFile) {
            blocks.push({
                id: `vid-${Date.now()}`,
                type: 'link_card',
                url: videoUrl,
                title: 'Attached Video',
                description: videoUrl,
            });
        }

        const contentBlocks: PostDocument = {
            version: 1,
            blocks,
        };

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', finalContent);
            formData.append('excerpt', finalContent.slice(0, 160));
            formData.append('category', 'Note');
            formData.append('readTime', '1 min');
            formData.append('contentBlocks', JSON.stringify(contentBlocks));

            // If scheduled, post is unpublished with scheduled date
            const isScheduled = scheduledDate !== null && scheduledDate.getTime() > Date.now();
            const finalPublished = isScheduled ? false : publishStatus;
            formData.append('published', String(finalPublished));

            if (scheduledDate) {
                formData.append('date', scheduledDate.toISOString());
            }

            // Media attachment
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (videoFile) {
                formData.append('image', videoFile);
            }

            const endpoint = activeDraftId ? `/api/posts/${activeDraftId}` : '/api/posts';
            const method = activeDraftId ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save note');
            }

            if (isScheduled) {
                toast.success(
                    `Note scheduled for ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString(
                        [],
                        { hour: '2-digit', minute: '2-digit' }
                    )}!`
                );
            } else if (publishStatus) {
                toast.success('Note posted successfully!');
            } else {
                toast.success('Draft saved!');
            }

            router.push('/admin');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save note';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        await submitPost(false);
    };

    const handlePost = async () => {
        await submitPost(true);
    };

    const hasContent =
        content.trim().length > 0 ||
        imageFile !== null ||
        imagePreview !== null ||
        videoFile !== null ||
        videoUrl !== null ||
        (isPollActive && poll.options.some(o => o.trim().length > 0));

    // YouTube/Vimeo embed preview helper
    const getEmbedUrl = (url: string) => {
        try {
            if (url.includes('youtube.com/watch')) {
                const urlObj = new URL(url);
                const v = urlObj.searchParams.get('v');
                if (v) return `https://www.youtube.com/embed/${v}`;
            }
            if (url.includes('youtu.be/')) {
                const id = url.split('youtu.be/')[1]?.split('?')[0];
                if (id) return `https://www.youtube.com/embed/${id}`;
            }
            if (url.includes('vimeo.com/')) {
                const id = url.split('vimeo.com/')[1]?.split('?')[0];
                if (id) return `https://player.vimeo.com/video/${id}`;
            }
        } catch {
            return null;
        }
        return null;
    };

    const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            {/* Modal Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full max-w-[640px] bg-[#161719] border ${isDragging ? 'border-[#FF6719] ring-2 ring-[#FF6719]/30' : 'border-white/[0.08]'
                    } rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.7)] p-5 sm:p-6 flex flex-col justify-between min-h-[340px] text-white relative transition-all duration-150`}
            >
                {/* Drag Overlay */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#161719]/90 backdrop-blur-xs rounded-2xl z-30 flex flex-col items-center justify-center pointer-events-none border-2 border-dashed border-[#FF6719]"
                        >
                            <ImageIcon className="w-10 h-10 text-[#FF6719] animate-bounce" />
                            <p className="text-base font-semibold text-white mt-2">Drop media to attach</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div>
                    {/* Header Row: Author Avatar & Name + Scheduled Badge + Drafts Link */}
                    <div className="flex items-center justify-between mb-3 select-none">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10 bg-zinc-800">
                                <Image
                                    src="/mba-headshot.jpg"
                                    alt="John David"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-white text-[15px] tracking-tight">
                                    John David
                                </span>
                                {activeDraftId && (
                                    <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                                        <Bookmark className="w-2.5 h-2.5" /> Editing Draft
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            {/* Scheduled Badge Indicator */}
                            {scheduledDate && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium">
                                    <CalendarCheck className="w-3.5 h-3.5" />
                                    <span>
                                        {scheduledDate.toLocaleDateString([], {
                                            month: 'short',
                                            day: 'numeric',
                                        })}{' '}
                                        {scheduledDate.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setScheduledDate(null);
                                            toast.info('Schedule removed');
                                        }}
                                        className="hover:text-white transition-colors cursor-pointer"
                                        title="Cancel schedule"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}

                            {/* Drafts Manager Button */}
                            <button
                                type="button"
                                onClick={() => setIsDraftsModalOpen(true)}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 text-white/70 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                            >
                                <Bookmark className="w-3.5 h-3.5 text-[#FF6719]" />
                                <span>Drafts</span>
                            </button>
                        </div>
                    </div>

                    {/* Note Writing Area */}
                    <div className="mt-2">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onPaste={handlePaste}
                            placeholder="What's on your mind?"
                            rows={4}
                            autoFocus
                            className="w-full bg-transparent border-0 outline-none resize-none text-[16px] sm:text-[17px] text-white/95 placeholder:text-white/35 leading-relaxed focus:ring-0 p-0"
                        />
                    </div>

                    {/* Image Attachment Preview */}
                    {imagePreview && (
                        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden my-3 border border-white/10 bg-black/30">
                            <Image
                                src={imagePreview}
                                alt="Attachment"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                                title="Remove image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Video Attachment Preview */}
                    {videoPreview && (
                        <div className="relative w-full rounded-xl overflow-hidden my-3 border border-white/10 bg-black/40">
                            {embedUrl ? (
                                <div className="relative w-full aspect-[16/9]">
                                    <iframe
                                        src={embedUrl}
                                        title="Video preview"
                                        className="w-full h-full border-0 rounded-xl"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <div className="p-2">
                                    <video
                                        src={videoPreview}
                                        controls
                                        playsInline
                                        className="w-full max-h-[300px] rounded-lg bg-black object-contain"
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleRemoveVideo}
                                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer z-10 shadow-md"
                                title="Remove video"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Poll Builder Card */}
                    {isPollActive && (
                        <PollBuilder
                            poll={poll}
                            onChange={setPoll}
                            onRemove={() => setIsPollActive(false)}
                        />
                    )}

                    {/* Expandable Formatting Bar */}
                    <FormattingToolbar
                        isOpen={isFormattingOpen}
                        onApplyFormat={insertTextAtCursor}
                        onClose={() => setIsFormattingOpen(false)}
                    />
                </div>

                {/* Bottom Toolbar & Action Buttons */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] select-none relative">
                    {/* Toolbar Icons */}
                    <div className="flex items-center gap-4 text-white/60 relative">
                        {/* Hidden Image Uploader */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                                if (e.target.files?.[0]) handleImageSelect(e.target.files[0]);
                            }}
                        />

                        {/* Image Button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="hover:text-white transition-colors cursor-pointer p-1 -m-1"
                            title="Add image"
                        >
                            <ImageIcon className="w-5 h-5 stroke-[1.75]" />
                        </button>

                        {/* Video Button */}
                        <button
                            type="button"
                            onClick={() => setIsVideoModalOpen(true)}
                            className={`transition-colors cursor-pointer p-1 -m-1 ${videoPreview ? 'text-[#FF6719]' : 'hover:text-white'
                                }`}
                            title="Add video"
                        >
                            <Video className="w-5 h-5 stroke-[1.75]" />
                        </button>

                        {/* Emoji Picker Button & Popover */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                                className={`transition-colors cursor-pointer p-1 -m-1 ${isEmojiPickerOpen ? 'text-[#FF6719]' : 'hover:text-white'
                                    }`}
                                title="Add emoji"
                            >
                                <Smile className="w-5 h-5 stroke-[1.75]" />
                            </button>

                            <EmojiPicker
                                isOpen={isEmojiPickerOpen}
                                onClose={() => setIsEmojiPickerOpen(false)}
                                onSelectEmoji={handleSelectEmoji}
                            />
                        </div>

                        {/* Poll Button */}
                        <button
                            type="button"
                            onClick={() => setIsPollActive(!isPollActive)}
                            className={`transition-colors cursor-pointer p-1 -m-1 ${isPollActive ? 'text-[#FF6719]' : 'hover:text-white'
                                }`}
                            title={isPollActive ? 'Hide poll' : 'Create poll'}
                        >
                            <svg
                                className="w-5 h-5 stroke-[1.75]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="4" width="18" height="6" rx="2" />
                                <rect x="3" y="14" width="18" height="6" rx="2" />
                                <line x1="8" y1="4" x2="8" y2="10" />
                                <line x1="8" y1="14" x2="8" y2="20" />
                            </svg>
                        </button>

                        {/* Schedule Button & Popover */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                                className={`transition-colors cursor-pointer p-1 -m-1 ${scheduledDate ? 'text-[#FF6719]' : 'hover:text-white'
                                    }`}
                                title="Schedule post"
                            >
                                <Calendar className="w-5 h-5 stroke-[1.75]" />
                            </button>

                            <SchedulePopover
                                isOpen={isScheduleOpen}
                                scheduledDate={scheduledDate}
                                onClose={() => setIsScheduleOpen(false)}
                                onSetSchedule={date => setScheduledDate(date)}
                            />
                        </div>

                        {/* Formatting Toolbar Toggle */}
                        <button
                            type="button"
                            onClick={() => setIsFormattingOpen(!isFormattingOpen)}
                            className={`transition-colors cursor-pointer p-1 -m-1 ${isFormattingOpen ? 'text-[#FF6719]' : 'hover:text-white'
                                }`}
                            title="Formatting options"
                        >
                            <MoreHorizontal className="w-5 h-5 stroke-[1.75]" />
                        </button>
                    </div>

                    {/* Right side: Character counter & Actions */}
                    <div className="flex items-center gap-3">
                        {/* Radial Character Counter Ring */}
                        <CharacterProgressRing current={content.length} max={500} />

                        <button
                            type="button"
                            onClick={() => {
                                if (hasContent) {
                                    if (confirm('Discard unsaved note?')) router.push('/admin');
                                } else {
                                    router.push('/admin');
                                }
                            }}
                            className="px-4 py-2 rounded-lg bg-[#24262A] hover:bg-[#2F3238] text-white text-sm font-semibold transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handlePost}
                            disabled={!hasContent || isSubmitting}
                            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${hasContent && !isSubmitting
                                    ? 'bg-[#FF6719] hover:bg-[#E5570F] text-white shadow-sm cursor-pointer'
                                    : 'bg-[#24262A] text-white/30 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    <span>{scheduledDate ? 'Scheduling…' : 'Posting…'}</span>
                                </>
                            ) : (
                                <span>{scheduledDate ? 'Schedule' : 'Post'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Video Attachment Modal */}
            <VideoAttachmentModal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                onAttachVideoFile={handleAttachVideoFile}
                onAttachVideoUrl={handleAttachVideoUrl}
            />

            {/* Drafts Manager Modal */}
            <DraftsModal
                isOpen={isDraftsModalOpen}
                onClose={() => setIsDraftsModalOpen(false)}
                onSelectDraft={handleSelectDraft}
                onSaveCurrentDraft={handleSaveDraft}
                isSubmitting={isSubmitting}
                hasCurrentContent={hasContent}
            />
        </div>
    );
}
