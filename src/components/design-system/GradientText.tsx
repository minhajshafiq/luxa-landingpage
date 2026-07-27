import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
}

/**
 * The highlighted half of the hero headline. Lavender → Stella's coral →
 * gold, on a track twice the width of the text so the sweep drifts across
 * it forever. It is the only permanently animated text on the page; the
 * `.luxa-gradient-text` rule holds the keyframes and the reduced-motion
 * opt-out (the gradient stays, the drift stops).
 */
export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span className={cn('luxa-gradient-text', className)}>{children}</span>
  )
}
