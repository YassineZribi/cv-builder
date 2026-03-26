import { z } from "zod"

// Schema version for migrations
export const SCHEMA_VERSION = 1

// Reusable date schema (YYYY-MM format)
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Date must be in YYYY-MM format")
  .optional()

const urlSchema = z.string().url().optional().or(z.literal(""))

// Contact Information
const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  linkedin: urlSchema,
  github: urlSchema,
  portfolio: urlSchema,
  customLinks: z
    .array(
      z.object({
        id: z.string().uuid(),
        label: z.string(),
        url: z.string().url(),
      })
    )
    .default([]),
})

// Personal Information
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().optional(),
  photo: z.string().optional(),
  summary: z.string().optional(),
  contact: contactSchema,
  // Europass-specific fields
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  gender: z
    .enum(["male", "female", "other", "prefer-not-to-say"])
    .optional(),
})

// Experience Entry
const experienceEntrySchema = z.object({
  id: z.string().uuid(),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  startDate: dateSchema,
  endDate: dateSchema.nullable(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  order: z.number(),
})

// Education Entry
const educationEntrySchema = z.object({
  id: z.string().uuid(),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: dateSchema,
  endDate: dateSchema.nullable(),
  current: z.boolean().default(false),
  grade: z.string().optional(),
  description: z.string().optional(),
  order: z.number(),
})

// Skill
const skillSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Skill name is required"),
  level: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .optional(),
  category: z.string().optional(),
  order: z.number(),
})

// Language with CEFR levels
const languageSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Language name is required"),
  proficiency: z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "native"]),
  order: z.number(),
})

// Certification
const certificationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: dateSchema,
  expiryDate: dateSchema.nullable(),
  credentialId: z.string().optional(),
  url: urlSchema,
  order: z.number(),
})

// Project
const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  url: urlSchema,
  technologies: z.array(z.string()).default([]),
  startDate: dateSchema,
  endDate: dateSchema.nullable(),
  order: z.number(),
})

// Reference
const referenceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Reference name is required"),
  position: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  relationship: z.string().optional(),
  order: z.number(),
})

// Section configuration for visibility and ordering
const sectionConfigSchema = z.object({
  id: z.string(),
  visible: z.boolean().default(true),
  order: z.number(),
})

// CV Format
export const cvFormatSchema = z.enum(["european", "canadian"])

// Template
export const templateSchema = z.enum(["modern", "classic", "minimal"])

// Locale
export const localeSchema = z.enum(["en", "fr"])

// Section type
export const sectionTypeSchema = z.enum([
  "personalInfo",
  "summary",
  "experience",
  "education",
  "skills",
  "languages",
  "certifications",
  "projects",
  "references",
])

// Default section order
export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "personalInfo", visible: true, order: 0 },
  { id: "summary", visible: true, order: 1 },
  { id: "experience", visible: true, order: 2 },
  { id: "education", visible: true, order: 3 },
  { id: "skills", visible: true, order: 4 },
  { id: "languages", visible: true, order: 5 },
  { id: "certifications", visible: true, order: 6 },
  { id: "projects", visible: true, order: 7 },
  { id: "references", visible: true, order: 8 },
]

// Complete CV Schema
export const cvSchema = z.object({
  schemaVersion: z.number().default(SCHEMA_VERSION),
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  // Metadata
  format: cvFormatSchema,
  template: templateSchema,
  locale: localeSchema,

  // Content
  personalInfo: personalInfoSchema,
  experience: z.array(experienceEntrySchema).default([]),
  education: z.array(educationEntrySchema).default([]),
  skills: z.array(skillSchema).default([]),
  languages: z.array(languageSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  references: z.array(referenceSchema).default([]),

  // Section configuration
  sections: z.array(sectionConfigSchema).default(DEFAULT_SECTIONS),
})

// Export types derived from schemas
export type CV = z.infer<typeof cvSchema>
export type CVFormat = z.infer<typeof cvFormatSchema>
export type Template = z.infer<typeof templateSchema>
export type Locale = z.infer<typeof localeSchema>
export type SectionType = z.infer<typeof sectionTypeSchema>
export type SectionConfig = z.infer<typeof sectionConfigSchema>

export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type Contact = z.infer<typeof contactSchema>
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>
export type EducationEntry = z.infer<typeof educationEntrySchema>
export type Skill = z.infer<typeof skillSchema>
export type Language = z.infer<typeof languageSchema>
export type Certification = z.infer<typeof certificationSchema>
export type Project = z.infer<typeof projectSchema>
export type Reference = z.infer<typeof referenceSchema>

// Helper type for section content
export type SectionContent = {
  personalInfo: PersonalInfo
  summary: string | undefined
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
  projects: Project[]
  references: Reference[]
}

// Validation helper
export function validateCV(data: unknown): {
  success: boolean
  data?: CV
  errors?: Array<{ path: string; message: string }>
} {
  const result = cvSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }))

  return { success: false, errors }
}
