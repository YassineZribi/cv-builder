"use client"

import { useCallback } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCVStore, selectLanguages } from "@/lib/store/cv-store"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import type { Language } from "@/lib/cv/schema"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons"

interface LanguagesEditorProps {
  dictionary: Dictionary
  locale: Locale
}

function SortableLanguageCard({
  language,
  dictionary,
  onUpdate,
  onRemove,
}: {
  language: Language
  dictionary: Dictionary
  onUpdate: (id: string, data: Partial<Language>) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: language.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const t = dictionary.cv.labels
  const p = dictionary.cv.placeholders
  const proficiencyLabels = dictionary.cv.proficiency

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(language.id, { name: e.target.value })
    },
    [language.id, onUpdate]
  )

  const handleProficiencyChange = useCallback(
    (value: string) => {
      onUpdate(language.id, { proficiency: value as Language["proficiency"] })
    },
    [language.id, onUpdate]
  )

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none p-1 hover:bg-muted rounded mt-2"
              aria-label="Drag to reorder"
            >
              <HugeiconsIcon
                icon={DragDropVerticalIcon}
                size={16}
                className="text-muted-foreground"
              />
            </button>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>{t.languageName}</FieldLabel>
                <Input
                  value={language.name}
                  onChange={handleNameChange}
                  placeholder={p.languageName}
                />
              </Field>
              <Field>
                <FieldLabel>{t.proficiency}</FieldLabel>
                <Select
                  value={language.proficiency}
                  onValueChange={handleProficiencyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="native">
                      {proficiencyLabels.native}
                    </SelectItem>
                    <SelectItem value="C2">{proficiencyLabels.C2}</SelectItem>
                    <SelectItem value="C1">{proficiencyLabels.C1}</SelectItem>
                    <SelectItem value="B2">{proficiencyLabels.B2}</SelectItem>
                    <SelectItem value="B1">{proficiencyLabels.B1}</SelectItem>
                    <SelectItem value="A2">{proficiencyLabels.A2}</SelectItem>
                    <SelectItem value="A1">{proficiencyLabels.A1}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onRemove(language.id)}
              className="mt-6"
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function LanguagesEditor({ dictionary, locale }: LanguagesEditorProps) {
  const languages = useCVStore(selectLanguages)
  const addLanguage = useCVStore((state) => state.addLanguage)
  const updateLanguage = useCVStore((state) => state.updateLanguage)
  const removeLanguage = useCVStore((state) => state.removeLanguage)
  const reorderLanguages = useCVStore((state) => state.reorderLanguages)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        const oldIndex = languages.findIndex((l) => l.id === active.id)
        const newIndex = languages.findIndex((l) => l.id === over.id)
        reorderLanguages(oldIndex, newIndex)
      }
    },
    [languages, reorderLanguages]
  )

  const handleAdd = useCallback(() => {
    addLanguage()
  }, [addLanguage])

  if (languages.length === 0) {
    return (
      <div className="space-y-4">
        <Empty>
          <EmptyTitle>{dictionary.ui.editor.empty.languages}</EmptyTitle>
          <EmptyDescription>Add languages you speak.</EmptyDescription>
        </Empty>
        <Button variant="outline" onClick={handleAdd} className="w-full">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          {dictionary.ui.editor.actions.addLanguage}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={languages.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {languages.map((language) => (
            <SortableLanguageCard
              key={language.id}
              language={language}
              dictionary={dictionary}
              onUpdate={updateLanguage}
              onRemove={removeLanguage}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={handleAdd} className="w-full">
        <HugeiconsIcon icon={Add01Icon} size={16} />
        {dictionary.ui.editor.actions.addLanguage}
      </Button>
    </div>
  )
}
