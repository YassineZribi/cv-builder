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
import { useCVStore, selectSkills } from "@/lib/store/cv-store"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import type { Skill } from "@/lib/cv/schema"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons"

interface SkillsEditorProps {
  dictionary: Dictionary
  locale: Locale
}

function SortableSkillCard({
  skill,
  dictionary,
  onUpdate,
  onRemove,
}: {
  skill: Skill
  dictionary: Dictionary
  onUpdate: (id: string, data: Partial<Skill>) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const t = dictionary.cv.labels
  const p = dictionary.cv.placeholders
  const levels = dictionary.cv.skillLevel

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(skill.id, { name: e.target.value })
    },
    [skill.id, onUpdate]
  )

  const handleLevelChange = useCallback(
    (value: string) => {
      onUpdate(skill.id, { level: value as Skill["level"] })
    },
    [skill.id, onUpdate]
  )

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(skill.id, { category: e.target.value })
    },
    [skill.id, onUpdate]
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
            <div className="flex-1 grid grid-cols-3 gap-3">
              <Field>
                <FieldLabel>{t.skillName}</FieldLabel>
                <Input
                  value={skill.name}
                  onChange={handleNameChange}
                  placeholder={p.skillName}
                />
              </Field>
              <Field>
                <FieldLabel>{t.skillLevel}</FieldLabel>
                <Select
                  value={skill.level || ""}
                  onValueChange={handleLevelChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">{levels.beginner}</SelectItem>
                    <SelectItem value="intermediate">
                      {levels.intermediate}
                    </SelectItem>
                    <SelectItem value="advanced">{levels.advanced}</SelectItem>
                    <SelectItem value="expert">{levels.expert}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>{t.skillCategory}</FieldLabel>
                <Input
                  value={skill.category || ""}
                  onChange={handleCategoryChange}
                  placeholder={p.skillCategory}
                />
              </Field>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onRemove(skill.id)}
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

export function SkillsEditor({ dictionary, locale }: SkillsEditorProps) {
  const skills = useCVStore(selectSkills)
  const addSkill = useCVStore((state) => state.addSkill)
  const updateSkill = useCVStore((state) => state.updateSkill)
  const removeSkill = useCVStore((state) => state.removeSkill)
  const reorderSkills = useCVStore((state) => state.reorderSkills)

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
        const oldIndex = skills.findIndex((s) => s.id === active.id)
        const newIndex = skills.findIndex((s) => s.id === over.id)
        reorderSkills(oldIndex, newIndex)
      }
    },
    [skills, reorderSkills]
  )

  const handleAdd = useCallback(() => {
    addSkill()
  }, [addSkill])

  if (skills.length === 0) {
    return (
      <div className="space-y-4">
        <Empty>
          <EmptyTitle>{dictionary.ui.editor.empty.skills}</EmptyTitle>
          <EmptyDescription>Add your technical and soft skills.</EmptyDescription>
        </Empty>
        <Button variant="outline" onClick={handleAdd} className="w-full">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          {dictionary.ui.editor.actions.addSkill}
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
          items={skills.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {skills.map((skill) => (
            <SortableSkillCard
              key={skill.id}
              skill={skill}
              dictionary={dictionary}
              onUpdate={updateSkill}
              onRemove={removeSkill}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={handleAdd} className="w-full">
        <HugeiconsIcon icon={Add01Icon} size={16} />
        {dictionary.ui.editor.actions.addSkill}
      </Button>
    </div>
  )
}
