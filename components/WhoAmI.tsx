"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function WhoAmI() {
  return (
    <section className="relative pt-8 md:pt-12 pb-10 md:pb-14 px-4 md:px-6 lg:px-12 xl:px-20 bg-transparent overflow-hidden">
      
      {/* SECTION COORDINATES */}
      <div className="absolute left-6 top-8 hidden md:block text-[9px] text-[#2B2119]/35 tracking-[0.3em] uppercase select-none pointer-events-none font-mono">
        02 // ABOUT
      </div>
      
      {/* AMBIENT BACKGROUND SYSTEM */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(84,42,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(84,42,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-60 -z-10" />
      
      {/* Soft warm glowing ambient orbs */}
      <div className="absolute top-[15%] left-[-8%] w-[45%] h-[45%] bg-[#542A00]/[0.04] blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[15%] right-[-8%] w-[45%] h-[45%] bg-[#D97932]/[0.02] blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Scientific precision engineering overlay vector */}
      <div className="absolute right-[5%] top-[10%] opacity-[0.12] pointer-events-none hidden lg:block -z-10">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#542A00]">
          <circle cx="150" cy="150" r="130" stroke="currentColor" strokeWidth="0.75" strokeDasharray="6 6" />
          <circle cx="150" cy="150" r="80" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="150" cy="150" r="3" fill="currentColor" />
          <line x1="150" y1="10" x2="150" y2="290" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="10" y1="150" x2="290" y2="150" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="80" y1="80" x2="150" y2="150" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
          <line x1="220" y1="80" x2="150" y2="150" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
          <circle cx="80" cy="80" r="4" stroke="currentColor" strokeWidth="1" fill="#FFF8D8" />
          <circle cx="220" cy="80" r="4" stroke="currentColor" strokeWidth="1" fill="#FFF8D8" />
          <text x="160" y="30" fill="currentColor" fontSize="8" letterSpacing="0.1em" opacity="0.5" className="font-mono">R: 130mm</text>
          <text x="160" y="145" fill="currentColor" fontSize="8" letterSpacing="0.1em" opacity="0.5" className="font-mono">SYS_COORD_02</text>
        </svg>
      </div>

      {/* MAIN TWO-COLUMN ELEGANT COMPOSITION */}
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-14 xl:gap-18">
        
        {/* COLUMN 1 - LUXURY PORTRAIT FRAMING (Hidden on mobile) */}
        <div className="hidden lg:flex w-full lg:w-[42%] justify-center lg:justify-start relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[3/4] group"
          >
            {/* Glassmorphic background container */}
            <div className="absolute inset-0 bg-[#FFF8D8] border border-[#D8D0A6] rounded-2xl shadow-[0_8px_30px_rgba(43,33,25,0.06)] backdrop-blur-3xl transition-all duration-500 group-hover:border-[#542A00]/40 group-hover:shadow-[0_12px_40px_rgba(84,42,0,0.1)]"></div>

            {/* Corner ticks */}
            <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-[#542A00] transition-all duration-300 group-hover:scale-110" />
            <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-[#542A00] transition-all duration-300 group-hover:scale-110" />
            <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-[#542A00] transition-all duration-300 group-hover:scale-110" />
            <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-[#542A00] transition-all duration-300 group-hover:scale-110" />

            {/* Editorial image layout */}
            <div className="absolute inset-4 rounded-xl overflow-hidden border border-[#D8D0A6] bg-[#FFF8D8] transition-all duration-500">
              <Image 
                src="/mba-headshot.jpg" 
                alt="John David Editorial Portrait"
                fill
                priority
                className="w-full h-full object-cover contrast-[1.05] saturate-[0.9] hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2119]/30 via-transparent to-transparent opacity-60 pointer-events-none z-10" />
            </div>

            {/* Coordinate info */}
            <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center z-20 select-none opacity-60 group-hover:opacity-90 transition-opacity duration-300">
              <span className="text-[8px] tracking-[0.25em] text-[#2B2119] font-mono uppercase">POS: 5.6037° N, 0.1870° W (ACCRA)</span>
              <span className="text-[8px] tracking-[0.25em] text-[#542A00] font-mono uppercase font-bold">FOUNDER // JADE_CONSULT</span>
            </div>
          </motion.div>
        </div>

        {/* COLUMN 2 - TYPOGRAPHY & BIOGRAPHY */}
        <div className="flex-1 w-full relative z-10 mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            {/* Section Label */}
            <div className="flex items-center gap-3 mb-3 select-none">
              <div className="w-6 h-[2px] bg-[#542A00]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#542A00]">
                Who I Am
              </span>
            </div>

            {/* Display Headline */}
            <h2 
              className="font-display font-extrabold uppercase leading-[0.95] tracking-tight text-[#2B2119] mb-5 text-balance select-none"
              style={{
                fontSize: "clamp(32px, 4.2vw, 52px)",
              }}
            >
              Mindset Engineer <br />
              <span 
                className="block text-[#542A00] font-serif italic font-normal tracking-wide mt-1.5"
                style={{
                  fontFamily: "var(--font-cormorant)",
                }}
              >
                &amp; Lead Consultant
              </span>
            </h2>

            {/* Editorial Content */}
            <div className="flex flex-col gap-3.5 max-w-[700px] mb-5">
              <p className="text-[14px] md:text-[15px] text-[#2B2119]/85 leading-[1.75] font-sans font-normal tracking-wide">
                I am <span className="text-[#542A00] font-semibold">John David E. Afeti</span> (often referred to as John David), the Founder and Lead Consultant of{" "}
                <a 
                  href="https://jadeconsult.uk/about" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#542A00] font-semibold underline underline-offset-4 decoration-[#542A00]/30 hover:decoration-[#542A00] transition-colors"
                >
                  JADE Consult
                </a>
                —a premier career consultancy and professional writing firm. As a professional writer, career coach, public speaker, and corporate trainer based in Ghana, I operate at the intersection of executive positioning, narrative strategy, and strategic career advancement.
              </p>

              <p className="text-[13px] md:text-[14px] text-[#2B2119]/75 leading-[1.75] font-sans font-normal tracking-wide">
                Identifying as a <span className="text-[#542A00] font-medium">&ldquo;mindset engineer,&rdquo;</span> I help founders, executives, academics, entrepreneurs, and ministers transform their messaging to command credibility and authority. Having completed over six full-length book manuscripts and spoken at high-level platforms including the <span className="text-[#542A00] font-medium">Career Expo Africa at the Google AI Center in Accra</span>, I equip leaders with recruiter-verified strategies, ATS optimization, and enduring personal legacies.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 max-w-[660px]">
              <div className="p-3 rounded-xl border border-[#D8D0A6] bg-[#FFF8D8]/70 backdrop-blur-xs">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#542A00]/65 block mb-1">Pillar 01</span>
                <p className="text-xs font-semibold text-[#2B2119]">Ghostwriting &amp; Books</p>
                <span className="text-[10px] text-[#2B2119]/60">6+ Completed Manuscripts</span>
              </div>
              <div className="p-3 rounded-xl border border-[#D8D0A6] bg-[#FFF8D8]/70 backdrop-blur-xs">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#542A00]/65 block mb-1">Pillar 02</span>
                <p className="text-xs font-semibold text-[#2B2119]">Career Consultancy</p>
                <span className="text-[10px] text-[#2B2119]/60">Executive Positioning &amp; ATS</span>
              </div>
              <div className="p-3 rounded-xl border border-[#D8D0A6] bg-[#FFF8D8]/70 backdrop-blur-xs col-span-2 sm:col-span-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#542A00]/65 block mb-1">Pillar 03</span>
                <p className="text-xs font-semibold text-[#2B2119]">Keynote Speaking</p>
                <span className="text-[10px] text-[#2B2119]/60">Google AI Center &amp; Summits</span>
              </div>
            </div>

            {/* Quote Block */}
            <div className="relative pl-6 md:pl-8 py-3.5 border-l-[3px] border-[#542A00] bg-[#FFF8D8] rounded-r-xl max-w-[660px] border border-l-0 border-[#D8D0A6] shadow-xs">
              <p
                className="text-[14px] md:text-[16px] text-[#2B2119] italic leading-[1.7] tracking-wide mb-2 font-serif"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                "Communication is not merely expression—it is a tool for strategic alignment. When you engineer your mindset, you structure your message to build credibility, bypass corporate hurdles, and command enduring influence."
              </p>
              <div className="flex items-center justify-between text-[11px] md:text-[12px] font-semibold text-[#542A00] uppercase tracking-wider">
                <span>— John David E. Afeti</span>
                <span className="text-[9px] font-mono font-normal text-[#2B2119]/50 lowercase">founder, jade consult</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
