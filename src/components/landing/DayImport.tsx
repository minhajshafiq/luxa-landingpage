'use client'

import { useRef } from 'react'
import { StatementEntry } from '@/components/statement/StatementEntry'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { gsap, EASE, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = {
  stamp: string
  amount: string
  tag: string
  file: string
  reading: string
  title: string
  body: string
  note: string
}

/** Number of transactions the demo statement contains. Matches the figure in
 *  Stella's annotation for this day — change both together. */
const OPERATIONS = 128

/** Le plus court des sept blocs : il porte la crédibilité du « sans connexion
 *  bancaire », pas une fonctionnalité très utilisée. */
export function DayImport() {
  const rootRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const { t, language } = useTranslation()

  const d = t('month.d03') as unknown as Day

  // The bar used to be painted at 100% in the markup, which made the one block
  // that says "Luxa reads your statement" the only motionless thing in Act I.
  // Reading is a process, so the bar performs it: it fills while the counter
  // climbs, and the two are driven by the same tween so they can never
  // disagree about how far along the read is.
  useIsomorphicLayoutEffect(() => {
    const el = countRef.current
    const bar = fillRef.current
    if (!el || !bar) return

    const formatter = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US')

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(bar, { width: '100%' })
        el.textContent = formatter.format(OPERATIONS)
        return
      }

      const counter = { value: 0 }
      gsap.set(bar, { width: '0%' })
      el.textContent = '0'

      gsap.to(counter, {
        value: OPERATIONS,
        duration: 1.5,
        ease: EASE.out,
        scrollTrigger: { trigger: bar, start: 'top 85%', once: true },
        onUpdate: () => {
          const ratio = counter.value / OPERATIONS
          gsap.set(bar, { width: `${ratio * 100}%` })
          el.textContent = formatter.format(Math.round(counter.value))
        },
        onComplete: () => {
          gsap.set(bar, { width: '100%' })
          el.textContent = formatter.format(OPERATIONS)
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [language])

  return (
    <div ref={rootRef}>
      <StatementEntry
        stamp={d.stamp}
        amount={d.amount}
        tag={d.tag}
        title={d.title}
        body={d.body}
        note={d.note}
        tone="neutral"
      >
        <div className="mt-7 flex items-center gap-4">
          <StellaMascot mood="reading" size="sm" floating />
          <div className="luxa-card luxa-hairline flex-1 rounded-tile px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {d.file}
              </p>
              <p className="font-mono text-[11px] tracking-[0.06em] text-epargne">
                <span ref={countRef} className="tabular">
                  {OPERATIONS}
                </span>{' '}
                {d.reading}
              </p>
            </div>
            <div className="luxa-meter mt-3 text-epargne">
              <div ref={fillRef} className="luxa-meter-fill" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </StatementEntry>
    </div>
  )
}
