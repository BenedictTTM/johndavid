"use client";

export default function Contact() {
    return (
        <section id="contact" className="relative py-24 md:py-32 flex flex-col items-center justify-center bg-transparent overflow-hidden">
            <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-3 select-none">
                        <div className="w-6 h-[2px] bg-[#713600]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#713600]">
                            Inquiries & Engagements
                        </span>
                        <div className="w-6 h-[2px] bg-[#713600]" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-display font-extrabold text-[#38240D] mb-6 uppercase tracking-tight">
                        Get in Touch
                    </h2>
                    <p 
                        className="text-xl md:text-2xl text-[#38240D]/80 italic font-serif leading-relaxed"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                        "Available for academic collaboration, speaking engagements, and consultation."
                    </p>
                </div>

                {/* Email Display */}
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="text-center w-full group">
                        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#713600] mb-4">
                            Direct Email
                        </h3>
                        <a
                            href="mailto:johndavid@yorku.ca"
                            className="relative inline-block text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#38240D] tracking-tight hover:text-[#C05800] transition-colors duration-300"
                        >
                            johndavid@yorku.ca
                            <span className="absolute -bottom-2 left-0 w-0 h-[3px] bg-[#C05800] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
