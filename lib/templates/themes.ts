import type { CV, Template } from "@/lib/cv/schema"

export interface TemplateTheme {
  id: Template
  name: string
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
    accent: string
    muted: string
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
}

export const templateThemes: Record<Template, TemplateTheme> = {
  modern: {
    id: "modern",
    name: "Modern",
    colors: {
      primary: "#1a1a2e",
      secondary: "#16213e",
      text: "#333333",
      background: "#ffffff",
      accent: "#0f4c75",
      muted: "#666666",
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
  },
  classic: {
    id: "classic",
    name: "Classic",
    colors: {
      primary: "#2c3e50",
      secondary: "#34495e",
      text: "#2c3e50",
      background: "#ffffff",
      accent: "#2980b9",
      muted: "#7f8c8d",
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
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    colors: {
      primary: "#000000",
      secondary: "#333333",
      text: "#444444",
      background: "#ffffff",
      accent: "#555555",
      muted: "#888888",
    },
    fonts: {
      heading: "Helvetica",
      body: "Helvetica",
    },
    spacing: {
      sectionGap: 20,
      itemGap: 12,
      pageMargin: 45,
    },
  },
}

export function getTemplateTheme(template: Template): TemplateTheme {
  return templateThemes[template]
}
