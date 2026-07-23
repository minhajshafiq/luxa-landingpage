'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { LanguageToggle } from '@/components/design-system/LanguageToggle'
import { AnimatedButton } from '@/components/design-system/AnimatedButton'
import { LogoText } from '@/components/ui/logo'
import { AppleLogo } from '@/components/ui/apple-logo'
import { APP_STORE_URL } from '@/constants/site'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()

  const navItems = [
    { title: t('nav.pockets'), href: '/#pockets' },
    { title: t('nav.stella'), href: '/#stella' },
    { title: t('nav.pricing'), href: '/#pricing' },
    { title: t('nav.faq'), href: '/#faq' },
  ]

  return (
    <header className="fixed top-3 md:top-5 inset-x-0 z-50 px-3 sm:px-4">
      <div
        className={cn(
          'mx-auto w-full max-w-5xl flex h-14 md:h-16 items-center justify-between gap-2',
          'rounded-2xl border border-border/70 bg-background/70 backdrop-blur-xl',
          'shadow-premium px-3 sm:px-4 md:px-5'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center z-50 cursor-pointer pl-1">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <LogoText className="transition-transform duration-300" />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium text-muted-foreground transition-all duration-300',
                'hover:text-foreground hover:bg-accent rounded-xl px-4 py-2 cursor-pointer'
              )}
            >
              {item.title as string}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Language */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageToggle />
          <AnimatedButton
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 cursor-pointer"
          >
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              <AppleLogo className="mr-1.5 h-4 w-4" />
              {t('nav.downloadApp') as string}
            </a>
          </AnimatedButton>
        </div>

        {/* Mobile: always-visible CTA (was hidden behind the menu) + menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <motion.a
            whileTap={{ scale: 0.95 }}
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('nav.downloadApp') as string}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer"
          >
            <AppleLogo className="h-4 w-4" />
          </motion.a>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-accent transition-colors relative z-50 cursor-pointer"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6 text-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6 text-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation - Floating Card */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden mx-auto mt-2 w-full max-w-5xl rounded-3xl border border-border/70 bg-background/95 backdrop-blur-xl shadow-premium overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'block px-4 py-3 text-base font-medium text-foreground',
                      'rounded-2xl hover:bg-accent transition-colors',
                      'border border-transparent hover:border-border cursor-pointer'
                    )}
                  >
                    {item.title as string}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Language + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
                className="pt-4 space-y-3"
              >
                <div className="flex justify-center gap-3">
                  <LanguageToggle />
                </div>
                <AnimatedButton
                  asChild
                  size="default"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer"
                >
                  <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                    <AppleLogo className="mr-1.5 h-4 w-4" />
                    {t('nav.downloadApp') as string}
                  </a>
                </AnimatedButton>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
