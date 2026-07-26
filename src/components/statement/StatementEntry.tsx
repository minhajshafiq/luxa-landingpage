import { StellaNote } from '@/components/statement/StellaNote'
import { cn } from '@/lib/utils'

export type EntryTone = 'out' | 'in' | 'neutral'

interface StatementEntryProps {
  /** Date affichée dans la gouttière, ex. « 08 juil. ». */
  stamp: string
  /** Montant de la gouttière. Doit être vrai pour ce bloc. */
  amount: string
  /** Micro-libellé sous le montant, ex. « prélèvements ». */
  tag: string
  title?: string
  body?: string
  tone?: EntryTone
  /** Annotation de Stella pour la marge. */
  note?: string
  /** Contenu riche sous le corps de texte. */
  children?: React.ReactNode
  id?: string
  className?: string
}

/**
 * Une entrée du relevé. La gouttière porte de l'information vraie — jamais un
 * numéro d'ordre décoratif. Rien n'est centré : tout est fer à gauche contre
 * le filet, ce qui rend le gabarit générique impossible par construction.
 */
export function StatementEntry({
  stamp,
  amount,
  tag,
  title,
  body,
  tone = 'neutral',
  note,
  children,
  id,
  className,
}: StatementEntryProps) {
  return (
    <section id={id} className={cn('stmt-entry relative', className)}>
      <span aria-hidden="true" className="stmt-node" />

      <div className="stmt-gutter font-mono">
        <div className="stmt-stamp">{stamp}</div>
        <div className="stmt-amount" data-tone={tone}>
          {amount}
        </div>
        <div className="stmt-tag">{tag}</div>
      </div>

      <div className="min-w-0">
        {title && (
          <h2 className="max-w-[19ch] font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground text-balance md:max-w-[24ch]">
            {title}
          </h2>
        )}
        {body && (
          <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-muted-foreground md:text-base">
            {body}
          </p>
        )}
        {children}

        {/* Sous 1100px la marge n'existe plus : la note revient dans le flux. */}
        {note && <StellaNote className="mt-7 max-w-[46ch] xl:hidden">{note}</StellaNote>}
      </div>

      {note && <StellaNote className="hidden xl:block">{note}</StellaNote>}
    </section>
  )
}
