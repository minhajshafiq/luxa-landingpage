'use client'

import { useRef } from 'react'
import { StellaNote } from '@/components/statement/StellaNote'
import { gsap, EASE, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

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
 * Découpe un montant de gouttière en préfixe / chiffres / suffixe, pour que
 * seuls les chiffres soient animés. Rend `null` si rien n'est comptable —
 * « 4 pages » compte sur 4, « +18 % » sur 18, « −1 276,00 » sur 1276.
 */
function parseAmount(raw: string) {
  const match = raw.match(/^(\D*?)([\d][\d\s  .,]*)(.*)$/)
  if (!match) return null

  const [, prefix, digits, suffix] = match
  const decimals = /[.,](\d+)$/.exec(digits)?.[1].length ?? 0
  const value = Number(
    digits.replace(/[\s  ]/g, '').replace(',', '.')
  )
  if (!Number.isFinite(value)) return null

  return { prefix, suffix, value, decimals }
}

/**
 * Une entrée du relevé. La gouttière porte de l'information vraie — jamais un
 * numéro d'ordre décoratif. Rien n'est centré : tout est fer à gauche contre
 * le filet, ce qui rend le gabarit générique impossible par construction.
 *
 * Chaque entrée a son propre battement à l'arrivée : le nœud s'allume sur le
 * filet, le montant se compte, et Stella réagit juste après — elle commente
 * ce que tu viens de lire au lieu d'être déjà écrite dans la marge.
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
  const rootRef = useRef<HTMLElement>(null)
  const { language } = useTranslation()

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const node = root.querySelector<HTMLElement>('.stmt-node')
      const amountEl = root.querySelector<HTMLElement>('.stmt-amount')
      const notes = gsap.utils.toArray<HTMLElement>('.stmt-note', root)
      const parsed = amountEl ? parseAmount(amountEl.textContent ?? '') : null
      const original = amountEl?.textContent ?? ''

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        defaults: { ease: EASE.out },
      })

      // The node ignites — the reading position arriving at this line.
      if (node) {
        tl.fromTo(
          node,
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.2)' },
          0
        )
      }

      // The amount settles, the way a total does when a machine finishes it.
      if (amountEl && parsed) {
        const counter = { value: 0 }
        const formatter = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
          minimumFractionDigits: parsed.decimals,
          maximumFractionDigits: parsed.decimals,
        })
        tl.fromTo(
          counter,
          { value: 0 },
          {
            value: parsed.value,
            duration: 0.9,
            onUpdate: () => {
              amountEl.textContent = `${parsed.prefix}${formatter.format(counter.value)}${parsed.suffix}`
            },
            // Restore the authored string exactly: the locale formatter's
            // group separator is a narrow no-break space, which may not be
            // byte-identical to what the copy was written with.
            onComplete: () => {
              amountEl.textContent = original
            },
          },
          0.05
        )
      } else if (amountEl) {
        tl.fromTo(amountEl, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 0.05)
      }

      // Stella answers after the line has landed, not alongside it.
      if (notes.length) {
        tl.fromTo(
          notes,
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.55 },
          0.55
        )
      }
    }, rootRef)

    return () => ctx.revert()
  }, [language])

  return (
    <section ref={rootRef} id={id} className={cn('stmt-entry relative', className)}>
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

        {/* Sous 1280px (xl) la marge n'existe plus : la note revient dans le flux. */}
        {note && <StellaNote className="mt-7 max-w-[46ch] xl:hidden">{note}</StellaNote>}
      </div>

      {/* `self-start` : sans lui l'aside s'étire sur toute la hauteur de la
          rangée de grille et son filet corail court sur 600px à côté de deux
          lignes de texte — une seconde colonne vertébrale qui concurrence le
          filet du relevé. */}
      {note && <StellaNote className="hidden self-start xl:block">{note}</StellaNote>}
    </section>
  )
}
