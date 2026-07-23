import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const content = (
  <>
    <Star className="h-3 w-3 fill-secondary text-secondary" />
    5.0 · App Store
  </>
)

/**
 * Static App Store rating — a known fact, not data that needs fetching.
 * `bare` drops the pill chrome so it can sit inside another badge instead
 * of stacking a second pill next to it.
 */
export function RatingBadge({ className, bare }: { className?: string; bare?: boolean }) {
  if (bare) {
    return <span className={cn('inline-flex items-center gap-1.5', className)}>{content}</span>
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/70 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.12em] md:px-4 md:text-xs md:tracking-[0.18em] uppercase text-muted-foreground backdrop-blur',
        className
      )}
    >
      {content}
    </span>
  )
}
