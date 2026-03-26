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
import { useCVStore, selectCertifications } from "@/lib/store/cv-store"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import type { Certification } from "@/lib/cv/schema"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons"

interface CertificationsEditorProps {
  dictionary: Dictionary
  locale: Locale
}

function SortableCertificationCard({
  cert,
  dictionary,
  onUpdate,
  onRemove,
}: {
  cert: Certification
  dictionary: Dictionary
  onUpdate: (id: string, data: Partial<Certification>) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cert.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const t = dictionary.cv.labels
  const p = dictionary.cv.placeholders

  const handleChange = useCallback(
    (field: keyof Certification) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate(cert.id, { [field]: e.target.value })
      },
    [cert.id, onUpdate]
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
              {cert.name || cert.issuer || "New Certification"}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(cert.id)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.certificationName}</FieldLabel>
                <Input
                  value={cert.name}
                  onChange={handleChange("name")}
                  placeholder={p.certificationName}
                />
              </Field>
              <Field>
                <FieldLabel>{t.issuer}</FieldLabel>
                <Input
                  value={cert.issuer}
                  onChange={handleChange("issuer")}
                  placeholder={p.issuer}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.issueDate}</FieldLabel>
                <Input
                  type="month"
                  value={cert.date || ""}
                  onChange={handleChange("date")}
                />
              </Field>
              <Field>
                <FieldLabel>{t.expiryDate}</FieldLabel>
                <Input
                  type="month"
                  value={cert.expiryDate || ""}
                  onChange={handleChange("expiryDate")}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.credentialId}</FieldLabel>
                <Input
                  value={cert.credentialId || ""}
                  onChange={handleChange("credentialId")}
                  placeholder={p.credentialId}
                />
              </Field>
              <Field>
                <FieldLabel>{t.credentialUrl}</FieldLabel>
                <Input
                  type="url"
                  value={cert.url || ""}
                  onChange={handleChange("url")}
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}

export function CertificationsEditor({
  dictionary,
  locale,
}: CertificationsEditorProps) {
  const certifications = useCVStore(selectCertifications)
  const addCertification = useCVStore((state) => state.addCertification)
  const updateCertification = useCVStore((state) => state.updateCertification)
  const removeCertification = useCVStore((state) => state.removeCertification)
  const reorderCertifications = useCVStore(
    (state) => state.reorderCertifications
  )

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
        const oldIndex = certifications.findIndex((c) => c.id === active.id)
        const newIndex = certifications.findIndex((c) => c.id === over.id)
        reorderCertifications(oldIndex, newIndex)
      }
    },
    [certifications, reorderCertifications]
  )

  const handleAdd = useCallback(() => {
    addCertification()
  }, [addCertification])

  if (certifications.length === 0) {
    return (
      <div className="space-y-4">
        <Empty>
          <EmptyTitle>{dictionary.ui.editor.empty.certifications}</EmptyTitle>
          <EmptyDescription>
            Add professional certifications and credentials.
          </EmptyDescription>
        </Empty>
        <Button variant="outline" onClick={handleAdd} className="w-full">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          {dictionary.ui.editor.actions.addCertification}
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
          items={certifications.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {certifications.map((cert) => (
            <SortableCertificationCard
              key={cert.id}
              cert={cert}
              dictionary={dictionary}
              onUpdate={updateCertification}
              onRemove={removeCertification}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={handleAdd} className="w-full">
        <HugeiconsIcon icon={Add01Icon} size={16} />
        {dictionary.ui.editor.actions.addCertification}
      </Button>
    </div>
  )
}
