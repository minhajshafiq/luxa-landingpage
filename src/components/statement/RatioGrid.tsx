import { cn } from '@/lib/utils'

export type RatioSlice = {
  pct: string
  name: string
  detail: string
  /** Classe de couleur du pocket : text-besoins | text-envies | text-epargne */
  tone: string
  /** Remplissage cible de la barre, entre 0 et 1. */
  fill: number
}

interface RatioGridProps {
  slices: [RatioSlice, RatioSlice, RatioSlice]
  className?: string
}

/**
 * Les trois colonnes font 50 %, 30 % et 20 % de la largeur — la proportion
 * n'est pas illustrée, elle est la grille. Seul endroit de la page où ce
 * système apparaît ; imposé partout il deviendrait un carcan.
 *
 * Les classes `.ratio-cell`, `.ratio-fill` et `.ratio-knob` sont les cibles
 * de la chorégraphie de DayIncome — ne pas les renommer sans mettre la
 * timeline à jour.
 */
export function RatioGrid({ slices, className }: RatioGridProps) {
  return (
    <div className={cn('ratio-grid', className)}>
      {slices.map((slice) => (
        <div
          key={slice.name}
          className={cn('ratio-cell', slice.tone)}
          style={{ borderColor: 'currentColor' }}
        >
          <div className={cn('ratio-pct font-mono', slice.tone)}>{slice.pct}</div>
          <p className="mt-2 text-[15px] font-semibold text-foreground">{slice.name}</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{slice.detail}</p>
          <div className={cn('luxa-meter mt-4', slice.tone)}>
            <div className="ratio-fill luxa-meter-fill" style={{ width: 0 }} />
            <span aria-hidden="true" className="ratio-knob luxa-meter-knob" style={{ left: 0, opacity: 0 }} />
          </div>
        </div>
      ))}
    </div>
  )
}
