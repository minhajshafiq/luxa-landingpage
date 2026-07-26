'use client'

import { Sparkles, CalendarHeart } from 'lucide-react'
import { Section } from '@/components/design-system/Section'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

type StellaInsight = { title: string; description: string }

export function Stella() {
  const { t } = useTranslation()
  const insights = t('stella.insights') as unknown as StellaInsight[]
  const weekly = t('stella.weekly') as unknown as { title: string; description: string }

  return (
    <Section id="stella" tone="stella" divider>
      <div aria-hidden="true" className="starfield pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow={t('stella.eyebrow') as string}
            title={t('stella.title') as string}
            lead={t('stella.lead') as string}
            centered={false}
            className="mb-8"
          />

          {/* Stella herself, present but not a sticker: she IS the section */}
          <div className="relative inline-block" data-animate="stella">
            <div className="glow-stella pointer-events-none absolute -inset-8 blur-2xl opacity-80" />
            <StellaMascot mood="budgeting" size="lg" floating className="relative" />
          </div>
        </div>

        {/* Her voice: gentle observations, like quiet notifications */}
        <div className="space-y-4">
          {Array.isArray(insights) &&
            insights.map((insight, index) => (
              <div
                key={index}
                data-animate="card"
                // No per-card offset any more: on a page where every other
                // edge lines up, one nudged card reads as a mistake, not as
                // rhythm.
                className="luxa-card luxa-hairline luxa-card-hover flex gap-3.5 rounded-card p-5"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stella/15 shadow-[0_0_22px_-6px_hsl(var(--stella))]">
                  <Sparkles className="h-4 w-4 text-stella" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{insight.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}

          {/* The Sunday ritual */}
          <div
            data-animate="card"
            className="flex gap-3.5 rounded-card border border-primary/25 bg-gradient-to-br from-primary/12 via-card/70 to-card/40 p-5 shadow-[0_0_40px_-24px_hsl(var(--primary)),0_18px_40px_-20px_hsl(0_0%_0%/0.9)]"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 shadow-[0_0_22px_-6px_hsl(var(--primary))]">
              <CalendarHeart className="h-4 w-4 text-primary" />
            </span>
            <div>
              <p className="font-semibold text-foreground">{weekly?.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {weekly?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
