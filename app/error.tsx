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
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center bg-[#FDFBD4]">
            <div className="space-y-6 max-w-md">
                {/* Icon Container */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-[#713600]/15 rounded-full blur-xl animate-pulse" />
                    <div className="relative flex items-center justify-center w-full h-full border border-[#713600]/25 rounded-full bg-[#FAF7C8]">
                        <span className="text-3xl text-[#713600] font-serif font-bold">!</span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <h2 className="text-3xl font-display font-extrabold text-[#38240D] uppercase tracking-tight">
                        Something went wrong!
                    </h2>
                    <p className="text-[#38240D]/80 font-sans text-sm">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                    <button
                        onClick={() => reset()}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#713600] text-[#FDFBD4] font-bold text-xs uppercase tracking-wider transition-all hover:bg-[#C05800] shadow-sm cursor-pointer"
                    >
                        <RefreshCcw size={16} />
                        <span>Try again</span>
                    </button>

                    <Link
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#713600]/20 text-[#38240D] font-bold text-xs uppercase tracking-wider transition-all hover:bg-[#FAF7C8]"
                    >
                        <Home size={16} />
                        <span>Return Home</span>
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 rounded-lg bg-[#FAF7C8] border border-red-300 text-left overflow-auto max-h-40">
                        <p className="text-red-700 text-xs font-mono">{error.message}</p>
                        {error.digest && <p className="text-[#38240D]/60 text-xs font-mono mt-2">Digest: {error.digest}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
