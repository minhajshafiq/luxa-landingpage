import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  /** Rendered after the title, in lavender — the emotional half of the sentence. */
  titleHighlight?: string
  lead?: string
  centered?: boolean
  className?: string
}

/**
 * Standard section opener: a small starred eyebrow set in mono
 * (Stella's signature), a display headline, and an optional lead.
 */
export function SectionHeading({
  eyebrow,
  title,
  titleHighlight,
  lead,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16 space-y-4 md:space-y-5',
        centered && 'text-center',
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'font-mono text-[11px] md:text-xs font-medium uppercase tracking-[0.22em] text-primary',
            'flex items-center gap-2',
            centered && 'justify-center'
          )}
        >
          <span aria-hidden="true" className="text-stella">✦</span>
          {eyebrow}
        </p>
      )}

      <h2
        className={cn(
          'font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08] text-foreground text-balance',
          centered && 'mx-auto max-w-3xl'
        )}
      >
        {title}
        {titleHighlight && (
          <>
            {' '}
            <span className="text-primary">{titleHighlight}</span>
          </>
        )}
      </h2>

      {lead && (
        <p
          className={cn(
            'text-base md:text-lg text-muted-foreground leading-relaxed text-pretty',
            centered && 'mx-auto max-w-2xl'
          )}
        >
          {lead}
        </p>
      )}
    </div>
  )
}
