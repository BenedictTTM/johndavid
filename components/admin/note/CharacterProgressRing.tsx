'use client';

interface CharacterProgressRingProps {
    current: number;
    max?: number;
}

export function CharacterProgressRing({ current, max = 500 }: CharacterProgressRingProps) {
    const size = 26;
    const strokeWidth = 2.5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const offset = circumference - (percentage / 100) * circumference;

    const remaining = max - current;
    const isWarning = remaining <= 80 && remaining > 0;
    const isDanger = remaining <= 0;

    let strokeColor = 'rgba(255, 255, 255, 0.4)';
    if (isDanger) {
        strokeColor = '#EF4444';
    } else if (isWarning) {
        strokeColor = '#F59E0B';
    }

    return (
        <div className="flex items-center gap-1.5 select-none" title={`${current}/${max} characters`}>
            {remaining <= 80 && (
                <span
                    className={`text-[11px] font-mono font-medium ${
                        isDanger ? 'text-red-400 font-bold' : 'text-amber-400'
                    }`}
                >
                    {remaining}
                </span>
            )}

            <div className="relative flex items-center justify-center">
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Progress */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-150 ease-out"
                    />
                </svg>
            </div>
        </div>
    );
}
