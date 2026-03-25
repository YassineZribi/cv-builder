import type { CV, CVFormat, Template, Locale } from "./schema"
import { DEFAULT_SECTIONS } from "./schema"

export function createDefaultCV(options?: {
  format?: CVFormat
  template?: Template
  locale?: Locale
}): CV {
  const now = new Date().toISOString()

  return {
    schemaVersion: 1,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,

    format: options?.format ?? "canadian",
    template: options?.template ?? "modern",
    locale: options?.locale ?? "en",

    personalInfo: {
      firstName: "",
      lastName: "",
      title: "",
      photo: "",
      summary: "",
      contact: {
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        linkedin: "",
        github: "",
        portfolio: "",
        customLinks: [],
      },
      dateOfBirth: "",
      nationality: "",
      gender: undefined,
    },

    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    references: [],

    sections: [...DEFAULT_SECTIONS],
  }
}

export function createExperienceEntry(
  data: Partial<CV["experience"][number]> = {}
): CV["experience"][number] {
  return {
    id: crypto.randomUUID(),
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: null,
    current: false,
    description: "",
    achievements: [],
    order: 0,
    ...data,
  }
}

export function createEducationEntry(
  data: Partial<CV["education"][number]> = {}
): CV["education"][number] {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: null,
    current: false,
    grade: "",
    description: "",
    order: 0,
    ...data,
  }
}

export function createSkill(
  data: Partial<CV["skills"][number]> = {}
): CV["skills"][number] {
  return {
    id: crypto.randomUUID(),
    name: "",
    level: undefined,
    category: "",
    order: 0,
    ...data,
  }
}

export function createLanguage(
  data: Partial<CV["languages"][number]> = {}
): CV["languages"][number] {
  return {
    id: crypto.randomUUID(),
    name: "",
    proficiency: "B1",
    order: 0,
    ...data,
  }
}

export function createCertification(
  data: Partial<CV["certifications"][number]> = {}
): CV["certifications"][number] {
  return {
    id: crypto.randomUUID(),
    name: "",
    issuer: "",
    date: "",
    expiryDate: null,
    credentialId: "",
    url: "",
    order: 0,
    ...data,
  }
}

export function createProject(
  data: Partial<CV["projects"][number]> = {}
): CV["projects"][number] {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    url: "",
    technologies: [],
    startDate: "",
    endDate: null,
    order: 0,
    ...data,
  }
}

export function createReference(
  data: Partial<CV["references"][number]> = {}
): CV["references"][number] {
  return {
    id: crypto.randomUUID(),
    name: "",
    position: "",
    company: "",
    email: "",
    phone: "",
    relationship: "",
    order: 0,
    ...data,
  }
}
