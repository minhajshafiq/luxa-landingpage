'use client'

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import enTranslations from '@/locales/en.json'
import frTranslations from '@/locales/fr.json'
import {
  LANGUAGE_COOKIE,
  LANGUAGE_COOKIE_MAX_AGE,
  type Language,
} from './config'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string | string[] | Record<string, unknown> | unknown[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, unknown>> = {
  en: enTranslations as Record<string, unknown>,
  fr: frTranslations as Record<string, unknown>,
}

/**
 * `initialLanguage` is resolved on the server (cookie, then Accept-Language),
 * so the first render already matches what the visitor should see. Nothing is
 * corrected after mount — no flash, and the <html lang> the server emitted
 * stays accurate.
 */
export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode
  initialLanguage: Language
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)

    if (typeof document === 'undefined') return

    // The server reads this on the next request; keep lang in sync now so
    // screen readers and translation tools follow the switch immediately.
    document.cookie = `${LANGUAGE_COOKIE}=${lang};path=/;max-age=${LANGUAGE_COOKIE_MAX_AGE};samesite=lax`
    document.documentElement.lang = lang
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

    return (value !== undefined && value !== null)
      ? value as string | string[] | Record<string, unknown> | unknown[]
      : key
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
