'use client'

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import enTranslations from '@/locales/en.json'
import frTranslations from '@/locales/fr.json'

type Language = 'en' | 'fr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string | string[] | Record<string, unknown> | unknown[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// French-speaking country codes
const FRENCH_LOCALES = [
  'fr', 'fr-FR', 'fr-CA', 'fr-BE', 'fr-CH', 'fr-LU',
  'fr-MC', 'fr-CI', 'fr-CM', 'fr-SN', 'fr-ML', 'fr-MG'
]

const translations: Record<Language, Record<string, unknown>> = {
  en: enTranslations as Record<string, unknown>,
  fr: frTranslations as Record<string, unknown>,
}

function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en'

  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage

  // Check if browser language matches any French locale
  if (browserLang && FRENCH_LOCALES.some(locale => browserLang.startsWith(locale))) {
    return 'fr'
  }

  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Detect browser language on mount
    const storedLang = localStorage.getItem('luxa-language') as Language | null
    const detectedLang = storedLang || detectBrowserLanguage()
    setLanguageState(detectedLang)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('luxa-language', lang)
    }
  }

  const t = (key: string): string | string[] | Record<string, unknown> | unknown[] => {
    const keys = key.split('.')
    let value: unknown = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key // Return key if translation not found
      }
    }

    return (value !== undefined && value !== null) ? value as string | string[] | Record<string, unknown> | unknown[] : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
