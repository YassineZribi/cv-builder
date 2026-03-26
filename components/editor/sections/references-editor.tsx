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
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { useCVStore, selectReferences } from "@/lib/store/cv-store"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import type { Reference } from "@/lib/cv/schema"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons"

interface ReferencesEditorProps {
  dictionary: Dictionary
  locale: Locale
}

function SortableReferenceCard({
  reference,
  dictionary,
  onUpdate,
  onRemove,
}: {
  reference: Reference
  dictionary: Dictionary
  onUpdate: (id: string, data: Partial<Reference>) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: reference.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const t = dictionary.cv.labels
  const p = dictionary.cv.placeholders

  const handleChange = useCallback(
    (field: keyof Reference) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate(reference.id, { [field]: e.target.value })
      },
    [reference.id, onUpdate]
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
              {reference.name || reference.company || "New Reference"}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(reference.id)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.referenceName}</FieldLabel>
                <Input
                  value={reference.name}
                  onChange={handleChange("name")}
                  placeholder={p.referenceName}
                />
              </Field>
              <Field>
                <FieldLabel>{t.referencePosition}</FieldLabel>
                <Input
                  value={reference.position || ""}
                  onChange={handleChange("position")}
                  placeholder={p.referencePosition}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.referenceCompany}</FieldLabel>
                <Input
                  value={reference.company || ""}
                  onChange={handleChange("company")}
                  placeholder={p.referenceCompany}
                />
              </Field>
              <Field>
                <FieldLabel>{t.relationship}</FieldLabel>
                <Input
                  value={reference.relationship || ""}
                  onChange={handleChange("relationship")}
                  placeholder={p.relationship}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.referenceEmail}</FieldLabel>
                <Input
                  type="email"
                  value={reference.email || ""}
                  onChange={handleChange("email")}
                  placeholder={p.referenceEmail}
                />
              </Field>
              <Field>
                <FieldLabel>{t.referencePhone}</FieldLabel>
                <Input
                  type="tel"
                  value={reference.phone || ""}
                  onChange={handleChange("phone")}
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}

export function ReferencesEditor({ dictionary, locale }: ReferencesEditorProps) {
  const references = useCVStore(selectReferences)
  const addReference = useCVStore((state) => state.addReference)
  const updateReference = useCVStore((state) => state.updateReference)
  const removeReference = useCVStore((state) => state.removeReference)
  const reorderReferences = useCVStore((state) => state.reorderReferences)

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
        const oldIndex = references.findIndex((r) => r.id === active.id)
        const newIndex = references.findIndex((r) => r.id === over.id)
        reorderReferences(oldIndex, newIndex)
      }
    },
    [references, reorderReferences]
  )

  const handleAdd = useCallback(() => {
    addReference()
  }, [addReference])

  if (references.length === 0) {
    return (
      <div className="space-y-4">
        <Empty>
          <EmptyTitle>{dictionary.ui.editor.empty.references}</EmptyTitle>
          <EmptyDescription>
            Add professional references who can vouch for your work.
          </EmptyDescription>
        </Empty>
        <Button variant="outline" onClick={handleAdd} className="w-full">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          {dictionary.ui.editor.actions.addReference}
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
          items={references.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          {references.map((reference) => (
            <SortableReferenceCard
              key={reference.id}
              reference={reference}
              dictionary={dictionary}
              onUpdate={updateReference}
              onRemove={removeReference}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={handleAdd} className="w-full">
        <HugeiconsIcon icon={Add01Icon} size={16} />
        {dictionary.ui.editor.actions.addReference}
      </Button>
    </div>
  )
}
