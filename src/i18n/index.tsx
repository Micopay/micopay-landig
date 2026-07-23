import { createContext, useContext, useState, type ReactNode } from 'react'
import es from './es.json'
import en from './en.json'

type Language = 'es' | 'en'
type Translations = typeof es

const translations: Record<Language, Translations> = { es, en }

interface I18nContextType {
  lang: Language
  t: Translations
  toggleLang: () => void
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('es')

  const toggleLang = () => {
    setLang(prev => prev === 'es' ? 'en' : 'es')
  }

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
