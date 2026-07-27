'use client'

import { StatementEntry } from '@/components/statement/StatementEntry'
import { PhoneFrame } from '@/components/design-system/PhoneFrame'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string; note: string; alt: string }

export function DayRemaining() {
  const { t } = useTranslation()
  const d = t('month.d28') as unknown as Day

  return (
    <StatementEntry
      stamp={d.stamp}
      amount={d.amount}
      tag={d.tag}
      title={d.title}
      body={d.body}
      note={d.note}
      tone="neutral"
    >
      <div className="mt-8 w-[220px]">
        <PhoneFrame
            parallax
          src="/stats.png"
          alt={d.alt}
          sizes="220px"
        />
      </div>
    </StatementEntry>
  )
}
