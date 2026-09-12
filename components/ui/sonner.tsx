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
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4 text-[#542A00]" />
        ),
        warning: (
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4 text-[#D97932]" />
        ),
        error: (
          <HugeiconsIcon icon={MultiplicationSignCircleIcon} strokeWidth={2} className="size-4 text-red-700" />
        ),
        loading: (
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin text-[#542A00]" />
        ),
      }}
      style={
        {
          "--normal-bg": "#FFF8D8",
          "--normal-text": "#2B2119",
          "--normal-border": "rgba(84, 42, 0, 0.20)",
          "--border-radius": "10px",
          "backdropFilter": "blur(8px)",
          "boxShadow": "0 8px 30px rgba(43, 33, 25, 0.08)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast border border-[#D8D0A6] bg-[#FFF8D8] font-sans p-4 shadow-md",
          title: "text-[#2B2119] font-bold text-[13px] font-sans tracking-wide",
          description: "text-[#2B2119]/75 text-[11px] mt-1 font-sans",
          actionButton: "!bg-[#542A00] !text-[#FFF8D8] hover:!bg-[#3D1E00] !font-bold !rounded-md !px-3 !py-1.5 !text-[10px] !uppercase !tracking-wider transition-all duration-300",
          cancelButton: "!bg-transparent !text-[#2B2119]/70 hover:!text-[#2B2119] hover:!bg-[#542A00]/10 !border !border-[#D8D0A6] !font-bold !rounded-md !px-3 !py-1.5 !text-[10px] !uppercase !tracking-wider transition-all duration-300",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
