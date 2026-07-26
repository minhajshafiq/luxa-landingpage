'use client'

import { ArrowUpRight, Landmark, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { AppleLogo } from '@/components/ui/apple-logo'
import { APP_STORE_URL } from '@/constants/site'
import { useTranslation } from '@/lib/i18n/useTranslation'

type ProofItem = {
  icon: LucideIcon
  label: string
  /** Colour + halo for the icon disc. The halo is what lifts it off black. */
  tone: string
}

/**
 * The reassurance rail, right under the hero. Every claim here is checkable —
 * that is the whole point. A star rating used to sit in the first slot; it was
 * a bare score with no review count, which on a money app reads as decoration
 * and costs more trust than it earns. The App Store link took its place: it
 * sends people to the listing where the real numbers live.
 */
export function ProductProof() {
  const { t } = useTranslation()

  const items: ProofItem[] = [
    {
      icon: Sparkles,
      label: t('hero.trust.free') as string,
      tone: 'text-primary bg-primary/12 shadow-[0_0_20px_-6px_hsl(var(--primary)/0.8)]',
    },
    {
      icon: Landmark,
      label: t('hero.trust.noBank') as string,
      tone: 'text-besoins bg-besoins/12 shadow-[0_0_20px_-6px_hsl(var(--besoins)/0.8)]',
    },
    {
      icon: ShieldCheck,
      label: t('hero.trust.private') as string,
      tone: 'text-epargne bg-epargne/12 shadow-[0_0_20px_-6px_hsl(var(--epargne)/0.8)]',
    },
  ]

  // Four standalone tiles. They used to sit inside a rounded rail, which put
  // a 16px box 8px inside a 28px box — a nested-radius mismatch (the inner
  // corner should be outer − padding = 20px) and a visible frame-in-a-frame.
  // Removing the rail removes the problem instead of tuning it.
  const itemClass =
    'luxa-card luxa-hairline luxa-card-hover flex min-h-[72px] items-center gap-3 rounded-tile px-4 py-3 md:px-5'
  const labelClass = 'text-sm font-semibold leading-snug text-foreground/90 md:text-[15px]'

  return (
    <section
      className="relative z-20 py-10 md:py-14"
      aria-label={t('hero.badge') as string}
    >
      <Container>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className={itemClass}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className={labelClass}>{item.label}</span>
              </div>
            )
          })}

          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${itemClass} group cursor-pointer`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/12 text-secondary shadow-[0_0_20px_-6px_hsl(var(--secondary)/0.8)]">
              <AppleLogo className="h-4 w-4" />
            </span>
            <span className={`${labelClass} inline-flex items-center gap-1`}>
              {t('proof.appStore') as string}
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        </div>
      </Container>
    </section>
  )
}
