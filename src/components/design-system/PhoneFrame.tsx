'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface PhoneFrameProps {
  src?: string
  alt?: string
  className?: string
  priority?: boolean
  sizes?: string
  /**
   * Drift the shot against the scroll. Gives the statement depth: the copy
   * scrolls at page speed while the product sits on a slower plane behind it.
   * Opt-in — the hero's shot is already owned by the scroll dive and must not
   * get a second transform fighting it.
   */
  parallax?: boolean
  /** Custom screen content, rendered instead of an <Image> when provided. */
  children?: React.ReactNode
}

/**
 * The current product shots already include the complete iPhone mockup.
 * Keeping the frame here as a simple intrinsic-ratio wrapper prevents a
 * second bezel/notch from being drawn around those images.
 */
export function PhoneFrame({
  src,
  alt,
  className,
  priority,
  sizes = '(max-width: 768px) 280px, 340px',
  parallax = false,
  children,
}: PhoneFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!parallax) return
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { yPercent: 7, rotate: 0.8 },
        {
          yPercent: -7,
          rotate: -0.8,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )
    }, rootRef)

    return () => ctx.revert()
  }, [parallax])

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative aspect-[1530/3036] w-full drop-shadow-[0_32px_55px_rgba(0,0,0,0.92)]',
        parallax && 'will-change-transform',
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? ''}
          width={1530}
          height={3036}
          priority={priority}
          className="h-full w-full select-none object-contain"
          sizes={sizes}
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden rounded-[2.25rem] bg-black">
          {children}
        </div>
      )}
    </div>
  )
}
