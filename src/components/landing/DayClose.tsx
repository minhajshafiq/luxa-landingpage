'use client'

import { StatementEntry } from '@/components/statement/StatementEntry'
import { AppStoreButtons } from '@/components/design-system/AppStoreButtons'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string }

/** Le soulagement, et le premier CTA naturel de la page. */
export function DayClose() {
  const { t } = useTranslation()
  const d = t('month.d31') as unknown as Day

  return (
    <StatementEntry
      stamp={d.stamp}
      amount={d.amount}
      tag={d.tag}
      title={d.title}
      body={d.body}
      tone="in"
    >
      <div className="mt-8">
        <AppStoreButtons
          downloadLabel={t('hero.ctaDownload') as string}
          androidLabel={t('hero.ctaAndroidBeta') as string}
          className="!justify-start"
        />
      </div>
    </StatementEntry>
  )
}
