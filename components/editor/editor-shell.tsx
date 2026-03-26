"use client"

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { EditorToolbar } from "./editor-toolbar"
import { FormPanel } from "./panels/form-panel"
import { PreviewPanel } from "./panels/preview-panel"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"

interface EditorShellProps {
  dictionary: Dictionary
  locale: Locale
}

export function EditorShell({ dictionary, locale }: EditorShellProps) {
  return (
    <div className="flex h-screen flex-col bg-muted/30">
      <EditorToolbar dictionary={dictionary} locale={locale} />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel
            defaultSize="50%"
            minSize="30%"
            maxSize="60%"
            className="bg-background"
          >
            <FormPanel dictionary={dictionary} locale={locale} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="50%" minSize="40%" className="bg-muted/50">
            <PreviewPanel dictionary={dictionary} locale={locale} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
