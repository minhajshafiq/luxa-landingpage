'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Percent, Gauge, Eye, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { PhoneFrame } from '@/components/design-system/PhoneFrame'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type TourStep = { title: string; description: string }
type ScreenTransition = { from: number; to: number; progress: number }

const stepIcons: LucideIcon[] = [Percent, Gauge, Eye]

const stepThemes = [
  'border-primary/20 bg-[radial-gradient(circle_at_76%_42%,hsl(var(--primary)/0.20),transparent_43%),linear-gradient(135deg,hsl(var(--card)/0.96),hsl(var(--background)/0.92))]',
  'border-stella/20 bg-[radial-gradient(circle_at_76%_42%,hsl(var(--stella)/0.16),transparent_43%),linear-gradient(135deg,hsl(var(--card)/0.96),hsl(var(--background)/0.92))]',
  'border-primary/25 bg-[radial-gradient(circle_at_76%_42%,hsl(var(--primary)/0.16),transparent_40%),radial-gradient(circle_at_86%_70%,hsl(var(--stella)/0.10),transparent_34%),linear-gradient(135deg,hsl(var(--card)/0.96),hsl(var(--background)/0.92))]',
]

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
  const [phoneVisible, setPhoneVisible] = useState(false)
  const [screenTransition, setScreenTransition] = useState<ScreenTransition>({
    from: 0,
    to: 0,
    progress: 0,
  })
  const { t } = useTranslation()

  const steps = t('pockets.bullets') as unknown as TourStep[]
  const callout = t('pockets.callout') as unknown as { label: string; value: string }

  useEffect(() => {
    if (window.innerWidth < 768) return

    const updateActiveStep = () => {
      const section = sectionRef.current
      if (!section) return

      const sectionRect = section.getBoundingClientRect()
      const firstStep = stepRefs.current[0]
      const lastStep = stepRefs.current[stepRefs.current.length - 1]
      const firstRect = firstStep?.getBoundingClientRect()
      const lastRect = lastStep?.getBoundingClientRect()
      const shouldShowPhone = Boolean(
        firstRect &&
          lastRect &&
          firstRect.top <= window.innerHeight * 0.55 &&
          lastRect.bottom >= window.innerHeight * 0.72
      )
      setPhoneVisible((current) => (current === shouldShowPhone ? current : shouldShowPhone))

      if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) return

      let from = 0
      let to = 0
      let progress = 0

      for (let index = 1; index < stepRefs.current.length; index += 1) {
        const step = stepRefs.current[index]
        if (!step) continue

        const rect = step.getBoundingClientRect()
        const rawProgress = (window.innerHeight * 0.9 - rect.top) / (window.innerHeight * 0.52)

        if (rawProgress <= 0) continue
        from = index - 1
        to = index
        const visibleProgress = Math.min(1, Math.max(0, rawProgress))
        const delayedProgress = Math.min(1, Math.max(0, (visibleProgress - 0.18) / 0.82))
        progress = delayedProgress * delayedProgress * (3 - 2 * delayedProgress)
      }

      const nextActive = progress >= 0.55 ? to : from
      setActive((current) => (current === nextActive ? current : nextActive))
      setScreenTransition((current) => {
        if (
          current.from === from &&
          current.to === to &&
          Math.abs(current.progress - progress) < 0.01
        ) {
          return current
        }
        return { from, to, progress }
      })
    }

    updateActiveStep()
    const syncTimer = window.setInterval(updateActiveStep, 120)
    window.addEventListener('scroll', updateActiveStep, { passive: true })
    window.addEventListener('resize', updateActiveStep)

    return () => {
      window.clearInterval(syncTimer)
      window.removeEventListener('scroll', updateActiveStep)
      window.removeEventListener('resize', updateActiveStep)
    }
  }, [steps.length])

  return (
    // overflow-x-clip (not hidden): an overflow-hidden ancestor disables position:sticky
    <section ref={sectionRef} id="pockets" className="relative isolate overflow-x-clip py-16 md:py-28">

      <Container className="relative">
        <SectionHeading
          eyebrow={t('pockets.eyebrow') as string}
          title={t('pockets.title') as string}
          lead={t('pockets.lead') as string}
          className="mb-12 md:mb-16"
        />

        <div className="relative">
          {/* Sticky phone: the screen follows the story */}
          <div className="pointer-events-none absolute -bottom-[50vh] right-0 top-0 z-30 hidden w-1/2 overflow-clip md:block">
            <div
              className={cn(
                'sticky top-[52%] flex -translate-y-1/2 justify-center transition-[opacity,transform] duration-300 ease-out',
                phoneVisible ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-0'
              )}
            >
              <div className="relative w-[min(22.5vw,300px)] lg:w-[310px]">
                <div className="glow-primary pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[520px] -translate-x-1/2 -translate-y-1/2 blur-[72px] opacity-70" />

                {/* The supplied shots already contain the complete device. */}
                <div className="relative aspect-[1530/3036] drop-shadow-[0_32px_55px_rgba(17,8,35,0.82)]">
                  {stepScreens.map((src, index) => (
                    <Image
                      key={`${src}-${index}`}
                      src={src}
                      alt={active === index ? screenAlts[index] : ''}
                      width={1530}
                      height={3036}
                      sizes="(max-width: 1023px) 22.5vw, 310px"
                      className={cn(
                        'absolute inset-0 h-full w-full select-none object-contain transition-[opacity,transform] duration-200 ease-out will-change-transform',
                        index !== screenTransition.from && index !== screenTransition.to && 'opacity-0'
                      )}
                      style={{
                        opacity:
                          screenTransition.from === screenTransition.to
                            ? index === screenTransition.from
                              ? 1
                              : 0
                            : index === screenTransition.from
                              ? 1 - screenTransition.progress
                              : index === screenTransition.to
                                ? screenTransition.progress
                                : 0,
                        transform:
                          index === screenTransition.from
                            ? `translate3d(0, ${-18 * screenTransition.progress}px, 0) scale(${1 - 0.015 * screenTransition.progress})`
                            : index === screenTransition.to
                              ? `translate3d(0, ${18 * (1 - screenTransition.progress)}px, 0) scale(${0.985 + 0.015 * screenTransition.progress})`
                              : 'translate3d(0, 18px, 0) scale(0.985)',
                      }}
                    />
                  ))}
                </div>

                {/* Left-to-spend callout — appears on the last step */}
                <div
                  className={cn(
                    'absolute -right-16 top-[52%] z-20 transition-all duration-500 ease-out lg:-right-24',
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
          <div className="relative z-10 space-y-5 md:space-y-7">
            {Array.isArray(steps) &&
              steps.map((step, index) => {
                const Icon = stepIcons[index] ?? Percent
                return (
                  <div
                    key={index}
                    data-tour-step={index}
                    ref={(el) => {
                      stepRefs.current[index] = el
                    }}
                    className={cn(
                      'relative flex overflow-hidden rounded-[2rem] border py-8 shadow-premium md:h-[68vh] md:min-h-[600px] md:max-h-[680px] md:items-center md:py-0',
                      stepThemes[index % stepThemes.length]
                    )}
                  >
                    <div
                      data-animate="card"
                      className="relative z-10 w-full p-6 sm:p-8 md:w-[56%] md:p-12 lg:p-16"
                    >
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
                            sizes="220px"
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
