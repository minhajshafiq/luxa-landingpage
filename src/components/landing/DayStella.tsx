'use client'

import { StatementEntry } from '@/components/statement/StatementEntry'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string }

/**
 * L'inversion : partout ailleurs Stella écrit dans la marge, ici elle est le
 * bloc. Le titre est sa phrase, citée telle quelle.
 */
export function DayStella() {
  const { t } = useTranslation()
  const d = t('month.d17') as unknown as Day

  return (
    <StatementEntry
      id="stella"
      className="stmt-entry--voice"
      stamp={d.stamp}
      amount={d.amount}
      tag={d.tag}
      tone="in"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <StellaMascot mood="thinking" size="md" floating className="shrink-0" />
        <blockquote>
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground text-balance">
            {d.title}
          </h2>
          <p className="mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground md:text-base">
            {d.body}
          </p>
        </blockquote>
      </div>
    </StatementEntry>
  )
}
