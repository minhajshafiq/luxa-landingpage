'use client'

import Link from 'next/link'
import { Twitter, Github, Linkedin, Heart } from 'lucide-react'
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
        { title: t('footer.features'), href: '#features' },
        { title: t('footer.howItWorks'), href: '#how-it-works' },
        { title: t('footer.faq'), href: '#faq' },
        { title: t('nav.roadmap'), href: '#roadmap' },
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
    <footer className="border-t border-border/50 bg-muted/30">
      <Container className="py-8 md:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4 sm:col-span-1">
            <Link href="/" className="inline-block cursor-pointer">
              <LogoText className="hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t('footer.description') as string}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const Icon =
                  link.icon === 'twitter'
                    ? Twitter
                    : link.icon === 'github'
                    ? Github
                    : Linkedin
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'p-2 rounded-lg text-muted-foreground hover:text-foreground',
                      'hover:bg-primary/10 transition-all duration-300 cursor-pointer'
                    )}
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((sec) => (
            <div key={sec.title as string} className="space-y-3 md:space-y-4">
              <h3 className="font-semibold text-sm md:text-base text-foreground">
                {sec.title as string}
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {sec.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer"
                    >
                      {link.title as string}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
              &copy; {year} Luxa. {t('footer.rights') as string}
            </p>
            <p className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
              {(t('footer.madeWith') as string).split('♥')[0]}
              <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
              {(t('footer.madeWith') as string).split('♥')[1]}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
