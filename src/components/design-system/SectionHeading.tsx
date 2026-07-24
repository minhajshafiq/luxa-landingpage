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
        'mb-10 md:mb-16 space-y-4 md:space-y-5',
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
          'font-display text-3xl font-semibold tracking-[-0.035em] leading-[1.05] text-foreground text-balance md:text-5xl lg:text-[3.5rem]',
          centered && 'mx-auto max-w-4xl'
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
            'text-base text-muted-foreground leading-relaxed text-pretty md:text-xl',
            centered && 'mx-auto max-w-3xl'
          )}
        >
          {lead}
        </p>
      )}
    </div>
  )
}
