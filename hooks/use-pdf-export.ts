"use client"

import { useState, useCallback } from "react"
import { useCVStore, selectCV } from "@/lib/store/cv-store"
import {
  generatePDF,
  downloadBlob,
  generateFilename,
} from "@/lib/pdf/generator"
import type { Dictionary } from "@/lib/i18n/dictionaries"

interface UsePDFExportOptions {
  dictionary: Dictionary
}

export function usePDFExport({ dictionary }: UsePDFExportOptions) {
  const cv = useCVStore(selectCV)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportPDF = useCallback(async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const labels = {
        sections: dictionary.ui.editor.sections,
        dates: dictionary.cv.dates,
        proficiency: dictionary.cv.proficiency,
        skillLevel: dictionary.cv.skillLevel,
      }

      const blob = await generatePDF({ cv, labels })
      const filename = generateFilename(cv, "pdf")
      downloadBlob(blob, filename)
    } catch (err) {
      console.error("PDF generation failed:", err)
      setError(
        err instanceof Error ? err.message : "Failed to generate PDF"
      )
    } finally {
      setIsGenerating(false)
    }
  }, [cv, dictionary])

  return {
    exportPDF,
    isGenerating,
    error,
  }
}
