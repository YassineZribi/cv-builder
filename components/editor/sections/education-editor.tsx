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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { useCVStore, selectEducation } from "@/lib/store/cv-store"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import type { EducationEntry } from "@/lib/cv/schema"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons"

interface EducationEditorProps {
  dictionary: Dictionary
  locale: Locale
}

function SortableEducationCard({
  entry,
  dictionary,
  onUpdate,
  onRemove,
}: {
  entry: EducationEntry
  dictionary: Dictionary
  onUpdate: (id: string, data: Partial<EducationEntry>) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const t = dictionary.cv.labels
  const p = dictionary.cv.placeholders

  const handleChange = useCallback(
    (field: keyof EducationEntry) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onUpdate(entry.id, { [field]: e.target.value })
      },
    [entry.id, onUpdate]
  )

  const handleCurrentChange = useCallback(
    (checked: boolean) => {
      onUpdate(entry.id, {
        current: checked,
        endDate: checked ? null : entry.endDate,
      })
    },
    [entry.id, entry.endDate, onUpdate]
  )

  return (
    <div ref={setNodeRef} style={style}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none p-1 hover:bg-muted rounded"
              aria-label="Drag to reorder"
            >
              <HugeiconsIcon
                icon={DragDropVerticalIcon}
                size={16}
                className="text-muted-foreground"
              />
            </button>
            <CardTitle className="text-base">
              {entry.degree || entry.institution || "New Education"}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(entry.id)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>{t.institution}</FieldLabel>
              <Input
                value={entry.institution}
                onChange={handleChange("institution")}
                placeholder={p.institution}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.degree}</FieldLabel>
                <Input
                  value={entry.degree}
                  onChange={handleChange("degree")}
                  placeholder={p.degree}
                />
              </Field>
              <Field>
                <FieldLabel>{t.field}</FieldLabel>
                <Input
                  value={entry.field || ""}
                  onChange={handleChange("field")}
                  placeholder={p.field}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>{t.location}</FieldLabel>
              <Input
                value={entry.location || ""}
                onChange={handleChange("location")}
                placeholder={p.location}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.startDate}</FieldLabel>
                <Input
                  type="month"
                  value={entry.startDate || ""}
                  onChange={handleChange("startDate")}
                />
              </Field>
              <Field>
                <FieldLabel>{t.endDate}</FieldLabel>
                <Input
                  type="month"
                  value={entry.endDate || ""}
                  onChange={handleChange("endDate")}
                  disabled={entry.current}
                />
              </Field>
            </div>
            <Field orientation="horizontal">
              <Checkbox
                id={`current-edu-${entry.id}`}
                checked={entry.current}
                onCheckedChange={handleCurrentChange}
              />
              <FieldLabel htmlFor={`current-edu-${entry.id}`}>
                Currently studying
              </FieldLabel>
            </Field>
            <Field>
              <FieldLabel>{t.grade}</FieldLabel>
              <Input
                value={entry.grade || ""}
                onChange={handleChange("grade")}
                placeholder={p.grade}
              />
            </Field>
            <Field>
              <FieldLabel>{t.description}</FieldLabel>
              <Textarea
                value={entry.description || ""}
                onChange={handleChange("description")}
                placeholder="Additional details about your studies..."
                rows={3}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}

export function EducationEditor({ dictionary, locale }: EducationEditorProps) {
  const education = useCVStore(selectEducation)
  const addEducation = useCVStore((state) => state.addEducation)
  const updateEducation = useCVStore((state) => state.updateEducation)
  const removeEducation = useCVStore((state) => state.removeEducation)
  const reorderEducation = useCVStore((state) => state.reorderEducation)

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
        const oldIndex = education.findIndex((e) => e.id === active.id)
        const newIndex = education.findIndex((e) => e.id === over.id)
        reorderEducation(oldIndex, newIndex)
      }
    },
    [education, reorderEducation]
  )

  const handleAdd = useCallback(() => {
    addEducation()
  }, [addEducation])

  if (education.length === 0) {
    return (
      <div className="space-y-4">
        <Empty>
          <EmptyTitle>{dictionary.ui.editor.empty.education}</EmptyTitle>
          <EmptyDescription>Add your educational background.</EmptyDescription>
        </Empty>
        <Button variant="outline" onClick={handleAdd} className="w-full">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          {dictionary.ui.editor.actions.addEducation}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={education.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {education.map((entry) => (
            <SortableEducationCard
              key={entry.id}
              entry={entry}
              dictionary={dictionary}
              onUpdate={updateEducation}
              onRemove={removeEducation}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={handleAdd} className="w-full">
        <HugeiconsIcon icon={Add01Icon} size={16} />
        {dictionary.ui.editor.actions.addEducation}
      </Button>
    </div>
  )
}
