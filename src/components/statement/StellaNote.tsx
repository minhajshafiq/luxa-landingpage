import { cn } from '@/lib/utils'

interface StellaNoteProps {
  children: React.ReactNode
  /** Libellé de la voix. Par défaut « Stella ». */
  who?: string
  className?: string
}

/**
 * L'annotation dans la marge. C'est le contrepoids humain du relevé : sans
 * elle la page devient un document comptable (voir la spec, « Risque assumé »).
 */
export function StellaNote({ children, who = 'Stella', className }: StellaNoteProps) {
  return (
    <aside className={cn('stmt-note', className)}>
      <span className="stmt-note-who font-mono">{who}</span>
      <p className="text-[13.5px] leading-relaxed text-muted-foreground">{children}</p>
    </aside>
  )
}
