'use client'

import { Container } from '@/components/design-system/Container'
import { AppStoreButtons } from '@/components/design-system/AppStoreButtons'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

/**
 * The close. After the whole journey — dispersion, pockets, Stella,
 * subscriptions — the page ends where the product wants to leave you:
 * calm. Stella is asleep on the moon; the night is quiet.
 */
export function FinalCTA() {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden py-24 md:py-40">
      <div className="starfield pointer-events-none absolute inset-0 opacity-80" />
      <div className="glow-primary animate-glow-breathe-slow pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 blur-[90px] opacity-50" />

      {/* A few hand-placed stars that twinkle around the moment */}
      <span aria-hidden="true" className="animate-star-twinkle absolute left-[18%] top-[22%] text-sm text-secondary/70">✦</span>
      <span aria-hidden="true" className="animate-star-twinkle absolute right-[20%] top-[30%] text-xs text-primary/70" style={{ animationDelay: '1.4s' }}>✦</span>
      <span aria-hidden="true" className="animate-star-twinkle absolute left-[30%] bottom-[24%] text-xs text-stella/70" style={{ animationDelay: '2.6s' }}>✦</span>

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center" data-animate="stella">
            <StellaMascot mood="sleepy" size="lg" floating />
          </div>

          <h2
            data-animate="lead"
            className="mt-8 font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance"
          >
            {t('final.title') as string}
          </h2>

          <p data-animate="lead" className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('final.subtitle') as string}
          </p>

          <div data-animate="cta" className="mt-9 flex flex-col items-center gap-4">
            <AppStoreButtons
              downloadLabel={t('final.ctaDownload') as string}
              androidLabel={t('final.ctaAndroidBeta') as string}
            />
            <p className="text-xs text-muted-foreground/80 md:text-sm">
              {t('final.micro') as string}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
