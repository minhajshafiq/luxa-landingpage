'use client'

import { useRef } from 'react'
import { Home, Heart, TrendingUp, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { AmountChip } from '@/components/design-system/AmountChip'
import { gsap, ScrollTrigger, EASE, useIsomorphicLayoutEffect } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type DisperseChip = { label: string; amount: string }
type DispersePocket = { name: string; target: string }

/**
 * The signature sequence of the page. On desktop the section PINS:
 * while you scroll, every scattered expense flies into its pocket,
 * the bars fill, and the page exhales. You feel the sorting happen
 * under your fingers — chaos becoming a picture you can read.
 * Mobile and reduced-motion get a calm two-state version.
 */

// Scatter layout: percentage positions inside the sky, hand-tuned so the
// cloud reads as noise without overlaps. pocket: 0 = needs, 1 = wants, 2 = savings.
const chipLayout = [
  { left: 8, top: 12, rotate: -9, pocket: 1 },   // Café
  { left: 66, top: 6, rotate: 7, pocket: 1 },    // Uber Eats
  { left: 30, top: 30, rotate: -4, pocket: 1 },  // Netflix
  { left: 84, top: 34, rotate: 10, pocket: 0 },  // Pharmacie
  { left: 12, top: 58, rotate: 6, pocket: 1 },   // Amazon
  { left: 58, top: 52, rotate: -8, pocket: 0 },  // Essence
  { left: 38, top: 76, rotate: 4, pocket: 1 },   // Zara
  { left: 74, top: 74, rotate: -6, pocket: 0 },  // Loyer
]

const pocketMeta: Array<{ icon: LucideIcon; barClass: string; iconClass: string; fill: number }> = [
  { icon: Home, barClass: 'bg-besoins', iconClass: 'bg-besoins/15 text-besoins', fill: 0.72 },
  { icon: Heart, barClass: 'bg-envies', iconClass: 'bg-envies/15 text-envies', fill: 0.55 },
  { icon: TrendingUp, barClass: 'bg-epargne', iconClass: 'bg-epargne/15 text-epargne', fill: 0.4 },
]

export function Disperse() {
  const sectionRef = useRef<HTMLElement>(null)
  const skyRef = useRef<HTMLDivElement>(null)
  const pocketRefs = useRef<(HTMLDivElement | null)[]>([])
  const { t } = useTranslation()

  const chips = t('disperse.chips') as unknown as DisperseChip[]
  const pockets = t('disperse.pockets') as unknown as DispersePocket[]

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
          still: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { desktop, mobile } = context.conditions as {
            desktop: boolean
            mobile: boolean
          }
          const chipEls = gsap.utils.toArray<HTMLElement>('.disperse-chip')
          const fillEls = gsap.utils.toArray<HTMLElement>('.pocket-fill')
          const afterEls = gsap.utils.toArray<HTMLElement>('.disperse-after')

          if (desktop) {
            // Scrubbed timelines don't render initial fromTo states until the
            // playhead arrives — set them explicitly so nothing shows early.
            gsap.set(afterEls, { opacity: 0, y: 22, filter: 'blur(5px)' })

            // Pinned choreography: the whole section holds still while
            // the chips file themselves away, driven by the scroll.
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=170%',
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
              defaults: { ease: EASE.inOut },
            })

            // A breath at the start: chips hover, nothing moves yet.
            tl.to({}, { duration: 0.12 })

            chipEls.forEach((chip, i) => {
              const layout = chipLayout[i]
              const target = pocketRefs.current[layout?.pocket ?? 0]
              if (!layout || !target) return

              tl.to(
                chip,
                {
                  x: () => {
                    const chipBox = chip.getBoundingClientRect()
                    const targetBox = target.getBoundingClientRect()
                    return targetBox.left + targetBox.width / 2 - (chipBox.left + chipBox.width / 2)
                  },
                  y: () => {
                    const chipBox = chip.getBoundingClientRect()
                    const targetBox = target.getBoundingClientRect()
                    return targetBox.top + 14 - chipBox.top
                  },
                  rotate: 0,
                  scale: 0.5,
                  opacity: 0,
                  duration: 0.55,
                },
                0.12 + i * 0.08
              )

              // Each landing nudges its pocket — the sort is physical.
              tl.to(
                target,
                { scale: 1.025, duration: 0.05, ease: 'power1.out' },
                0.12 + i * 0.08 + 0.5
              ).to(target, { scale: 1, duration: 0.08, ease: 'power1.in' })
            })

            tl.to(
              fillEls,
              {
                scaleX: (i) => pocketMeta[i]?.fill ?? 0.5,
                duration: 0.5,
                stagger: 0.08,
                ease: EASE.out,
              },
              0.45
            )
            tl.fromTo(
              afterEls,
              { opacity: 0, y: 22, filter: 'blur(5px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, stagger: 0.06, ease: EASE.out },
              '>-0.15'
            )
            // A final quiet beat so the exhale lands before unpinning.
            tl.to({}, { duration: 0.25 })
          } else if (mobile) {
            // Lighter touch: chips drift in, pockets fill on reveal.
            gsap.fromTo(
              chipEls,
              { opacity: 0, y: 14 },
              {
                opacity: 0.85,
                y: 0,
                duration: 0.6,
                stagger: 0.06,
                ease: EASE.out,
                scrollTrigger: { trigger: skyRef.current, start: 'top 82%', once: true },
              }
            )
            gsap.to(fillEls, {
              scaleX: (i) => pocketMeta[i]?.fill ?? 0.5,
              duration: 1,
              stagger: 0.15,
              ease: EASE.out,
              scrollTrigger: { trigger: pocketRefs.current[0], start: 'top 85%', once: true },
            })
            gsap.fromTo(
              afterEls,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: EASE.out,
                scrollTrigger: { trigger: pocketRefs.current[0], start: 'top 75%', once: true },
              }
            )
          } else {
            // Reduced motion: show the resolved state, no animation.
            gsap.set(chipEls, { opacity: 0.7 })
            gsap.set(fillEls, { scaleX: (i: number) => pocketMeta[i]?.fill ?? 0.5 })
            gsap.set(afterEls, { opacity: 1 })
          }
        }
      )

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden py-20 md:min-h-screen md:flex md:flex-col md:justify-center md:pt-28 md:pb-6"
    >
      <div className="glow-stella animate-glow-breathe pointer-events-none absolute -left-32 top-16 h-80 w-80 blur-3xl opacity-40" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t('disperse.eyebrow') as string}
          title={t('disperse.title') as string}
          titleHighlight={t('disperse.titleHighlight') as string}
          lead={t('disperse.lead') as string}
          className="mb-6 md:mb-8"
        />

        {/* The sky: scattered spending */}
        <div
          ref={skyRef}
          className="relative mx-auto h-52 max-w-3xl md:h-44"
          aria-hidden="true"
        >
          {Array.isArray(chips) &&
            chips.map((chip, index) => {
              const layout = chipLayout[index]
              if (!layout) return null
              return (
                <div
                  key={index}
                  className="disperse-chip absolute will-change-transform"
                  style={{
                    left: `${layout.left}%`,
                    top: `${layout.top}%`,
                    transform: `rotate(${layout.rotate}deg)`,
                  }}
                >
                  <AmountChip label={chip.label} amount={chip.amount} muted />
                </div>
              )
            })}
        </div>

        {/* The pockets: where everything lands */}
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.isArray(pockets) &&
            pockets.map((pocket, index) => {
              const meta = pocketMeta[index]
              if (!meta) return null
              const Icon = meta.icon
              return (
                <div
                  key={index}
                  ref={(el) => {
                    pocketRefs.current[index] = el
                  }}
                  className="rounded-3xl border border-border bg-card p-5 shadow-premium"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={cn('flex h-9 w-9 items-center justify-center rounded-full', meta.iconClass)}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-foreground">{pocket.name}</span>
                    </div>
                    <span className="font-mono tabular text-xs text-muted-foreground">{pocket.target}</span>
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('pocket-fill h-full w-full origin-left rounded-full', meta.barClass)}
                      style={{ transform: 'scaleX(0)' }}
                    />
                  </div>
                </div>
              )
            })}
        </div>

        {/* The exhale */}
        <div className="mt-10 text-center md:mt-8">
          <h3 className="disperse-after font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {(t('disperse.after') as Record<string, string>)?.title}
          </h3>
          <p className="disperse-after mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            {(t('disperse.after') as Record<string, string>)?.lead}
          </p>
        </div>
      </Container>
    </section>
  )
}
