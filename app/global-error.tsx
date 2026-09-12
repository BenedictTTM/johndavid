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
            <body className="bg-[#F5F1D5] text-[#2B2119] font-sans min-h-screen flex items-center justify-center">
                <div className="p-8 text-center max-w-lg mx-auto">
                    <div className="mb-6 relative inline-block">
                        <div className="absolute inset-0 bg-[#542A00]/15 rounded-full blur-xl" />
                        <div className="relative w-20 h-20 flex items-center justify-center rounded-full border border-[#D8D0A6] bg-[#FFF8D8] mx-auto">
                            <span className="text-3xl font-serif font-bold text-[#542A00]">!</span>
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold mb-3 text-[#2B2119]">Critical Error</h2>
                    <p className="text-[#2B2119]/80 mb-8 text-sm">
                        A critical system error prevented the application from loading.
                    </p>

                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#542A00] text-[#FFF8D8] font-bold text-xs uppercase tracking-wider hover:bg-[#3D1E00] transition-colors cursor-pointer shadow-sm"
                    >
                        <RefreshCcw size={16} />
                        <span>Reload Application</span>
                    </button>
                </div>
            </body>
        </html>
    );
}
