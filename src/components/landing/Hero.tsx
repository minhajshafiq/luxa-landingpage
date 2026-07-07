'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { PhoneFrame } from '@/components/design-system/PhoneFrame'
import { GradientText } from '@/components/design-system/GradientText'
import { AppStoreButtons } from '@/components/design-system/AppStoreButtons'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { AmountChip } from '@/components/design-system/AmountChip'
import { LUXA_LOADER_COMPLETE_EVENT, hasSeenLuxaLoader } from '@/components/loader-provider'
import { gsap, ScrollTrigger, EASE, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type HeroChip = { label: string; amount: string }

/**
 * Chip placement around the phone. Desktop only for the outer ones;
 * the Stella insight chip survives on mobile. scatter = the direction
 * each chip flies out when the scroll dive begins.
 */
const chipSlots = [
  { className: 'left-[4%] top-[6%] lg:left-[12%]', scatter: { x: -180, y: -120 }, delay: 0 },
  { className: 'right-[3%] top-[14%] lg:right-[11%]', scatter: { x: 200, y: -100 }, delay: 1.6 },
  { className: 'left-[7%] bottom-[30%] lg:left-[15%]', scatter: { x: -220, y: 60 }, delay: 0.9 },
  { className: 'right-[6%] bottom-[38%] lg:right-[14%]', scatter: { x: 240, y: 90 }, delay: 2.2 },
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const stellaRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { t } = useTranslation()
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => {
    if (hasSeenLuxaLoader()) {
      setHeroReady(true)
      return
    }

    const handleLoaderComplete = () => setHeroReady(true)
    const fallbackTimer = window.setTimeout(() => setHeroReady(true), 2400)
    window.addEventListener(LUXA_LOADER_COMPLETE_EVENT, handleLoaderComplete, { once: true })

    return () => {
      window.clearTimeout(fallbackTimer)
      window.removeEventListener(LUXA_LOADER_COMPLETE_EVENT, handleLoaderComplete)
    }
  }, [])

  const titleWords = (t('hero.title') as string || '').split(' ').filter(Boolean)
  const highlightWords = (t('hero.titleHighlight') as string || '').split(' ').filter(Boolean)
  const chips = t('hero.chips') as unknown as HeroChip[]
  const insightChip = t('hero.insightChip') as unknown as { label: string; value: string }
  const savingsChip = t('hero.savingsChip') as unknown as { label: string; value: string }

  // Entrance choreography — waits for the loader, touches only tweenable
  // properties. Lives apart from the scroll triggers so re-running it never
  // destroys the dive pin (rebuilding a pin shifts every trigger below it).
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const words = titleRef.current
        ? Array.from(titleRef.current.querySelectorAll('.word'))
        : []
      const chipsEls = gsap.utils.toArray<HTMLElement>('.hero-chip')
      const lead = gsap.utils.toArray<HTMLElement>('.hero-lead')

      gsap.set(words, { opacity: 0, y: 24 })
      gsap.set(lead, { opacity: 0, y: 16 })
      gsap.set(phoneRef.current, { opacity: 0, yPercent: 8, scale: 0.96, filter: 'blur(8px)' })
      gsap.set(chipsEls, { opacity: 0, y: 20, scale: 0.92 })
      gsap.set(stellaRef.current, { opacity: 0, y: 18, scale: 0.88 })

      if (heroReady) {
        const tl = gsap.timeline({ defaults: { ease: EASE.out } })
        tl.to(words, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 }, 0.15)
          .to(lead, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.55)
          .to(
            phoneRef.current,
            { opacity: 1, yPercent: 0, scale: 1, filter: 'blur(0px)', duration: 1.05 },
            0.45
          )
          .to(chipsEls, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.09 }, 0.95)
          .to(stellaRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, 1.25)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [heroReady])

  // Scroll triggers — created ONCE at mount so their pin spacers never churn.
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { desktop } = context.conditions as { desktop: boolean; mobile: boolean }
          const chipsEls = gsap.utils.toArray<HTMLElement>('.hero-chip')

          // --- Ambient -------------------------------------------------------
          gsap.to('.hero-glow', {
            opacity: 0.9,
            duration: 5,
            ease: EASE.sine,
            yoyo: true,
            repeat: -1,
          })

          // --- Scroll --------------------------------------------------------
          if (desktop) {
            // The dive: the hero pins and you scroll INTO the screen.
            // Headline lifts away, chips scatter like startled fireflies,
            // the phone grows until its screen is the world.
            const dive = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=120%',
                scrub: 0.8,
                pin: true,
                anticipatePin: 1,
              },
              defaults: { ease: 'none' },
            })

            dive
              .to(
                contentRef.current,
                { opacity: 0, y: -70, filter: 'blur(5px)', duration: 0.28 },
                0
              )
              .to(
                chipsEls,
                {
                  opacity: 0,
                  scale: 0.75,
                  x: (i, el) => Number((el as HTMLElement).dataset.scatterX ?? -120),
                  y: (i, el) => Number((el as HTMLElement).dataset.scatterY ?? -80),
                  duration: 0.4,
                  stagger: 0.03,
                },
                0.02
              )
              .to(stellaRef.current, { opacity: 0, scale: 0.85, y: 60, duration: 0.3 }, 0.1)
              .to(
                zoomRef.current,
                { scale: 2.3, y: () => window.innerHeight * 0.22, duration: 1 },
                0
              )
              .to(stageRef.current, { opacity: 0.45, duration: 0.15 }, 0.85)
          } else {
            // Mobile: no pin (browser chrome makes pins jumpy) — a gentle
            // grow-toward-you as the phone crosses the viewport.
            gsap.to(zoomRef.current, {
              scale: 1.14,
              ease: 'none',
              scrollTrigger: {
                trigger: stageRef.current,
                start: 'top 80%',
                end: 'bottom top',
                scrub: 1,
              },
            })
            gsap.to(contentRef.current, {
              opacity: 0.25,
              y: -40,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: '60% top',
                scrub: 1,
              },
            })
          }

        }
      )
    }, sectionRef)

    // Re-measure once layout is settled (fonts, images, pin spacers).
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150)

    return () => {
      window.clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden min-h-screen flex flex-col items-center pt-32 md:pt-36 pb-0"
    >
      {/* Night ambiance: stars + a screen-like lavender glow rising from below */}
      <div className="starfield pointer-events-none absolute inset-0 opacity-70" />
      <div className="hero-glow glow-primary pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 blur-[60px] opacity-60" />
      <div className="hero-glow glow-stella pointer-events-none absolute top-1/2 -right-32 h-96 w-96 blur-3xl opacity-40" />

      <Container className="relative z-10">
        <div ref={contentRef} className="text-center max-w-3xl mx-auto">
          {/* Availability badge */}
          <p className="hero-lead inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 font-mono text-[11px] md:text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-epargne/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-epargne" />
            </span>
            {t('hero.badge') as string}
          </p>

          {/* Headline */}
          <h1
            ref={titleRef}
            className="mt-6 font-display text-[2.75rem] leading-[1.05] md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground"
          >
            {titleWords.map((word, index) => (
              <span key={`title-${index}`}>
                <span className="word inline-block">{word}</span>{' '}
              </span>
            ))}
            <span className="whitespace-nowrap">
              {highlightWords.map((word, index) => (
                <span key={`highlight-${index}`}>
                  <span className="word inline-block">
                    <GradientText>{word}</GradientText>
                  </span>
                  {index < highlightWords.length - 1 && ' '}
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-lead mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground text-pretty">
            {t('hero.subtitle') as string}
          </p>

          {/* CTAs */}
          <div className="hero-lead mt-8 flex flex-col items-center gap-4">
            <AppStoreButtons
              downloadLabel={t('hero.ctaDownload') as string}
              androidLabel={t('hero.ctaAndroidBeta') as string}
            />
            {/* Trust line */}
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs md:text-sm text-muted-foreground/80">
              <span>{t('hero.trust.free') as string}</span>
              <span aria-hidden="true" className="text-stella">✦</span>
              <span>{t('hero.trust.noBank') as string}</span>
              <span aria-hidden="true" className="text-stella">✦</span>
              <span>{t('hero.trust.private') as string}</span>
            </p>
          </div>
        </div>

        {/* Product stage: one phone glowing in the night, transactions orbiting */}
        <div ref={stageRef} className="relative mx-auto mt-12 md:mt-16 max-w-4xl">
          <div className="hero-glow glow-primary pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[720px] -translate-x-1/2 -translate-y-1/2 blur-[70px] opacity-70" />

          {/* Orbiting transaction chips (desktop) */}
          {Array.isArray(chips) &&
            chips.map((chip, index) => {
              const slot = chipSlots[index]
              if (!slot) return null
              return (
                <div
                  key={index}
                  data-scatter-x={slot.scatter.x}
                  data-scatter-y={slot.scatter.y}
                  className={cn('hero-chip absolute z-20 hidden md:block', slot.className)}
                >
                  <div
                    className="animate-luxa-float"
                    style={{ animationDelay: `${slot.delay}s`, animationDuration: '5.5s' }}
                  >
                    <AmountChip label={chip.label} amount={chip.amount} />
                  </div>
                </div>
              )
            })}

          {/* Stella insight chip — present on all screens */}
          <div
            data-scatter-x={-160}
            data-scatter-y={-140}
            className="hero-chip absolute -top-4 left-1/2 z-20 w-max -translate-x-1/2 md:left-[8%] md:top-[38%] md:translate-x-0 lg:left-[10%]"
          >
            <div className="animate-luxa-float" style={{ animationDuration: '6s' }}>
              <div className="flex items-center gap-2.5 rounded-2xl border border-stella/25 bg-card/95 px-3.5 py-2.5 shadow-premium backdrop-blur-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stella/15">
                  <Sparkles className="h-4 w-4 text-stella" />
                </div>
                <div className="leading-tight text-left">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-stella">
                    {insightChip?.label}
                  </p>
                  <p className="text-xs font-medium text-foreground">{insightChip?.value}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Savings chip */}
          <div
            data-scatter-x={220}
            data-scatter-y={120}
            className="hero-chip absolute bottom-[16%] right-[2%] z-20 hidden md:block lg:right-[8%]"
          >
            <div className="animate-luxa-float" style={{ animationDelay: '2.8s', animationDuration: '5s' }}>
              <div className="flex items-center gap-2.5 rounded-2xl border border-epargne/25 bg-card/95 px-3.5 py-2.5 shadow-premium backdrop-blur-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-epargne/15">
                  <span className="font-mono text-xs font-bold text-epargne">%</span>
                </div>
                <div className="leading-tight text-left">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-epargne">
                    {savingsChip?.label}
                  </p>
                  <p className="text-xs font-medium text-foreground tabular">{savingsChip?.value}</p>
                </div>
              </div>
            </div>
          </div>

          {/* The zoom target: on desktop you scroll INTO this screen */}
          <div
            ref={zoomRef}
            className="relative z-10 mx-auto w-[280px] md:w-[340px] lg:w-[380px] will-change-transform"
            style={{ transformOrigin: '50% 22%' }}
          >
            <div ref={phoneRef} className="relative will-change-transform">
              <PhoneFrame
                src="/dashboard.png"
                alt="Luxa — dashboard: balance, weekly spending, recent transactions"
                className="shadow-screen rounded-[2.75rem]"
                priority
              />
            </div>
            {/* Stella peeks from behind the phone */}
            <div ref={stellaRef} className="absolute -right-16 bottom-10 z-20 md:-right-24 md:bottom-16">
              <div className="glow-stella pointer-events-none absolute -inset-5 blur-2xl opacity-70" />
              <StellaMascot mood="happy" size="lg" floating priority className="relative" />
            </div>
          </div>
        </div>
      </Container>

      {/* Fade the phone into the next section — no hard seam */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
