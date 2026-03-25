import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"
import type { CV } from "@/lib/cv/schema"
import { getTemplateTheme } from "@/lib/templates/themes"

// Register default fonts
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
})

interface CVDocumentProps {
  cv: CV
  labels: {
    sections: Record<string, string>
    dates: { present: string; to: string }
    proficiency: Record<string, string>
    skillLevel: Record<string, string>
  }
}

export function CVDocument({ cv, labels }: CVDocumentProps) {
  const theme = getTemplateTheme(cv.template)
  const visibleSections = cv.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
    .map((s) => s.id)

  const styles = createStyles(theme)

  const formatDate = (date: string | null | undefined) => {
    if (!date) return ""
    const [year, month] = date.split("-")
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {visibleSections.includes("personalInfo") && (
          <View style={styles.header}>
            <Text style={styles.name}>
              {cv.personalInfo.firstName} {cv.personalInfo.lastName}
            </Text>
            {cv.personalInfo.title && (
              <Text style={styles.title}>{cv.personalInfo.title}</Text>
            )}
            <View style={styles.contactRow}>
              {cv.personalInfo.contact.email && (
                <Text style={styles.contactItem}>
                  {cv.personalInfo.contact.email}
                </Text>
              )}
              {cv.personalInfo.contact.phone && (
                <Text style={styles.contactItem}>
                  {cv.personalInfo.contact.phone}
                </Text>
              )}
              {cv.personalInfo.contact.city && (
                <Text style={styles.contactItem}>
                  {cv.personalInfo.contact.city}
                  {cv.personalInfo.contact.country &&
                    `, ${cv.personalInfo.contact.country}`}
                </Text>
              )}
            </View>
            {(cv.personalInfo.contact.linkedin ||
              cv.personalInfo.contact.github) && (
              <View style={styles.contactRow}>
                {cv.personalInfo.contact.linkedin && (
                  <Text style={styles.contactItem}>
                    {cv.personalInfo.contact.linkedin}
                  </Text>
                )}
                {cv.personalInfo.contact.github && (
                  <Text style={styles.contactItem}>
                    {cv.personalInfo.contact.github}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Summary */}
        {visibleSections.includes("summary") && cv.personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.sections.summary}</Text>
            <Text style={styles.text}>{cv.personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {visibleSections.includes("experience") && cv.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {labels.sections.experience}
            </Text>
            {cv.experience.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemTitle}>{exp.position}</Text>
                    <Text style={styles.itemSubtitle}>
                      {exp.company}
                      {exp.location && ` - ${exp.location}`}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>
                    {formatDate(exp.startDate)} -{" "}
                    {exp.current
                      ? labels.dates.present
                      : formatDate(exp.endDate)}
                  </Text>
                </View>
                {exp.description && (
                  <Text style={styles.text}>{exp.description}</Text>
                )}
                {exp.achievements.length > 0 && (
                  <View style={styles.list}>
                    {exp.achievements.map((achievement, idx) => (
                      <Text key={idx} style={styles.listItem}>
                        • {achievement}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {visibleSections.includes("education") && cv.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.sections.education}</Text>
            {cv.education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemTitle}>
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </Text>
                    <Text style={styles.itemSubtitle}>
                      {edu.institution}
                      {edu.location && ` - ${edu.location}`}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>
                    {formatDate(edu.startDate)} -{" "}
                    {edu.current
                      ? labels.dates.present
                      : formatDate(edu.endDate)}
                  </Text>
                </View>
                {edu.grade && (
                  <Text style={styles.textMuted}>{edu.grade}</Text>
                )}
                {edu.description && (
                  <Text style={styles.text}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {visibleSections.includes("skills") && cv.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.sections.skills}</Text>
            <View style={styles.skillsContainer}>
              {cv.skills.map((skill) => (
                <Text key={skill.id} style={styles.skillBadge}>
                  {skill.name}
                  {skill.level && ` (${labels.skillLevel[skill.level]})`}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {visibleSections.includes("languages") && cv.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.sections.languages}</Text>
            <View style={styles.languagesGrid}>
              {cv.languages.map((lang) => (
                <View key={lang.id} style={styles.languageItem}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <Text style={styles.languageLevel}>
                    {labels.proficiency[lang.proficiency]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Certifications */}
        {visibleSections.includes("certifications") &&
          cv.certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {labels.sections.certifications}
              </Text>
              {cv.certifications.map((cert) => (
                <View key={cert.id} style={styles.certItem}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.textMuted}>
                    {cert.issuer} • {formatDate(cert.date)}
                  </Text>
                </View>
              ))}
            </View>
          )}

        {/* Projects */}
        {visibleSections.includes("projects") && cv.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.sections.projects}</Text>
            {cv.projects.map((project) => (
              <View key={project.id} style={styles.item}>
                <Text style={styles.itemTitle}>{project.name}</Text>
                {project.description && (
                  <Text style={styles.text}>{project.description}</Text>
                )}
                {project.technologies.length > 0 && (
                  <Text style={styles.textMuted}>
                    {project.technologies.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* References */}
        {visibleSections.includes("references") && cv.references.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {labels.sections.references}
            </Text>
            <View style={styles.referencesGrid}>
              {cv.references.map((ref) => (
                <View key={ref.id} style={styles.referenceItem}>
                  <Text style={styles.referenceName}>{ref.name}</Text>
                  {ref.position && (
                    <Text style={styles.textMuted}>{ref.position}</Text>
                  )}
                  {ref.company && (
                    <Text style={styles.textMuted}>{ref.company}</Text>
                  )}
                  {ref.email && <Text style={styles.text}>{ref.email}</Text>}
                  {ref.phone && <Text style={styles.text}>{ref.phone}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}

function createStyles(theme: ReturnType<typeof getTemplateTheme>) {
  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.pageMargin,
      fontFamily: theme.fonts.body,
      fontSize: 10,
      color: theme.colors.text,
    },
    header: {
      marginBottom: theme.spacing.sectionGap,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },
    name: {
      fontSize: 24,
      fontFamily: theme.fonts.heading,
      color: theme.colors.primary,
      marginBottom: 4,
    },
    title: {
      fontSize: 14,
      color: theme.colors.muted,
      marginBottom: 8,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 4,
    },
    contactItem: {
      fontSize: 9,
      color: theme.colors.muted,
    },
    section: {
      marginBottom: theme.spacing.sectionGap,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: theme.fonts.heading,
      color: theme.colors.primary,
      marginBottom: 8,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.accent,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    item: {
      marginBottom: theme.spacing.itemGap,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    itemTitle: {
      fontSize: 11,
      fontFamily: theme.fonts.heading,
      color: theme.colors.secondary,
    },
    itemSubtitle: {
      fontSize: 10,
      color: theme.colors.muted,
    },
    dateText: {
      fontSize: 9,
      color: theme.colors.muted,
    },
    text: {
      fontSize: 10,
      lineHeight: 1.4,
      marginTop: 4,
    },
    textMuted: {
      fontSize: 9,
      color: theme.colors.muted,
      marginTop: 2,
    },
    list: {
      marginTop: 4,
    },
    listItem: {
      fontSize: 9,
      marginBottom: 2,
      paddingLeft: 8,
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    skillBadge: {
      fontSize: 9,
      backgroundColor: "#f0f0f0",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    languagesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    languageItem: {
      width: "45%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    languageName: {
      fontSize: 10,
      fontFamily: theme.fonts.heading,
    },
    languageLevel: {
      fontSize: 9,
      color: theme.colors.muted,
    },
    certItem: {
      marginBottom: 6,
    },
    certName: {
      fontSize: 10,
      fontFamily: theme.fonts.heading,
    },
    referencesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    referenceItem: {
      width: "45%",
    },
    referenceName: {
      fontSize: 10,
      fontFamily: theme.fonts.heading,
      marginBottom: 2,
    },
  })
}
