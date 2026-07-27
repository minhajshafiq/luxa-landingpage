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

  useIsomorphicLayoutEffect(() => {
    const ink = inkRef.current
    if (!ink) return

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

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className={cn('relative isolate overflow-x-clip', className)}>
      <Container>
        <div className="luxa-statement">
          <span ref={inkRef} aria-hidden="true" className="luxa-statement-ink" />
          {children}
        </div>
      </Container>
    </div>
  )
}
