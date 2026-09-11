'use client';

import { useState, useRef } from 'react';
import { Video, Upload, Link as LinkIcon, X, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface VideoAttachmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAttachVideoFile: (file: File) => void;
    onAttachVideoUrl: (url: string) => void;
}

export function VideoAttachmentModal({
    isOpen,
    onClose,
    onAttachVideoFile,
    onAttachVideoUrl,
}: VideoAttachmentModalProps) {
    const [tab, setTab] = useState<'upload' | 'url'>('upload');
    const [videoUrlInput, setVideoUrlInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFile = (file: File) => {
        if (!file.type.startsWith('video/')) {
            toast.error('Please select a valid video file (MP4, WebM, MOV)');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            toast.error('Video file must be under 50MB');
            return;
        }
        onAttachVideoFile(file);
        onClose();
        toast.success('Video attached');
    };

    const handleUrlSubmit = () => {
        const url = videoUrlInput.trim();
        if (!url) {
            toast.error('Please enter a video URL');
            return;
        }
        // Basic check for youtube, vimeo or mp4/webm/direct video
        const isSupported =
            url.includes('youtube.com') ||
            url.includes('youtu.be') ||
            url.includes('vimeo.com') ||
            url.match(/\.(mp4|webm|mov|ogg)(\?|$)/i);

        if (!isSupported) {
            toast.info('Attaching link. Supported players include YouTube, Vimeo, and MP4/WebM files.');
        }

        onAttachVideoUrl(url);
        setVideoUrlInput('');
        onClose();
        toast.success('Video link attached');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="w-full max-w-md bg-[#181a1d] border border-white/10 rounded-2xl shadow-2xl p-5 text-white flex flex-col gap-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2 text-base font-semibold">
                        <Video className="w-5 h-5 text-[#FF6719]" />
                        <span>Add Video Attachment</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/40 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/5 rounded-lg text-xs">
                    <button
                        type="button"
                        onClick={() => setTab('upload')}
                        className={`flex-1 py-1.5 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            tab === 'upload' ? 'bg-[#FF6719] text-white' : 'text-white/60 hover:text-white'
                        }`}
                    >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('url')}
                        className={`flex-1 py-1.5 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            tab === 'url' ? 'bg-[#FF6719] text-white' : 'text-white/60 hover:text-white'
                        }`}
                    >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Video URL / Embed</span>
                    </button>
                </div>

                {/* Tab Content */}
                {tab === 'upload' ? (
                    <div
                        onDragOver={e => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={e => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-colors ${
                            isDragging
                                ? 'border-[#FF6719] bg-[#FF6719]/10'
                                : 'border-white/15 hover:border-white/30 bg-black/20'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime,video/*"
                            className="hidden"
                            onChange={e => {
                                if (e.target.files?.[0]) handleFile(e.target.files[0]);
                            }}
                        />
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#FF6719]">
                            <Upload className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Click or drag & drop video</p>
                            <p className="text-xs text-white/40 mt-1">MP4, WebM, or MOV (max 50MB)</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 py-2">
                        <label className="text-xs text-white/60">Enter YouTube, Vimeo, or MP4 URL:</label>
                        <input
                            type="url"
                            value={videoUrlInput}
                            onChange={e => setVideoUrlInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleUrlSubmit();
                            }}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#FF6719]/70 focus:outline-none"
                            autoFocus
                        />
                        <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                            <AlertCircle className="w-3.5 h-3.5 text-white/40 shrink-0" />
                            <span>Will embed responsive video card preview in the note</span>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 font-medium cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUrlSubmit}
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FF6719] hover:bg-[#E5570F] text-xs text-white font-semibold transition-colors cursor-pointer"
                            >
                                <Check className="w-3.5 h-3.5" />
                                <span>Attach Video</span>
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
