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
import { useCVStore, selectProjects } from "@/lib/store/cv-store"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import type { Project } from "@/lib/cv/schema"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons"

interface ProjectsEditorProps {
  dictionary: Dictionary
  locale: Locale
}

function SortableProjectCard({
  project,
  dictionary,
  onUpdate,
  onRemove,
}: {
  project: Project
  dictionary: Dictionary
  onUpdate: (id: string, data: Partial<Project>) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const t = dictionary.cv.labels
  const p = dictionary.cv.placeholders

  const handleChange = useCallback(
    (field: keyof Project) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onUpdate(project.id, { [field]: e.target.value })
      },
    [project.id, onUpdate]
  )

  const handleTechnologiesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const technologies = e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      onUpdate(project.id, { technologies })
    },
    [project.id, onUpdate]
  )

  const handleOngoingChange = useCallback(
    (checked: boolean) => {
      onUpdate(project.id, {
        endDate: checked ? null : project.endDate,
      })
    },
    [project.id, project.endDate, onUpdate]
  )

  const isOngoing = project.endDate === null

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
              {project.name || "New Project"}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(project.id)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.projectName}</FieldLabel>
                <Input
                  value={project.name}
                  onChange={handleChange("name")}
                  placeholder={p.projectName}
                />
              </Field>
              <Field>
                <FieldLabel>{t.projectUrl}</FieldLabel>
                <Input
                  type="url"
                  value={project.url || ""}
                  onChange={handleChange("url")}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>{t.description}</FieldLabel>
              <Textarea
                value={project.description || ""}
                onChange={handleChange("description")}
                placeholder={p.projectDescription}
                rows={3}
              />
            </Field>
            <Field>
              <FieldLabel>{t.technologies}</FieldLabel>
              <Input
                value={project.technologies.join(", ")}
                onChange={handleTechnologiesChange}
                placeholder={p.technologies}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.startDate}</FieldLabel>
                <Input
                  type="month"
                  value={project.startDate || ""}
                  onChange={handleChange("startDate")}
                />
              </Field>
              <Field>
                <FieldLabel>{t.endDate}</FieldLabel>
                <Input
                  type="month"
                  value={project.endDate || ""}
                  onChange={handleChange("endDate")}
                  disabled={isOngoing}
                />
              </Field>
            </div>
            <Field orientation="horizontal">
              <Checkbox
                id={`ongoing-${project.id}`}
                checked={isOngoing}
                onCheckedChange={handleOngoingChange}
              />
              <FieldLabel htmlFor={`ongoing-${project.id}`}>
                {dictionary.cv.dates.present}
              </FieldLabel>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}

export function ProjectsEditor({ dictionary, locale }: ProjectsEditorProps) {
  const projects = useCVStore(selectProjects)
  const addProject = useCVStore((state) => state.addProject)
  const updateProject = useCVStore((state) => state.updateProject)
  const removeProject = useCVStore((state) => state.removeProject)
  const reorderProjects = useCVStore((state) => state.reorderProjects)

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
        const oldIndex = projects.findIndex((p) => p.id === active.id)
        const newIndex = projects.findIndex((p) => p.id === over.id)
        reorderProjects(oldIndex, newIndex)
      }
    },
    [projects, reorderProjects]
  )

  const handleAdd = useCallback(() => {
    addProject()
  }, [addProject])

  if (projects.length === 0) {
    return (
      <div className="space-y-4">
        <Empty>
          <EmptyTitle>{dictionary.ui.editor.empty.projects}</EmptyTitle>
          <EmptyDescription>
            Showcase your personal and professional projects.
          </EmptyDescription>
        </Empty>
        <Button variant="outline" onClick={handleAdd} className="w-full">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          {dictionary.ui.editor.actions.addProject}
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
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => (
            <SortableProjectCard
              key={project.id}
              project={project}
              dictionary={dictionary}
              onUpdate={updateProject}
              onRemove={removeProject}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={handleAdd} className="w-full">
        <HugeiconsIcon icon={Add01Icon} size={16} />
        {dictionary.ui.editor.actions.addProject}
      </Button>
    </div>
  )
}
