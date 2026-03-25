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
import {
  Field,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field"
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { useCVStore, selectExperience } from "@/lib/store/cv-store"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import type { ExperienceEntry } from "@/lib/cv/schema"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons"

interface ExperienceEditorProps {
  dictionary: Dictionary
  locale: Locale
}

function SortableExperienceCard({
  entry,
  dictionary,
  onUpdate,
  onRemove,
}: {
  entry: ExperienceEntry
  dictionary: Dictionary
  onUpdate: (id: string, data: Partial<ExperienceEntry>) => void
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
    (field: keyof ExperienceEntry) =>
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
              {entry.position || entry.company || "New Experience"}
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
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.company}</FieldLabel>
                <Input
                  value={entry.company}
                  onChange={handleChange("company")}
                  placeholder={p.company}
                />
              </Field>
              <Field>
                <FieldLabel>{t.position}</FieldLabel>
                <Input
                  value={entry.position}
                  onChange={handleChange("position")}
                  placeholder={p.position}
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
                id={`current-${entry.id}`}
                checked={entry.current}
                onCheckedChange={handleCurrentChange}
              />
              <FieldLabel htmlFor={`current-${entry.id}`}>
                {t.current} - {dictionary.cv.dates.present}
              </FieldLabel>
            </Field>
            <Field>
              <FieldLabel>{t.description}</FieldLabel>
              <Textarea
                value={entry.description || ""}
                onChange={handleChange("description")}
                placeholder={p.description}
                rows={4}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}

export function ExperienceEditor({ dictionary, locale }: ExperienceEditorProps) {
  const experience = useCVStore(selectExperience)
  const addExperience = useCVStore((state) => state.addExperience)
  const updateExperience = useCVStore((state) => state.updateExperience)
  const removeExperience = useCVStore((state) => state.removeExperience)
  const reorderExperience = useCVStore((state) => state.reorderExperience)

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
        const oldIndex = experience.findIndex((e) => e.id === active.id)
        const newIndex = experience.findIndex((e) => e.id === over.id)
        reorderExperience(oldIndex, newIndex)
      }
    },
    [experience, reorderExperience]
  )

  const handleAdd = useCallback(() => {
    addExperience()
  }, [addExperience])

  if (experience.length === 0) {
    return (
      <div className="space-y-4">
        <Empty>
          <EmptyTitle>{dictionary.ui.editor.empty.experience}</EmptyTitle>
          <EmptyDescription>Add your work experience to showcase your professional background.</EmptyDescription>
        </Empty>
        <Button variant="outline" onClick={handleAdd} className="w-full">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          {dictionary.ui.editor.actions.addExperience}
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
          items={experience.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {experience.map((entry) => (
            <SortableExperienceCard
              key={entry.id}
              entry={entry}
              dictionary={dictionary}
              onUpdate={updateExperience}
              onRemove={removeExperience}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={handleAdd} className="w-full">
        <HugeiconsIcon icon={Add01Icon} size={16} />
        {dictionary.ui.editor.actions.addExperience}
      </Button>
    </div>
  )
}
