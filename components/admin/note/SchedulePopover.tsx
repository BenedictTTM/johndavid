'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SchedulePopoverProps {
    isOpen: boolean;
    scheduledDate: Date | null;
    onClose: () => void;
    onSetSchedule: (date: Date | null) => void;
}

export function SchedulePopover({
    isOpen,
    scheduledDate,
    onClose,
    onSetSchedule,
}: SchedulePopoverProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [dateStr, setDateStr] = useState(() => {
        const initial = scheduledDate || new Date(Date.now() + 24 * 60 * 60 * 1000);
        return initial.toISOString().split('T')[0];
    });
    const [timeStr, setTimeStr] = useState(() => {
        const initial = scheduledDate || new Date(Date.now() + 24 * 60 * 60 * 1000);
        return `${String(initial.getHours()).padStart(2, '0')}:${String(
            initial.getMinutes()
        ).padStart(2, '0')}`;
    });

    useEffect(() => {
        if (scheduledDate) {
            setDateStr(scheduledDate.toISOString().split('T')[0]);
            setTimeStr(
                `${String(scheduledDate.getHours()).padStart(2, '0')}:${String(
                    scheduledDate.getMinutes()
                ).padStart(2, '0')}`
            );
        }
    }, [scheduledDate]);

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

    const handleApplySchedule = () => {
        if (!dateStr || !timeStr) {
            toast.error('Please select both date and time');
            return;
        }
        const target = new Date(`${dateStr}T${timeStr}`);
        if (isNaN(target.getTime())) {
            toast.error('Invalid date format');
            return;
        }
        if (target.getTime() <= Date.now()) {
            toast.error('Scheduled date must be in the future');
            return;
        }
        onSetSchedule(target);
        onClose();
        toast.success(`Scheduled for ${target.toLocaleDateString()} at ${target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    };

    const handlePreset = (preset: 'today-evening' | 'tomorrow-morning' | 'tomorrow-evening' | 'two-days') => {
        const now = new Date();
        const target = new Date();

        if (preset === 'today-evening') {
            target.setHours(18, 0, 0, 0);
            if (target.getTime() <= now.getTime()) {
                target.setDate(target.getDate() + 1);
            }
        } else if (preset === 'tomorrow-morning') {
            target.setDate(target.getDate() + 1);
            target.setHours(9, 0, 0, 0);
        } else if (preset === 'tomorrow-evening') {
            target.setDate(target.getDate() + 1);
            target.setHours(18, 0, 0, 0);
        } else if (preset === 'two-days') {
            target.setDate(target.getDate() + 2);
            target.setHours(9, 0, 0, 0);
        }

        setDateStr(target.toISOString().split('T')[0]);
        setTimeStr(
            `${String(target.getHours()).padStart(2, '0')}:${String(target.getMinutes()).padStart(2, '0')}`
        );
    };

    if (!isOpen) return null;

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <AnimatePresence>
            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute bottom-full left-0 mb-3 w-[310px] sm:w-[340px] bg-[#1a1c1e] border border-white/10 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] p-4 z-50 text-white flex flex-col gap-3.5 backdrop-blur-md"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <CalendarIcon className="w-4 h-4 text-[#FF6719]" />
                        <span>Schedule Publication</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/40 hover:text-white p-1 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
                        Quick Options
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <button
                            type="button"
                            onClick={() => handlePreset('tomorrow-morning')}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-left transition-colors cursor-pointer"
                        >
                            Tomorrow 9 AM
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePreset('tomorrow-evening')}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-left transition-colors cursor-pointer"
                        >
                            Tomorrow 6 PM
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePreset('today-evening')}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-left transition-colors cursor-pointer"
                        >
                            Later Today (6 PM)
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePreset('two-days')}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-left transition-colors cursor-pointer"
                        >
                            In 2 Days (9 AM)
                        </button>
                    </div>
                </div>

                {/* Date & Time Selectors */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.06]">
                    <div>
                        <label className="block text-[11px] text-white/50 mb-1">Date</label>
                        <input
                            type="date"
                            min={minDate}
                            value={dateStr}
                            onChange={e => setDateStr(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#FF6719]/60"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] text-white/50 mb-1">Time</label>
                        <input
                            type="time"
                            value={timeStr}
                            onChange={e => setTimeStr(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#FF6719]/60"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                    {scheduledDate ? (
                        <button
                            type="button"
                            onClick={() => {
                                onSetSchedule(null);
                                onClose();
                                toast.info('Schedule cancelled');
                            }}
                            className="text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
                        >
                            Remove schedule
                        </button>
                    ) : (
                        <div />
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 font-medium transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleApplySchedule}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF6719] hover:bg-[#E5570F] text-xs text-white font-semibold shadow-sm transition-colors cursor-pointer"
                        >
                            <Check className="w-3.5 h-3.5" />
                            <span>Set</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
