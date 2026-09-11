'use client';

import { Plus, Trash2, X, Clock } from 'lucide-react';

export interface PollData {
    options: string[];
    durationDays: number;
}

interface PollBuilderProps {
    poll: PollData;
    onChange: (poll: PollData) => void;
    onRemove: () => void;
}

export function PollBuilder({ poll, onChange, onRemove }: PollBuilderProps) {
    const handleOptionChange = (index: number, val: string) => {
        const next = [...poll.options];
        next[index] = val;
        onChange({ ...poll, options: next });
    };

    const handleAddOption = () => {
        if (poll.options.length >= 4) return;
        onChange({ ...poll, options: [...poll.options, ''] });
    };

    const handleRemoveOption = (index: number) => {
        if (poll.options.length <= 2) return;
        const next = poll.options.filter((_, i) => i !== index);
        onChange({ ...poll, options: next });
    };

    const handleDurationChange = (days: number) => {
        onChange({ ...poll, durationDays: days });
    };

    return (
        <div className="my-3 p-3.5 sm:p-4 rounded-xl bg-black/40 border border-white/10 text-white flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF6719]">
                    <svg
                        className="w-4 h-4 stroke-[2]"
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
                    <span>Poll Options</span>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-white/40 hover:text-red-400 p-1 rounded-md transition-colors cursor-pointer"
                    title="Remove poll"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Options Input List */}
            <div className="flex flex-col gap-2">
                {poll.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={opt}
                                onChange={e => handleOptionChange(idx, e.target.value)}
                                placeholder={`Option ${idx + 1}`}
                                maxLength={50}
                                className="w-full bg-[#1e2023] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#FF6719]/60 focus:outline-none focus:ring-1 focus:ring-[#FF6719]/40 transition-colors"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-white/30 font-mono pointer-events-none">
                                {50 - opt.length}
                            </span>
                        </div>

                        {poll.options.length > 2 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(idx)}
                                className="text-white/40 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                                title="Remove option"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Option & Duration Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
                {poll.options.length < 4 ? (
                    <button
                        type="button"
                        onClick={handleAddOption}
                        className="inline-flex items-center gap-1.5 text-xs text-[#FF6719] hover:text-[#ff8240] font-semibold py-1 px-2 rounded-md hover:bg-[#FF6719]/10 transition-colors cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add option</span>
                    </button>
                ) : (
                    <span className="text-[11px] text-white/30 italic">Max 4 options</span>
                )}

                {/* Duration Pills */}
                <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <Clock className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-[11px] text-white/40">Duration:</span>
                    {[1, 3, 7].map(days => (
                        <button
                            key={days}
                            type="button"
                            onClick={() => handleDurationChange(days)}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                                poll.durationDays === days
                                    ? 'bg-[#FF6719] text-white'
                                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                            }`}
                        >
                            {days} {days === 1 ? 'day' : 'days'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
