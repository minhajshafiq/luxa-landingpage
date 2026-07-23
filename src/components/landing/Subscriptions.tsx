'use client'

import { useRef } from 'react'
import { BellRing } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { PhoneFrame } from '@/components/design-system/PhoneFrame'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { gsap, ScrollTrigger, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function Subscriptions() {
  const sectionRef = useRef<HTMLElement>(null)
  const totalRef = useRef<HTMLSpanElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const { t, language } = useTranslation()

  const finalTotal = t('subs.total') as string

  // The reveal: the monthly total counts up from zero as it enters view —
  // the same small shock the app gives you the first time.
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const el = totalRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const counter = { value: 0 }
      const formatter = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US')

      // The phone drifts against the scroll — a quiet layer of depth.
      gsap.fromTo(
        phoneRef.current,
        { y: 60, rotate: 1.5 },
        {
          y: -60,
          rotate: -1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )

      gsap.to(counter, {
        value: 1276,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        onUpdate: () => {
          el.textContent = `−${formatter.format(Math.round(counter.value))} €`
        },
        onComplete: () => {
          el.textContent = finalTotal
        },
      })

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [finalTotal, language])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden py-16 md:py-32">
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={t('subs.eyebrow') as string}
              title={t('subs.title') as string}
              lead={t('subs.lead') as string}
              centered={false}
              className="mb-8 md:mb-10"
            />

            {/* The reveal card: the true monthly total */}
            <div
              data-animate="card"
              className="relative rounded-3xl border border-border bg-card p-6 shadow-premium md:p-8"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {t('subs.totalLabel') as string}
              </p>
              <p className="mt-3 flex items-baseline gap-2">
                <span
                  ref={totalRef}
                  className="font-mono tabular text-4xl font-bold text-destructive md:text-5xl"
                >
                  {finalTotal}
                </span>
                <span className="text-sm text-muted-foreground">{t('subs.perMonth') as string}</span>
              </p>

              {/* Stella can't believe it either */}
              <StellaMascot
                mood="surprised"
                size="sm"
                floating
                className="absolute -right-3 -top-8 md:-right-6"
              />

              <div className="mt-5 flex items-start gap-2.5 border-t border-border pt-5">
                <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t('subs.note') as string}
                </p>
              </div>
            </div>
          </div>

          {/* No data-animate here: the reveal engine's overwrite would kill
              the parallax scrub that owns this node's transform. */}
          <div ref={phoneRef} className="relative mx-auto w-[260px] md:w-[300px] will-change-transform">
            <div className="glow-primary pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[480px] -translate-x-1/2 -translate-y-1/2 blur-[60px] opacity-55" />
            <PhoneFrame
              src="/subscriptions.png"
              alt="Luxa — recurring expenses gathered with their monthly total"
              className="shadow-screen rounded-[2.75rem] relative"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
