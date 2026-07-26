import { Container } from '@/components/design-system/Container'
import { cn } from '@/lib/utils'

/** Ambient tint behind a section. Never more than one per section. */
export type SectionTone = 'none' | 'primary' | 'stella' | 'gold' | 'epargne'

const toneClass: Record<Exclude<SectionTone, 'none'>, string> = {
  primary: 'glow-primary',
  stella: 'glow-stella',
  gold: 'glow-gold',
  epargne: 'glow-epargne',
}

interface SectionProps {
  id?: string
  children: React.ReactNode
  /** Forwarded to the <section> — GSAP triggers need the element. */
  ref?: React.Ref<HTMLElement>
  /** Ambient glow behind the content. Defaults to none. */
  tone?: SectionTone
  /** Hairline across the top edge — the page's only section separator. */
  divider?: boolean
  /** Extra classes on the <section> (padding overrides, min-height, …). */
  className?: string
  /** Extra classes on the inner Container. */
  containerClassName?: string
}

/**
 * Every section on the page goes through here.
 *
 * The page used to alternate — without any rule — between framed panels
 * (1280px wide, 48px corners, visible border) and full-bleed sections
 * (1440px, no frame). The content edge jumped seven times on the way down,
 * and the hero's panel cropped the product shot. There are no frames now:
 * one content width from top to bottom, over the app's black. Rhythm comes
 * from spacing, a hairline, and a single ambient glow — the same grammar the
 * app uses, where screens are full-bleed and only cards have edges.
 *
 * `overflow-x-clip` (not `hidden`) so the sticky phone in the tour survives.
 */
export function Section({
  id,
  children,
  ref,
  tone = 'none',
  divider = false,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      ref={ref}
      className={cn('relative isolate overflow-x-clip py-24 md:py-32', className)}
    >
      {divider && (
        <div
          aria-hidden="true"
          className="luxa-rule absolute inset-x-0 top-0 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8"
        />
      )}

      {tone !== 'none' && (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[1100px]',
            '-translate-x-1/2 -translate-y-1/2 blur-[90px] opacity-60',
            toneClass[tone]
          )}
        />
      )}

      <Container className={cn('relative', containerClassName)}>{children}</Container>
    </section>
  )
}
