'use client'

import { StatementClose } from '@/components/statement/StatementClose'
import { useTranslation } from '@/lib/i18n/useTranslation'

/**
 * `page.tsx` is a server component and can't call `useTranslation()` itself.
 * This thin client wrapper reads `close.label` and hands it down to the
 * presentational `StatementClose`.
 */
export function StatementCloseSlot() {
  const { t } = useTranslation()
  const label = t('close.label') as string

  return <StatementClose label={label} />
}
