'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Percent, Gauge, Eye, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { PhoneFrame } from '@/components/design-system/PhoneFrame'
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type TourStep = { title: string; description: string }

const stepIcons: LucideIcon[] = [Percent, Gauge, Eye]

/** Which app screen each step shows on the sticky phone. */
const stepScreens = ['/pockets.png', '/stats.png', '/pockets.png']
const screenAlts = [
  'Luxa — pockets: budget by category with live progress',
  'Luxa — statistics: budget health, weekly expenses, daily average',
  'Luxa — pockets with the left-to-spend amount highlighted',
]

/**
 * Flowty-style guided tour: the phone stays pinned (CSS sticky) while
 * the three pocket promises scroll past — each step swaps the screen.
 * The product demos itself under your scroll.
 */
export function AppTour() {
  const sectionRef = useRef<HTMLElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)
  const { t } = useTranslation()

  const steps = t('pockets.bullets') as unknown as TourStep[]
  const callout = t('pockets.callout') as unknown as { label: string; value: string }

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        stepRefs.current.forEach((step, index) => {
          if (!step) return
          ScrollTrigger.create({
            trigger: step,
            start: 'top 62%',
            end: 'bottom 38%',
            onToggle: (self) => {
              if (self.isActive) setActive(index)
            },
          })
        })
      })

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    // overflow-x-clip (not hidden): an overflow-hidden ancestor disables position:sticky
    <section ref={sectionRef} id="pockets" className="relative isolate overflow-x-clip py-24 md:py-28">
      <div className="glow-primary animate-glow-breathe-slow pointer-events-none absolute -right-40 top-1/3 h-96 w-96 blur-3xl opacity-45" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t('pockets.eyebrow') as string}
          title={t('pockets.title') as string}
          lead={t('pockets.lead') as string}
        />

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* Sticky phone: the screen follows the story */}
          <div className="hidden md:block">
            <div className="sticky top-0 flex h-screen items-center justify-center">
              <div className="relative w-[270px] lg:w-[310px]">
                <div className="glow-primary pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[480px] -translate-x-1/2 -translate-y-1/2 blur-[60px] opacity-60" />

                {/* Stacked screens, crossfading with the active step */}
                <div className="shadow-screen relative aspect-[1206/2622] overflow-hidden rounded-[2.75rem] bg-black p-[10px]">
                  <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-black">
                    {stepScreens.map((src, index) => (
                      <Image
                        key={`${src}-${index}`}
                        src={src}
                        alt={active === index ? screenAlts[index] : ''}
                        fill
                        sizes="310px"
                        className={cn(
                          'object-cover transition-all duration-700 ease-out',
                          active === index
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-[1.04]'
                        )}
                      />
                    ))}
                  </div>
                  <div className="pointer-events-none absolute left-1/2 top-[10px] h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
                </div>

                {/* Left-to-spend callout — appears on the last step */}
                <div
                  className={cn(
                    'absolute -right-24 top-[52%] z-20 transition-all duration-500 ease-out',
                    active === 2
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3 pointer-events-none'
                  )}
                >
                  <div className="rounded-2xl border border-stella/30 bg-card/95 px-4 py-3 shadow-premium backdrop-blur-md">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-stella">
                      {callout?.label}
                    </p>
                    <p className="mt-0.5 font-mono tabular text-lg font-bold text-foreground">
                      {callout?.value}
                    </p>
                  </div>
                </div>

                {/* Step dots */}
                <div className="absolute -left-10 top-1/2 flex -translate-y-1/2 flex-col gap-2.5">
                  {steps?.map?.((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        'h-2 w-2 rounded-full transition-all duration-500',
                        active === index ? 'bg-primary scale-110' : 'bg-border'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Steps: each one owns a viewport-height beat on desktop */}
          <div>
            {Array.isArray(steps) &&
              steps.map((step, index) => {
                const Icon = stepIcons[index] ?? Percent
                return (
                  <div
                    key={index}
                    ref={(el) => {
                      stepRefs.current[index] = el
                    }}
                    className="flex items-center py-10 md:min-h-[80vh] md:py-0"
                  >
                    <div data-animate="card">
                      <span
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors duration-500',
                          active === index
                            ? 'border-primary/40 bg-primary/15 text-primary'
                            : 'border-border bg-card text-muted-foreground'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="mt-5 font-mono text-xs tracking-[0.2em] text-muted-foreground">
                        0{index + 1} / 0{steps.length}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                        {step.description}
                      </p>

                      {/* Mobile: the matching screen rides along with each step */}
                      <div className="mt-8 md:hidden">
                        <div className="relative mx-auto w-[220px]">
                          <PhoneFrame
                            src={stepScreens[index]}
                            alt={screenAlts[index]}
                            className="shadow-screen rounded-[2.25rem]"
                          />
                          {index === 2 && (
                            <div className="absolute -right-6 top-[52%] rounded-2xl border border-stella/30 bg-card/95 px-3 py-2 shadow-premium">
                              <p className="font-mono text-[9px] uppercase tracking-wider text-stella">
                                {callout?.label}
                              </p>
                              <p className="font-mono tabular text-sm font-bold text-foreground">
                                {callout?.value}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </Container>
    </section>
  )
}
