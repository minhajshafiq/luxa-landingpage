import { Container } from '@/components/design-system/Container'

/**
 * La césure. Le filet s'arrête net : le mois est fini, ce qui suit relève de
 * la décision, pas de la démonstration.
 */
export function StatementClose({ label }: { label: string }) {
  return (
    <div className="relative py-16 md:py-24">
      <Container>
        <div className="flex items-center gap-5">
          <span className="stmt-close font-mono">{label}</span>
          <span aria-hidden="true" className="luxa-rule h-px flex-1" />
        </div>
      </Container>
    </div>
  )
}
