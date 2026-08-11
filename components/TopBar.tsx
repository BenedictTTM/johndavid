'use client';

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from 'next/link';

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/#about", label: "About" },
    { to: "/#contact", label: "Contact" },
    { to: "/blog", label: "Blog" },
  ];

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

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-3 md:pt-4">
      <div
        className={`container mx-auto transition-all duration-300 ${isScrolled ? "max-w-4xl px-4" : "max-w-7xl px-6"}`}>
        <nav
          className={`flex items-center justify-between px-6 py-2.5 md:py-3 transition-all duration-300 ${
            isScrolled
              ? "bg-[#FAF7C8]/90 backdrop-blur-md rounded-full border border-[#713600]/15 shadow-md shadow-[#713600]/5"
              : "bg-transparent border-b border-transparent"
          }`}>
          {/* Logo */}
          <div className="flex-1 md:flex-initial md:w-[160px]">
            <Link href="/" className="text-xl font-serif italic tracking-wide text-[#38240D] hover:text-[#713600] transition-colors duration-300">
              David <span className="not-italic text-lg text-[#713600]">ッ</span>
            </Link>
          </div>

          {/* Centered Desktop Nav Items */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-10">
            {navItems
              .filter(item => item.label !== "Contact")
              .map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  className="relative text-xs uppercase tracking-[0.2em] font-semibold text-[#38240D]/80 hover:text-[#713600] transition-colors duration-300 group py-1.5"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#713600] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
          </div>

          {/* Right Side: Contact Button on Desktop, Menu Button on Mobile */}
          <div className="flex items-center justify-end md:w-[160px]">
            {navItems
              .filter(item => item.label === "Contact")
              .map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  className="hidden md:inline-flex items-center justify-center bg-[#713600] hover:bg-[#C05800] text-[#FDFBD4] font-semibold tracking-widest uppercase text-[11px] px-5 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {item.label}
                </Link>
              ))}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#38240D] hover:text-[#713600] transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              type="button"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 z-40" role="dialog" aria-modal="true">
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-[#38240D]/40 backdrop-blur-xs"
              onClick={closeMenu}
            />

            {/* panel */}
            <div className="absolute top-[20px] left-4 right-4 mx-auto max-w-md">
              <div
                className="bg-[#FAF7C8] backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-[#713600]/20 transform transition duration-250"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#713600]/15">
                  <Link href="/" onClick={closeMenu} className="text-xl font-serif italic tracking-wide text-[#38240D] hover:text-[#713600] transition-colors duration-300">
                    David <span className="not-italic text-lg text-[#713600]">ッ</span>
                  </Link>
                  <button onClick={closeMenu} aria-label="Close menu" className="p-2 text-[#38240D]/70 hover:text-[#713600] hover:bg-[#713600]/5 rounded-full transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      href={item.to}
                      onClick={closeMenu}
                      className="block text-[#38240D] hover:text-[#713600] text-xs uppercase tracking-[0.2em] py-3.5 px-4 rounded-lg font-semibold hover:bg-[#713600]/8 transition-all duration-300"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
