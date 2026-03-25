import { create } from "zustand"
import { subscribeWithSelector, devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import type {
  CV,
  CVFormat,
  Template,
  Locale,
  PersonalInfo,
  ExperienceEntry,
  EducationEntry,
  Skill,
  Language,
  Certification,
  Project,
  Reference,
} from "@/lib/cv/schema"
import {
  createDefaultCV,
  createExperienceEntry,
  createEducationEntry,
  createSkill,
  createLanguage,
  createCertification,
  createProject,
  createReference,
} from "@/lib/cv/defaults"

interface CVState {
  cv: CV
  isDirty: boolean
  lastSaved: Date | null

  // Core actions
  setCV: (cv: CV) => void
  resetCV: () => void
  markSaved: () => void

  // Personal Info
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void
  updateContact: (data: Partial<PersonalInfo["contact"]>) => void

  // Experience
  addExperience: (data?: Partial<Omit<ExperienceEntry, "id" | "order">>) => void
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void
  removeExperience: (id: string) => void
  reorderExperience: (fromIndex: number, toIndex: number) => void

  // Education
  addEducation: (data?: Partial<Omit<EducationEntry, "id" | "order">>) => void
  updateEducation: (id: string, data: Partial<EducationEntry>) => void
  removeEducation: (id: string) => void
  reorderEducation: (fromIndex: number, toIndex: number) => void

  // Skills
  addSkill: (data?: Partial<Omit<Skill, "id" | "order">>) => void
  updateSkill: (id: string, data: Partial<Skill>) => void
  removeSkill: (id: string) => void
  reorderSkills: (fromIndex: number, toIndex: number) => void

  // Languages
  addLanguage: (data?: Partial<Omit<Language, "id" | "order">>) => void
  updateLanguage: (id: string, data: Partial<Language>) => void
  removeLanguage: (id: string) => void
  reorderLanguages: (fromIndex: number, toIndex: number) => void

  // Certifications
  addCertification: (data?: Partial<Omit<Certification, "id" | "order">>) => void
  updateCertification: (id: string, data: Partial<Certification>) => void
  removeCertification: (id: string) => void
  reorderCertifications: (fromIndex: number, toIndex: number) => void

  // Projects
  addProject: (data?: Partial<Omit<Project, "id" | "order">>) => void
  updateProject: (id: string, data: Partial<Project>) => void
  removeProject: (id: string) => void
  reorderProjects: (fromIndex: number, toIndex: number) => void

  // References
  addReference: (data?: Partial<Omit<Reference, "id" | "order">>) => void
  updateReference: (id: string, data: Partial<Reference>) => void
  removeReference: (id: string) => void
  reorderReferences: (fromIndex: number, toIndex: number) => void

  // Sections
  toggleSection: (sectionId: string) => void
  reorderSections: (fromIndex: number, toIndex: number) => void

  // Settings
  setTemplate: (template: Template) => void
  setFormat: (format: CVFormat) => void
  setLocale: (locale: Locale) => void
}

// Helper to update timestamps
function touch(cv: CV) {
  cv.updatedAt = new Date().toISOString()
}

// Helper to reorder array items
function reorder<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

// Helper to update order property
function updateOrders<T extends { order: number }>(items: T[]): void {
  items.forEach((item, index) => {
    item.order = index
  })
}

export const useCVStore = create<CVState>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set) => ({
          cv: createDefaultCV(),
          isDirty: false,
          lastSaved: null,

          setCV: (cv) =>
            set((state) => {
              state.cv = cv
              state.isDirty = false
            }),

          resetCV: () =>
            set((state) => {
              state.cv = createDefaultCV()
              state.isDirty = false
            }),

          markSaved: () =>
            set((state) => {
              state.isDirty = false
              state.lastSaved = new Date()
            }),

          // Personal Info
          updatePersonalInfo: (data) =>
            set((state) => {
              Object.assign(state.cv.personalInfo, data)
              touch(state.cv)
              state.isDirty = true
            }),

          updateContact: (data) =>
            set((state) => {
              Object.assign(state.cv.personalInfo.contact, data)
              touch(state.cv)
              state.isDirty = true
            }),

          // Experience
          addExperience: (data) =>
            set((state) => {
              const entry = createExperienceEntry({
                ...data,
                order: state.cv.experience.length,
              })
              state.cv.experience.push(entry)
              touch(state.cv)
              state.isDirty = true
            }),

          updateExperience: (id, data) =>
            set((state) => {
              const entry = state.cv.experience.find((e) => e.id === id)
              if (entry) {
                Object.assign(entry, data)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          removeExperience: (id) =>
            set((state) => {
              const index = state.cv.experience.findIndex((e) => e.id === id)
              if (index !== -1) {
                state.cv.experience.splice(index, 1)
                updateOrders(state.cv.experience)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          reorderExperience: (fromIndex, toIndex) =>
            set((state) => {
              state.cv.experience = reorder(
                state.cv.experience,
                fromIndex,
                toIndex
              )
              updateOrders(state.cv.experience)
              touch(state.cv)
              state.isDirty = true
            }),

          // Education
          addEducation: (data) =>
            set((state) => {
              const entry = createEducationEntry({
                ...data,
                order: state.cv.education.length,
              })
              state.cv.education.push(entry)
              touch(state.cv)
              state.isDirty = true
            }),

          updateEducation: (id, data) =>
            set((state) => {
              const entry = state.cv.education.find((e) => e.id === id)
              if (entry) {
                Object.assign(entry, data)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          removeEducation: (id) =>
            set((state) => {
              const index = state.cv.education.findIndex((e) => e.id === id)
              if (index !== -1) {
                state.cv.education.splice(index, 1)
                updateOrders(state.cv.education)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          reorderEducation: (fromIndex, toIndex) =>
            set((state) => {
              state.cv.education = reorder(
                state.cv.education,
                fromIndex,
                toIndex
              )
              updateOrders(state.cv.education)
              touch(state.cv)
              state.isDirty = true
            }),

          // Skills
          addSkill: (data) =>
            set((state) => {
              const skill = createSkill({
                ...data,
                order: state.cv.skills.length,
              })
              state.cv.skills.push(skill)
              touch(state.cv)
              state.isDirty = true
            }),

          updateSkill: (id, data) =>
            set((state) => {
              const skill = state.cv.skills.find((s) => s.id === id)
              if (skill) {
                Object.assign(skill, data)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          removeSkill: (id) =>
            set((state) => {
              const index = state.cv.skills.findIndex((s) => s.id === id)
              if (index !== -1) {
                state.cv.skills.splice(index, 1)
                updateOrders(state.cv.skills)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          reorderSkills: (fromIndex, toIndex) =>
            set((state) => {
              state.cv.skills = reorder(state.cv.skills, fromIndex, toIndex)
              updateOrders(state.cv.skills)
              touch(state.cv)
              state.isDirty = true
            }),

          // Languages
          addLanguage: (data) =>
            set((state) => {
              const language = createLanguage({
                ...data,
                order: state.cv.languages.length,
              })
              state.cv.languages.push(language)
              touch(state.cv)
              state.isDirty = true
            }),

          updateLanguage: (id, data) =>
            set((state) => {
              const language = state.cv.languages.find((l) => l.id === id)
              if (language) {
                Object.assign(language, data)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          removeLanguage: (id) =>
            set((state) => {
              const index = state.cv.languages.findIndex((l) => l.id === id)
              if (index !== -1) {
                state.cv.languages.splice(index, 1)
                updateOrders(state.cv.languages)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          reorderLanguages: (fromIndex, toIndex) =>
            set((state) => {
              state.cv.languages = reorder(
                state.cv.languages,
                fromIndex,
                toIndex
              )
              updateOrders(state.cv.languages)
              touch(state.cv)
              state.isDirty = true
            }),

          // Certifications
          addCertification: (data) =>
            set((state) => {
              const cert = createCertification({
                ...data,
                order: state.cv.certifications.length,
              })
              state.cv.certifications.push(cert)
              touch(state.cv)
              state.isDirty = true
            }),

          updateCertification: (id, data) =>
            set((state) => {
              const cert = state.cv.certifications.find((c) => c.id === id)
              if (cert) {
                Object.assign(cert, data)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          removeCertification: (id) =>
            set((state) => {
              const index = state.cv.certifications.findIndex(
                (c) => c.id === id
              )
              if (index !== -1) {
                state.cv.certifications.splice(index, 1)
                updateOrders(state.cv.certifications)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          reorderCertifications: (fromIndex, toIndex) =>
            set((state) => {
              state.cv.certifications = reorder(
                state.cv.certifications,
                fromIndex,
                toIndex
              )
              updateOrders(state.cv.certifications)
              touch(state.cv)
              state.isDirty = true
            }),

          // Projects
          addProject: (data) =>
            set((state) => {
              const project = createProject({
                ...data,
                order: state.cv.projects.length,
              })
              state.cv.projects.push(project)
              touch(state.cv)
              state.isDirty = true
            }),

          updateProject: (id, data) =>
            set((state) => {
              const project = state.cv.projects.find((p) => p.id === id)
              if (project) {
                Object.assign(project, data)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          removeProject: (id) =>
            set((state) => {
              const index = state.cv.projects.findIndex((p) => p.id === id)
              if (index !== -1) {
                state.cv.projects.splice(index, 1)
                updateOrders(state.cv.projects)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          reorderProjects: (fromIndex, toIndex) =>
            set((state) => {
              state.cv.projects = reorder(state.cv.projects, fromIndex, toIndex)
              updateOrders(state.cv.projects)
              touch(state.cv)
              state.isDirty = true
            }),

          // References
          addReference: (data) =>
            set((state) => {
              const reference = createReference({
                ...data,
                order: state.cv.references.length,
              })
              state.cv.references.push(reference)
              touch(state.cv)
              state.isDirty = true
            }),

          updateReference: (id, data) =>
            set((state) => {
              const reference = state.cv.references.find((r) => r.id === id)
              if (reference) {
                Object.assign(reference, data)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          removeReference: (id) =>
            set((state) => {
              const index = state.cv.references.findIndex((r) => r.id === id)
              if (index !== -1) {
                state.cv.references.splice(index, 1)
                updateOrders(state.cv.references)
                touch(state.cv)
                state.isDirty = true
              }
            }),

          reorderReferences: (fromIndex, toIndex) =>
            set((state) => {
              state.cv.references = reorder(
                state.cv.references,
                fromIndex,
                toIndex
              )
              updateOrders(state.cv.references)
              touch(state.cv)
              state.isDirty = true
            }),

          // Sections
          toggleSection: (sectionId) =>
            set((state) => {
              const section = state.cv.sections.find((s) => s.id === sectionId)
              if (section) {
                section.visible = !section.visible
                touch(state.cv)
                state.isDirty = true
              }
            }),

          reorderSections: (fromIndex, toIndex) =>
            set((state) => {
              state.cv.sections = reorder(
                state.cv.sections,
                fromIndex,
                toIndex
              )
              updateOrders(state.cv.sections)
              touch(state.cv)
              state.isDirty = true
            }),

          // Settings
          setTemplate: (template) =>
            set((state) => {
              state.cv.template = template
              touch(state.cv)
              state.isDirty = true
            }),

          setFormat: (format) =>
            set((state) => {
              state.cv.format = format
              touch(state.cv)
              state.isDirty = true
            }),

          setLocale: (locale) =>
            set((state) => {
              state.cv.locale = locale
              touch(state.cv)
              state.isDirty = true
            }),
        })),
        {
          name: "cv-builder-storage",
          partialize: (state) => ({ cv: state.cv }),
        }
      )
    ),
    { name: "CVStore" }
  )
)

// Selectors for common access patterns
export const selectCV = (state: CVState) => state.cv
export const selectPersonalInfo = (state: CVState) => state.cv.personalInfo
export const selectExperience = (state: CVState) => state.cv.experience
export const selectEducation = (state: CVState) => state.cv.education
export const selectSkills = (state: CVState) => state.cv.skills
export const selectLanguages = (state: CVState) => state.cv.languages
export const selectCertifications = (state: CVState) => state.cv.certifications
export const selectProjects = (state: CVState) => state.cv.projects
export const selectReferences = (state: CVState) => state.cv.references
export const selectSections = (state: CVState) => state.cv.sections
export const selectVisibleSections = (state: CVState) =>
  state.cv.sections.filter((s) => s.visible).sort((a, b) => a.order - b.order)
export const selectTemplate = (state: CVState) => state.cv.template
export const selectFormat = (state: CVState) => state.cv.format
export const selectLocale = (state: CVState) => state.cv.locale
export const selectIsDirty = (state: CVState) => state.isDirty
export const selectLastSaved = (state: CVState) => state.lastSaved
