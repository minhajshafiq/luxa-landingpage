'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/useTranslation'

const subscribeToHydration = () => () => undefined
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation()
  const mounted = React.useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  )

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted/50 animate-pulse" />
    )
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en')
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors relative overflow-hidden cursor-pointer"
      aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="text-xs font-bold text-foreground"
        >
          {language === 'en' ? 'EN' : 'FR'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
