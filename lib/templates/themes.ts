import type { CV, Template } from "@/lib/cv/schema"

export interface TemplateTheme {
  id: Template
  name: string
  colors: {
    // Body
    text: string
    background: string
    muted: string
    secondary: string
    // Header
    headerBackground: string
    headerName: string
    headerTitle: string
    headerContact: string
    headerBorder: string
    // Section titles
    sectionTitleText: string
    sectionTitleBorder: string
    // Items
    itemTitle: string
    // Skill badges
    skillBadgeBackground: string
    skillBadgeText: string
    skillBadgeBorder: string | undefined
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: {
    sectionGap: number
    itemGap: number
    pageMargin: number
  }
  header: {
    /** When true a full-bleed colored band is rendered */
    hasDarkBackground: boolean
    /** Bottom border width (0 = none) */
    borderBottomWidth: number
  }
  sectionTitle: {
    fontSize: number
    borderBottomWidth: number
    letterSpacing: number
  }
}

// Tailwind color equivalents used in cv-preview.tsx
// gray-50=#f9fafb  gray-100=#f3f4f6  gray-300=#d1d5db  gray-500=#6b7280
// gray-600=#4b5563  gray-700=#374151  gray-800=#1f2937  gray-900=#111827
// blue-100=#dbeafe  blue-500=#3b82f6  blue-800=#1e40af

export const templateThemes: Record<Template, TemplateTheme> = {
  modern: {
    id: "modern",
    name: "Modern",
    colors: {
      text: "#1f2937",         // gray-800
      background: "#ffffff",
      muted: "#4b5563",        // gray-600
      secondary: "#374151",    // gray-700
      headerBackground: "#111827", // gray-900
      headerName: "#ffffff",
      headerTitle: "#d1d5db",  // gray-300
      headerContact: "#d1d5db",// gray-300
      headerBorder: "#111827",
      sectionTitleText: "#111827", // gray-900
      sectionTitleBorder: "#3b82f6", // blue-500
      itemTitle: "#111827",    // gray-900
      skillBadgeBackground: "#dbeafe", // blue-100
      skillBadgeText: "#1e40af",       // blue-800
      skillBadgeBorder: undefined,
    },
    fonts: {
      heading: "Helvetica-Bold",
      body: "Helvetica",
    },
    spacing: {
      sectionGap: 16,
      itemGap: 10,
      pageMargin: 40,
    },
    header: {
      hasDarkBackground: true,
      borderBottomWidth: 0,
    },
    sectionTitle: {
      fontSize: 11,
      borderBottomWidth: 2,
      letterSpacing: 0,
    },
  },

  classic: {
    id: "classic",
    name: "Classic",
    colors: {
      text: "#1f2937",         // gray-800
      background: "#ffffff",
      muted: "#4b5563",        // gray-600
      secondary: "#4b5563",    // gray-600
      headerBackground: "#ffffff",
      headerName: "#111827",   // gray-900
      headerTitle: "#374151",  // gray-700
      headerContact: "#4b5563",// gray-600
      headerBorder: "#1f2937", // gray-800
      sectionTitleText: "#111827", // gray-900
      sectionTitleBorder: "#d1d5db", // gray-300
      itemTitle: "#111827",    // gray-900
      skillBadgeBackground: "#f3f4f6", // gray-100
      skillBadgeText: "#1f2937",       // gray-800
      skillBadgeBorder: "#d1d5db",     // gray-300
    },
    fonts: {
      heading: "Times-Bold",
      body: "Times-Roman",
    },
    spacing: {
      sectionGap: 14,
      itemGap: 8,
      pageMargin: 50,
    },
    header: {
      hasDarkBackground: false,
      borderBottomWidth: 2,
    },
    sectionTitle: {
      fontSize: 11,
      borderBottomWidth: 1,
      letterSpacing: 1,
    },
  },

  minimal: {
    id: "minimal",
    name: "Minimal",
    colors: {
      text: "#374151",         // gray-700
      background: "#ffffff",
      muted: "#6b7280",        // gray-500
      secondary: "#6b7280",    // gray-500
      headerBackground: "#ffffff",
      headerName: "#111827",   // gray-900
      headerTitle: "#6b7280",  // gray-500
      headerContact: "#6b7280",// gray-500
      headerBorder: "transparent",
      sectionTitleText: "#6b7280", // gray-500
      sectionTitleBorder: "transparent",
      itemTitle: "#111827",    // gray-900
      skillBadgeBackground: "#f9fafb", // gray-50
      skillBadgeText: "#374151",       // gray-700
      skillBadgeBorder: undefined,
    },
    fonts: {
      heading: "Helvetica-Bold",
      body: "Helvetica",
    },
    spacing: {
      sectionGap: 20,
      itemGap: 12,
      pageMargin: 45,
    },
    header: {
      hasDarkBackground: false,
      borderBottomWidth: 0,
    },
    sectionTitle: {
      fontSize: 9,
      borderBottomWidth: 0,
      letterSpacing: 1.5,
    },
  },
}

export function getTemplateTheme(template: Template): TemplateTheme {
  return templateThemes[template]
}
