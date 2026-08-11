'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2, Sparkles, Image as ImageIcon, Eye, Clock, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import Editor from '@/components/Editor';
import { createPostSchema, postSchema } from '@/lib/schemas';

export default function CreatePostPage() {
    const router = useRouter();

    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const createPostMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create post');
            }

            return response.json();
        },
        onSuccess: (data, variables) => {
            const isPublished = variables.get('published') === 'true';
            toast.success(isPublished ? 'Post published successfully' : 'Draft saved successfully');
            router.push('/admin');
        },
        onError: (error: Error) => {
            console.error('Error creating post:', error);
            toast.error(error.message || 'Failed to create post');
        },
    });

    const handleSave = async (published: boolean) => {
        setErrors({});

        const form = document.querySelector('form') as HTMLFormElement;
        const formData = new FormData(form);

        const visibility = formData.get('visibility');
        const effectivePublished = visibility === 'private' ? false : published;

        const data = {
            title: formData.get('title'),
            excerpt: formData.get('excerpt'),
            content: content,
            readTime: formData.get('readTime'),
            category: formData.get('category'),
            image: formData.get('image'),
            published: effectivePublished,
        };

        const schema = effectivePublished ? createPostSchema : postSchema;
        const result = schema.safeParse(data);

        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0] as string] = issue.message;
            });
            setErrors(formattedErrors);
            return;
        }

        formData.set('content', content);
        formData.set('published', String(effectivePublished));
        createPostMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-[#FDFBD4] text-[#38240D] font-sans relative overflow-hidden pb-20">
            
            {/* Fine grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(113,54,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,54,0,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none -z-10" />
            <div className="absolute top-0 left-[8%] right-[8%] h-[1px] bg-gradient-to-r from-transparent via-[#713600]/15 to-transparent pointer-events-none" />

            {/* Header Branding */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-20 pt-8 flex justify-between items-center text-[9px] text-[#38240D]/60 tracking-[0.3em] uppercase select-none pointer-events-none font-mono">
                <span>04 // COMPOSER_PORTAL</span>
                <span>SYS_VER: 2026.05</span>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-20 pt-8">
                    
                    {/* Back Link */}
                    <div className="mb-6">
                        <Link 
                            href="/admin" 
                            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#713600] hover:text-[#C05800] transition-colors group cursor-pointer"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Ledger
                        </Link>
                    </div>

                    {/* Page Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-[#713600]/15 pb-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-2.5">
                                <div className="w-5 h-[2px] bg-[#713600]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#713600]">John David Ledger</span>
                            </div>
                            <h1 
                                className="font-display font-extrabold uppercase leading-none tracking-tight select-none text-4xl sm:text-5xl text-[#38240D]"
                            >
                                Compose <span className="font-serif italic font-normal tracking-wide text-[#713600]">New Resource</span>
                            </h1>
                        </div>

                        {/* Top Action Buttons Panel */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center justify-end gap-3.5 w-full md:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="button"
                                onClick={() => handleSave(false)}
                                disabled={createPostMutation.isPending}
                                className="
                                    px-5 
                                    py-3 
                                    rounded-lg 
                                    border 
                                    border-[#713600]/25 
                                    text-[#38240D] 
                                    bg-[#FAF7C8]
                                    font-bold
                                    text-[10px]
                                    uppercase
                                    tracking-[0.2em]
                                    hover:bg-[#713600]/10
                                    transition-all 
                                    duration-300
                                    text-center 
                                    flex 
                                    items-center 
                                    justify-center 
                                    gap-2
                                    shadow-xs
                                    cursor-pointer
                                "
                            >
                                {createPostMutation.isPending && !createPostMutation.variables?.get('published') ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#713600]" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    'Save Draft'
                                )}
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="button"
                                onClick={() => handleSave(true)}
                                disabled={createPostMutation.isPending}
                                className="
                                    px-6
                                    py-3
                                    rounded-lg
                                    bg-[#713600]
                                    text-[#FDFBD4]
                                    text-[10px]
                                    uppercase
                                    tracking-[0.2em]
                                    font-bold
                                    transition-all
                                    duration-300
                                    flex
                                    items-center
                                    justify-center
                                    gap-2.5
                                    cursor-pointer
                                    shadow-sm
                                    hover:bg-[#C05800]
                                "
                            >
                                {createPostMutation.isPending && createPostMutation.variables?.get('published') === 'true' ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FDFBD4]" />
                                ) : (
                                    <Sparkles size={13} className="text-[#FDFBD4]" />
                                )}
                                {createPostMutation.isPending && createPostMutation.variables?.get('published') === 'true' ? 'Processing...' : 'Publish Post'}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Split Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Main Editorial Form Area */}
                        <motion.div 
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-2 space-y-8"
                        >
                            <div className="bg-[#FAF7C8] border border-[#713600]/15 rounded-xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(56,36,13,0.04)] relative">
                                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#713600]" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#713600]" />
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#713600]" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#713600]" />

                                <div className="flex items-center gap-2 mb-6 border-b border-[#713600]/12 pb-4">
                                    <Sparkles size={14} className="text-[#713600]" />
                                    <h2 className="text-base font-bold text-[#38240D] uppercase tracking-wider">Post Details</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Title Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#713600]">
                                            Post Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            className={`w-full px-4 py-3 bg-[#FDFBD4] border rounded-lg focus:ring-2 focus:ring-[#713600]/20 focus:border-[#713600] outline-none transition-all duration-300 text-[#38240D] placeholder-[#38240D]/40 text-base font-serif ${
                                                errors.title ? 'border-red-600' : 'border-[#713600]/20'
                                            }`}
                                            placeholder="Enter an editorial title..."
                                        />
                                        {errors.title && <p className="text-red-700 text-xs font-medium font-mono">{errors.title}</p>}
                                    </div>

                                    {/* Excerpt Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="excerpt" className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#713600]">
                                            Excerpt
                                        </label>
                                        <textarea
                                            name="excerpt"
                                            id="excerpt"
                                            rows={3}
                                            className={`w-full px-4 py-3 bg-[#FDFBD4] border rounded-lg focus:ring-2 focus:ring-[#713600]/20 focus:border-[#713600] outline-none transition-all duration-300 text-[#38240D] placeholder-[#38240D]/40 text-sm leading-relaxed resize-none ${
                                                errors.excerpt ? 'border-red-600' : 'border-[#713600]/20'
                                            }`}
                                            placeholder="Write a brief synopsis for this story..."
                                        />
                                        {errors.excerpt && <p className="text-red-700 text-xs font-medium font-mono">{errors.excerpt}</p>}
                                    </div>

                                    {/* Content Editor */}
                                    <div className="space-y-2">
                                        <label htmlFor="content" className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#713600]">
                                            Content
                                        </label>
                                        <div className={`overflow-hidden rounded-lg border bg-[#FDFBD4] ${
                                            errors.content ? 'border-red-600' : 'border-[#713600]/20'
                                        }`}>
                                            <Editor value={content} onChange={setContent} />
                                        </div>
                                        {errors.content && <p className="text-red-700 text-xs font-medium font-mono">{errors.content}</p>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Settings Sidebar */}
                        <motion.div 
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-6"
                        >
                            <div className="bg-[#FAF7C8] border border-[#713600]/15 rounded-xl p-5 shadow-[0_4px_20px_rgba(56,36,13,0.04)] relative">
                                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#713600]" />
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#713600]" />

                                <div className="flex items-center gap-2 mb-4 border-b border-[#713600]/12 pb-3">
                                    <Folder size={14} className="text-[#713600]" />
                                    <h3 className="text-sm font-bold text-[#38240D] uppercase tracking-wider">Post Settings</h3>
                                </div>

                                <div className="space-y-6">
                                    {/* Featured Image */}
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#713600]">
                                                Featured Image
                                            </label>
                                            <span className="text-[8px] font-mono text-[#38240D]/60">ASSET // 01</span>
                                        </div>

                                        <div className={`relative group border border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-[#713600]/5 min-h-[160px] ${
                                            errors.image ? 'border-red-600 bg-red-50/20' : 'border-[#713600]/30'
                                        }`}>
                                            {imagePreview ? (
                                                <div className="w-full relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-36 object-cover rounded-md border border-[#713600]/20 shadow-xs"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setImagePreview(null)}
                                                        className="absolute top-2 right-2 bg-[#FDFBD4] text-red-700 rounded-full p-1.5 shadow-md hover:bg-red-700 hover:text-[#FDFBD4] transition-all border border-red-200"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 bg-[#FDFBD4] border border-[#713600]/20 rounded-full flex items-center justify-center mb-3 text-[#713600]">
                                                        <Upload size={16} />
                                                    </div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#38240D]">Click to upload image</p>
                                                    <p className="text-[9px] text-[#38240D]/60 mt-1 font-mono">PNG, JPG, WEBP (MAX. 5MB)</p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                name="image"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        {errors.image && <p className="text-red-700 text-xs font-medium font-mono">{errors.image}</p>}
                                    </div>

                                    {/* Estimated Read Time */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={13} className="text-[#713600]" />
                                            <label htmlFor="readTime" className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#713600]">
                                                Estimated Read Time
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="readTime"
                                                id="readTime"
                                                defaultValue="5"
                                                className="w-full px-4 py-3 bg-[#FDFBD4] border border-[#713600]/20 rounded-lg focus:ring-2 focus:ring-[#713600]/20 focus:border-[#713600] outline-none transition-all duration-300 text-[#38240D] text-sm font-medium"
                                                placeholder="e.g. 5"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#38240D]/60 text-[9px] uppercase tracking-wider font-bold">mins</span>
                                        </div>
                                    </div>

                                    {/* Category Select */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5">
                                            <ImageIcon size={13} className="text-[#713600]" />
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#713600]">
                                                Category
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <select 
                                                name="category" 
                                                className="w-full px-4 py-3 bg-[#FDFBD4] border border-[#713600]/20 rounded-lg focus:ring-2 focus:ring-[#713600]/20 focus:border-[#713600] outline-none transition-all duration-300 text-[#38240D] text-sm appearance-none cursor-pointer font-medium"
                                            >
                                                <option value="Uncategorized">Select a category</option>
                                                <option value="Research">Research</option>
                                                <option value="Mentorship">Mentorship</option>
                                                <option value="Bioinformatics">Bioinformatics</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="AI & Health">AI & Health</option>
                                                <option value="Community">Community</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#713600]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Visibility */}
                                    <div className="bg-[#FDFBD4] rounded-xl p-4 border border-[#713600]/15 space-y-3.5">
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#713600]">
                                            <Eye size={13} />
                                            Post Visibility
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center">
                                                    <input type="radio" name="visibility" value="public" defaultChecked className="peer sr-only" />
                                                    <div className="w-3.5 h-3.5 border border-[#713600]/40 rounded-full peer-checked:border-[#713600] peer-checked:border-4 transition-all bg-[#FDFBD4]"></div>
                                                </div>
                                                <span className="text-[#38240D]/80 text-xs font-bold uppercase tracking-wider group-hover:text-[#713600] transition-colors">Public</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center">
                                                    <input type="radio" name="visibility" value="private" className="peer sr-only" />
                                                    <div className="w-3.5 h-3.5 border border-[#713600]/40 rounded-full peer-checked:border-[#713600] peer-checked:border-4 transition-all bg-[#FDFBD4]"></div>
                                                </div>
                                                <span className="text-[#38240D]/80 text-xs font-bold uppercase tracking-wider group-hover:text-[#713600] transition-colors">Private</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </form>
        </div>
    );
}
