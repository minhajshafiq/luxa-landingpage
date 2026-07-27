'use client'

import { Star } from 'lucide-react'
import { APP_STORE_RATING, APP_STORE_URL, SHOW_RATING } from '@/constants/site'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

/**
 * The App Store rating, always sourced and always clickable — a score with no
 * review count behind it reads as decoration rather than evidence, which is
 * the opposite of what a money app needs.
 *
 * Renders nothing while SHOW_RATING is off (see site.ts), so every call site
 * can stay in place until the rating is worth showing.
 */
export function RatingBadge({ className, bare }: { className?: string; bare?: boolean }) {
  const { t, language } = useTranslation()

  if (!SHOW_RATING) return null

  const { score, count } = APP_STORE_RATING
  const label = `${score.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
    minimumFractionDigits: 1,
  })} · ${count} ${t('proof.reviews') as string}`

  const content = (
    <>
      <Star className="h-3 w-3 fill-secondary text-secondary" aria-hidden="true" />
      {label}
    </>
  )

  if (bare) {
    return <span className={cn('inline-flex items-center gap-1.5', className)}>{content}</span>
  }

  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'luxa-hairline inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.12em] md:px-4 md:text-xs md:tracking-[0.18em] uppercase text-muted-foreground backdrop-blur-xl transition-colors hover:text-foreground',
        className
      )}
    >
      {content}
    </a>
  )
}
