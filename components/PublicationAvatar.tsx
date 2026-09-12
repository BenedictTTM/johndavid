"use client";

import React from "react";
import { getPublicationConfig, type PublicationConfig } from "@/lib/publications";

interface PublicationIconProps {
    publication?: string;
    className?: string;
    size?: number;
    strokeWidth?: number;
}

/**
 * Renders the custom SVG icon assigned to a publication/author.
 */
export function PublicationIcon({
    publication,
    className = "w-[18px] h-[18px] text-[#713600] stroke-[1.75]",
    size,
    strokeWidth,
}: PublicationIconProps) {
    const config: PublicationConfig = getPublicationConfig(publication);
    const IconComponent = config.icon;

    return (
        <IconComponent
            className={className}
            size={size}
            strokeWidth={strokeWidth}
            aria-hidden="true"
        />
    );
}

interface PublicationAvatarProps {
    publication?: string;
    size?: "sm" | "md";
    className?: string;
    iconClassName?: string;
}

/**
 * Renders the styled avatar container with the publication's custom icon.
 * Preserves the exact styling, border radius, dimensions, and shadows of the existing design.
 */
export default function PublicationAvatar({
    publication,
    size = "md",
    className = "",
    iconClassName = "",
}: PublicationAvatarProps) {
    const config = getPublicationConfig(publication);

    if (size === "sm") {
        return (
            <div
                className={`w-4.5 h-4.5 rounded-[4px] bg-[#1A2129] flex items-center justify-center shrink-0 border border-white/10 overflow-hidden ${className}`}
                title={config.name}
                aria-label={config.name}
            >
                <PublicationIcon
                    publication={publication}
                    className={`w-2.5 h-2.5 text-slate-300 stroke-[2] ${iconClassName}`}
                />
            </div>
        );
    }

    // Default 'md' circular avatar (40px x 40px)
    return (
        <div
            className={`w-10 h-10 rounded-full overflow-hidden bg-[#713600]/10 flex items-center justify-center shrink-0 border border-[#713600]/15 shadow-2xs ${className}`}
            title={config.name}
            aria-label={config.name}
        >
            <PublicationIcon
                publication={publication}
                className={`w-[18px] h-[18px] text-[#713600] stroke-[1.75] ${iconClassName}`}
            />
        </div>
    );
}
