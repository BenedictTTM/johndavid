'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Smile, ThumbsUp, Heart, Lightbulb, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectEmoji: (emoji: string) => void;
}

interface EmojiItem {
    char: string;
    name: string;
    keywords: string[];
    category: 'smileys' | 'gestures' | 'hearts' | 'tech' | 'objects';
}

const EMOJI_DATABASE: EmojiItem[] = [
    // Smileys
    { char: '😀', name: 'grinning face', keywords: ['happy', 'smile'], category: 'smileys' },
    { char: '😃', name: 'grinning face with big eyes', keywords: ['happy', 'smile'], category: 'smileys' },
    { char: '😄', name: 'grinning face with smiling eyes', keywords: ['happy', 'laugh'], category: 'smileys' },
    { char: '😁', name: 'beaming face with smiling eyes', keywords: ['happy', 'grin'], category: 'smileys' },
    { char: '😆', name: 'grinning squinting face', keywords: ['laugh', 'happy'], category: 'smileys' },
    { char: '😅', name: 'grinning face with sweat', keywords: ['relief', 'sweat'], category: 'smileys' },
    { char: '🤣', name: 'rolling on the floor laughing', keywords: ['rofl', 'lol'], category: 'smileys' },
    { char: '😂', name: 'face with tears of joy', keywords: ['tears', 'crying laugh'], category: 'smileys' },
    { char: '🙂', name: 'slightly smiling face', keywords: ['smile', 'fine'], category: 'smileys' },
    { char: '🙃', name: 'upside-down face', keywords: ['silly', 'sarcasm'], category: 'smileys' },
    { char: '😉', name: 'winking face', keywords: ['wink', 'flirt'], category: 'smileys' },
    { char: '😊', name: 'smiling face with smiling eyes', keywords: ['warm', 'blush'], category: 'smileys' },
    { char: '😇', name: 'smiling face with halo', keywords: ['angel', 'innocent'], category: 'smileys' },
    { char: '🥰', name: 'smiling face with hearts', keywords: ['love', 'adore'], category: 'smileys' },
    { char: '😍', name: 'heart eyes', keywords: ['love', 'crush'], category: 'smileys' },
    { char: '🤩', name: 'star-struck', keywords: ['stars', 'amazed'], category: 'smileys' },
    { char: '😘', name: 'face blowing a kiss', keywords: ['kiss', 'love'], category: 'smileys' },
    { char: '😋', name: 'face savoring food', keywords: ['yummy', 'delicious'], category: 'smileys' },
    { char: '😛', name: 'face with tongue', keywords: ['silly', 'tongue'], category: 'smileys' },
    { char: '😜', name: 'winking face with tongue', keywords: ['playful', 'crazy'], category: 'smileys' },
    { char: '🤪', name: 'zany face', keywords: ['wild', 'crazy'], category: 'smileys' },
    { char: '😎', name: 'smiling face with sunglasses', keywords: ['cool', 'chill'], category: 'smileys' },
    { char: '🤓', name: 'nerd face', keywords: ['nerd', 'geek', 'code'], category: 'smileys' },
    { char: '🧐', name: 'face with monocle', keywords: ['curious', 'inspect'], category: 'smileys' },
    { char: '🤔', name: 'thinking face', keywords: ['think', 'hmmm', 'wonder'], category: 'smileys' },
    { char: '🤫', name: 'shushing face', keywords: ['quiet', 'secret'], category: 'smileys' },
    { char: '🤗', name: 'hugging face', keywords: ['hug', 'warm'], category: 'smileys' },
    { char: '🤐', name: 'zipper mouth', keywords: ['sealed', 'secret'], category: 'smileys' },
    { char: '🤨', name: 'face with raised eyebrow', keywords: ['skeptical', 'doubt'], category: 'smileys' },
    { char: '😐', name: 'neutral face', keywords: ['meh', 'neutral'], category: 'smileys' },
    { char: '😏', name: 'smirking face', keywords: ['smirk', 'cool'], category: 'smileys' },
    { char: '😒', name: 'unamused face', keywords: ['bored', 'annoyed'], category: 'smileys' },
    { char: '🙄', name: 'face with rolling eyes', keywords: ['eyeroll', 'whatever'], category: 'smileys' },
    { char: '😬', name: 'grimacing face', keywords: ['awkward', 'yikes'], category: 'smileys' },
    { char: '😌', name: 'relieved face', keywords: ['peace', 'calm'], category: 'smileys' },
    { char: '😔', name: 'pensive face', keywords: ['sad', 'down'], category: 'smileys' },
    { char: '😴', name: 'sleeping face', keywords: ['sleep', 'tired'], category: 'smileys' },
    { char: '🤯', name: 'exploding head', keywords: ['mind blown', 'shock'], category: 'smileys' },
    { char: '🥳', name: 'partying face', keywords: ['celebrate', 'birthday'], category: 'smileys' },
    { char: '🥴', name: 'woozy face', keywords: ['dizzy', 'tired'], category: 'smileys' },
    { char: '🥺', name: 'pleading face', keywords: ['puppy eyes', 'please'], category: 'smileys' },
    { char: '😭', name: 'loudly crying face', keywords: ['cry', 'sad', 'sobbing'], category: 'smileys' },
    { char: '😱', name: 'face screaming in fear', keywords: ['shocked', 'scared'], category: 'smileys' },
    { char: '😤', name: 'face with steam from nose', keywords: ['triumph', 'proud'], category: 'smileys' },
    { char: '😡', name: 'pouting face', keywords: ['angry', 'mad'], category: 'smileys' },
    { char: '💀', name: 'skull', keywords: ['dead', 'skeleton', 'laughing dead'], category: 'smileys' },

    // Gestures
    { char: '👍', name: 'thumbs up', keywords: ['like', 'approve', 'yes', 'ok'], category: 'gestures' },
    { char: '👎', name: 'thumbs down', keywords: ['dislike', 'no'], category: 'gestures' },
    { char: '👏', name: 'clapping hands', keywords: ['applause', 'bravo'], category: 'gestures' },
    { char: '🙌', name: 'raising hands', keywords: ['hooray', 'celebrate'], category: 'gestures' },
    { char: '👐', name: 'open hands', keywords: ['welcome', 'open'], category: 'gestures' },
    { char: '🤲', name: 'palms up together', keywords: ['pray', 'hope'], category: 'gestures' },
    { char: '🤝', name: 'handshake', keywords: ['deal', 'agreement', 'partner'], category: 'gestures' },
    { char: '🙏', name: 'folded hands', keywords: ['thank you', 'pray', 'please'], category: 'gestures' },
    { char: '✌️', name: 'victory hand', keywords: ['peace', 'two'], category: 'gestures' },
    { char: '🤞', name: 'crossed fingers', keywords: ['luck', 'hope'], category: 'gestures' },
    { char: '🤟', name: 'love-you gesture', keywords: ['love', 'rock'], category: 'gestures' },
    { char: '🤘', name: 'sign of the horns', keywords: ['rock', 'metal'], category: 'gestures' },
    { char: '👌', name: 'OK hand', keywords: ['perfect', 'good'], category: 'gestures' },
    { char: '🤌', name: 'pinched fingers', keywords: ['italian', 'chef kiss'], category: 'gestures' },
    { char: '👈', name: 'backhand index pointing left', keywords: ['left', 'look'], category: 'gestures' },
    { char: '👉', name: 'backhand index pointing right', keywords: ['right', 'look'], category: 'gestures' },
    { char: '👆', name: 'backhand index pointing up', keywords: ['up', 'above'], category: 'gestures' },
    { char: '👇', name: 'backhand index pointing down', keywords: ['down', 'below'], category: 'gestures' },
    { char: '☝️', name: 'index pointing up', keywords: ['one', 'point'], category: 'gestures' },
    { char: '👋', name: 'waving hand', keywords: ['hello', 'bye', 'wave'], category: 'gestures' },
    { char: '🤙', name: 'call me hand', keywords: ['call', 'shaka'], category: 'gestures' },
    { char: '💪', name: 'flexed biceps', keywords: ['muscle', 'strong'], category: 'gestures' },
    { char: '🫡', name: 'saluting face', keywords: ['respect', 'salute'], category: 'gestures' },

    // Hearts & Reactions
    { char: '❤️', name: 'red heart', keywords: ['love', 'like'], category: 'hearts' },
    { char: '🧡', name: 'orange heart', keywords: ['love'], category: 'hearts' },
    { char: '💛', name: 'yellow heart', keywords: ['love', 'friendship'], category: 'hearts' },
    { char: '💚', name: 'green heart', keywords: ['love', 'nature'], category: 'hearts' },
    { char: '💙', name: 'blue heart', keywords: ['love', 'trust'], category: 'hearts' },
    { char: '💜', name: 'purple heart', keywords: ['love'], category: 'hearts' },
    { char: '🖤', name: 'black heart', keywords: ['love', 'dark'], category: 'hearts' },
    { char: '🤍', name: 'white heart', keywords: ['love', 'pure'], category: 'hearts' },
    { char: '💔', name: 'broken heart', keywords: ['sad', 'breakup'], category: 'hearts' },
    { char: '❣️', name: 'heart exclamation', keywords: ['love', 'accent'], category: 'hearts' },
    { char: '💕', name: 'two hearts', keywords: ['love', 'hearts'], category: 'hearts' },
    { char: '💖', name: 'sparkling heart', keywords: ['love', 'sparkle'], category: 'hearts' },
    { char: '🔥', name: 'fire', keywords: ['hot', 'lit', 'flame'], category: 'hearts' },
    { char: '⚡', name: 'high voltage', keywords: ['lightning', 'fast', 'energy'], category: 'hearts' },
    { char: '✨', name: 'sparkles', keywords: ['magic', 'shine', 'clean'], category: 'hearts' },
    { char: '🌟', name: 'glowing star', keywords: ['star', 'bright'], category: 'hearts' },
    { char: '💥', name: 'collision', keywords: ['boom', 'blast'], category: 'hearts' },
    { char: '💯', name: 'hundred points', keywords: ['perfect', 'score'], category: 'hearts' },

    // Tech & Tools
    { char: '💻', name: 'laptop', keywords: ['computer', 'code', 'work'], category: 'tech' },
    { char: '🖥️', name: 'desktop computer', keywords: ['screen', 'pc'], category: 'tech' },
    { char: '📱', name: 'mobile phone', keywords: ['cell', 'smartphone'], category: 'tech' },
    { char: '⌨️', name: 'keyboard', keywords: ['type', 'coding'], category: 'tech' },
    { char: '🖱️', name: 'computer mouse', keywords: ['click'], category: 'tech' },
    { char: '🔬', name: 'microscope', keywords: ['science', 'research', 'lab'], category: 'tech' },
    { char: '🧬', name: 'DNA', keywords: ['genetics', 'biology', 'bioinformatics'], category: 'tech' },
    { char: '🧪', name: 'test tube', keywords: ['experiment', 'chemistry', 'science'], category: 'tech' },
    { char: '🧫', name: 'petri dish', keywords: ['biology', 'culture'], category: 'tech' },
    { char: '📡', name: 'satellite antenna', keywords: ['signal', 'network'], category: 'tech' },
    { char: '🤖', name: 'robot', keywords: ['ai', 'bot', 'machine'], category: 'tech' },
    { char: '🧠', name: 'brain', keywords: ['mind', 'intellect', 'ai'], category: 'tech' },
    { char: '⚙️', name: 'gear', keywords: ['settings', 'config'], category: 'tech' },
    { char: '🛠️', name: 'hammer and wrench', keywords: ['tools', 'build'], category: 'tech' },
    { char: '🔧', name: 'wrench', keywords: ['tool', 'fix'], category: 'tech' },
    { char: '📊', name: 'bar chart', keywords: ['stats', 'data'], category: 'tech' },
    { char: '📈', name: 'chart increasing', keywords: ['growth', 'upward'], category: 'tech' },
    { char: '🔒', name: 'locked', keywords: ['secure', 'privacy'], category: 'tech' },
    { char: '🔑', name: 'key', keywords: ['password', 'access'], category: 'tech' },

    // Objects & Symbols
    { char: '🚀', name: 'rocket', keywords: ['launch', 'fast', 'startup'], category: 'objects' },
    { char: '🎯', name: 'bullseye', keywords: ['target', 'goal'], category: 'objects' },
    { char: '🏆', name: 'trophy', keywords: ['win', 'prize'], category: 'objects' },
    { char: '💡', name: 'light bulb', keywords: ['idea', 'insight'], category: 'objects' },
    { char: '📌', name: 'pushpin', keywords: ['pin', 'notice'], category: 'objects' },
    { char: '📝', name: 'memo', keywords: ['write', 'note'], category: 'objects' },
    { char: '📚', name: 'books', keywords: ['read', 'study'], category: 'objects' },
    { char: '☕', name: 'hot beverage', keywords: ['coffee', 'tea'], category: 'objects' },
    { char: '🍕', name: 'pizza', keywords: ['food'], category: 'objects' },
    { char: '🎉', name: 'party popper', keywords: ['congratulations', 'tada'], category: 'objects' },
    { char: '🌍', name: 'globe showing Europe-Africa', keywords: ['earth', 'world'], category: 'objects' },
    { char: '✅', name: 'check mark button', keywords: ['done', 'correct'], category: 'objects' },
    { char: '⚠️', name: 'warning', keywords: ['caution', 'alert'], category: 'objects' },
    { char: '🔔', name: 'bell', keywords: ['notification'], category: 'objects' },
];

const QUICK_REACTIONS = ['🔥', '❤️', '👍', '🚀', '🎉', '✨', '💡', '😂', '👏', '💯', '🧠', '⚡'];

export function EmojiPicker({ isOpen, onClose, onSelectEmoji }: EmojiPickerProps) {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'smileys' | 'gestures' | 'hearts' | 'tech' | 'objects'>('all');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        } else {
            setSearch('');
            setActiveTab('all');
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onClose]);

    const filteredEmojis = useMemo(() => {
        const query = search.trim().toLowerCase();
        return EMOJI_DATABASE.filter(item => {
            const matchesCategory = activeTab === 'all' || item.category === activeTab;
            if (!query) return matchesCategory;
            const matchesSearch =
                item.name.toLowerCase().includes(query) ||
                item.keywords.some(k => k.toLowerCase().includes(query)) ||
                item.char === query;
            return matchesCategory && matchesSearch;
        });
    }, [search, activeTab]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute bottom-full left-0 mb-3 w-[330px] sm:w-[360px] bg-[#1a1c1e] border border-white/10 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] p-3 z-50 text-white flex flex-col gap-2.5 backdrop-blur-md"
            >
                {/* Search Header */}
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm">
                    <Search className="w-4 h-4 text-white/40 shrink-0" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search emojis..."
                        className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none border-none p-0 focus:ring-0"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="text-white/40 hover:text-white p-0.5 cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Quick Reactions Bar */}
                <div className="flex items-center justify-between px-1 py-1 border-b border-white/[0.07] overflow-x-auto no-scrollbar">
                    {QUICK_REACTIONS.map(emoji => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                                onSelectEmoji(emoji);
                                onClose();
                            }}
                            className="hover:scale-125 hover:bg-white/10 p-1 rounded-md transition-all text-base leading-none cursor-pointer select-none"
                            title={emoji}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                {/* Category Navigation Tabs */}
                <div className="flex items-center justify-around text-xs text-white/50 border-b border-white/[0.07] pb-1.5">
                    <button
                        type="button"
                        onClick={() => setActiveTab('all')}
                        className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                            activeTab === 'all' ? 'text-[#FF6719] bg-[#FF6719]/15 font-semibold' : 'hover:text-white'
                        }`}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('smileys')}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                            activeTab === 'smileys' ? 'text-[#FF6719] bg-[#FF6719]/15' : 'hover:text-white'
                        }`}
                        title="Smileys"
                    >
                        <Smile className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('gestures')}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                            activeTab === 'gestures' ? 'text-[#FF6719] bg-[#FF6719]/15' : 'hover:text-white'
                        }`}
                        title="Gestures"
                    >
                        <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('hearts')}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                            activeTab === 'hearts' ? 'text-[#FF6719] bg-[#FF6719]/15' : 'hover:text-white'
                        }`}
                        title="Hearts & Reactions"
                    >
                        <Heart className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('tech')}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                            activeTab === 'tech' ? 'text-[#FF6719] bg-[#FF6719]/15' : 'hover:text-white'
                        }`}
                        title="Tech & Science"
                    >
                        <Lightbulb className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('objects')}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                            activeTab === 'objects' ? 'text-[#FF6719] bg-[#FF6719]/15' : 'hover:text-white'
                        }`}
                        title="Symbols & Objects"
                    >
                        <Sparkles className="w-4 h-4" />
                    </button>
                </div>

                {/* Emojis Grid */}
                <div className="grid grid-cols-7 sm:grid-cols-8 gap-1 max-h-[190px] overflow-y-auto pr-1">
                    {filteredEmojis.map((item, idx) => (
                        <button
                            key={`${item.char}-${idx}`}
                            type="button"
                            onClick={() => {
                                onSelectEmoji(item.char);
                                onClose();
                            }}
                            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 hover:scale-115 active:scale-95 transition-all text-xl cursor-pointer select-none"
                            title={item.name}
                        >
                            {item.char}
                        </button>
                    ))}
                    {filteredEmojis.length === 0 && (
                        <div className="col-span-full py-6 text-center text-xs text-white/40">
                            No emojis found
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
