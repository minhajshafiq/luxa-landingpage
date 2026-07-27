'use client'

import { Section } from '@/components/design-system/Section'
import { AppStoreButtons } from '@/components/design-system/AppStoreButtons'
import { RatingBadge } from '@/components/design-system/RatingBadge'
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
    <Section divider>
      <div aria-hidden="true" className="starfield pointer-events-none absolute inset-0 -z-10 opacity-80" />
      <div aria-hidden="true" className="glow-primary animate-glow-breathe-slow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 blur-[90px] opacity-50" />


        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center" data-animate="stella">
            <StellaMascot mood="sleepy" size="lg" floating />
          </div>

          <h2
            data-animate="lead"
            // La clôture enfle et se centre : c'est un moment de fin, pas du
            // contenu documentaire. Même famille, même graisse, même approche
            // que les autres titres de l'acte II, mais un cran plus grand.
            className="mx-auto mt-8 max-w-[18ch] font-display text-[clamp(2.4rem,5vw,3.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground text-balance"
          >
            {t('final.title') as string}
          </h2>

          <p data-animate="lead" className="mx-auto mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground md:text-base">
            {t('final.subtitle') as string}
          </p>

          <div data-animate="cta" className="mt-9 flex flex-col items-center gap-4">
            <RatingBadge />
            <AppStoreButtons
              downloadLabel={t('final.ctaDownload') as string}
              androidLabel={t('final.ctaAndroidBeta') as string}
            />
            <p className="text-xs text-muted-foreground/80 md:text-sm">
              {t('final.micro') as string}
            </p>
          </div>
        </div>
    </Section>
  )
}
