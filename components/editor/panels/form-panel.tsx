"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useShallow } from "zustand/react/shallow"
import { useCVStore, selectVisibleSections } from "@/lib/store/cv-store"
import { PersonalInfoEditor } from "../sections/personal-info-editor"
import { ExperienceEditor } from "../sections/experience-editor"
import { EducationEditor } from "../sections/education-editor"
import { SkillsEditor } from "../sections/skills-editor"
import { LanguagesEditor } from "../sections/languages-editor"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"

interface FormPanelProps {
  dictionary: Dictionary
  locale: Locale
}

export function FormPanel({ dictionary, locale }: FormPanelProps) {
  const visibleSections = useCVStore(useShallow(selectVisibleSections))
  const t = dictionary.ui.editor.sections

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="personalInfo" className="flex h-full flex-col">
        <div className="border-b px-4">
          <TabsList className="h-12 w-full justify-start gap-1 bg-transparent">
            {visibleSections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="data-[state=active]:bg-muted"
              >
                {t[section.id as keyof typeof t] || section.id}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="personalInfo" className="mt-0">
              <PersonalInfoEditor dictionary={dictionary} locale={locale} />
            </TabsContent>
            <TabsContent value="summary" className="mt-0">
              <PersonalInfoEditor
                dictionary={dictionary}
                locale={locale}
                showSummaryOnly
              />
            </TabsContent>
            <TabsContent value="experience" className="mt-0">
              <ExperienceEditor dictionary={dictionary} locale={locale} />
            </TabsContent>
            <TabsContent value="education" className="mt-0">
              <EducationEditor dictionary={dictionary} locale={locale} />
            </TabsContent>
            <TabsContent value="skills" className="mt-0">
              <SkillsEditor dictionary={dictionary} locale={locale} />
            </TabsContent>
            <TabsContent value="languages" className="mt-0">
              <LanguagesEditor dictionary={dictionary} locale={locale} />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
