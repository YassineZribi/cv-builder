"use client"

import { useState, useCallback, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCVStore } from "@/lib/store/cv-store"
import {
  importFromJSON,
  readFileAsText,
  type ImportResult,
} from "@/lib/storage/export-import"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { HugeiconsIcon } from "@hugeicons/react"
import { FileImportIcon, AlertCircleIcon } from "@hugeicons/core-free-icons"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dictionary: Dictionary
}

export function ImportDialog({
  open,
  onOpenChange,
  dictionary,
}: ImportDialogProps) {
  const setCV = useCVStore((state) => state.setCV)
  const [isDragging, setIsDragging] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = dictionary.ui.import

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true)
      setResult(null)

      try {
        const content = await readFileAsText(file)
        const importResult = importFromJSON(content)
        setResult(importResult)

        if (importResult.success && importResult.data) {
          setCV(importResult.data)
          onOpenChange(false)
        }
      } catch (error) {
        setResult({
          success: false,
          errors: [
            {
              path: "",
              message: error instanceof Error ? error.message : "Import failed",
            },
          ],
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [setCV, onOpenChange]
  )

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragging(false)

      const file = event.dataTransfer.files[0]
      if (file && file.type === "application/json") {
        processFile(file)
      } else {
        setResult({
          success: false,
          errors: [{ path: "", message: "Please drop a JSON file" }],
        })
      }
    },
    [processFile]
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleSelectFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleClose = useCallback(() => {
    setResult(null)
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
              ${isProcessing ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-primary/50"}
            `}
            onClick={handleSelectFile}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <HugeiconsIcon
              icon={FileImportIcon}
              size={40}
              className="mx-auto mb-4 text-muted-foreground"
            />
            <p className="text-sm font-medium">{t.selectFile}</p>
            <p className="text-sm text-muted-foreground mt-1">{t.dragDrop}</p>
            <p className="text-xs text-muted-foreground mt-2">{t.fileType}</p>
          </div>
        </div>

        {result && !result.success && result.errors && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <div className="flex items-start gap-2">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                size={20}
                className="text-destructive shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-destructive">
                  {t.validationErrors}
                </p>
                <ul className="mt-2 text-sm text-destructive/80 space-y-1">
                  {result.errors.map((error, idx) => (
                    <li key={idx}>
                      {error.path && (
                        <code className="bg-destructive/10 px-1 rounded mr-1">
                          {error.path}
                        </code>
                      )}
                      {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {dictionary.ui.common.cancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
