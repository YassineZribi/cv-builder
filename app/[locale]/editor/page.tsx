import { getDictionary } from "@/lib/i18n/dictionaries"
import { isValidLocale, defaultLocale } from "@/lib/i18n/config"
import { EditorShell } from "@/components/editor/editor-shell"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function EditorPage({ params }: Props) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? locale : defaultLocale
  const dictionary = await getDictionary(validLocale)

  return <EditorShell dictionary={dictionary} locale={validLocale} />
}
