"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function SplitHero() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [btnCoords, setBtnCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnCoords({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setBtnCoords({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full pt-20 sm:pt-24 lg:pt-20 pb-8 md:pb-12 overflow-hidden text-[#2B2119] font-sans">
      {/* Visual coordinate markers */}
      <div className="absolute left-6 top-8 hidden md:block text-[9px] text-[#2B2119]/35 tracking-[0.3em] uppercase select-none pointer-events-none font-mono">
        01 // PORTFOLIO HERO
      </div>
      <div className="absolute right-6 top-8 hidden md:block text-[9px] text-[#2B2119]/35 tracking-[0.3em] uppercase select-none pointer-events-none font-mono">
        ACCRA // GHANA
      </div>

      <div className="max-w-7xl xl:max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 min-h-[calc(100vh-7rem)] lg:min-h-[calc(100vh-6rem)]">
        {/* LEFT COLUMN - CONTENT */}
        <div className="w-full lg:w-[54%] xl:w-[52%] z-20 flex flex-col items-center lg:items-start lg:pl-4 xl:pl-8 2xl:pl-12 lg:my-auto text-center lg:text-left">
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 mb-4 sm:mb-6 select-none"
          >
            <div className="w-5 sm:w-6 h-[2px] bg-[#542A00]" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#542A00]">
              Executive Positioning &amp; Ghostwriting
            </span>
          </motion.div>

          {/* MAIN HEADLINE */}
          <div className="relative mb-4 sm:mb-6 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                text-[40px]
                xs:text-[46px]
                sm:text-[62px]
                md:text-[76px]
                lg:text-[70px]
                xl:text-[84px]
                2xl:text-[92px]
                font-display
                font-extrabold
                leading-[0.9]
                tracking-tight
                uppercase
                text-[#2B2119]
                mb-2
                select-none
              "
            >
              <span className="block text-[#2B2119] font-extrabold tracking-tight">
                Mindset
              </span>
              <span 
                className="block text-[#542A00] font-serif italic font-normal tracking-wide -mt-1 sm:-mt-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Engineer
              </span>
            </motion.h1>
          </div>

          {/* HERO SUBTEXT */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              text-[14px]
              sm:text-[15px]
              md:text-[16px]
              leading-relaxed
              text-[#2B2119]/80
              max-w-md
              sm:max-w-lg
              tracking-wide
              font-normal
              mb-6
              sm:mb-8
              mx-auto
              lg:mx-0
            "
          >
            Trusted by founders, corporate executives, and leaders to engineer high-impact narratives, publish enduring books, and command boardroom influence across global stages.
          </motion.p>

          {/* ACTIONS & METRICS SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              w-full
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              lg:justify-start
              gap-6
              sm:gap-8
              md:gap-10
            "
          >
            {/* Primary CTA Button */}
            <Link href="#contact" className="w-full sm:w-auto flex justify-center">
              <motion.button
                ref={buttonRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ x: btnCoords.x, y: btnCoords.y }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                className="
                  relative
                  group
                  px-6
                  py-3.5
                  sm:px-8
                  sm:py-4
                  w-full
                  sm:w-auto
                  min-w-[200px]
                  max-w-[280px]
                  sm:max-w-none
                  justify-center
                  rounded-lg
                  overflow-hidden
                  bg-[#542A00]
                  text-[#FFF8D8]
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  font-bold
                  shadow-[0_4px_16px_rgba(84,42,0,0.25)]
                  hover:bg-[#3D1E00]
                  hover:shadow-[0_6px_24px_rgba(84,42,0,0.3)]
                  transition-all
                  duration-300
                  flex
                  items-center
                  gap-3
                  cursor-pointer
                "
              >
                <span className="relative z-10 flex items-center gap-2.5 text-[#FFF8D8]">
                  <Calendar size={14} className="text-[#FFF8D8]" />
                  Schedule a Call
                </span>
              </motion.button>
            </Link>

            {/* METRICS - Refined editorial block */}
            <div className="flex gap-8 sm:gap-8 md:gap-10 border-t sm:border-t-0 sm:border-l border-[#D8D0A6] pt-4 sm:pt-0 pl-0 sm:pl-8 md:pl-10 py-1 justify-center sm:justify-start w-full sm:w-auto">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-2xl sm:text-3xl font-bold text-[#542A00] leading-none mb-1 font-display">
                  6+
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#2B2119]/70 font-semibold whitespace-nowrap">
                  Manuscripts
                </span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-2xl sm:text-3xl font-bold text-[#542A00] leading-none mb-1 font-display">
                  250+
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#2B2119]/70 font-semibold whitespace-nowrap">
                  Leaders Coached
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN - PORTRAIT */}
        <div
          className="
            relative
            w-full
            lg:w-[46%]
            xl:w-[48%]
            flex
            justify-center
            lg:justify-end
            items-end
            lg:items-center
            mt-4
            lg:mt-0
            z-10
          "
        >
          {/* EDITORIAL SIDEBAR NAVIGATION */}
          <div
            className="
              absolute
              right-0
              xl:right-2
              top-1/2
              -translate-y-1/2
              hidden
              xl:flex
              flex-col
              gap-8
              text-right
              z-30
            "
          >
            {["ABOUT", "BLOG", "CONTACT"].map((item) => {
              const isActive = item === "ABOUT";
              return (
                <div key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className={`
                      group
                      relative
                      ${isActive ? "text-[#542A00] font-bold" : "text-[#2B2119]/60 font-semibold"}
                      hover:text-[#542A00]
                      text-[10px]
                      tracking-[0.35em]
                      flex
                      justify-end
                      items-center
                      gap-6
                      transition-colors
                      duration-300
                      py-2
                    `}
                  >
                    {item}
                    <span
                      className={`
                        w-2
                        h-2
                        rounded-full
                        border
                        transition-all
                        duration-300
                        ${isActive
                          ? "bg-[#542A00] border-[#542A00] scale-125"
                          : "bg-transparent border-[#2B2119]/40 group-hover:bg-[#542A00] group-hover:border-[#542A00] group-hover:scale-125"}
                      `}
                    />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* HERO PORTRAIT */}
          <div
            className="
              relative
              w-full
              max-w-[320px]
              sm:max-w-[400px]
              md:max-w-[440px]
              lg:max-w-[480px]
              xl:max-w-[540px]
              aspect-[4/5]
              z-10
            "
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.25,
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-full h-full"
            >
              {/* Soft warm background aura */}
              <div className="absolute inset-0 bg-[#542A00]/5 blur-[80px] rounded-full -z-10" />

              <Image
                src="/jade.png"
                alt="John David E. Afeti"
                fill
                priority
                className="
                  object-contain
                  object-bottom
                  drop-shadow-[0_12px_32px_rgba(43,33,25,0.15)]
                  z-10
                "
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}