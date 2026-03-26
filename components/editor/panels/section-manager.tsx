"use client"

import { useCallback } from "react"
import { useShallow } from "zustand/react/shallow"
import { useCVStore, selectSections } from "@/lib/store/cv-store"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { HugeiconsIcon } from "@hugeicons/react"
import { Setting07Icon } from "@hugeicons/core-free-icons"

interface SectionManagerProps {
  dictionary: Dictionary
}

const SECTION_ORDER = [
  "personalInfo",
  "summary",
  "experience",
  "education",
  "skills",
  "languages",
  "certifications",
  "projects",
  "references",
] as const

export function SectionManager({ dictionary }: SectionManagerProps) {
  const sections = useCVStore(useShallow(selectSections))
  const toggleSection = useCVStore((state) => state.toggleSection)

  const t = dictionary.ui.editor.sections

  const handleToggle = useCallback(
    (id: string) => {
      toggleSection(id)
    },
    [toggleSection]
  )

  const sortedSections = [...sections].sort(
    (a, b) =>
      SECTION_ORDER.indexOf(a.id as (typeof SECTION_ORDER)[number]) -
      SECTION_ORDER.indexOf(b.id as (typeof SECTION_ORDER)[number])
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={dictionary.ui.editor.toolbar.manageSections}
        >
          <HugeiconsIcon icon={Setting07Icon} size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <PopoverHeader>
          <PopoverTitle>
            {dictionary.ui.editor.toolbar.manageSections}
          </PopoverTitle>
          <PopoverDescription>
            {dictionary.ui.editor.toolbar.manageSectionsDescription}
          </PopoverDescription>
        </PopoverHeader>
        <Separator />
        <div className="flex flex-col gap-1">
          {sortedSections.map((section) => {
            const label = t[section.id as keyof typeof t] ?? section.id
            const isLocked = section.id === "personalInfo"
            return (
              <div
                key={section.id}
                className="flex items-center justify-between rounded-lg px-1 py-1.5 transition-colors hover:bg-muted/50"
              >
                <span
                  className={
                    isLocked
                      ? "text-sm text-muted-foreground"
                      : "text-sm"
                  }
                >
                  {label}
                </span>
                <Switch
                  size="sm"
                  checked={section.visible}
                  onCheckedChange={() => handleToggle(section.id)}
                  disabled={isLocked}
                  aria-label={label}
                />
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
