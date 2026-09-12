'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Home } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center bg-[#F5F1D5]">
            <div className="space-y-6 max-w-md">
                {/* Icon Container */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-[#542A00]/15 rounded-full blur-xl animate-pulse" />
                    <div className="relative flex items-center justify-center w-full h-full border border-[#D8D0A6] rounded-full bg-[#FFF8D8]">
                        <span className="text-3xl text-[#542A00] font-serif font-bold">!</span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <h2 className="text-3xl font-display font-extrabold text-[#2B2119] uppercase tracking-tight">
                        Something went wrong!
                    </h2>
                    <p className="text-[#2B2119]/80 font-sans text-sm">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                    <button
                        onClick={() => reset()}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#542A00] text-[#FFF8D8] font-bold text-xs uppercase tracking-wider transition-all hover:bg-[#3D1E00] shadow-sm cursor-pointer"
                    >
                        <RefreshCcw size={16} />
                        <span>Try again</span>
                    </button>

                    <Link
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#D8D0A6] text-[#2B2119] font-bold text-xs uppercase tracking-wider transition-all hover:bg-[#FFF8D8]"
                    >
                        <Home size={16} />
                        <span>Return Home</span>
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 rounded-lg bg-[#FFF8D8] border border-red-300 text-left overflow-auto max-h-40">
                        <p className="text-red-700 text-xs font-mono">{error.message}</p>
                        {error.digest && <p className="text-[#2B2119]/60 text-xs font-mono mt-2">Digest: {error.digest}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
