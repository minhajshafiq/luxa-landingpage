import { Container } from '@/components/design-system/Container'
import { cn } from '@/lib/utils'

interface StatementProps {
  children: React.ReactNode
  className?: string
}

/**
 * Le conteneur de l'acte I. Il possède le filet vertical continu — une seule
 * ligne du haut au bas du relevé, pas une bordure par entrée. C'est ce qui
 * fait lire la page comme un document plutôt que comme des blocs empilés.
 */
export function Statement({ children, className }: StatementProps) {
  return (
    <div className={cn('relative isolate overflow-x-clip', className)}>
      <Container>
        <div className="luxa-statement">{children}</div>
      </Container>
    </div>
  )
}
