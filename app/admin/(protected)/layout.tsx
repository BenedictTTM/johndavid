'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProtectedAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Run this check purely on the client side
        const token = localStorage.getItem('admin_token');
        
        if (!token) {
            // Not authorized, redirect to login page
            router.push('/admin/auth');
        } else {
            // Token found, proceed
            setIsAuthorized(true);
        }
    }, [router]);

    // Render a luxurious loading state until client-side verification completes
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBD4] font-sans">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-[#713600]" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#38240D]/70 font-bold select-none">
                        Verifying Clearance
                    </span>
                </div>
            </div>
        );
    }

    // Authorized
    return <>{children}</>;
}
