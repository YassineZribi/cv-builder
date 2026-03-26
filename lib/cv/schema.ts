import { z } from "zod"

// Schema version for migrations
export const SCHEMA_VERSION = 1

// Validation messages interface — implemented by cv.json["validation"]
export interface ValidationMessages {
  dateFormat: string
  invalidEmail: string
  firstNameRequired: string
  lastNameRequired: string
  companyRequired: string
  positionRequired: string
  institutionRequired: string
  degreeRequired: string
  skillNameRequired: string
  languageNameRequired: string
  certificationNameRequired: string
  issuerRequired: string
  projectNameRequired: string
  referenceNameRequired: string
}

const DEFAULT_VALIDATION_MESSAGES: ValidationMessages = {
  dateFormat: "Date must be in YYYY-MM format",
  invalidEmail: "Invalid email address",
  firstNameRequired: "First name is required",
  lastNameRequired: "Last name is required",
  companyRequired: "Company name is required",
  positionRequired: "Position is required",
  institutionRequired: "Institution name is required",
  degreeRequired: "Degree is required",
  skillNameRequired: "Skill name is required",
  languageNameRequired: "Language name is required",
  certificationNameRequired: "Certification name is required",
  issuerRequired: "Issuer is required",
  projectNameRequired: "Project name is required",
  referenceNameRequired: "Reference name is required",
}

// Module-level schemas (no validation messages)
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

// SectionConfig type (used by DEFAULT_SECTIONS below)
export type SectionConfig = z.infer<typeof sectionConfigSchema>

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

// Factory — builds the full CV Zod schema with localized validation messages
function createCVSchemas(messages: ValidationMessages) {
  const dateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}$/, messages.dateFormat)
    .optional()

  const urlSchema = z.string().url().optional().or(z.literal(""))

  const contactSchema = z.object({
    email: z.string().email(messages.invalidEmail),
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

  const personalInfoSchema = z.object({
    firstName: z.string().min(1, messages.firstNameRequired),
    lastName: z.string().min(1, messages.lastNameRequired),
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

  const experienceEntrySchema = z.object({
    id: z.string().uuid(),
    company: z.string().min(1, messages.companyRequired),
    position: z.string().min(1, messages.positionRequired),
    location: z.string().optional(),
    startDate: dateSchema,
    endDate: dateSchema.nullable(),
    current: z.boolean().default(false),
    description: z.string().optional(),
    achievements: z.array(z.string()).default([]),
    order: z.number(),
  })

  const educationEntrySchema = z.object({
    id: z.string().uuid(),
    institution: z.string().min(1, messages.institutionRequired),
    degree: z.string().min(1, messages.degreeRequired),
    field: z.string().optional(),
    location: z.string().optional(),
    startDate: dateSchema,
    endDate: dateSchema.nullable(),
    current: z.boolean().default(false),
    grade: z.string().optional(),
    description: z.string().optional(),
    order: z.number(),
  })

  const skillSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, messages.skillNameRequired),
    level: z
      .enum(["beginner", "intermediate", "advanced", "expert"])
      .optional(),
    category: z.string().optional(),
    order: z.number(),
  })

  const languageSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, messages.languageNameRequired),
    proficiency: z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "native"]),
    order: z.number(),
  })

  const certificationSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, messages.certificationNameRequired),
    issuer: z.string().min(1, messages.issuerRequired),
    date: dateSchema,
    expiryDate: dateSchema.nullable(),
    credentialId: z.string().optional(),
    url: urlSchema,
    order: z.number(),
  })

  const projectSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, messages.projectNameRequired),
    description: z.string().optional(),
    url: urlSchema,
    technologies: z.array(z.string()).default([]),
    startDate: dateSchema,
    endDate: dateSchema.nullable(),
    order: z.number(),
  })

  const referenceSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, messages.referenceNameRequired),
    position: z.string().optional(),
    company: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
    order: z.number(),
  })

  return z.object({
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
}

// Static schema export (English defaults) — source of truth for all type inference
export const cvSchema = createCVSchemas(DEFAULT_VALIDATION_MESSAGES)

// Type exports derived from the CV schema
export type CV = z.infer<typeof cvSchema>
export type CVFormat = z.infer<typeof cvFormatSchema>
export type Template = z.infer<typeof templateSchema>
export type Locale = z.infer<typeof localeSchema>
export type SectionType = z.infer<typeof sectionTypeSchema>

export type PersonalInfo = CV["personalInfo"]
export type Contact = PersonalInfo["contact"]
export type ExperienceEntry = CV["experience"][number]
export type EducationEntry = CV["education"][number]
export type Skill = CV["skills"][number]
export type Language = CV["languages"][number]
export type Certification = CV["certifications"][number]
export type Project = CV["projects"][number]
export type Reference = CV["references"][number]

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

// Validation helper — accepts optional localized messages for i18n error output
export function validateCV(
  data: unknown,
  messages?: ValidationMessages
): {
  success: boolean
  data?: CV
  errors?: Array<{ path: string; message: string }>
} {
  const schema = messages ? createCVSchemas(messages) : cvSchema
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data as CV }
  }

  const errors = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }))

  return { success: false, errors }
}

