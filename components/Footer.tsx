import Link from "next/link";
import { Linkedin, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#FFF8D8] border-t border-[#D8D0A6] text-[#2B2119] overflow-hidden">
            {/* Soft ambient light overlay */}
            <div className="absolute bottom-0 right-[-10%] w-[35%] h-[70%] bg-[#542A00]/[0.03] blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* Column 1: Branding & Bio */}
                    <div className="lg:col-span-5 space-y-5">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-serif italic tracking-wide text-[#2B2119]" style={{ fontFamily: "var(--font-cormorant)" }}>
                                John David <span className="not-italic text-xl text-[#542A00]">ッ</span>
                            </span>
                        </div>
                        <p className="text-[14px] text-[#2B2119]/80 leading-[1.8] font-serif italic max-w-md" style={{ fontFamily: "var(--font-cormorant)" }}>
                            Founder &amp; Lead Consultant of JADE Consult, professional writer, mindset engineer, and executive career coach based in Ghana. Dedicated to structuring messaging that builds credibility and influence.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/#about"
                                className="inline-flex items-center text-[10px] font-bold tracking-[0.25em] text-[#542A00] hover:text-[#3D1E00] transition-colors duration-300 uppercase group"
                            >
                                Read Full Biography
                                <span className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Navigation Links */}
                    <div className="lg:col-span-3 lg:col-start-7 space-y-5">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#542A00] font-display">
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
                                    <Link href={item.href} className="inline-flex items-center text-[13px] text-[#2B2119]/80 hover:text-[#542A00] hover:translate-x-1 transition-all duration-300 tracking-wide font-sans font-medium group">
                                        <span className="w-0 group-hover:w-3.5 h-[1.5px] bg-[#542A00] mr-0 group-hover:mr-2.5 transition-all duration-300 block"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Inquiries & Socials */}
                    <div className="lg:col-span-3 space-y-5">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#542A00] font-display">
                            Connect
                        </h3>
                        <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-[#2B2119]/60 font-semibold font-sans">For inquiries:</p>
                            <a 
                                href="mailto:johndavid@yorku.ca" 
                                className="text-[15px] text-[#2B2119] hover:text-[#542A00] font-semibold transition-colors duration-300 inline-block pb-0.5 border-b border-[#D8D0A6] hover:border-[#542A00]"
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
                                    className="w-9 h-9 border border-[#D8D0A6] rounded-full flex items-center justify-center text-[#2B2119]/80 bg-[#F5F1D5] hover:bg-[#542A00] hover:text-[#FFF8D8] hover:border-transparent transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Divider & Technical Marker */}
                <div className="mt-14 pt-8 border-t border-[#D8D0A6] flex flex-col sm:flex-row justify-between items-center gap-6 relative">
                    <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-8 h-[1px] bg-[#542A00]/40 hidden sm:block" />
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-[10px] text-[#2B2119]/60 tracking-[0.15em] font-mono uppercase">
                        <span>© {currentYear} John David. All rights reserved.</span>
                        <span className="hidden sm:inline text-[#542A00]/35">|</span>
                        <span>SYS_COORD_04 // FOOTER</span>
                    </div>
                    
                    <div className="flex gap-6 text-[10px] tracking-[0.2em] font-semibold uppercase">
                        <a href="#" className="text-[#2B2119]/60 hover:text-[#542A00] transition-colors duration-300">Privacy Policy</a>
                        <a href="#" className="text-[#2B2119]/60 hover:text-[#542A00] transition-colors duration-300">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
