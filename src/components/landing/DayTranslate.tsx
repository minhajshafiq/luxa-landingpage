'use client'

import { ArrowRight } from 'lucide-react'
import { StatementEntry } from '@/components/statement/StatementEntry'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Day = { stamp: string; amount: string; tag: string; title: string; body: string; note: string }
type Row = { bank: string; luxa: string; tone: 'primary' | 'success' | 'warning' }

const toneText: Record<Row['tone'], string> = {
  primary: 'text-primary',
  success: 'text-epargne',
  warning: 'text-envies',
}

export function DayTranslate() {
  const { t } = useTranslation()
  const d = t('month.d12') as unknown as Day
  const rows = t('difference.rows') as unknown as Row[]

  return (
    <StatementEntry
      stamp={d.stamp}
      amount={d.amount}
      tag={d.tag}
      title={d.title}
      body={d.body}
      note={d.note}
      tone="out"
    >
      <div className="mt-8 space-y-2">
        {Array.isArray(rows) &&
          rows.map((row, index) => (
            <div
              key={index}
              className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4"
            >
              <div className="rounded-tile border border-border/70 bg-[repeating-linear-gradient(135deg,hsl(var(--foreground)/0.02)_0_6px,transparent_6px_12px)] px-4 py-3">
                <p className="truncate font-mono tabular text-xs text-muted-foreground">{row.bank}</p>
              </div>
              <ArrowRight aria-hidden="true" className="hidden h-4 w-4 text-muted-foreground/50 sm:block" />
              <div className="luxa-card luxa-hairline rounded-tile px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  <span className={cn('font-semibold', toneText[row.tone] ?? 'text-primary')}>
                    {row.luxa.split('·')[0]}
                  </span>
                  {row.luxa.includes('·') && (
                    <span className="text-muted-foreground">
                      {' ·'}
                      {row.luxa.split('·').slice(1).join('·')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
      </div>
    </StatementEntry>
  )
}
