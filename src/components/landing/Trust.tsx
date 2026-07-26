'use client'

import { ShieldCheck, Server, EyeOff, type LucideIcon } from 'lucide-react'
import { Section } from '@/components/design-system/Section'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

const icons: LucideIcon[] = [ShieldCheck, Server, EyeOff]

/** Acte II : lève l'objection principale, donc convertit. Pas de gouttière. */
export function Trust() {
  const { t } = useTranslation()
  const bullets = t('privacy.bullets') as unknown as Array<{ title: string; description: string }>

  return (
    <Section tone="epargne" divider>
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <h2 className="max-w-[16ch] font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground text-balance">
            {t('trust.title') as string}
          </h2>
          <p className="mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground md:text-base">
            {t('trust.body') as string}
          </p>
          <StellaMascot mood="love" size="md" floating className="mt-10" />
        </div>

        <div className="grid gap-3 self-center">
          {Array.isArray(bullets) &&
            bullets.map((bullet, index) => {
              const Icon = icons[index] ?? ShieldCheck
              return (
                <div
                  key={index}
                  data-animate="card"
                  className="luxa-card luxa-hairline luxa-card-hover flex gap-4 rounded-card p-5"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-epargne/12 text-epargne shadow-[0_0_22px_-6px_hsl(var(--epargne))]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{bullet.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {bullet.description}
                    </p>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </Section>
  )
}
