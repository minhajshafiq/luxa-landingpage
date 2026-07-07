'use client'

import { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { gsap, ScrollTrigger, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type DifferenceRow = { bank: string; luxa: string; tone: 'primary' | 'success' | 'warning' }

const toneClasses: Record<DifferenceRow['tone'], { border: string; text: string }> = {
  primary: { border: 'border-primary/25', text: 'text-primary' },
  success: { border: 'border-epargne/25', text: 'text-epargne' },
  warning: { border: 'border-envies/25', text: 'text-envies' },
}

/**
 * The reason Luxa exists, staged as a translation exercise:
 * raw statement lines on the left, what they actually mean on the right.
 */
export function Difference() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useTranslation()
  const rows = t('difference.rows') as unknown as DifferenceRow[]

  // Each translation happens under your scroll: the raw line slides in,
  // then hands its meaning across the arrow.
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.diff-row').forEach((row) => {
        const bank = row.querySelector('.diff-bank')
        const arrow = row.querySelector('.diff-arrow')
        const luxa = row.querySelector('.diff-luxa')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 92%',
            end: 'top 55%',
            scrub: 0.6,
          },
        })
        tl.fromTo(bank, { opacity: 0, x: -48 }, { opacity: 1, x: 0, duration: 0.4 })
          .fromTo(arrow, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.15 }, 0.3)
          .fromTo(luxa, { opacity: 0, x: 48 }, { opacity: 1, x: 0, duration: 0.4 }, 0.35)
      })
      ScrollTrigger.refresh()
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden py-24 md:py-32">
      <div className="glow-primary animate-glow-breathe pointer-events-none absolute left-1/2 top-0 h-72 w-[640px] -translate-x-1/2 blur-3xl opacity-35" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t('difference.eyebrow') as string}
          title={t('difference.title') as string}
          titleHighlight={t('difference.titleHighlight') as string}
        />

        <div className="mx-auto max-w-4xl">
          {/* Column labels */}
          <div className="mb-4 hidden grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {t('difference.bankTitle') as string}
            </p>
            <span aria-hidden="true" className="w-4" />
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3 w-3 text-stella" />
              {t('difference.luxaTitle') as string}
            </p>
          </div>

          <div className="space-y-3">
            {Array.isArray(rows) &&
              rows.map((row, index) => {
                const tone = toneClasses[row.tone] ?? toneClasses.primary
                return (
                  <div
                    key={index}
                    className="diff-row grid grid-cols-1 items-stretch gap-2 md:grid-cols-[1fr_auto_1fr] md:gap-4"
                  >
                    {/* The line as your bank prints it */}
                    <div className="diff-bank flex items-center rounded-2xl border border-border/70 bg-muted/40 px-4 py-3.5 will-change-transform">
                      <p className="truncate font-mono tabular text-xs text-muted-foreground md:text-[13px]">
                        {row.bank}
                      </p>
                    </div>

                    <div className="diff-arrow hidden items-center md:flex" aria-hidden="true">
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                    </div>

                    {/* The same line, once Luxa has read it */}
                    <div
                      className={cn(
                        'diff-luxa flex items-center rounded-2xl border bg-card px-4 py-3.5 shadow-premium will-change-transform',
                        tone.border
                      )}
                    >
                      <p className="text-sm font-medium text-foreground">
                        <span className={cn('font-semibold', tone.text)}>
                          {row.luxa.split('·')[0]}
                        </span>
                        {row.luxa.includes('·') && (
                          <span className="text-muted-foreground">
                            {' ·'}
                            {row.luxa.split('·').slice(1).join('·')}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>

          <p
            data-animate="lead"
            className="mt-12 text-center font-display text-xl font-medium tracking-tight text-foreground/90 md:text-2xl"
          >
            {t('difference.punch') as string}
          </p>
        </div>
      </Container>
    </section>
  )
}
