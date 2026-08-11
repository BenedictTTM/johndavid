"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

function TypographicNameplate() {
  return (
    <div
      className="
        relative
        flex
        flex-col
        items-center
        justify-center
        py-4
        px-6
        sm:py-4
        sm:px-12
        rounded-lg
        border
        border-[#713600]/15
        bg-[#FAF7C8]/80
        backdrop-blur-md
        shadow-[0_4px_20px_rgba(56,36,13,0.06)]
        max-w-[280px]
        sm:max-w-sm
        mx-auto
        overflow-hidden
        transition-all
        duration-500
        hover:border-[#713600]/30
        hover:shadow-[0_8px_30px_rgba(113,54,0,0.1)]
      "
    >
      {/* Primary brand marker on left edge */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-9 bg-[#713600] rounded-r" />

      {/* Modern Editorial Name */}
      <span
        className="
          text-[18px]
          sm:text-[22px]
          md:text-[25px]
          tracking-[0.28em]
          leading-none
          whitespace-nowrap
          text-center
          font-serif
          italic
          font-semibold
          text-[#713600]
          mb-3
          sm:mb-3.5
          select-none
        "
        style={{
          fontFamily: "var(--font-cormorant)",
        }}
      >
        JOHN DAVID
      </span>

      {/* Warm horizontal divider */}
      <div className="w-14 h-[1px] bg-[#713600]/20 mb-3.5" />

      {/* Editorial Subtitle */}
      <span className="text-[9px] sm:text-[10px] tracking-[0.28em] sm:tracking-[0.32em] uppercase font-bold text-[#38240D]/75 leading-none whitespace-nowrap select-none font-sans">
        Creative Developer & Scholar
      </span>
    </div>
  );
}

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
    <div className="relative w-full pt-16 lg:pt-12 overflow-hidden text-[#38240D] font-sans">
      {/* Visual coordinate markers */}
      <div className="absolute left-6 top-8 hidden md:block text-[9px] text-[#38240D]/30 tracking-[0.3em] uppercase select-none pointer-events-none font-mono">
        01 // PORTFOLIO HERO
      </div>
      <div className="absolute right-6 top-8 hidden md:block text-[9px] text-[#38240D]/30 tracking-[0.3em] uppercase select-none pointer-events-none font-mono">
        SYS_VER: 2026.05
      </div>

      {/* Main Grid-Aligned Composition */}
      <div
        className="
          relative
          z-10
          flex
          flex-col
          lg:flex-row
          w-full
          h-auto
          max-w-[1800px]
          mx-auto
          px-4
          md:px-6
          lg:px-12
          xl:px-20
          gap-6
          lg:gap-8
        "
      >
        {/* LEFT COLUMN - CONTENT */}
        <div
          className="
            w-full
            lg:flex-1
            flex
            flex-col
            justify-start
            items-center
            lg:items-start
            text-center
            lg:text-left
            pt-4
            lg:pt-6
            pb-2
            lg:pb-16
            z-20
            max-w-2xl
            mx-auto
            lg:mx-0
          "
        >
          {/* HERO HEADING - Brotheric display text */}
          <div className="relative mb-4">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                flex
                flex-col
                items-center
                lg:items-start
                leading-[0.92]
                uppercase
                font-display
                tracking-tight
                select-none
              "
              style={{
                fontSize: "clamp(36px, 8vw, 88px)",
              }}
            >
              <span className="block text-[#38240D] font-extrabold tracking-tight text-center lg:text-left">
                Precisi
                <svg
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block w-[0.8em] h-[0.8em] mx-[0.05em] align-middle -translate-y-[0.1em]"
                >
                  <path
                    d="M21 6 A15 15 0 0 1 36 21"
                    stroke="#713600"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M21 36 A15 15 0 0 1 6 21"
                    stroke="#713600"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="21" cy="21" r="2.5" fill="#713600" />
                  <line x1="21" y1="2" x2="21" y2="8" stroke="#713600" strokeWidth="1.2" />
                  <line x1="21" y1="34" x2="21" y2="40" stroke="#713600" strokeWidth="1.2" />
                </svg>
                n Engineer
              </span>

              {/* TYPOGRAPHIC NAMEPLATE */}
              <div className="relative w-full flex justify-center my-4 md:my-5">
                <TypographicNameplate />
              </div>
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
              text-[13px]
              md:text-[16px]
              leading-relaxed
              text-[#38240D]/80
              max-w-lg
              tracking-wide
              font-normal
              mb-6
            "
          >
            I&apos;ve earned the trust of over{" "}
            <span className="text-[#713600] font-semibold">250 clients</span> and{" "}
            <span className="text-[#713600] font-semibold">40 brands</span>, delivering
            award-winning digital experiences with absolute precision and premium
            polish.
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
              flex
              flex-col
              sm:flex-row
              items-center
              sm:items-center
              lg:items-start
              gap-8
              md:gap-12
            "
          >
            {/* Primary CTA Button */}
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
                py-4
                sm:px-8
                sm:py-4.5
                w-full
                sm:w-auto
                max-w-[320px]
                sm:max-w-none
                justify-center
                rounded-lg
                overflow-hidden
                bg-[#713600]
                text-[#FDFBD4]
                text-xs
                uppercase
                tracking-[0.2em]
                font-bold
                shadow-[0_4px_16px_rgba(113,54,0,0.25)]
                hover:bg-[#C05800]
                hover:shadow-[0_6px_24px_rgba(192,88,0,0.3)]
                transition-all
                duration-300
                flex
                items-center
                gap-3
                cursor-pointer
              "
            >
              <span className="relative z-10 flex items-center gap-2.5 text-[#FDFBD4]">
                <Calendar size={14} className="text-[#FDFBD4]" />
                Schedule a Call
              </span>
            </motion.button>

            {/* METRICS - Refined editorial block */}
            <div className="flex gap-10 border-l-0 sm:border-l border-[#713600]/20 pl-0 sm:pl-8 md:pl-10 py-1 justify-center sm:justify-start">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-2xl md:text-3xl font-bold text-[#713600] leading-none mb-1.5 font-display">
                  600+
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#38240D]/70 font-semibold">
                  Projects
                </span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-2xl md:text-3xl font-bold text-[#713600] leading-none mb-1.5 font-display">
                  12+
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#38240D]/70 font-semibold">
                  Years Exp
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
            h-full
            lg:flex-1
            lg:h-auto
            flex
            justify-center
            lg:justify-end
            items-end
            lg:items-start
            lg:pt-12
            z-10
          "
        >
          {/* EDITORIAL SIDEBAR NAVIGATION */}
          <div
            className="
              absolute
              right-12
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
            {["ABOUT", "SERVICES", "CONTACT"].map((item) => {
              const isActive = item === "ABOUT";
              return (
                <div key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className={`
                      group
                      relative
                      ${isActive ? "text-[#713600] font-bold" : "text-[#38240D]/60 font-semibold"}
                      hover:text-[#C05800]
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
                          ? "bg-[#713600] border-[#713600] scale-125"
                          : "bg-transparent border-[#38240D]/40 group-hover:bg-[#C05800] group-hover:border-[#C05800] group-hover:scale-125"}
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
              max-w-[480px]
              lg:max-w-[560px]
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
              <div className="absolute inset-0 bg-[#713600]/5 blur-[80px] rounded-full -z-10" />

              <Image
                src="/dry.png"
                alt="John David Portrait"
                fill
                priority
                className="
                  object-contain
                  object-bottom
                  drop-shadow-[0_12px_32px_rgba(56,36,13,0.15)]
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