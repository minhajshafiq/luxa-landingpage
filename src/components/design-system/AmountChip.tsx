import { cn } from '@/lib/utils'

interface AmountChipProps {
  label: string
  amount: string
  className?: string
  /** Dim the chip (used for the "noise" state in the disperse sequence). */
  muted?: boolean
}

/**
 * A single transaction, the recurring visual atom of the page:
 * label in sans, amount in tabular mono. Positive amounts glow green.
 */
export function AmountChip({ label, amount, className, muted = false }: AmountChipProps) {
  const positive = amount.startsWith('+')

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2 backdrop-blur-md',
        muted
          ? 'border-border/60 bg-card/50'
          : 'border-border bg-card/90 shadow-premium',
        className
      )}
    >
      <span
        className={cn(
          'text-xs font-semibold leading-none',
          muted ? 'text-muted-foreground' : 'text-foreground'
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'font-mono tabular text-xs leading-none',
          positive ? 'text-epargne' : muted ? 'text-muted-foreground/70' : 'text-foreground/70'
        )}
      >
        {amount}
      </span>
    </div>
  )
}
