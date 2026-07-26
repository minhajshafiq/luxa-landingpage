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
 * The signature sequence of the page. On desktop, while you scroll,
 * every scattered expense flies into its pocket,
 * the bars fill, and the page exhales. You feel the sorting happen
 * under your fingers — chaos becoming a picture you can read.
 * Mobile plays the same story as a one-shot timeline (pop in scattered,
 * flock into the pockets, sky closes up); reduced-motion gets the
 * resolved state with no animation.
 */

// Scatter layout: hand-tuned positions inside the sky so the cloud reads as
// noise without overlaps. Mobile gets its own coordinates (base classes) so
// no chip ever bleeds off a phone screen; md: restores the desktop cloud.
// pocket: 0 = needs, 1 = wants, 2 = savings.
const chipLayout = [
  { className: 'left-[2%] top-[3%] md:left-[8%] md:top-[12%]', rotate: -9, pocket: 1 },     // Café
  { className: 'left-[52%] top-[9%] md:left-[66%] md:top-[6%]', rotate: 7, pocket: 1 },     // Uber Eats
  { className: 'left-[10%] top-[27%] md:left-[30%] md:top-[30%]', rotate: -4, pocket: 1 },  // Netflix
  { className: 'left-[54%] top-[33%] md:left-[84%] md:top-[34%]', rotate: 10, pocket: 0 },  // Pharmacie
  { className: 'left-[4%] top-[52%] md:left-[12%] md:top-[58%]', rotate: 6, pocket: 1 },    // Amazon
  { className: 'left-[54%] top-[58%] md:left-[58%] md:top-[52%]', rotate: -8, pocket: 0 },  // Essence
  { className: 'left-[12%] top-[78%] md:left-[38%] md:top-[76%]', rotate: 4, pocket: 1 },   // Zara
  { className: 'left-[56%] top-[84%] md:left-[74%] md:top-[74%]', rotate: -6, pocket: 0 },  // Loyer
]

// `toneClass` sets the text colour on the meter wrapper; the fill and its knob
// both paint with currentColor, exactly like the app's budget bars.
const pocketMeta: Array<{ icon: LucideIcon; toneClass: string; iconClass: string; fill: number }> = [
  { icon: Home, toneClass: 'text-besoins', iconClass: 'bg-besoins/15 text-besoins', fill: 0.72 },
  { icon: Heart, toneClass: 'text-envies', iconClass: 'bg-envies/15 text-envies', fill: 0.55 },
  { icon: TrendingUp, toneClass: 'text-epargne', iconClass: 'bg-epargne/15 text-epargne', fill: 0.4 },
]

/** Fill ratio of pocket i as a CSS percentage — one source for bar and knob. */
const fillPercent = (i: number) => `${(pocketMeta[i]?.fill ?? 0.5) * 100}%`

export function Disperse() {
  const sectionRef = useRef<HTMLElement>(null)
  /** The element GSAP pins — held still while the sort plays out. */
  const stageRef = useRef<HTMLDivElement>(null)
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
          const knobEls = gsap.utils.toArray<HTMLElement>('.pocket-knob')
          const afterEls = gsap.utils.toArray<HTMLElement>('.disperse-after')

          if (desktop) {
            // Scrubbed timelines don't render initial fromTo states until the
            // playhead arrives — set them explicitly so nothing shows early.
            gsap.set(afterEls, { opacity: 0, y: 22, filter: 'blur(5px)' })

            // PINNED. The previous version ran in normal document flow from
            // `top 82%` to `bottom 28%`, which meant the whole sort played
            // out while the section was still climbing into the viewport:
            // by the time you could actually see the pockets the chips had
            // already gone and the bars were already full, leaving a dead
            // band where the chips used to be. Pinning holds the section
            // still and spends the scroll on the choreography instead of on
            // travel, so the payoff happens in front of you.
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=120%',
                pin: stageRef.current,
                pinSpacing: true,
                anticipatePin: 1,
                scrub: 1,
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

            // Bar and knob run as two tweens at the same timeline position
            // with the same easing, so the knob stays welded to the head of
            // the fill. (Animating width, not scaleX, keeps the rounded cap
            // a circle instead of squashing it into an ellipse.)
            tl.to(
              fillEls,
              {
                width: (i: number) => fillPercent(i),
                duration: 0.5,
                stagger: 0.08,
                ease: EASE.out,
              },
              0.45
            )
            tl.to(
              knobEls,
              {
                left: (i: number) => fillPercent(i),
                opacity: 1,
                duration: 0.5,
                stagger: 0.08,
                ease: EASE.out,
              },
              0.45
            )
            // The emptied sky closes up. Without this the 300px band the
            // chips came from stays reserved and reads as a hole punched in
            // the section; collapsing it lets the pockets rise into the
            // middle of the frame — the page literally tightening around the
            // result. Safe inside the pin: the stage is min-h-screen, so its
            // measured height (and the pin spacer) never changes.
            tl.to(skyRef.current, { height: 0, duration: 0.35, ease: EASE.inOut }, 0.62)

            tl.fromTo(
              afterEls,
              { opacity: 0, y: 22, filter: 'blur(5px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, stagger: 0.06, ease: EASE.out },
              '>-0.15'
            )
            // A final quiet beat so the exhale has room to land.
            tl.to({}, { duration: 0.25 })
          } else if (mobile) {
            // Same story as desktop, told once: expenses pop in scattered,
            // breathe, then flock into their pockets. A play-once timeline
            // (no pin — pins jump with mobile browser chrome) keeps it
            // smooth at 60fps regardless of scroll momentum.
            gsap.set(chipEls, { opacity: 0, scale: 0.7, y: 12 })
            gsap.set(afterEls, { opacity: 0, y: 14 })

            const tl = gsap.timeline({
              scrollTrigger: { trigger: skyRef.current, start: 'top 68%', once: true },
              defaults: { ease: EASE.out },
            })

            // 1 — dispersion: the month happens, one small expense at a time.
            tl.to(chipEls, { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.07 })
              .addLabel('flock', '+=0.4')

            // 2 — regroupement: each chip flies into its pocket.
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
                    return targetBox.top + 10 - chipBox.top
                  },
                  rotate: 0,
                  scale: 0.35,
                  opacity: 0,
                  duration: 0.6,
                  ease: EASE.inOut,
                },
                `flock+=${i * 0.08}`
              )
              tl.to(
                target,
                { scale: 1.03, duration: 0.1, ease: 'power1.out' },
                `flock+=${i * 0.08 + 0.55}`
              ).to(target, { scale: 1, duration: 0.15, ease: 'power1.in' })
            })

            // 3 — the picture: bars fill, the emptied sky closes up
            // (the page literally tightens), and the exhale lands.
            tl.to(
              fillEls,
              { width: (i: number) => fillPercent(i), duration: 0.8, stagger: 0.12 },
              'flock+=0.5'
            )
              .to(
                knobEls,
                { left: (i: number) => fillPercent(i), opacity: 1, duration: 0.8, stagger: 0.12 },
                'flock+=0.5'
              )
              .to(
                skyRef.current,
                {
                  height: 96,
                  duration: 0.6,
                  ease: EASE.inOut,
                  // The page just got shorter — remeasure every trigger below.
                  onComplete: () => ScrollTrigger.refresh(),
                },
                'flock+=1.2'
              )
              .to(afterEls, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, 'flock+=1.3')
          } else {
            // Reduced motion: show the resolved state, no animation.
            gsap.set(chipEls, { opacity: 0.7 })
            gsap.set(fillEls, { width: (i: number) => fillPercent(i) })
            gsap.set(knobEls, { left: (i: number) => fillPercent(i), opacity: 1 })
            gsap.set(afterEls, { opacity: 1 })
          }
        }
      )

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative isolate overflow-x-clip">
      <div
        aria-hidden="true"
        className="luxa-rule absolute inset-x-0 top-0 z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8"
      />

      {/* The pinned stage. Everything inside stays put while the sort plays. */}
      <div
        ref={stageRef}
        className="flex min-h-screen flex-col justify-center py-24 md:py-32"
      >
        <div className="glow-primary pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 blur-[80px] opacity-40" />
        {/* Three faint pools of pocket colour sitting under the row of
            pockets: the resolution is already glowing before the chips land. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[22%] mx-auto hidden max-w-3xl justify-between px-8 opacity-[0.3] blur-[64px] md:flex">
          <span className="h-24 w-32 rounded-full bg-besoins" />
          <span className="h-24 w-32 rounded-full bg-envies" />
          <span className="h-24 w-32 rounded-full bg-epargne" />
        </div>

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
          className="relative mx-auto h-64 max-w-3xl md:h-[300px]"
          aria-hidden="true"
        >
          {Array.isArray(chips) &&
            chips.map((chip, index) => {
              const layout = chipLayout[index]
              if (!layout) return null
              return (
                <div
                  key={index}
                  className={cn('disperse-chip absolute will-change-transform', layout.className)}
                  style={{ transform: `rotate(${layout.rotate}deg)` }}
                >
                  <AmountChip label={chip.label} amount={chip.amount} muted />
                </div>
              )
            })}
        </div>

        {/* The pockets: where everything lands. Always 3-up so the flock
            animation has visible targets on phones too. */}
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-3 gap-2.5 md:mt-8 md:gap-4">
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
                  className="luxa-card luxa-hairline rounded-tile p-3 md:rounded-card md:p-5"
                >
                  <div className="flex flex-col items-center gap-1.5 md:flex-row md:justify-between md:gap-2.5">
                    <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-2.5">
                      <span className={cn('flex h-8 w-8 items-center justify-center rounded-full md:h-9 md:w-9', meta.iconClass)}>
                        <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </span>
                      <span className="text-center text-xs font-semibold text-foreground md:text-sm">{pocket.name}</span>
                    </div>
                    <span className="font-mono tabular text-[10px] text-muted-foreground md:text-xs">{pocket.target}</span>
                  </div>

                  {/* The app's budget bar, knob and all */}
                  <div className={cn('luxa-meter mt-3 md:mt-4', meta.toneClass)}>
                    <div className="pocket-fill luxa-meter-fill" style={{ width: 0 }} />
                    <span
                      aria-hidden="true"
                      className="pocket-knob luxa-meter-knob"
                      style={{ left: 0, opacity: 0 }}
                    />
                  </div>
                </div>
              )
            })}
        </div>

        {/* The exhale */}
        <div className="mt-10 text-center md:mt-8">
          <div className="luxa-rule disperse-after mx-auto mb-8 max-w-sm" />
          <h3 className="disperse-after font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {(t('disperse.after') as Record<string, string>)?.title}
          </h3>
          <p className="disperse-after mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            {(t('disperse.after') as Record<string, string>)?.lead}
          </p>
        </div>
      </Container>
      </div>
    </section>
  )
}
