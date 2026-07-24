'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, type CSSProperties } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { gsap, EASE, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

type PocketId = 'needs' | 'wants' | 'savings'

type Transaction = {
  label: string
  amount: string
  pocket: PocketId
  chaos: { x: number; y: number; rotate: number }
  targetOffset: { x: number; y: number }
  fallbackTarget: { x: number; y: number }
  tone: string
}

const transactions: Transaction[] = [
  {
    label: 'Rent',
    amount: '-1,180 EUR',
    pocket: 'needs',
    chaos: { x: -184, y: -88, rotate: -7 },
    targetOffset: { x: -28, y: -2 },
    fallbackTarget: { x: -214, y: 128 },
    tone: 'border-primary/20 bg-card/90',
  },
  {
    label: 'Groceries',
    amount: '-82 EUR',
    pocket: 'needs',
    chaos: { x: 142, y: -110, rotate: 6 },
    targetOffset: { x: 24, y: 2 },
    fallbackTarget: { x: -168, y: 128 },
    tone: 'border-primary/18 bg-card/90',
  },
  {
    label: 'Netflix',
    amount: '-15 EUR',
    pocket: 'wants',
    chaos: { x: -118, y: 62, rotate: 8 },
    targetOffset: { x: 0, y: 1 },
    fallbackTarget: { x: 0, y: 128 },
    tone: 'border-secondary/30 bg-card/90',
  },
  {
    label: 'Transport',
    amount: '-42 EUR',
    pocket: 'needs',
    chaos: { x: 182, y: 56, rotate: -5 },
    targetOffset: { x: 0, y: 8 },
    fallbackTarget: { x: -190, y: 140 },
    tone: 'border-primary/15 bg-card/90',
  },
  {
    label: 'Income',
    amount: '+2,480 EUR',
    pocket: 'savings',
    chaos: { x: -58, y: -144, rotate: 4 },
    targetOffset: { x: -24, y: -2 },
    fallbackTarget: { x: 186, y: 128 },
    tone: 'border-epargne/25 bg-card/90',
  },
  {
    label: 'Savings',
    amount: '+420 EUR',
    pocket: 'savings',
    chaos: { x: 78, y: 124, rotate: -8 },
    targetOffset: { x: 24, y: 2 },
    fallbackTarget: { x: 230, y: 128 },
    tone: 'border-epargne/25 bg-card/90',
  },
]

const pockets: Array<{ id: PocketId; label: string; fill: number }> = [
  { id: 'needs', label: 'Needs', fill: 0.76 },
  { id: 'wants', label: 'Wants', fill: 0.44 },
  { id: 'savings', label: 'Savings', fill: 0.58 },
]

interface TransactionChipProps {
  transaction: Transaction
  index: number
  chipRef: (node: HTMLDivElement | null) => void
}

export function TransactionChip({ transaction, index, chipRef }: TransactionChipProps) {
  const style = {
    '--chaos-x': `${transaction.chaos.x}px`,
    '--chaos-y': `${transaction.chaos.y}px`,
    '--clarity-x': `${transaction.fallbackTarget.x}px`,
    '--clarity-y': `${transaction.fallbackTarget.y}px`,
    '--chip-rotate': `${transaction.chaos.rotate}deg`,
    '--chip-index': index,
  } as CSSProperties

  return (
    <div
      ref={chipRef}
      style={style}
      className={cn(
        'luxa-loader-chip absolute left-1/2 top-[42%] z-20 flex min-w-[112px] items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left shadow-premium backdrop-blur-md will-change-transform',
        'sm:min-w-[136px] sm:px-3.5',
        transaction.tone
      )}
    >
      <span className="text-[11px] font-bold leading-none text-foreground sm:text-xs">
        {transaction.label}
      </span>
      <span className="hidden text-[10px] font-semibold leading-none text-muted-foreground sm:inline">
        {transaction.amount}
      </span>
    </div>
  )
}

interface MiniPocketProps {
  label: string
  fill: number
  pocketRef: (node: HTMLDivElement | null) => void
  fillRef: (node: HTMLDivElement | null) => void
}

export function MiniPocket({ label, fill, pocketRef, fillRef }: MiniPocketProps) {
  const fillStyle = { '--fill-target': fill } as CSSProperties

  return (
    <div
      ref={pocketRef}
      className="luxa-loader-pocket rounded-lg border border-primary/12 bg-background/82 p-3 shadow-[0_10px_28px_-22px_hsl(var(--primary)/0.65)] backdrop-blur-md"
      data-fill={fill}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-foreground">{label}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
        <div
          ref={fillRef}
          style={fillStyle}
          className="luxa-loader-fill h-full w-full origin-left rounded-full bg-primary"
        />
      </div>
    </div>
  )
}

interface LuxaLoaderProps {
  onComplete: () => void
}

export function LuxaLoader({ onComplete }: LuxaLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const stellaRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const sparkleRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<Array<HTMLDivElement | null>>([])
  const pocketRefs = useRef<Array<HTMLDivElement | null>>([])
  const fillRefs = useRef<Array<HTMLDivElement | null>>([])
  const completeRef = useRef(false)

  const handleComplete = useCallback(() => {
    if (completeRef.current) return
    completeRef.current = true
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const stella = stellaRef.current
    const halo = haloRef.current
    const sparkle = sparkleRef.current
    const progress = progressRef.current
    const chips = chipRefs.current.filter(Boolean) as HTMLDivElement[]
    const pocketNodes = pocketRefs.current.filter(Boolean) as HTMLDivElement[]
    const fills = fillRefs.current.filter(Boolean) as HTMLDivElement[]

    if (!root || !stage || !stella || !halo || !sparkle || !progress) {
      handleComplete()
      return
    }

    let exitTimer: number | undefined
    let hardStopTimer: number | undefined

    const complete = () => {
      handleComplete()
    }

    const scheduleExit = (delay: number, duration: number) => {
      exitTimer = window.setTimeout(() => {
        gsap.killTweensOf(root)
        gsap.to(root, {
          autoAlpha: 0,
          y: -12,
          duration,
          ease: EASE.inOut,
          onComplete: complete,
        })
      }, delay)

      hardStopTimer = window.setTimeout(complete, 1950)
    }

    root.classList.add('luxa-loader-js')

    const ctx = gsap.context(() => {
      const reduceMotion = prefersReducedMotion()
      const mobileScale = window.innerWidth < 640 ? 0.62 : 1

      gsap.set(root, { autoAlpha: 1, y: 0 })
      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(sparkle, { autoAlpha: 0, scale: 0.75 })
      gsap.set(fills, { scaleX: 0, transformOrigin: 'left center' })

      if (reduceMotion) {
        gsap.set(chips, { autoAlpha: 0 })
        gsap.set([stella, halo, ...pocketNodes], { autoAlpha: 1, scale: 1, y: 0 })
        gsap.set(fills, { scaleX: 1 })
        gsap.set(progress, { scaleX: 1 })
        scheduleExit(850, 0.22)
        return
      }

      const stageBox = stage.getBoundingClientRect()
      const origin = {
        x: stageBox.left + stageBox.width / 2,
        y: stageBox.top + stageBox.height * 0.42,
      }

      const getPocketTarget = (transaction: Transaction) => {
        const pocketIndex = pockets.findIndex((pocket) => pocket.id === transaction.pocket)
        const pocket = pocketRefs.current[pocketIndex]
        if (!pocket) {
          return {
            x: transaction.chaos.x * mobileScale,
            y: transaction.chaos.y * mobileScale,
          }
        }

        const rect = pocket.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2 - origin.x + transaction.targetOffset.x * mobileScale,
          y: rect.top + rect.height / 2 - origin.y + transaction.targetOffset.y * mobileScale,
        }
      }

      chips.forEach((chip, index) => {
        const transaction = transactions[index]
        gsap.set(chip, {
          autoAlpha: 0,
          xPercent: -50,
          yPercent: -50,
          x: transaction.chaos.x * mobileScale,
          y: transaction.chaos.y * mobileScale,
          rotate: transaction.chaos.rotate,
          scale: 0.96,
          filter: 'blur(3px)',
        })
      })

      gsap.set(stella, { autoAlpha: 0, y: 8, scale: 0.88 })
      gsap.set(halo, { autoAlpha: 0, scale: 0.86 })
      gsap.set(pocketNodes, { autoAlpha: 0, y: 14, scale: 0.97 })

      const stellaFloat = gsap.to(stella, {
        y: -2,
        duration: 0.82,
        ease: EASE.sine,
        yoyo: true,
        repeat: -1,
        paused: true,
      })

      const timeline = gsap.timeline()

      timeline
        .to(
          chips,
          {
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(1.2px)',
            duration: 0.3,
            stagger: 0.035,
            ease: EASE.out,
          },
          0.05
        )
        .to(
          chips,
          {
            y: (index) => transactions[index].chaos.y * mobileScale + (index % 2 === 0 ? -8 : 7),
            duration: 0.42,
            yoyo: true,
            repeat: 1,
            ease: EASE.sine,
          },
          0.16
        )
        .to(
          halo,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.34,
            ease: EASE.out,
          },
          0.32
        )
        .to(
          stella,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            ease: EASE.out,
            onStart: () => stellaFloat.play(),
          },
          0.36
        )
        .to(
          pocketNodes,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            stagger: 0.045,
            ease: EASE.out,
          },
          0.62
        )
        .to(
          chips,
          {
            x: (index) => getPocketTarget(transactions[index]).x,
            y: (index) => getPocketTarget(transactions[index]).y,
            rotate: 0,
            scale: window.innerWidth < 640 ? 0.54 : 0.66,
            autoAlpha: 0.34,
            filter: 'blur(0px)',
            duration: 0.5,
            ease: 'power3.inOut',
          },
          0.72
        )
        .to(
          fills,
          {
            scaleX: (index) => pockets[index].fill,
            duration: 0.34,
            stagger: 0.055,
            ease: EASE.out,
          },
          0.98
        )
        .to(
          progress,
          {
            scaleX: 1,
            duration: 0.42,
            ease: EASE.inOut,
          },
          1.06
        )
        .to(
          sparkle,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.18,
            ease: EASE.out,
          },
          1.3
        )

      scheduleExit(1520, 0.28)
    }, root)

    return () => {
      if (exitTimer) window.clearTimeout(exitTimer)
      if (hardStopTimer) window.clearTimeout(hardStopTimer)
      root.classList.remove('luxa-loader-js')
      ctx.revert()
    }
  }, [handleComplete])

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading Luxa"
      aria-busy="true"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) handleComplete()
      }}
      className="luxa-loader-shell fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background px-5 text-foreground"
      style={{
        background:
          'radial-gradient(circle at 50% 34%, hsl(var(--primary-light) / 0.92), hsl(var(--background)) 58%, hsl(var(--background)) 100%)',
      }}
    >
      <span className="sr-only">Loading Luxa</span>
      <div className="glow-burgundy pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-55" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.025]" />

      <div className="relative z-10 w-full max-w-3xl text-center">
        <div ref={stageRef} className="relative mx-auto h-[340px] w-full max-w-[620px] sm:h-[380px]">
          {transactions.map((transaction, index) => (
            <TransactionChip
              key={transaction.label}
              transaction={transaction}
              index={index}
              chipRef={(node) => {
                chipRefs.current[index] = node
              }}
            />
          ))}

          <div className="absolute left-1/2 top-[38%] z-30 -translate-x-1/2 -translate-y-1/2">
            <div
              ref={haloRef}
              className="luxa-loader-halo glow-burgundy pointer-events-none absolute -inset-8 rounded-full blur-2xl"
            />
            <div
              ref={stellaRef}
              className="luxa-loader-stella relative flex h-24 w-24 items-center justify-center rounded-full border border-primary/10 bg-card/85 shadow-premium backdrop-blur-md sm:h-28 sm:w-28"
            >
              <Image
                src="/mascots/stella-happy.webp"
                alt="Stella organizing your month"
                width={88}
                height={88}
                priority
                className="h-20 w-20 object-contain drop-shadow-[0_12px_26px_rgba(112,0,14,0.22)] sm:h-24 sm:w-24"
              />
              <span
                ref={sparkleRef}
                className="luxa-loader-sparkle absolute -right-1 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-premium"
              >
                <Check className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-12 z-10 grid grid-cols-3 gap-2 sm:bottom-8 sm:gap-3">
            {pockets.map((pocket, index) => (
              <MiniPocket
                key={pocket.id}
                label={pocket.label}
                fill={pocket.fill}
                pocketRef={(node) => {
                  pocketRefs.current[index] = node
                }}
                fillRef={(node) => {
                  fillRefs.current[index] = node
                }}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto -mt-5 max-w-xs sm:-mt-3">
          <p className="mb-3 text-sm font-semibold text-foreground sm:text-base">
            Preparing your clearer month…
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
            <div ref={progressRef} className="luxa-loader-progress h-full w-full origin-left rounded-full bg-primary" />
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-primary/75">
            <Sparkles className="h-3 w-3 text-secondary" />
            <span>Monthly clarity</span>
          </div>
        </div>
      </div>
    </div>
  )
}
