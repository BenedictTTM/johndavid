'use client';

import { useState, useEffect, useRef } from 'react';
import { Folder, ChevronLeft, Plus, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CategorySelectProps {
    value: string;
    onChange: (category: string) => void;
    error?: string;
}

const DEFAULT_CATEGORIES = [
    'Research',
    'Mentorship',
    'Bioinformatics',
    'Engineering',
    'AI & Health',
    'Community',
];

const LOCAL_STORAGE_KEY = 'jd_custom_categories';

export function CategorySelect({ value, onChange, error }: CategorySelectProps) {
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
    const [isCreating, setIsCreating] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch existing categories from server + local storage
    useEffect(() => {
        let isMounted = true;
        async function fetchCategories() {
            try {
                let savedLocal: string[] = [];
                try {
                    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
                    if (raw) savedLocal = JSON.parse(raw);
                } catch {
                    // ignore
                }

                const res = await fetch('/api/categories');
                if (res.ok) {
                    const serverCats: string[] = await res.json();
                    if (isMounted) {
                        const merged = Array.from(
                            new Set([...DEFAULT_CATEGORIES, ...serverCats, ...savedLocal])
                        ).filter(c => c && c !== 'Uncategorized');
                        setCategories(merged.sort());
                    }
                } else if (isMounted) {
                    const merged = Array.from(
                        new Set([...DEFAULT_CATEGORIES, ...savedLocal])
                    ).filter(c => c && c !== 'Uncategorized');
                    setCategories(merged.sort());
                }
            } catch {
                // fallback to defaults
            }
        }
        fetchCategories();
        return () => {
            isMounted = false;
        };
    }, []);

    // Focus input when entering creation mode
    useEffect(() => {
        if (isCreating) {
            const timer = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [isCreating]);

    const handleCreateCategory = () => {
        const trimmed = newCategoryName.trim();
        if (!trimmed) {
            toast.error('Please enter a category name');
            return;
        }

        if (trimmed.toLowerCase() === 'uncategorized') {
            toast.error('"Uncategorized" is not a valid category');
            return;
        }

        // Check if category already exists (case-insensitive)
        const existing = categories.find(c => c.toLowerCase() === trimmed.toLowerCase());
        if (existing) {
            onChange(existing);
            setIsCreating(false);
            setNewCategoryName('');
            toast.info(`Selected existing category: "${existing}"`);
            return;
        }

        // Add new category
        const updated = [...categories, trimmed].sort();
        setCategories(updated);
        onChange(trimmed);

        // Save to localStorage
        try {
            const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
            const saved: string[] = raw ? JSON.parse(raw) : [];
            if (!saved.includes(trimmed)) {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...saved, trimmed]));
            }
        } catch {
            // ignore
        }

        setIsCreating(false);
        setNewCategoryName('');
        toast.success(`Category "${trimmed}" created & selected`);
    };

    // Ensure selected value is present in dropdown options if it is set and not empty
    const displayCategories = value && !categories.includes(value) && value !== 'Uncategorized'
        ? [...categories, value].sort()
        : categories;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label htmlFor="category" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    <Folder className="w-3.5 h-3.5 text-gray-400" />
                    <span>Category</span>
                    <span className="text-red-500 font-bold" title="Compulsory">*</span>
                </label>
                {!isCreating && (
                    <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Add a new category"
                    >
                        <Plus className="w-3 h-3" />
                        <span>New</span>
                    </button>
                )}
            </div>

            {isCreating ? (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5 transition-all shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Create New Category
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCreating(false);
                                setNewCategoryName('');
                            }}
                            className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors cursor-pointer"
                            aria-label="Cancel"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="e.g. Neuroscience, Machine Learning..."
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateCategory();
                            } else if (e.key === 'Escape') {
                                setIsCreating(false);
                                setNewCategoryName('');
                            }
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all placeholder:text-gray-400"
                    />

                    <div className="flex items-center gap-2 pt-0.5">
                        <button
                            type="button"
                            onClick={handleCreateCategory}
                            className="flex-1 py-1.5 px-3 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add & Select</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCreating(false);
                                setNewCategoryName('');
                            }}
                            className="py-1.5 px-3 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <select
                        id="category"
                        value={value || ''}
                        onChange={e => {
                            const val = e.target.value;
                            if (val === '__CREATE_NEW__') {
                                setIsCreating(true);
                            } else {
                                onChange(val);
                            }
                        }}
                        className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none transition-colors appearance-none cursor-pointer pr-9 ${
                            error
                                ? 'border-red-400 focus:border-red-500 bg-red-50/20 text-gray-800'
                                : value
                                  ? 'border-gray-200 focus:border-gray-400 focus:bg-white text-gray-800'
                                  : 'border-gray-200 focus:border-gray-400 focus:bg-white text-gray-400'
                        }`}
                    >
                        <option value="" disabled className="text-gray-400">
                            Select a category…
                        </option>
                        {displayCategories.map(c => (
                            <option key={c} value={c} className="text-gray-800">
                                {c}
                            </option>
                        ))}
                        <option disabled className="text-gray-300">
                            ───────────────
                        </option>
                        <option value="__CREATE_NEW__" className="font-semibold text-gray-900 bg-gray-100">
                            + Create new category…
                        </option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronLeft className="w-4 h-4 -rotate-90" />
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-[11px] font-medium mt-1">{error}</p>}
        </div>
    );
}
