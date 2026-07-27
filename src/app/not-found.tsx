'use client'

import Link from 'next/link'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Container } from '@/components/design-system/Container'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { AnimatedButton } from '@/components/design-system/AnimatedButton'
import { useTranslation } from '@/lib/i18n/useTranslation'

/**
 * The page had no 404 at all, so a bad link fell through to Next's default
 * white error screen — jarring on a site that is otherwise all night sky.
 * Stella is sad here rather than asleep: it is the one place on the site where
 * something actually went wrong.
 */
export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative isolate flex flex-1 items-center overflow-x-clip py-24 md:py-32">
          <div className="starfield pointer-events-none absolute inset-0 opacity-80" />
          <div className="glow-primary pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 blur-[90px] opacity-50" />

          <Container className="relative">
            <div className="mx-auto max-w-xl text-center">
              <div className="flex justify-center">
                <StellaMascot mood="sad" size="lg" floating />
              </div>

              <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                404
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground text-balance md:text-5xl">
                {t('meta.notFoundTitle') as string}
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                {t('meta.notFoundLead') as string}
              </p>

              <AnimatedButton
                asChild
                size="lg"
                wrapperClassName="mt-9 inline-block"
                className="luxa-cta h-12 rounded-button px-7 text-base font-semibold text-primary-foreground"
              >
                <Link href="/">{t('meta.notFoundCta') as string}</Link>
              </AnimatedButton>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  )
}
