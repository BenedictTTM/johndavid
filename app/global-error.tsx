'use client';

import { useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';
import './globals.css';

export default function GlobalError({
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
        <html lang="en">
            <body className="bg-[#FDFBD4] text-[#38240D] font-sans min-h-screen flex items-center justify-center">
                <div className="p-8 text-center max-w-lg mx-auto">
                    <div className="mb-6 relative inline-block">
                        <div className="absolute inset-0 bg-[#713600]/15 rounded-full blur-xl" />
                        <div className="relative w-20 h-20 flex items-center justify-center rounded-full border border-[#713600]/30 bg-[#FAF7C8] mx-auto">
                            <span className="text-3xl font-serif font-bold text-[#713600]">!</span>
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold mb-3 text-[#38240D]">Critical Error</h2>
                    <p className="text-[#38240D]/80 mb-8 text-sm">
                        A critical system error prevented the application from loading.
                    </p>

                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#713600] text-[#FDFBD4] font-bold text-xs uppercase tracking-wider hover:bg-[#C05800] transition-colors cursor-pointer shadow-sm"
                    >
                        <RefreshCcw size={16} />
                        <span>Reload Application</span>
                    </button>
                </div>
            </body>
        </html>
    );
}
