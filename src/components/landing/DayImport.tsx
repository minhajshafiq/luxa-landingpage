'use client'

import { StatementEntry } from '@/components/statement/StatementEntry'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string; note: string }

/** Le plus court des sept blocs : il porte la crédibilité du « sans connexion
 *  bancaire », pas une fonctionnalité très utilisée. */
export function DayImport() {
  const { t } = useTranslation()
  const d = t('month.d03') as unknown as Day

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
      <div className="mt-7 flex items-center gap-4">
        <StellaMascot mood="reading" size="sm" floating />
        <div className="luxa-card luxa-hairline flex-1 rounded-tile px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            releve-juillet.pdf
          </p>
          <div className="luxa-meter mt-3 text-epargne">
            <div className="luxa-meter-fill" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    </StatementEntry>
  )
}
