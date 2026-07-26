'use client'

import { useRef } from 'react'
import { StatementEntry } from '@/components/statement/StatementEntry'
import { RatioGrid, type RatioSlice } from '@/components/statement/RatioGrid'
import { AmountChip } from '@/components/design-system/AmountChip'
import { gsap, ScrollTrigger, EASE, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = {
  stamp: string
  amount: string
  tag: string
  title: string
  body: string
  note: string
  slices: Array<{ name: string; detail: string }>
}
type Chip = { label: string; amount: string }

/** Position de départ de chaque dépense, et la colonne où elle atterrit.
 *  colonne 0 = besoins, 1 = envies, 2 = épargne. */
const chipLayout = [
  { className: 'left-[2%] top-[6%] md:left-[6%]', rotate: -8, column: 1 },
  { className: 'left-[52%] top-[2%] md:left-[62%]', rotate: 7, column: 1 },
  { className: 'left-[14%] top-[34%] md:left-[28%]', rotate: -4, column: 1 },
  { className: 'left-[56%] top-[38%] md:left-[80%]', rotate: 9, column: 0 },
  { className: 'left-[0%] top-[64%] md:left-[10%]', rotate: 5, column: 1 },
  { className: 'left-[50%] top-[68%] md:left-[54%]', rotate: -7, column: 0 },
  { className: 'left-[18%] top-[90%] md:left-[36%]', rotate: 4, column: 1 },
  { className: 'left-[58%] top-[92%] md:left-[72%]', rotate: -5, column: 0 },
]

const FILLS = [0.72, 0.55, 0.4] as const

export function DayIncome() {
  const rootRef = useRef<HTMLDivElement>(null)
  const skyRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const d = t('month.d01') as unknown as Day
  const chips = t('disperse.chips') as unknown as Chip[]

  // Le tri, joué une fois quand le bloc est réellement à l'écran. Pas de
  // scrub et pas de pin : l'entrée tient dans le viewport, donc la charge
  // utile se voit sans avoir à immobiliser la page.
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chipEls = gsap.utils.toArray<HTMLElement>('.income-chip')
      const cellEls = gsap.utils.toArray<HTMLElement>('.ratio-cell')
      const fillEls = gsap.utils.toArray<HTMLElement>('.ratio-fill')
      const knobEls = gsap.utils.toArray<HTMLElement>('.ratio-knob')
      if (!chipEls.length || !cellEls.length) return

      const fillPercent = (i: number) => `${(FILLS[i] ?? 0.5) * 100}%`

      if (prefersReducedMotion()) {
        gsap.set(chipEls, { opacity: 0.5 })
        gsap.set(fillEls, { width: (i: number) => fillPercent(i) })
        gsap.set(knobEls, { left: (i: number) => fillPercent(i), opacity: 1 })
        return
      }

      gsap.set(chipEls, { opacity: 0, scale: 0.75, y: 14 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: skyRef.current, start: 'top 72%', once: true },
        defaults: { ease: EASE.out },
      })

      // 1 — le mois arrive, une dépense à la fois.
      tl.to(chipEls, { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.06 })
        .addLabel('flock', '+=0.45')

      // 2 — chaque dépense rejoint sa colonne.
      chipEls.forEach((chip, i) => {
        const target = cellEls[chipLayout[i]?.column ?? 0]
        if (!target) return
        tl.to(
          chip,
          {
            x: () => {
              const c = chip.getBoundingClientRect()
              const t = target.getBoundingClientRect()
              return t.left + t.width / 2 - (c.left + c.width / 2)
            },
            y: () => {
              const c = chip.getBoundingClientRect()
              const t = target.getBoundingClientRect()
              return t.top + 12 - c.top
            },
            rotate: 0,
            scale: 0.4,
            opacity: 0,
            duration: 0.55,
            ease: EASE.inOut,
          },
          `flock+=${i * 0.07}`
        )
      })

      // 3 — les barres se remplissent, le ciel vidé se referme.
      tl.to(fillEls, { width: (i: number) => fillPercent(i), duration: 0.6, stagger: 0.1 }, 'flock+=0.5')
        .to(knobEls, { left: (i: number) => fillPercent(i), opacity: 1, duration: 0.6, stagger: 0.1 }, 'flock+=0.5')
        .to(
          skyRef.current,
          {
            height: 0,
            marginTop: 0,
            duration: 0.5,
            ease: EASE.inOut,
            // La page vient de raccourcir : remesurer tout ce qui suit.
            onComplete: () => ScrollTrigger.refresh(),
          },
          'flock+=1.05'
        )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const slices: [RatioSlice, RatioSlice, RatioSlice] = [
    { pct: '50 %', name: d.slices?.[0]?.name ?? '', detail: d.slices?.[0]?.detail ?? '', tone: 'text-besoins', fill: FILLS[0] },
    { pct: '30 %', name: d.slices?.[1]?.name ?? '', detail: d.slices?.[1]?.detail ?? '', tone: 'text-envies', fill: FILLS[1] },
    { pct: '20 %', name: d.slices?.[2]?.name ?? '', detail: d.slices?.[2]?.detail ?? '', tone: 'text-epargne', fill: FILLS[2] },
  ]

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
        <div ref={skyRef} className="ratio-sky" aria-hidden="true">
          {Array.isArray(chips) &&
            chips.map((chip, index) => {
              const layout = chipLayout[index]
              if (!layout) return null
              return (
                <div
                  key={index}
                  className={cn('income-chip absolute will-change-transform', layout.className)}
                  style={{ transform: `rotate(${layout.rotate}deg)` }}
                >
                  <AmountChip label={chip.label} amount={chip.amount} muted />
                </div>
              )
            })}
        </div>

        <RatioGrid slices={slices} />
      </StatementEntry>
    </div>
  )
}
