'use client'

import { Landmark, ShieldCheck, Sparkles, Star, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { useTranslation } from '@/lib/i18n/useTranslation'

type ProofItem = {
  icon: LucideIcon
  label: string
  tone: string
}

export function ProductProof() {
  const { t } = useTranslation()

  const items: ProofItem[] = [
    { icon: Star, label: '5.0 · App Store', tone: 'text-secondary bg-secondary/12' },
    { icon: Sparkles, label: t('hero.trust.free') as string, tone: 'text-primary bg-primary/12' },
    { icon: Landmark, label: t('hero.trust.noBank') as string, tone: 'text-besoins bg-besoins/12' },
    { icon: ShieldCheck, label: t('hero.trust.private') as string, tone: 'text-epargne bg-epargne/12' },
  ]

  return (
    <section className="relative z-20 px-2 py-8 sm:px-3 md:py-12" aria-label={t('hero.badge') as string}>
      <Container>
        <div className="luxa-proof-rail grid grid-cols-2 gap-2 p-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex min-h-20 items-center gap-3 rounded-2xl border border-white/[0.04] bg-background/45 px-4 py-3 backdrop-blur-md transition-colors duration-300 hover:bg-card/80 md:px-5"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.tone}`}>
                  <Icon className="h-4 w-4" fill={item.icon === Star ? 'currentColor' : 'none'} />
                </span>
                <span className="text-sm font-semibold leading-snug text-foreground/90 md:text-[15px]">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
