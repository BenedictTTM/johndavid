import Link from "next/link";
import { Linkedin, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#FAF7C8] border-t border-[#713600]/15 text-[#38240D] overflow-hidden">
            {/* Soft ambient light overlay */}
            <div className="absolute bottom-0 right-[-10%] w-[35%] h-[70%] bg-[#713600]/[0.03] blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* Column 1: Branding & Bio */}
                    <div className="lg:col-span-5 space-y-5">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-serif italic tracking-wide text-[#38240D]" style={{ fontFamily: "var(--font-cormorant)" }}>
                                John David <span className="not-italic text-xl text-[#713600]">ッ</span>
                            </span>
                        </div>
                        <p className="text-[14px] text-[#38240D]/80 leading-[1.8] font-serif italic max-w-md" style={{ fontFamily: "var(--font-cormorant)" }}>
                            Ghanaian bioengineering researcher and scholar based at York University. Dedicated to bridging the gap between biological complexity, technological precision, and advanced computational engineering.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/#about"
                                className="inline-flex items-center text-[10px] font-bold tracking-[0.25em] text-[#713600] hover:text-[#C05800] transition-colors duration-300 uppercase group"
                            >
                                Read Full Biography
                                <span className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Navigation Links */}
                    <div className="lg:col-span-3 lg:col-start-7 space-y-5">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#713600] font-display">
                            Navigation
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/#about", label: "About" },
                                { href: "/#contact", label: "Contact" },
                                { href: "/blog", label: "Blog" }
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="inline-flex items-center text-[13px] text-[#38240D]/80 hover:text-[#713600] hover:translate-x-1 transition-all duration-300 tracking-wide font-sans font-medium group">
                                        <span className="w-0 group-hover:w-3.5 h-[1.5px] bg-[#713600] mr-0 group-hover:mr-2.5 transition-all duration-300 block"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Inquiries & Socials */}
                    <div className="lg:col-span-3 space-y-5">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#713600] font-display">
                            Connect
                        </h3>
                        <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-[#38240D]/60 font-semibold font-sans">For inquiries:</p>
                            <a 
                                href="mailto:johndavid@yorku.ca" 
                                className="text-[15px] text-[#38240D] hover:text-[#C05800] font-semibold transition-colors duration-300 inline-block pb-0.5 border-b border-[#713600]/20 hover:border-[#C05800]"
                            >
                                johndavid@yorku.ca
                            </a>
                        </div>
                        <div className="flex gap-3 pt-3">
                            {[
                                { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                                { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                                { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                                { Icon: Mail, href: "mailto:johndavid@yorku.ca", label: "Email" }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 border border-[#713600]/15 rounded-full flex items-center justify-center text-[#38240D]/80 bg-[#FDFBD4] hover:bg-[#713600] hover:text-[#FDFBD4] hover:border-transparent transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Divider & Technical Marker */}
                <div className="mt-14 pt-8 border-t border-[#713600]/12 flex flex-col sm:flex-row justify-between items-center gap-6 relative">
                    <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-8 h-[1px] bg-[#713600]/40 hidden sm:block" />
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-[10px] text-[#38240D]/60 tracking-[0.15em] font-mono uppercase">
                        <span>© {currentYear} John David. All rights reserved.</span>
                        <span className="hidden sm:inline text-[#713600]/30">|</span>
                        <span>SYS_COORD_04 // FOOTER</span>
                    </div>
                    
                    <div className="flex gap-6 text-[10px] tracking-[0.2em] font-semibold uppercase">
                        <a href="#" className="text-[#38240D]/60 hover:text-[#713600] transition-colors duration-300">Privacy Policy</a>
                        <a href="#" className="text-[#38240D]/60 hover:text-[#713600] transition-colors duration-300">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
