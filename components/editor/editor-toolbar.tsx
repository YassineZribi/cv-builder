"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  useCVStore,
  selectTemplate,
  selectFormat,
  selectIsDirty,
  selectLastSaved,
} from "@/lib/store/cv-store"
import { ExportDialog } from "@/components/shared/export-dialog"
import { ImportDialog } from "@/components/shared/import-dialog"
import { useAutosave } from "@/hooks/use-autosave"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import type { Template, CVFormat } from "@/lib/cv/schema"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlusSignIcon,
  DocumentValidationIcon,
  Globe02Icon,
  PaintBrushIcon,
  FileExportIcon,
  FileImportIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { useRouter } from "next/navigation"

interface EditorToolbarProps {
  dictionary: Dictionary
  locale: Locale
}

export function EditorToolbar({ dictionary, locale }: EditorToolbarProps) {
  const router = useRouter()
  const template = useCVStore(selectTemplate)
  const format = useCVStore(selectFormat)
  const isDirty = useCVStore(selectIsDirty)
  const lastSaved = useCVStore(selectLastSaved)
  const setTemplate = useCVStore((state) => state.setTemplate)
  const setFormat = useCVStore((state) => state.setFormat)
  const resetCV = useCVStore((state) => state.resetCV)

  const [exportOpen, setExportOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  // Initialize autosave
  useAutosave()

  const t = dictionary.ui

  const handleTemplateChange = useCallback(
    (value: string) => {
      setTemplate(value as Template)
    },
    [setTemplate]
  )

  const handleFormatChange = useCallback(
    (value: string) => {
      setFormat(value as CVFormat)
    },
    [setFormat]
  )

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      router.push(`/${newLocale}/editor`)
    },
    [router]
  )

  const handleNewCV = useCallback(() => {
    if (
      isDirty &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to create a new CV?"
      )
    ) {
      return
    }
    resetCV()
  }, [isDirty, resetCV])

  const formatLastSaved = (date: Date | null) => {
    if (!date) return null
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)

    if (seconds < 60) return "Just saved"
    if (seconds < 3600) return `Saved ${Math.floor(seconds / 60)}m ago`
    return `Saved ${Math.floor(seconds / 3600)}h ago`
  }

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{t.editor.title}</h1>
          <Separator orientation="vertical" className="mx-2 h-6" />

          <Button variant="outline" size="sm" onClick={handleNewCV}>
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            {t.editor.toolbar.newCV}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportOpen(true)}
          >
            <HugeiconsIcon icon={FileImportIcon} size={16} />
            {t.editor.toolbar.import}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportOpen(true)}
          >
            <HugeiconsIcon icon={FileExportIcon} size={16} />
            {t.editor.toolbar.export}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {isDirty ? (
            <span className="text-sm text-muted-foreground">
              {t.editor.toolbar.unsavedChanges}
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={14}
                className="text-green-500"
              />
              {formatLastSaved(lastSaved)}
            </span>
          ) : null}

          <Select value={format} onValueChange={handleFormatChange}>
            <SelectTrigger className="w-[180px]">
              <HugeiconsIcon icon={DocumentValidationIcon} size={16} />
              <SelectValue placeholder={t.editor.toolbar.format} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="european">{t.format.european}</SelectItem>
              <SelectItem value="canadian">{t.format.canadian}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={template} onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-[140px]">
              <HugeiconsIcon icon={PaintBrushIcon} size={16} />
              <SelectValue placeholder={t.editor.toolbar.template} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">{t.template.modern}</SelectItem>
              <SelectItem value="classic">{t.template.classic}</SelectItem>
              <SelectItem value="minimal">{t.template.minimal}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locale} onValueChange={handleLocaleChange}>
            <SelectTrigger className="w-[100px]">
              <HugeiconsIcon icon={Globe02Icon} size={16} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Francais</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        dictionary={dictionary}
      />

      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        dictionary={dictionary}
      />
    </>
  )
}
