'use client'

import { ShieldCheck, Server, EyeOff, type LucideIcon } from 'lucide-react'
import { Section } from '@/components/design-system/Section'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

type PrivacyBullet = { title: string; description: string }

const bulletIcons: LucideIcon[] = [ShieldCheck, Server, EyeOff]

export function Privacy() {
  const { t } = useTranslation()
  const bullets = t('privacy.bullets') as unknown as PrivacyBullet[]

  return (
    <Section tone="epargne" divider>
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
                  className="luxa-card luxa-hairline luxa-card-hover rounded-card p-6 text-center"
                >
                  <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-stella/12 text-stella shadow-[0_0_24px_-6px_hsl(var(--stella))]">
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
    </Section>
  )
}
