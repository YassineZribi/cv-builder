"use client"

import { useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCVStore, selectPersonalInfo, selectFormat } from "@/lib/store/cv-store"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import type { PersonalInfo } from "@/lib/cv/schema"

interface PersonalInfoEditorProps {
  dictionary: Dictionary
  locale: Locale
  showSummaryOnly?: boolean
}

export function PersonalInfoEditor({
  dictionary,
  locale,
  showSummaryOnly = false,
}: PersonalInfoEditorProps) {
  const personalInfo = useCVStore(selectPersonalInfo)
  const format = useCVStore(selectFormat)
  const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo)
  const updateContact = useCVStore((state) => state.updateContact)

  const t = dictionary.cv.labels
  const p = dictionary.cv.placeholders

  const handleChange = useCallback(
    (field: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updatePersonalInfo({ [field]: e.target.value })
    },
    [updatePersonalInfo]
  )

  const handleContactChange = useCallback(
    (field: keyof PersonalInfo["contact"]) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateContact({ [field]: e.target.value })
      },
    [updateContact]
  )

  const handleGenderChange = useCallback(
    (value: string) => {
      updatePersonalInfo({
        gender: value as PersonalInfo["gender"],
      })
    },
    [updatePersonalInfo]
  )

  if (showSummaryOnly) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.ui.editor.sections.summary}</CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel>{t.summary}</FieldLabel>
            <Textarea
              value={personalInfo.summary || ""}
              onChange={handleChange("summary")}
              placeholder={p.summary}
              rows={6}
            />
          </Field>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.ui.editor.sections.personalInfo}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.firstName}</FieldLabel>
                <Input
                  value={personalInfo.firstName}
                  onChange={handleChange("firstName")}
                  placeholder={p.firstName}
                />
              </Field>
              <Field>
                <FieldLabel>{t.lastName}</FieldLabel>
                <Input
                  value={personalInfo.lastName}
                  onChange={handleChange("lastName")}
                  placeholder={p.lastName}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>{t.title}</FieldLabel>
              <Input
                value={personalInfo.title || ""}
                onChange={handleChange("title")}
                placeholder={p.title}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.email}</FieldLabel>
                <Input
                  type="email"
                  value={personalInfo.contact.email}
                  onChange={handleContactChange("email")}
                  placeholder={p.email}
                />
              </Field>
              <Field>
                <FieldLabel>{t.phone}</FieldLabel>
                <Input
                  type="tel"
                  value={personalInfo.contact.phone || ""}
                  onChange={handleContactChange("phone")}
                  placeholder={p.phone}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>{t.address}</FieldLabel>
              <Input
                value={personalInfo.contact.address || ""}
                onChange={handleContactChange("address")}
                placeholder={p.address}
              />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel>{t.city}</FieldLabel>
                <Input
                  value={personalInfo.contact.city || ""}
                  onChange={handleContactChange("city")}
                  placeholder={p.city}
                />
              </Field>
              <Field>
                <FieldLabel>{t.postalCode}</FieldLabel>
                <Input
                  value={personalInfo.contact.postalCode || ""}
                  onChange={handleContactChange("postalCode")}
                  placeholder={p.postalCode}
                />
              </Field>
              <Field>
                <FieldLabel>{t.country}</FieldLabel>
                <Input
                  value={personalInfo.contact.country || ""}
                  onChange={handleContactChange("country")}
                  placeholder={p.country}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>{t.linkedin}</FieldLabel>
                <Input
                  type="url"
                  value={personalInfo.contact.linkedin || ""}
                  onChange={handleContactChange("linkedin")}
                  placeholder={p.linkedin}
                />
              </Field>
              <Field>
                <FieldLabel>{t.github}</FieldLabel>
                <Input
                  type="url"
                  value={personalInfo.contact.github || ""}
                  onChange={handleContactChange("github")}
                  placeholder={p.github}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>{t.portfolio}</FieldLabel>
              <Input
                type="url"
                value={personalInfo.contact.portfolio || ""}
                onChange={handleContactChange("portfolio")}
                placeholder={p.portfolio}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {format === "european" && (
        <Card>
          <CardHeader>
            <CardTitle>Europass Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>{t.dateOfBirth}</FieldLabel>
                  <Input
                    type="date"
                    value={personalInfo.dateOfBirth || ""}
                    onChange={handleChange("dateOfBirth")}
                  />
                </Field>
                <Field>
                  <FieldLabel>{t.nationality}</FieldLabel>
                  <Input
                    value={personalInfo.nationality || ""}
                    onChange={handleChange("nationality")}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel>{t.gender}</FieldLabel>
                <Select
                  value={personalInfo.gender || ""}
                  onValueChange={handleGenderChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">
                      {dictionary.cv.gender.male}
                    </SelectItem>
                    <SelectItem value="female">
                      {dictionary.cv.gender.female}
                    </SelectItem>
                    <SelectItem value="other">
                      {dictionary.cv.gender.other}
                    </SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      {dictionary.cv.gender["prefer-not-to-say"]}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
