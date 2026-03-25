"use client"

import { useMemo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCVStore, selectCV, selectTemplate } from "@/lib/store/cv-store"
import { CVPreview } from "@/components/preview/cv-preview"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"

interface PreviewPanelProps {
  dictionary: Dictionary
  locale: Locale
}

export function PreviewPanel({ dictionary, locale }: PreviewPanelProps) {
  const cv = useCVStore(selectCV)
  const template = useCVStore(selectTemplate)

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center justify-center border-b bg-background/50 px-4">
        <span className="text-sm font-medium text-muted-foreground">
          {dictionary.ui.editor.toolbar.preview}
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex justify-center p-8">
          <CVPreview cv={cv} template={template} dictionary={dictionary} />
        </div>
      </ScrollArea>
    </div>
  )
}
