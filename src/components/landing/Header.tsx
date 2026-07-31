'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { LanguageToggle } from '@/components/design-system/LanguageToggle'
import { AnimatedButton } from '@/components/design-system/AnimatedButton'
import { LogoText } from '@/components/ui/logo'
import { AppleLogo } from '@/components/ui/apple-logo'
import { PlayStoreLogo } from '@/components/ui/play-store-logo'
import { APP_STORE_URL, PLAY_STORE_URL } from '@/constants/site'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useTranslation()

  // At the top the bar floats wide and almost transparent, letting the hero
  // aurora through. Once you leave the hero it tightens and turns solid so
  // text never has to compete with whatever is scrolling underneath.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
          'luxa-hairline mx-auto flex w-full items-center justify-between gap-2',
          'rounded-tile backdrop-blur-2xl md:rounded-full px-3 sm:px-4 md:px-4',
          'transition-[max-width,height,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          scrolled
            ? 'h-[52px] max-w-3xl bg-card/85 shadow-[0_18px_50px_-26px_rgba(0,0,0,1)] md:h-14'
            : 'h-14 max-w-4xl bg-card/45 shadow-[0_16px_48px_-30px_rgba(0,0,0,0.9)] md:h-[60px]'
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
                'hover:text-foreground hover:bg-accent rounded-full px-3.5 py-2 cursor-pointer'
              )}
            >
              {item.title as string}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Language */}
        <div className="hidden md:flex items-center gap-1.5">
          <LanguageToggle />
          <AnimatedButton
            asChild
            size="sm"
            className="luxa-cta rounded-full text-primary-foreground font-semibold px-3.5 cursor-pointer"
          >
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" title="App Store">
              <AppleLogo className="mr-1.5 h-4 w-4" />
              App Store
            </a>
          </AnimatedButton>
          <AnimatedButton
            asChild
            size="sm"
            className="luxa-cta rounded-full text-primary-foreground font-semibold px-3.5 cursor-pointer"
          >
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" title="Google Play">
              <PlayStoreLogo className="mr-1.5 h-4 w-4" />
              Google Play
            </a>
          </AnimatedButton>
        </div>

        {/* Mobile: always-visible CTAs + menu toggle */}
        <div className="flex items-center gap-1.5 md:hidden">
          <motion.a
            whileTap={{ scale: 0.95 }}
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="App Store"
            className="luxa-cta flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground cursor-pointer"
          >
            <AppleLogo className="h-4 w-4" />
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.95 }}
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Google Play"
            className="luxa-cta flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground cursor-pointer"
          >
            <PlayStoreLogo className="h-4 w-4" />
          </motion.a>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-accent transition-colors relative z-50 cursor-pointer"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence initial={false} mode="wait">
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
            className="luxa-card luxa-hairline mx-auto mt-2 max-h-[calc(100dvh-5.75rem)] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-card md:hidden"
          >
            <nav
              className="space-y-1 px-4 pt-4"
              style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
            >
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
                      'rounded-tile hover:bg-accent transition-colors',
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
                <div className="grid grid-cols-2 gap-2">
                  <AnimatedButton
                    asChild
                    size="default"
                    className="luxa-cta w-full rounded-tile text-primary-foreground font-semibold cursor-pointer"
                  >
                    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                      <AppleLogo className="mr-1.5 h-4 w-4" />
                      App Store
                    </a>
                  </AnimatedButton>
                  <AnimatedButton
                    asChild
                    size="default"
                    className="luxa-cta w-full rounded-tile text-primary-foreground font-semibold cursor-pointer"
                  >
                    <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                      <PlayStoreLogo className="mr-1.5 h-4 w-4" />
                      Google Play
                    </a>
                  </AnimatedButton>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
