import { notFound } from "next/navigation"
import { locales, type Locale, isValidLocale } from "@/lib/i18n/config"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  return <>{children}</>
}
