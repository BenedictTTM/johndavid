"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function WhoAmI() {
  return (
    <section className="relative py-20 md:py-28 lg:py-36 px-4 md:px-6 lg:px-12 xl:px-20 bg-transparent overflow-hidden">
      
      {/* SECTION COORDINATES */}
      <div className="absolute left-6 top-12 hidden md:block text-[9px] text-[#38240D]/30 tracking-[0.3em] uppercase select-none pointer-events-none font-mono">
        02 // ABOUT
      </div>
      
      {/* AMBIENT BACKGROUND SYSTEM */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(113,54,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,54,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-60 -z-10" />
      
      {/* Soft warm glowing ambient orbs */}
      <div className="absolute top-[15%] left-[-8%] w-[45%] h-[45%] bg-[#713600]/[0.04] blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[15%] right-[-8%] w-[45%] h-[45%] bg-[#C05800]/[0.03] blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Scientific precision engineering overlay vector */}
      <div className="absolute right-[5%] top-[10%] opacity-[0.12] pointer-events-none hidden lg:block -z-10">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#713600]">
          <circle cx="150" cy="150" r="130" stroke="currentColor" strokeWidth="0.75" strokeDasharray="6 6" />
          <circle cx="150" cy="150" r="80" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="150" cy="150" r="3" fill="currentColor" />
          <line x1="150" y1="10" x2="150" y2="290" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="10" y1="150" x2="290" y2="150" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="80" y1="80" x2="150" y2="150" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
          <line x1="220" y1="80" x2="150" y2="150" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
          <circle cx="80" cy="80" r="4" stroke="currentColor" strokeWidth="1" fill="#FDFBD4" />
          <circle cx="220" cy="80" r="4" stroke="currentColor" strokeWidth="1" fill="#FDFBD4" />
          <text x="160" y="30" fill="currentColor" fontSize="8" letterSpacing="0.1em" opacity="0.5" className="font-mono">R: 130mm</text>
          <text x="160" y="145" fill="currentColor" fontSize="8" letterSpacing="0.1em" opacity="0.5" className="font-mono">SYS_COORD_02</text>
        </svg>
      </div>

      {/* MAIN TWO-COLUMN ELEGANT COMPOSITION */}
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16 xl:gap-20">
        
        {/* COLUMN 1 - LUXURY PORTRAIT FRAMING */}
        <div className="w-full lg:w-[42%] flex justify-center lg:justify-start relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[3/4] group"
          >
            {/* Glassmorphic background container */}
            <div className="absolute inset-0 bg-[#FAF7C8] border border-[#713600]/15 rounded-2xl shadow-[0_8px_30px_rgba(56,36,13,0.06)] backdrop-blur-3xl transition-all duration-500 group-hover:border-[#713600]/30 group-hover:shadow-[0_12px_40px_rgba(113,54,0,0.1)]"></div>

            {/* Corner ticks */}
            <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-[#713600] transition-all duration-300 group-hover:scale-110" />
            <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-[#713600] transition-all duration-300 group-hover:scale-110" />
            <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-[#713600] transition-all duration-300 group-hover:scale-110" />
            <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-[#713600] transition-all duration-300 group-hover:scale-110" />

            {/* Editorial image layout */}
            <div className="absolute inset-4 rounded-xl overflow-hidden border border-[#713600]/15 bg-[#FAF7C8] transition-all duration-500">
              <Image 
                src="/mba-headshot.jpg" 
                alt="John David Editorial Portrait"
                fill
                priority
                className="w-full h-full object-cover contrast-[1.05] saturate-[0.9] hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#38240D]/30 via-transparent to-transparent opacity-60 pointer-events-none z-10" />
            </div>

            {/* Coordinate info */}
            <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center z-20 select-none opacity-60 group-hover:opacity-90 transition-opacity duration-300">
              <span className="text-[8px] tracking-[0.25em] text-[#38240D] font-mono uppercase">POS: 43.6532° N, 79.3832° W</span>
              <span className="text-[8px] tracking-[0.25em] text-[#713600] font-mono uppercase font-bold">WHO_AM_I_02</span>
            </div>
          </motion.div>
        </div>

        {/* COLUMN 2 - TYPOGRAPHY & BIOGRAPHY */}
        <div className="flex-1 w-full relative z-10 mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            {/* Section Label */}
            <div className="flex items-center gap-3 mb-4 select-none">
              <div className="w-6 h-[2px] bg-[#713600]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#713600]">
                Who I Am
              </span>
            </div>

            {/* Display Headline */}
            <h2 
              className="font-display font-extrabold uppercase leading-[0.95] tracking-tight text-[#38240D] mb-6 text-balance select-none"
              style={{
                fontSize: "clamp(36px, 5vw, 62px)",
              }}
            >
              Bioengineering <br />
              <span 
                className="block text-[#713600] font-serif italic font-normal tracking-wide mt-2"
                style={{
                  fontFamily: "var(--font-cormorant)",
                }}
              >
                Researcher
              </span>
            </h2>

            {/* Editorial Content */}
            <div className="flex flex-col gap-4 max-w-[700px] mb-8">
              <p className="text-[14px] md:text-[15px] text-[#38240D]/85 leading-[1.8] font-sans font-normal tracking-wide">
                I am a{" "}
                <span className="text-[#713600] font-semibold">
                  Ghanaian Bioengineering Researcher
                </span>
                , scholar, and innovator based at{" "}
                <span className="text-[#713600] font-semibold">
                  York University
                </span>
                . Driven by a passion for medical discovery and technological precision, my work bridges the gap between biological complexity and advanced computational engineering.
              </p>

              <p className="text-[13px] md:text-[14px] text-[#38240D]/70 leading-[1.8] font-sans font-normal tracking-wide">
                Through rigorous computational analysis and state-of-the-art laboratory experimentation, my research drives major leaps in{" "}
                <span className="text-[#713600] font-medium">
                  Medical Discovery
                </span>{" "}
                and{" "}
                <span className="text-[#713600] font-medium">
                  Computational Engineering
                </span>
                , designing new modalities for high-precision diagnostic and therapeutic systems.
              </p>
            </div>

            {/* Quote Block */}
            <div className="mt-2 relative pl-6 md:pl-8 py-3 border-l-[3px] border-[#713600] bg-[#FAF7C8] rounded-r-lg max-w-[650px] border border-l-0 border-[#713600]/10 shadow-xs">
              <p
                className="text-[15px] md:text-[17px] text-[#38240D] italic leading-[1.7] tracking-wide mb-2 font-serif"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                "Engineering is the disciplined art of turning ideas into reality with precision, purpose, and relentless curiosity."
              </p>
              <div className="text-[12px] md:text-[13px] font-semibold text-[#713600] uppercase tracking-wider">
                — John David
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
