import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Stella is Luxa's emotional thread. Each mood maps to a real expression
 * asset — use the one that matches the moment, never decoration for its
 * own sake. Assets live in /public/mascot.
 */
export type StellaMood =
  | 'happy'      // sparkles & coins — greeting, celebration
  | 'budgeting'  // holding a money bag — pockets, pricing
  | 'thinking'   // question marks — FAQ, curiosity
  | 'reading'    // magnifier & PDF — statement import, analysis
  | 'surprised'  // wide-eyed — the subscriptions reveal
  | 'sleepy'     // asleep on the moon — calm, the final CTA
  | 'love'       // hugging a heart — privacy, trust
  | 'angry'      // pouting — over-budget alerts
  | 'sad'        // crying — the "before Luxa" feeling

type StellaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const stellaMoods: Record<StellaMood, string> = {
  happy: '/mascot/happyluxa.webp',
  budgeting: '/mascot/budgetingluxa.webp',
  thinking: '/mascot/questionmarkluxa.webp',
  reading: '/mascot/pdfreaderluxa.webp',
  surprised: '/mascot/chockedluxa.webp',
  sleepy: '/mascot/sleepyluxa.webp',
  love: '/mascot/heartluxa.webp',
  angry: '/mascot/angryluxa.webp',
  sad: '/mascot/cryluxa.webp',
}

const moodAlt: Record<StellaMood, string> = {
  happy: 'Stella, the little star of Luxa, celebrating',
  budgeting: 'Stella holding a bag of savings',
  thinking: 'Stella wondering, surrounded by question marks',
  reading: 'Stella reading a bank statement with a magnifier',
  surprised: 'Stella surprised by the total of subscriptions',
  sleepy: 'Stella asleep on a crescent moon, at peace',
  love: 'Stella hugging a heart',
  angry: 'Stella pouting at an over-budget pocket',
  sad: 'Stella sad about a messy month',
}

// Rendered pixel box per size (keeps intrinsic ratio, avoids layout shift).
const sizePx: Record<StellaSize, number> = {
  xs: 48,
  sm: 72,
  md: 112,
  lg: 168,
  xl: 240,
}

const sizeClasses: Record<StellaSize, string> = {
  xs: 'w-12 h-12',
  sm: 'w-16 h-16 sm:w-[72px] sm:h-[72px]',
  md: 'w-24 h-24 md:w-28 md:h-28',
  lg: 'w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44',
  xl: 'w-44 h-44 md:w-56 md:h-56 lg:w-60 lg:h-60',
}

interface StellaMascotProps {
  mood: StellaMood
  size?: StellaSize
  floating?: boolean
  priority?: boolean
  className?: string
  /** Override the default alt text if a more specific one fits the context. */
  alt?: string
}

export function StellaMascot({
  mood,
  size = 'md',
  floating = false,
  priority = false,
  className,
  alt,
}: StellaMascotProps) {
  const src = stellaMoods[mood]
  if (!src) return null

  const px = sizePx[size]

  return (
    <div
      className={cn(
        'relative select-none pointer-events-none',
        sizeClasses[size],
        floating && 'animate-stella-float',
        className
      )}
    >
      <Image
        src={src}
        alt={alt ?? moodAlt[mood]}
        width={px}
        height={px}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        className="h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(246,112,98,0.25)]"
        sizes={`${px}px`}
      />
    </div>
  )
}
