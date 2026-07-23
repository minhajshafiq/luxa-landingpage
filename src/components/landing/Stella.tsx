'use client'

import { Sparkles, CalendarHeart } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type StellaInsight = { title: string; description: string }

export function Stella() {
  const { t } = useTranslation()
  const insights = t('stella.insights') as unknown as StellaInsight[]
  const weekly = t('stella.weekly') as unknown as { title: string; description: string }

  return (
    <section id="stella" className="relative isolate overflow-hidden py-16 md:py-32">
      {/* Stella's zone glows coral — the warm heart of the page */}
      <div className="starfield pointer-events-none absolute inset-0 opacity-50" />

      <Container className="relative">
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
              <StellaMascot mood="budgeting" size="xl" floating className="relative" />
            </div>
          </div>

          {/* Her voice: gentle observations, like quiet notifications */}
          <div className="space-y-4">
            {Array.isArray(insights) &&
              insights.map((insight, index) => (
                <div
                  key={index}
                  data-animate="card"
                  className={cn(
                    'flex gap-3.5 rounded-3xl border border-border bg-card/90 p-5 shadow-premium backdrop-blur-sm',
                    'transition-colors duration-300 hover:border-stella/30',
                    index === 1 && 'lg:translate-x-6'
                  )}
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stella/15">
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
              className="flex gap-3.5 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 to-transparent p-5 shadow-premium"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
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
      </Container>
    </section>
  )
}
