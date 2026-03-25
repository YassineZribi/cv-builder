import type { Locale } from "./config"

export type Dictionary = {
  ui: typeof import("@/dictionaries/en/ui.json")
  cv: typeof import("@/dictionaries/en/cv.json")
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => ({
    ui: (await import("@/dictionaries/en/ui.json")).default,
    cv: (await import("@/dictionaries/en/cv.json")).default,
  }),
  fr: async () => ({
    ui: (await import("@/dictionaries/fr/ui.json")).default,
    cv: (await import("@/dictionaries/fr/cv.json")).default,
  }),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}

export async function getUIDictionary(
  locale: Locale
): Promise<Dictionary["ui"]> {
  const dict = await dictionaries[locale]()
  return dict.ui
}

export async function getCVDictionary(
  locale: Locale
): Promise<Dictionary["cv"]> {
  const dict = await dictionaries[locale]()
  return dict.cv
}
