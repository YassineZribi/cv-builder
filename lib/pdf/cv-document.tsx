import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"
import type { CV } from "@/lib/cv/schema"
import { getTemplateTheme } from "@/lib/templates/themes"

// Disable automatic hyphenation — wrap whole words instead of splitting them
Font.registerHyphenationCallback((word) => [word])

interface CVDocumentProps {
  cv: CV
  labels: {
    sections: Record<string, string>
    dates: { present: string; to: string; months: string[] }
    proficiency: Record<string, string>
    skillLevel: Record<string, string>
    europass: {
      dateOfBirth: string
      nationality: string
      gender: string
      genderValues: Record<string, string>
    }
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
    return `${labels.dates.months[parseInt(month, 10) - 1]} ${year}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {visibleSections.includes("personalInfo") && (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerText}>
                <Text style={styles.name}>
                  {cv.personalInfo.firstName} {cv.personalInfo.lastName}
                </Text>
                {cv.personalInfo.title && (
                  <Text style={styles.jobTitle}>{cv.personalInfo.title}</Text>
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
                {cv.format === "european" &&
                  (cv.personalInfo.dateOfBirth || cv.personalInfo.nationality || cv.personalInfo.gender) && (
                  <View style={styles.contactRow}>
                    {cv.personalInfo.dateOfBirth && (
                      <Text style={styles.contactItem}>
                        {labels.europass.dateOfBirth}: {cv.personalInfo.dateOfBirth}
                      </Text>
                    )}
                    {cv.personalInfo.nationality && (
                      <Text style={styles.contactItem}>
                        {labels.europass.nationality}: {cv.personalInfo.nationality}
                      </Text>
                    )}
                    {cv.personalInfo.gender && (
                      <Text style={styles.contactItem}>
                        {labels.europass.gender}: {labels.europass.genderValues[cv.personalInfo.gender]}
                      </Text>
                    )}
                  </View>
                )}
              </View>
              {cv.format === "european" && cv.personalInfo.photo && (
                <Image
                  src={cv.personalInfo.photo}
                  style={styles.photo}
                />
              )}
            </View>
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
                  <Text style={styles.languageDot}>·</Text>
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
                  <Text style={styles.certName}>
                    {cert.name}
                    <Text style={styles.textMuted}> - {cert.issuer}</Text>
                  </Text>
                  <Text style={styles.certDate}>{formatDate(cert.date)}</Text>
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
  const m = theme.spacing.pageMargin

  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: theme.colors.background,
      padding: m,
      fontFamily: theme.fonts.body,
      fontSize: 10,
      color: theme.colors.text,
    },

    // ─── Header ──────────────────────────────────────────────────────────────
    header: {
      // Full-bleed background for modern (negative margin bleeds past page padding)
      ...(theme.header.hasDarkBackground
        ? {
            marginTop: -m,
            marginHorizontal: -m,
            paddingHorizontal: m,
            paddingVertical: 24,
            backgroundColor: theme.colors.headerBackground,
            marginBottom: theme.spacing.sectionGap,
          }
        : {
            marginBottom: theme.spacing.sectionGap,
            paddingBottom: 14,
            borderBottomWidth: theme.header.borderBottomWidth,
            borderBottomColor: theme.colors.headerBorder,
          }),
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headerText: {
      flex: 1,
    },
    photo: {
      width: 72,
      height: 72,
      borderRadius: 36,
      marginLeft: 16,
      objectFit: "cover",
    },
    name: {
      fontSize: 22,
      fontFamily: theme.fonts.heading,
      color: theme.colors.headerName,
      marginBottom: 4,
    },
    jobTitle: {
      fontSize: 13,
      color: theme.colors.headerTitle,
      marginBottom: 6,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 4,
    },
    contactItem: {
      fontSize: 9,
      color: theme.colors.headerContact,
    },

    // ─── Section ─────────────────────────────────────────────────────────────
    section: {
      marginBottom: theme.spacing.sectionGap,
    },
    sectionTitle: {
      fontSize: theme.sectionTitle.fontSize,
      fontFamily: theme.fonts.heading,
      color: theme.colors.sectionTitleText,
      marginBottom: 8,
      paddingBottom: theme.sectionTitle.borderBottomWidth > 0 ? 4 : 0,
      borderBottomWidth: theme.sectionTitle.borderBottomWidth,
      borderBottomColor: theme.colors.sectionTitleBorder,
      textTransform: "uppercase",
      letterSpacing: theme.sectionTitle.letterSpacing,
    },

    // ─── Items ────────────────────────────────────────────────────────────────
    item: {
      marginBottom: theme.spacing.itemGap,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    itemTitle: {
      fontSize: 11,
      fontFamily: theme.fonts.heading,
      color: theme.colors.itemTitle,
      marginBottom: 2,
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
      textAlign: "justify",
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

    // ─── Skills ───────────────────────────────────────────────────────────────
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    skillBadge: {
      fontSize: 9,
      backgroundColor: theme.colors.skillBadgeBackground,
      color: theme.colors.skillBadgeText,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      ...(theme.colors.skillBadgeBorder
        ? { borderWidth: 1, borderColor: theme.colors.skillBadgeBorder }
        : {}),
    },

    // ─── Languages ────────────────────────────────────────────────────────────
    languagesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    languageItem: {
      width: "45%",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    languageDot: {
      fontSize: 9,
      color: theme.colors.muted,
      opacity: 0.5,
    },
    languageName: {
      fontSize: 10,
      fontFamily: theme.fonts.heading,
    },
    languageLevel: {
      fontSize: 9,
      color: theme.colors.muted,
    },

    // ─── Certifications ───────────────────────────────────────────────────────
    certItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 6,
    },
    certName: {
      fontSize: 10,
      fontFamily: theme.fonts.heading,
      flex: 1,
    },
    certDate: {
      fontSize: 9,
      color: theme.colors.muted,
      marginLeft: 8,
    },

    // ─── References ───────────────────────────────────────────────────────────
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
