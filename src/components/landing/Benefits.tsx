'use client'

import { useRef } from 'react'
import { Section } from '@/components/design-system/Section'
import { PhoneFrame } from '@/components/design-system/PhoneFrame'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { gsap, ScrollTrigger, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Benefit = { tag: string; title: string; description: string }

/**
 * A ledger, not a bento grid: four capabilities read top to bottom like
 * lines on a statement, each tagged the way Luxa tags a transaction —
 * not numbered, since order carries no meaning here.
 */
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

  return (
    <Section ref={sectionRef} divider>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={t('benefits.eyebrow') as string}
              title={t('benefits.title') as string}
              lead={t('benefits.subtitle') as string}
              centered={false}
              className="mb-2 md:mb-2"
            />

            <div>
              {items.map((item, index) => (
                <div
                  key={index}
                  data-animate="card"
                  className="group relative flex gap-4 border-b border-border/70 py-6 first:pt-8 last:border-b-0 md:gap-6 md:py-7"
                >
                  {/* A lavender tick lights up on the rule as you hover the
                      row — the ledger acknowledging the line you're reading. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-px left-0 h-px w-0 bg-primary transition-[width] duration-500 ease-out group-hover:w-full group-last:hidden"
                  />
                  <span className="w-16 shrink-0 pt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary/70 transition-colors duration-300 group-hover:text-primary md:w-24 md:text-xs md:tracking-[0.18em]">
                    {item.tag}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-foreground md:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The proof: the new export already includes its complete phone. */}
          <div className="relative mx-auto w-[260px] md:w-[290px] lg:sticky lg:top-24">
            <StellaMascot
              mood="reading"
              size="sm"
              floating
              className="absolute -left-4 -top-5 z-10 md:-left-6"
            />
            <div ref={calendarImgRef} className="relative will-change-transform">
              <PhoneFrame
                src="/history.png"
                alt="Luxa — spending calendar, each day showing its merchants"
                sizes="(max-width: 767px) 260px, 290px"
              />
            </div>
          </div>
        </div>
    </Section>
  )
}
