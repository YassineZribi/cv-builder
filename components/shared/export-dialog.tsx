"use client"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { usePDFExport } from "@/hooks/use-pdf-export"
import { useCVStore, selectCV } from "@/lib/store/cv-store"
import { downloadJSON } from "@/lib/storage/export-import"
import { generateFilename } from "@/lib/pdf/generator"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DocumentValidationIcon,
  FileExportIcon,
} from "@hugeicons/core-free-icons"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dictionary: Dictionary
}

export function ExportDialog({
  open,
  onOpenChange,
  dictionary,
}: ExportDialogProps) {
  const cv = useCVStore(selectCV)
  const { exportPDF, isGenerating, error } = usePDFExport({ dictionary })
  const [isExportingJSON, setIsExportingJSON] = useState(false)

  const t = dictionary.ui.export

  const handleExportPDF = useCallback(async () => {
    await exportPDF()
    if (!error) {
      onOpenChange(false)
    }
  }, [exportPDF, error, onOpenChange])

  const handleExportJSON = useCallback(() => {
    setIsExportingJSON(true)
    try {
      const filename = generateFilename(cv, "json")
      downloadJSON(cv, filename)
      onOpenChange(false)
    } catch (err) {
      console.error("JSON export failed:", err)
    } finally {
      setIsExportingJSON(false)
    }
  }, [cv, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={handleExportPDF}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Spinner className="mr-3 size-5" />
            ) : (
              <HugeiconsIcon
                icon={DocumentValidationIcon}
                size={20}
                className="mr-3"
              />
            )}
            <div className="text-left">
              <div className="font-medium">
                {isGenerating
                  ? t.generating
                  : dictionary.ui.editor.toolbar.exportPDF}
              </div>
              <div className="text-sm text-muted-foreground">
                Pixel-perfect PDF matching the preview
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={handleExportJSON}
            disabled={isExportingJSON}
          >
            <HugeiconsIcon
              icon={FileExportIcon}
              size={20}
              className="mr-3"
            />
            <div className="text-left">
              <div className="font-medium">
                {dictionary.ui.editor.toolbar.exportJSON}
              </div>
              <div className="text-sm text-muted-foreground">
                JSON file for backup or import
              </div>
            </div>
          </Button>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {dictionary.ui.common.cancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
