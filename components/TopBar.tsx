'use client';

import { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  Home, 
  User, 
  BookOpen, 
  Mail, 
  ArrowRight, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Send 
} from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  to: string;
  label: string;
  desc: string;
  coord: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { to: "/", label: "Home", desc: "Main portfolio & executive overview", coord: "01", icon: Home },
  { to: "/#about", label: "About", desc: "Biography, mindset & consultation", coord: "02", icon: User },
  { to: "/blog", label: "Blog & Notes", desc: "Publications, thoughts & dispatches", coord: "03", icon: BookOpen },
  { to: "/#contact", label: "Contact", desc: "Direct inquiries & editorial message", coord: "04", icon: Mail },
];

const TopBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateHash = () => {
      if (typeof window !== "undefined") {
        setActiveHash(window.location.hash);
      }
    };
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isItemActive = (item: NavItem) => {
    if (item.to === "/") return pathname === "/" && !activeHash;
    if (item.to === "/blog") return pathname?.startsWith("/blog");
    if (item.to === "/#about") return pathname === "/" && activeHash === "#about";
    if (item.to === "/#contact") return pathname === "/" && activeHash === "#contact";
    return pathname === item.to;
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-2.5 sm:pt-3 md:pt-4 pointer-events-none">
      <div
        className={`mx-auto px-3.5 sm:px-6 transition-all duration-500 pointer-events-auto ${
          isScrolled ? "max-w-4xl" : "max-w-5xl"
        }`}>
        <nav
          className={`flex items-center justify-between px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all duration-300 border ${
            isScrolled
              ? "bg-[#FFF8D8]/92 backdrop-blur-xl border-[#D8D0A6] shadow-[0_8px_30px_rgba(43,33,25,0.08)] ring-1 ring-[#FFF8D8]/60"
              : "bg-[#FFF8D8]/85 backdrop-blur-lg border-[#D8D0A6] shadow-[0_4px_20px_rgba(43,33,25,0.05)] ring-1 ring-[#FFF8D8]/50"
          }`}>
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              onClick={() => setActiveHash("")}
              className="group flex items-center gap-1.5 py-0.5 select-none"
            >
              <span className="text-[17px] sm:text-[19px] font-serif italic tracking-wide text-[#2B2119] group-hover:text-[#542A00] transition-colors duration-300">
                David
              </span>
              <span className="text-base sm:text-lg text-[#542A00] font-sans not-italic font-bold transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                ッ
              </span>
            </Link>

            {/* Subtle editorial status badge on desktop */}
            <span className="hidden lg:inline-flex items-center gap-1.5 ml-3 pl-3 border-l border-[#D8D0A6] text-[9px] font-mono uppercase tracking-[0.2em] text-[#542A00]/60 font-semibold select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97932] animate-pulse" />
              Editorial
            </span>
          </div>

          {/* Centered Desktop Nav Items */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-10">
            {navItems
              .filter(item => item.label !== "Contact")
              .map((item) => {
                const active = isItemActive(item);
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    className={`relative text-[11px] uppercase tracking-[0.22em] font-semibold transition-colors duration-300 group py-1 ${
                      active ? "text-[#542A00]" : "text-[#2B2119]/75 hover:text-[#542A00]"
                    }`}
                  >
                    {item.label}
                    <span 
                      className={`absolute bottom-0 left-0 h-[1.5px] bg-[#542A00] transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`} 
                    />
                  </Link>
                );
              })}
          </div>

          {/* Right Side: Contact Button on Desktop, Menu Button on Mobile */}
          <div className="flex items-center gap-2">
            {navItems
              .filter(item => item.label === "Contact")
              .map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  className="hidden md:inline-flex items-center justify-center bg-[#542A00] hover:bg-[#3D1E00] text-[#FFF8D8] font-semibold tracking-widest uppercase text-[10px] px-4.5 py-1.5 rounded-full shadow-[0_2px_10px_rgba(84,42,0,0.18)] hover:shadow-[0_4px_16px_rgba(84,42,0,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {item.label}
                </Link>
              ))}

            {/* Custom Animated Mobile Menu Trigger */}
            <button
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-[#2B2119] hover:text-[#542A00] hover:bg-[#542A00]/[0.08] active:scale-90 transition-all duration-200 cursor-pointer"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              type="button"
            >
              <div className="w-4 h-3.5 flex flex-col justify-between items-end" aria-hidden="true">
                <span 
                  className={`h-[1.5px] bg-[#2B2119] rounded-full transition-all duration-300 ${
                    isOpen ? "w-4 rotate-45 translate-y-[5.5px]" : "w-4"
                  }`} 
                />
                <span 
                  className={`h-[1.5px] bg-[#542A00] rounded-full transition-all duration-200 ${
                    isOpen ? "opacity-0 w-0" : "w-2.5"
                  }`} 
                />
                <span 
                  className={`h-[1.5px] bg-[#2B2119] rounded-full transition-all duration-300 ${
                    isOpen ? "w-4 -rotate-45 -translate-y-[5.5px]" : "w-4"
                  }`} 
                />
              </div>
            </button>
          </div>
        </nav>

        {/* ── Enhanced Editorial Mobile Menu ────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <div className="md:hidden fixed inset-0 z-50 overflow-y-auto pointer-events-auto" role="dialog" aria-modal="true">
              {/* Backdrop with rich blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 bg-[#2B2119]/45 backdrop-blur-sm"
                onClick={closeMenu}
              />

              {/* Centered Panel */}
              <div className="relative min-h-full flex items-start justify-center p-3.5 pt-4 sm:p-5">
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-md bg-[#FFF8D8] border border-[#D8D0A6] rounded-[24px] shadow-[0_20px_50px_rgba(43,33,25,0.22)] overflow-hidden flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Subtle decorative grid lines background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(84,42,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(84,42,0,0.025)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />

                  {/* Modal Header */}
                  <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#D8D0A6]">
                    <div className="flex flex-col">
                      <Link 
                        href="/" 
                        onClick={() => {
                          setActiveHash("");
                          closeMenu();
                        }} 
                        className="text-xl font-serif italic tracking-wide text-[#2B2119] hover:text-[#542A00] transition-colors duration-300"
                      >
                        David <span className="not-italic text-lg text-[#542A00]">ッ</span>
                      </Link>
                      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#542A00]/65 font-bold mt-0.5">
                        00 // NAVIGATION INDEX
                      </span>
                    </div>

                    <button 
                      onClick={closeMenu} 
                      aria-label="Close menu" 
                      className="w-9 h-9 rounded-full border border-[#D8D0A6] bg-[#F5F1D5] text-[#2B2119] hover:bg-[#542A00] hover:text-[#FFF8D8] hover:border-transparent flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <X className="h-4 w-4 stroke-[2.25]" />
                    </button>
                  </div>

                  {/* Nav links with editorial coordinates & micro-animations */}
                  <nav className="relative z-10 p-3.5 flex flex-col gap-1.5">
                    {navItems.map((item, idx) => {
                      const active = isItemActive(item);
                      const Icon = item.icon;

                      return (
                        <motion.div
                          key={item.to}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * idx, duration: 0.25 }}
                        >
                          <Link
                            href={item.to}
                            onClick={() => {
                              if (item.to.startsWith("/#")) {
                                setActiveHash(item.to.substring(1));
                              } else {
                                setActiveHash("");
                              }
                              closeMenu();
                            }}
                            className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-200 border ${
                              active
                                ? "bg-[#542A00]/[0.08] border-[#542A00]/25 shadow-2xs"
                                : "border-transparent hover:bg-[#542A00]/[0.05] hover:border-[#D8D0A6]"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Icon Container */}
                              <div
                                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-colors duration-200 ${
                                  active
                                    ? "bg-[#542A00] border-[#542A00] text-[#FFF8D8]"
                                    : "bg-[#F5F1D5] border-[#D8D0A6] text-[#542A00] group-hover:bg-[#542A00] group-hover:text-[#FFF8D8] group-hover:border-[#542A00]"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>

                              {/* Label & Description */}
                              <div className="flex flex-col min-w-0 text-left">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#542A00]/65">
                                    {item.coord}
                                  </span>
                                  <span className="text-sm font-semibold tracking-wide text-[#2B2119] uppercase group-hover:text-[#542A00] transition-colors">
                                    {item.label}
                                  </span>
                                </div>
                                <span className="text-[11px] text-[#2B2119]/60 font-serif italic truncate mt-0.5">
                                  {item.desc}
                                </span>
                              </div>
                            </div>

                            {/* Right Status / Arrow Indicator */}
                            <div className="flex items-center shrink-0 pl-2">
                              {active ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#542A00] text-[#FFF8D8]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97932] animate-pulse" />
                                  Current
                                </span>
                              ) : (
                                <ArrowRight className="w-4 h-4 text-[#542A00]/45 group-hover:text-[#542A00] group-hover:translate-x-0.5 transition-all" />
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* ── Bottom Section: Direct Dispatch & Socials ───────── */}
                  <div className="relative z-10 px-4 pt-3.5 pb-4.5 bg-[#FFF8D8]/90 border-t border-[#D8D0A6] flex flex-col gap-3">
                    {/* Quick Dispatch Banner */}
                    <div className="p-3.5 rounded-2xl bg-[#F5F1D5] border border-[#D8D0A6] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-[#542A00]/65 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97932] animate-pulse" />
                          Direct Dispatch
                        </span>
                        <span className="text-[9px] font-mono text-[#2B2119]/50 uppercase font-semibold">
                          Ghana // GMT
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-3">
                        <a 
                          href="mailto:johndavid@yorku.ca"
                          className="text-xs font-semibold text-[#2B2119] hover:text-[#542A00] transition-colors truncate"
                        >
                          johndavid@yorku.ca
                        </a>

                        <Link
                          href="/#contact"
                          onClick={() => {
                            setActiveHash("contact");
                            closeMenu();
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#542A00] hover:bg-[#3D1E00] text-[#FFF8D8] transition-all shrink-0 shadow-2xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Write</span>
                        </Link>
                      </div>
                    </div>

                    {/* Socials & Technical Coordinate */}
                    <div className="flex items-center justify-between pt-1 px-1">
                      <div className="flex items-center gap-2">
                        {[
                          { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                          { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                          { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                          { Icon: Mail, href: "mailto:johndavid@yorku.ca", label: "Email" },
                        ].map((social, i) => (
                          <a
                            key={i}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="w-8 h-8 rounded-full border border-[#D8D0A6] bg-[#F5F1D5] text-[#2B2119]/75 hover:bg-[#542A00] hover:text-[#FFF8D8] hover:border-transparent flex items-center justify-center transition-all duration-200"
                          >
                            <social.Icon className="w-3.5 h-3.5" />
                          </a>
                        ))}
                      </div>

                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#542A00]/45 font-semibold select-none">
                        SYS_NAV_01
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default TopBar;

