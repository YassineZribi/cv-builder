import { pdf } from "@react-pdf/renderer"
import type { CV } from "@/lib/cv/schema"
import { CVDocument } from "./cv-document"

interface GeneratePDFOptions {
  cv: CV
  labels: {
    sections: Record<string, string>
    dates: { present: string; to: string }
    proficiency: Record<string, string>
    skillLevel: Record<string, string>
    europass: {
      dateOfBirth: string
      nationality: string
      gender: string
      genderValues: Record<string, string>
    }
  }
}

export async function generatePDF({
  cv,
  labels,
}: GeneratePDFOptions): Promise<Blob> {
  const document = <CVDocument cv={cv} labels={labels} />
  const blob = await pdf(document).toBlob()
  return blob
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateFilename(cv: CV, extension: string): string {
  const name = [cv.personalInfo.firstName, cv.personalInfo.lastName]
    .filter(Boolean)
    .join("_")
  const timestamp = new Date().toISOString().split("T")[0]
  return `${name || "CV"}_${timestamp}.${extension}`
}
