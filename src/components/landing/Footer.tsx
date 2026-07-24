'use client'

import Link from 'next/link'
import { Instagram, Music2, Heart } from 'lucide-react'
import { LogoText } from '@/components/ui/logo'
import { socialLinks } from '@/constants/site'
import { Container } from '@/components/design-system/Container'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const footerSections = [
    {
      title: t('footer.product'),
      links: [
        { title: t('footer.pockets'), href: '/#pockets' },
        { title: t('footer.stella'), href: '/#stella' },
        { title: t('footer.pricing'), href: '/#pricing' },
        { title: t('footer.faq'), href: '/#faq' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { title: t('footer.privacyPolicy'), href: '/privacy' },
        { title: t('footer.terms'), href: '/terms' },
        { title: t('footer.contact'), href: '/contact' },
      ],
    },
  ]

  return (
    <footer className="relative border-t border-border/60 bg-card/40">
      <Container className="py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-1">
            <Link href="/" className="inline-block cursor-pointer">
              <LogoText className="hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t('footer.tagline') as string}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon === 'tiktok' ? Music2 : Instagram
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      'p-2 rounded-lg text-muted-foreground hover:text-foreground',
                      'hover:bg-accent transition-all duration-300 cursor-pointer'
                    )}
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Links */}
          {footerSections.map((sec) => (
            <div key={sec.title as string} className="space-y-3 md:space-y-4">
              <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {sec.title as string}
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {sec.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/75 hover:text-foreground transition-colors duration-300 cursor-pointer"
                    >
                      {link.title as string}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
              &copy; {year} Luxa. {t('footer.rights') as string}
            </p>
            <p className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
              {(t('footer.madeWith') as string).split('♥')[0]}
              <Heart className="h-3.5 w-3.5 fill-stella text-stella" />
              {(t('footer.madeWith') as string).split('♥')[1]}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
