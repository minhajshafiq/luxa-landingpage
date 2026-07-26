'use client'

import { useRef } from 'react'
import { StatementEntry } from '@/components/statement/StatementEntry'
import { PhoneFrame } from '@/components/design-system/PhoneFrame'
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string; note: string; alt: string }

export function DaySubscriptions() {
  const rootRef = useRef<HTMLDivElement>(null)
  const totalRef = useRef<HTMLSpanElement>(null)
  const { t, language } = useTranslation()
  const d = t('month.d08') as unknown as Day
  const finalTotal = t('subs.total') as string

  // Le total grimpe depuis zéro à l'entrée dans le viewport — le même petit
  // choc que l'app te donne la première fois.
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const el = totalRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const counter = { value: 0 }
      const formatter = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US')
      gsap.to(counter, {
        value: 1276,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = `−${formatter.format(Math.round(counter.value))} €`
        },
        onComplete: () => {
          el.textContent = finalTotal
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [finalTotal, language])

  return (
    <div ref={rootRef}>
      <StatementEntry
        stamp={d.stamp}
        amount={d.amount}
        tag={d.tag}
        title={d.title}
        body={d.body}
        note={d.note}
        tone="out"
      >
        <div className="mt-8 grid items-center gap-8 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {t('subs.totalLabel') as string}
            </p>
            <p className="mt-3 flex items-baseline gap-2">
              <span
                ref={totalRef}
                className="font-display tabular text-[clamp(2.4rem,6vw,3.6rem)] font-bold tracking-[-0.03em] text-destructive [text-shadow:0_0_36px_hsl(var(--destructive)/0.5)]"
              >
                {finalTotal}
              </span>
              <span className="text-sm text-muted-foreground">{t('subs.perMonth') as string}</span>
            </p>
          </div>
          <div className="w-[190px] justify-self-start sm:justify-self-end">
            <PhoneFrame
              src="/subscriptions.png"
              alt={d.alt}
              sizes="190px"
            />
          </div>
        </div>
      </StatementEntry>
    </div>
  )
}
