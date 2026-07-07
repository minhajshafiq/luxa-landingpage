'use client'

import { Check, Apple } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { AnimatedButton } from '@/components/design-system/AnimatedButton'
import { APP_STORE_URL } from '@/constants/site'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

type Plan = {
  name: string
  badge?: string
  price: string
  period: string
  note?: string
  tagline: string
  features: string[]
  cta: string
}

function PlanCard({ plan, highlighted }: { plan: Plan; highlighted?: boolean }) {
  return (
    <div
      data-animate="card"
      className={cn(
        'relative flex h-full flex-col rounded-3xl border p-7 md:p-8',
        highlighted
          ? 'border-primary/40 bg-gradient-to-b from-primary/12 to-card shadow-premium-hover'
          : 'border-border bg-card shadow-premium'
      )}
    >
      {highlighted && plan.badge && (
        <span className="absolute -top-3.5 left-7 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
          <span aria-hidden="true">✦</span>
          {plan.badge}
        </span>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">{plan.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
        </div>
        {highlighted && (
          <StellaMascot mood="budgeting" size="sm" floating className="-mr-2 -mt-3" />
        )}
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-mono tabular text-4xl font-bold text-foreground md:text-5xl">
          {plan.price}
        </span>
        <span className="text-sm text-muted-foreground">{plan.period}</span>
      </div>
      {plan.note && <p className="mt-1.5 text-xs text-muted-foreground">{plan.note}</p>}

      <ul className="mt-7 flex-1 space-y-3.5">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                highlighted ? 'bg-primary/20 text-primary' : 'bg-epargne/15 text-epargne'
              )}
            >
              <Check className="h-3 w-3" />
            </span>
            <span className="text-sm leading-relaxed text-foreground/85">{feature}</span>
          </li>
        ))}
      </ul>

      <AnimatedButton
        asChild
        size="lg"
        variant={highlighted ? 'default' : 'outline'}
        className={cn(
          'mt-8 w-full h-12 text-base font-semibold',
          highlighted
            ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_28px_-8px_hsl(var(--primary)/0.55)]'
            : 'bg-transparent border border-border text-foreground hover:bg-accent hover:border-primary/40'
        )}
      >
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
          <Apple className="mr-2 h-5 w-5" />
          {plan.cta}
        </a>
      </AnimatedButton>
    </div>
  )
}

export function Pricing() {
  const { t } = useTranslation()
  const free = t('pricing.free') as unknown as Plan
  const pro = t('pricing.pro') as unknown as Plan

  return (
    <section id="pricing" className="relative isolate overflow-hidden py-24 md:py-32">
      <div className="glow-primary animate-glow-breathe pointer-events-none absolute left-1/2 top-16 h-96 w-[760px] -translate-x-1/2 blur-[80px] opacity-40" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t('pricing.eyebrow') as string}
          title={t('pricing.title') as string}
          titleHighlight={t('pricing.titleHighlight') as string}
          lead={t('pricing.subtitle') as string}
        />

        <div className="mx-auto grid max-w-4xl items-stretch gap-6 md:grid-cols-2">
          <PlanCard plan={free} />
          <PlanCard plan={pro} highlighted />
        </div>
      </Container>
    </section>
  )
}
