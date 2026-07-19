'use client'

import { ShieldCheck, Server, EyeOff, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

type PrivacyBullet = { title: string; description: string }

const bulletIcons: LucideIcon[] = [ShieldCheck, Server, EyeOff]

export function Privacy() {
  const { t } = useTranslation()
  const bullets = t('privacy.bullets') as unknown as PrivacyBullet[]

  return (
    <section className="relative isolate overflow-hidden py-16 md:py-28">
      <div className="glow-stella animate-glow-breathe-slow pointer-events-none absolute left-1/2 top-1/2 h-72 w-[640px] -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30" />

      <Container className="relative">
        <div className="mx-auto flex justify-center" data-animate="stella">
          <StellaMascot mood="love" size="md" floating />
        </div>

        <SectionHeading
          eyebrow={t('privacy.eyebrow') as string}
          title={t('privacy.title') as string}
          lead={t('privacy.lead') as string}
          className="mt-6 mb-10 md:mb-12"
        />

        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          {Array.isArray(bullets) &&
            bullets.map((bullet, index) => {
              const Icon = bulletIcons[index] ?? ShieldCheck
              return (
                <div
                  key={index}
                  data-animate="card"
                  className="rounded-3xl border border-border bg-card/80 p-6 text-center shadow-premium"
                >
                  <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-stella/12 text-stella">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="text-sm font-semibold text-foreground md:text-base">
                    {bullet.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {bullet.description}
                  </p>
                </div>
              )
            })}
        </div>
      </Container>
    </section>
  )
}
