import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
    Feather,
    FlaskConical,
    Dna,
    Cpu,
    Sparkles,
    Users,
    BookOpen,
} from "lucide-react";

/**
 * Publication Configuration Interface
 * Defines metadata and icon representation for a publication or author channel.
 */
export interface PublicationConfig {
    id: string;
    name: string;
    icon: ComponentType<LucideProps>;
    description?: string;
}

/**
 * Publications Registry
 * Add new publications here to automatically map them to custom icons across all cards.
 */
export const PUBLICATIONS_CONFIG: Record<string, PublicationConfig> = {
    pasion: {
        id: "pasion",
        name: "Pasion",
        icon: Feather, // Elegant feather/quill-style icon
        description: "Personal essays, thoughts, and publications",
    },
    research: {
        id: "research",
        name: "Research",
        icon: FlaskConical,
        description: "Scientific and biomedical research updates",
    },
    bioinformatics: {
        id: "bioinformatics",
        name: "Bioinformatics",
        icon: Dna,
        description: "Genomics, computational biology, and data science",
    },
    engineering: {
        id: "engineering",
        name: "Engineering",
        icon: Cpu,
        description: "Hardware, medical devices, and bioengineering systems",
    },
    "ai & health": {
        id: "ai-health",
        name: "AI & Health",
        icon: Sparkles,
        description: "Artificial intelligence applied to healthcare and medicine",
    },
    mentorship: {
        id: "mentorship",
        name: "Mentorship",
        icon: Users,
        description: "Academic guidance, leadership, and student mentorship",
    },
    community: {
        id: "community",
        name: "Community",
        icon: Users,
        description: "Outreach, academic collaborations, and community events",
    },
    article: {
        id: "article",
        name: "Article",
        icon: BookOpen,
        description: "Long-form editorial articles and scholarly publications",
    },
};

/** Default publication configuration used as an elegant fallback */
export const DEFAULT_PUBLICATION_CONFIG: PublicationConfig = {
    id: "default",
    name: "Pasion",
    icon: Feather,
    description: "Default publication channel",
};

/**
 * Resolves the configuration for a given publication name (case-insensitive).
 */
export function getPublicationConfig(publicationName?: string): PublicationConfig {
    if (!publicationName) return DEFAULT_PUBLICATION_CONFIG;
    const normalized = publicationName.trim().toLowerCase();
    
    if (PUBLICATIONS_CONFIG[normalized]) {
        return PUBLICATIONS_CONFIG[normalized];
    }

    return {
        ...DEFAULT_PUBLICATION_CONFIG,
        id: normalized,
        name: publicationName,
    };
}
