'use client'

import { useRef } from 'react'
import { Container } from '@/components/design-system/Container'
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface StatementProps {
  children: React.ReactNode
  className?: string
}

/**
 * Le conteneur de l'acte I. Il possède le filet vertical continu — une seule
 * ligne du haut au bas du relevé, pas une bordure par entrée. C'est ce qui
 * fait lire la page comme un document plutôt que comme des blocs empilés.
 *
 * Le filet se dessine au scroll. C'était la pièce inerte de la page : une
 * colonne vertébrale qui ne faisait rien. Maintenant elle avance avec la
 * lecture — le relevé s'écrit sous les yeux au lieu d'être déjà imprimé.
 */
export function Statement({ children, className }: StatementProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inkRef = useRef<HTMLSpanElement>(null)
  const pulseRef = useRef<HTMLSpanElement>(null)

  useIsomorphicLayoutEffect(() => {
    const ink = inkRef.current
    if (!ink) return

    // The travelling pulse loops in CSS, but only this component knows how
    // far it has to travel — the statement's own height, which depends on
    // the copy. Hand it over as a custom property and let CSS animate it.
    const sizePulse = () => {
      const pulse = pulseRef.current
      const spine = ink.parentElement
      if (!pulse || !spine) return
      pulse.style.setProperty('--pulse-distance', `${spine.offsetHeight}px`)
    }
    sizePulse()
    const resize = new ResizeObserver(sizePulse)
    if (ink.parentElement) resize.observe(ink.parentElement)

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(ink, { scaleY: 1 })
        return
      }

      // Scrubbed against the whole statement so the ink tracks reading
      // position exactly — scroll back up and it un-draws, which is what
      // makes it read as a position indicator rather than a loading bar.
      gsap.fromTo(
        ink,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 62%',
            end: 'bottom 72%',
            scrub: 0.6,
          },
        }
      )
    }, rootRef)

    return () => {
      resize.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-x-clip', className)}>
      {/* Act I was ~5000px of flat black with nothing moving in it. These two
          drifting washes are the ground: too faint to compete with the text,
          wide enough that the canvas stops reading as dead. */}
      <div
        aria-hidden="true"
        className="glow-primary luxa-drift pointer-events-none absolute left-[-10%] top-[6%] -z-10 h-[900px] w-[75%] opacity-40 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="glow-stella luxa-drift pointer-events-none absolute right-[-12%] top-[52%] -z-10 h-[760px] w-[62%] opacity-30 blur-[110px]"
        style={{ animationDelay: '-14s', animationDuration: '41s' }}
      />

      <Container>
        <div className="luxa-statement">
          <span ref={inkRef} aria-hidden="true" className="luxa-statement-ink" />
          <span ref={pulseRef} aria-hidden="true" className="luxa-statement-pulse" />
          {children}
        </div>
      </Container>
    </div>
  )
}
