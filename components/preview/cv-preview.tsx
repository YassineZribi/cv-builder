"use client"

import { useMemo } from "react"
import type { CV, Template } from "@/lib/cv/schema"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

interface CVPreviewProps {
  cv: CV
  template: Template
  dictionary: Dictionary
}

export function CVPreview({ cv, template, dictionary }: CVPreviewProps) {
  const visibleSections = useMemo(
    () =>
      cv.sections
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order)
        .map((s) => s.id),
    [cv.sections]
  )

  const templateStyles = useMemo(() => getTemplateStyles(template), [template])

  const formatDate = (date: string | null | undefined) => {
    if (!date) return ""
    const [year, month] = date.split("-")
    return `${dictionary.cv.dates.months[parseInt(month, 10) - 1]} ${year}`
  }

  const cvLabels = dictionary.cv
  const dateLabels = cvLabels.dates

  return (
    <div
      className={cn(
        "w-[210mm] min-h-[297mm] bg-white shadow-lg print:shadow-none",
        templateStyles.container
      )}
      style={{ fontFamily: templateStyles.fontFamily }}
    >
      {/* Header / Personal Info */}
      {visibleSections.includes("personalInfo") && (
        <header className={cn("px-8 py-6", templateStyles.header)}>
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h1
                className={cn("text-2xl font-bold", templateStyles.name)}
              >
                {cv.personalInfo.firstName} {cv.personalInfo.lastName}
              </h1>
              {cv.personalInfo.title && (
                <p className={cn("text-lg mt-1", templateStyles.title)}>
                  {cv.personalInfo.title}
                </p>
              )}
              <div
                className={cn(
                  "flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm",
                  templateStyles.contact
                )}
              >
                {cv.personalInfo.contact.email && (
                  <span>{cv.personalInfo.contact.email}</span>
                )}
                {cv.personalInfo.contact.phone && (
                  <span>{cv.personalInfo.contact.phone}</span>
                )}
                {cv.personalInfo.contact.city && (
                  <span>
                    {cv.personalInfo.contact.city}
                    {cv.personalInfo.contact.country &&
                      `, ${cv.personalInfo.contact.country}`}
                  </span>
                )}
                {cv.personalInfo.contact.linkedin && (
                  <span>{cv.personalInfo.contact.linkedin}</span>
                )}
                {cv.personalInfo.contact.github && (
                  <span>{cv.personalInfo.contact.github}</span>
                )}
              </div>
              {cv.format === "european" && (
                (cv.personalInfo.dateOfBirth || cv.personalInfo.nationality || cv.personalInfo.gender) && (
                  <div className={cn("flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm", templateStyles.contact)}>
                    {cv.personalInfo.dateOfBirth && (
                      <span>
                        {cvLabels.labels.dateOfBirth}: {cv.personalInfo.dateOfBirth}
                      </span>
                    )}
                    {cv.personalInfo.nationality && (
                      <span>
                        {cvLabels.labels.nationality}: {cv.personalInfo.nationality}
                      </span>
                    )}
                    {cv.personalInfo.gender && (
                      <span>
                        {cvLabels.labels.gender}: {cvLabels.gender[cv.personalInfo.gender]}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
            {cv.format === "european" && cv.personalInfo.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cv.personalInfo.photo}
                alt={`${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`}
                className="h-24 w-24 shrink-0 rounded-full object-cover border-2 border-white/20"
              />
            )}
          </div>
        </header>
      )}

      <div className="px-8 py-4 space-y-6">
        {/* Summary */}
        {visibleSections.includes("summary") && cv.personalInfo.summary && (
          <section>
            <h2 className={templateStyles.sectionTitle}>
              {dictionary.ui.editor.sections.summary}
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-justify">
              {cv.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {visibleSections.includes("experience") && cv.experience.length > 0 && (
          <section>
            <h2 className={templateStyles.sectionTitle}>
              {dictionary.ui.editor.sections.experience}
            </h2>
            <div className="space-y-4">
              {cv.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.position}</h3>
                      <p className={cn("text-sm", templateStyles.subtitle)}>
                        {exp.company}
                        {exp.location && ` - ${exp.location}`}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current
                        ? dateLabels.present
                        : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm mt-2 whitespace-pre-line text-justify">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {visibleSections.includes("education") && cv.education.length > 0 && (
          <section>
            <h2 className={templateStyles.sectionTitle}>
              {dictionary.ui.editor.sections.education}
            </h2>
            <div className="space-y-4">
              {cv.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {edu.degree}
                        {edu.field && ` ${dictionary.cv.dates.in} ${edu.field}`}
                      </h3>
                      <p className={cn("text-sm", templateStyles.subtitle)}>
                        {edu.institution}
                        {edu.location && ` - ${edu.location}`}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(edu.startDate)} -{" "}
                      {edu.current
                        ? dateLabels.present
                        : formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.grade && (
                    <p className="text-sm mt-1 text-muted-foreground">
                      {edu.grade}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-sm mt-2 whitespace-pre-line">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {visibleSections.includes("skills") && cv.skills.length > 0 && (
          <section>
            <h2 className={templateStyles.sectionTitle}>
              {dictionary.ui.editor.sections.skills}
            </h2>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill) => (
                <span
                  key={skill.id}
                  className={cn(
                    "px-2 py-1 rounded text-sm",
                    templateStyles.skillBadge
                  )}
                >
                  {skill.name}
                  {skill.level && (
                    <span className="text-xs ml-1 opacity-70">
                      ({dictionary.cv.skillLevel[skill.level]})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {visibleSections.includes("languages") && cv.languages.length > 0 && (
          <section>
            <h2 className={templateStyles.sectionTitle}>
              {dictionary.ui.editor.sections.languages}
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              {cv.languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-muted-foreground/40 select-none">·</span>
                  <span className="text-muted-foreground shrink-0">
                    {dictionary.cv.proficiency[lang.proficiency]}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {visibleSections.includes("certifications") &&
          cv.certifications.length > 0 && (
            <section>
              <h2 className={templateStyles.sectionTitle}>
                {dictionary.ui.editor.sections.certifications}
              </h2>
              <div className="space-y-2">
                {cv.certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{cert.name}</span>
                      <span className="text-muted-foreground">
                        {" "}- {cert.issuer}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatDate(cert.date)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* Projects */}
        {visibleSections.includes("projects") && cv.projects.length > 0 && (
          <section>
            <h2 className={templateStyles.sectionTitle}>
              {dictionary.ui.editor.sections.projects}
            </h2>
            <div className="space-y-4">
              {cv.projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm mt-1">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {visibleSections.includes("references") && cv.references.length > 0 && (
          <section>
            <h2 className={templateStyles.sectionTitle}>
              {dictionary.ui.editor.sections.references}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {cv.references.map((ref) => (
                <div key={ref.id} className="text-sm">
                  <p className="font-medium">{ref.name}</p>
                  {ref.position && (
                    <p className="text-muted-foreground">{ref.position}</p>
                  )}
                  {ref.company && (
                    <p className="text-muted-foreground">{ref.company}</p>
                  )}
                  {ref.email && <p>{ref.email}</p>}
                  {ref.phone && <p>{ref.phone}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function getTemplateStyles(template: Template) {
  switch (template) {
    case "modern":
      return {
        container: "text-gray-800",
        fontFamily: "var(--font-sans)",
        header: "bg-gray-900 text-white",
        name: "text-white",
        title: "text-gray-300",
        contact: "text-gray-300",
        sectionTitle:
          "text-lg font-bold text-gray-900 uppercase border-b-2 border-blue-500 pb-1 mb-3",
        subtitle: "text-gray-600",
        skillBadge: "bg-blue-100 text-blue-800",
      }
    case "classic":
      return {
        container: "text-gray-800",
        fontFamily: "Georgia, serif",
        header: "border-b-2 border-gray-800",
        name: "text-gray-900",
        title: "text-gray-700 italic",
        contact: "text-gray-600",
        sectionTitle:
          "text-lg font-bold text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1 mb-3",
        subtitle: "text-gray-600",
        skillBadge: "bg-gray-100 text-gray-800 border border-gray-300",
      }
    case "minimal":
      return {
        container: "text-gray-700",
        fontFamily: "var(--font-sans)",
        header: "",
        name: "text-gray-900",
        title: "text-gray-500",
        contact: "text-gray-500",
        sectionTitle: "text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3",
        subtitle: "text-gray-500",
        skillBadge: "bg-gray-50 text-gray-700",
      }
    default:
      return {
        container: "",
        fontFamily: "var(--font-sans)",
        header: "",
        name: "",
        title: "",
        contact: "",
        sectionTitle: "text-lg font-bold mb-3",
        subtitle: "",
        skillBadge: "bg-gray-100",
      }
  }
}
