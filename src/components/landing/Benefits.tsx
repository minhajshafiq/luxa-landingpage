'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Zap, LineChart } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { AmountChip } from '@/components/design-system/AmountChip'
import { gsap, ScrollTrigger, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Benefit = { title: string; description: string }

export function Benefits() {
  const sectionRef = useRef<HTMLElement>(null)
  const calendarImgRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const items = t('benefits.items') as unknown as Benefit[]

  // The calendar slides inside its window as you scroll — you look INTO
  // the month, the way you would in the app.
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        calendarImgRef.current,
        { yPercent: 5 },
        {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: calendarImgRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )
      ScrollTrigger.refresh()
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (!Array.isArray(items) || items.length < 4) return null

  const [quick, importPdf, calendar, habits] = items

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden py-24 md:py-32">
      <Container className="relative">
        <SectionHeading
          eyebrow={t('benefits.eyebrow') as string}
          title={t('benefits.title') as string}
          lead={t('benefits.subtitle') as string}
        />

        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">
          {/* Calendar — tall cell, the history screen is the visual */}
          <article
            data-animate="card"
            className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-premium md:row-span-2"
          >
            <div className="p-6 pb-0">
              <h3 className="font-semibold text-foreground">{calendar.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {calendar.description}
              </p>
            </div>
            <div className="relative mx-6 mt-6 h-72 overflow-hidden rounded-t-3xl border border-b-0 border-border md:h-[380px]">
              <div ref={calendarImgRef} className="absolute -inset-y-10 inset-x-0 will-change-transform">
                <Image
                  src="/history.png"
                  alt="Luxa — spending calendar, each day showing its merchants"
                  fill
                  sizes="(max-width: 768px) 90vw, 360px"
                  className="object-cover object-[center_32%] transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>
          </article>

          {/* Quick add — wide cell with a tiny "three seconds" vignette */}
          <article
            data-animate="card"
            className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-premium md:col-span-2"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <Zap className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{quick.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {quick.description}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 opacity-80" aria-hidden="true">
              <AmountChip label="☕" amount="−2,80 €" muted />
              <span className="font-mono text-xs text-muted-foreground">→</span>
              <AmountChip label="Envies" amount="✓" />
            </div>
          </article>

          {/* PDF import — Stella does the reading */}
          <article
            data-animate="card"
            className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-premium"
          >
            <StellaMascot mood="reading" size="md" className="mb-4" />
            <h3 className="font-semibold text-foreground">{importPdf.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {importPdf.description}
            </p>
          </article>

          {/* Habits & trends */}
          <article
            data-animate="card"
            className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-premium"
          >
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-epargne/20 bg-epargne/10 text-epargne">
              <LineChart className="h-4.5 w-4.5" />
            </span>
            <h3 className="font-semibold text-foreground">{habits.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {habits.description}
            </p>
          </article>
        </div>
      </Container>
    </section>
  )
}
