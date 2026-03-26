import type { CV } from "@/lib/cv/schema"
import { validateCV, SCHEMA_VERSION } from "@/lib/cv/schema"
import type { ValidationMessages } from "@/lib/cv/schema"

export interface ImportResult {
  success: boolean
  data?: CV
  errors?: Array<{ path: string; message: string }>
}

export interface ImportErrorMessages {
  invalidJson?: string
  unsupportedVersion?: string
  importFailed?: string
}

export function exportToJSON(cv: CV): string {
  return JSON.stringify(cv, null, 2)
}

export function downloadJSON(cv: CV, filename: string) {
  const json = exportToJSON(cv)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function importFromJSON(
  jsonString: string,
  messages?: {
    validation?: ValidationMessages
    errors?: ImportErrorMessages
  }
): ImportResult {
  const errorMsgs = {
    invalidJson: messages?.errors?.invalidJson ?? "Invalid JSON format",
    unsupportedVersion:
      messages?.errors?.unsupportedVersion ?? "Unsupported schema version",
    importFailed: messages?.errors?.importFailed ?? "Unknown error occurred",
  }

  try {
    const parsed = JSON.parse(jsonString)

    // Check schema version and migrate if needed
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      const migrated = migrateSchema(parsed)
      if (!migrated.success) {
        return {
          success: false,
          errors: [
            {
              path: "schemaVersion",
              message: `${errorMsgs.unsupportedVersion}: ${parsed.schemaVersion}`,
            },
          ],
        }
      }
      parsed.schemaVersion = SCHEMA_VERSION
    }

    // Validate with Zod (using localized messages if provided)
    return validateCV(parsed, messages?.validation)
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        errors: [{ path: "", message: errorMsgs.invalidJson }],
      }
    }
    return {
      success: false,
      errors: [
        {
          path: "",
          message:
            error instanceof Error ? error.message : errorMsgs.importFailed,
        },
      ],
    }
  }
}

export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}

// Schema migration helper
function migrateSchema(data: unknown): { success: boolean; data?: unknown } {
  if (typeof data !== "object" || data === null) {
    return { success: false }
  }

  const obj = data as Record<string, unknown>

  // Handle missing schema version (assume version 1)
  if (!obj.schemaVersion) {
    obj.schemaVersion = 1
  }

  // Future migrations would go here
  // Example:
  // if (obj.schemaVersion === 1) {
  //   // Migrate from v1 to v2
  //   obj.schemaVersion = 2;
  // }

  return { success: true, data: obj }
}
