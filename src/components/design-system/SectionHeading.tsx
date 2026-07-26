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
      {/* The eyebrow is a chip, not a line of text — same shape language as
          the app's status pills ("70% used · 30 days left"). */}
      {eyebrow && (
        <div className={cn('flex', centered && 'justify-center')}>
          <p className="luxa-hairline inline-flex items-center gap-2 rounded-full bg-primary/[0.07] px-3 py-1.5 font-mono text-[10px] md:text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
            <span aria-hidden="true" className="text-stella">✦</span>
            {eyebrow}
          </p>
        </div>
      )}

      <h2
        className={cn(
          'font-display text-[clamp(1.95rem,4.6vw,3.5rem)] font-semibold tracking-[-0.042em] leading-[1.03] text-foreground text-balance',
          centered && 'mx-auto max-w-4xl'
        )}
      >
        {title}
        {titleHighlight && (
          <>
            {' '}
            <span className="text-primary [text-shadow:0_0_44px_hsl(var(--primary)/0.4)]">
              {titleHighlight}
            </span>
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
