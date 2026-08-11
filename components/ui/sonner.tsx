"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, InformationCircleIcon, Alert02Icon, MultiplicationSignCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 text-[#2D6A4F]" />
        ),
        info: (
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4 text-[#713600]" />
        ),
        warning: (
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 text-[#C05800]" />
        ),
        error: (
          <HugeiconsIcon icon={MultiplicationSignCircleIcon} strokeWidth={2} className="size-4 text-red-700" />
        ),
        loading: (
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin text-[#713600]" />
        ),
      }}
      style={
        {
          "--normal-bg": "#FAF7C8",
          "--normal-text": "#38240D",
          "--normal-border": "rgba(113, 54, 0, 0.20)",
          "--border-radius": "10px",
          "backdropFilter": "blur(8px)",
          "boxShadow": "0 8px 30px rgba(56, 36, 13, 0.08)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast border border-[#713600]/20 bg-[#FAF7C8] font-sans p-4 shadow-md",
          title: "text-[#38240D] font-bold text-[13px] font-sans tracking-wide",
          description: "text-[#38240D]/75 text-[11px] mt-1 font-sans",
          actionButton: "!bg-[#713600] !text-[#FDFBD4] hover:!bg-[#C05800] !font-bold !rounded-md !px-3 !py-1.5 !text-[10px] !uppercase !tracking-wider transition-all duration-300",
          cancelButton: "!bg-transparent !text-[#38240D]/70 hover:!text-[#38240D] hover:!bg-[#713600]/10 !border !border-[#713600]/20 !font-bold !rounded-md !px-3 !py-1.5 !text-[10px] !uppercase !tracking-wider transition-all duration-300",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
