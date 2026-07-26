'use client'

import { AppleLogo } from '@/components/ui/apple-logo'
import { Section } from '@/components/design-system/Section'
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

/**
 * A receipt, not a SaaS pricing table: a dashed tear between the price and
 * what it buys, features listed as itemized lines — the same mono-ledger
 * grammar as the rest of the page, no checkmark-in-a-circle icons.
 */
function PlanCard({ plan, highlighted }: { plan: Plan; highlighted?: boolean }) {
  return (
    <div
      data-animate="card"
      className={cn(
        'relative flex h-full flex-col rounded-card p-6 sm:p-7 md:p-9',
        highlighted
          ? 'border border-primary/40 bg-gradient-to-br from-primary/[0.14] via-card to-card shadow-[0_0_60px_-30px_hsl(var(--primary)),0_24px_56px_-20px_hsl(0_0%_0%/0.95)]'
          : 'luxa-card luxa-hairline luxa-card-hover'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-semibold text-foreground">{plan.name}</h3>
            {highlighted && plan.badge && (
              <span className="rounded-tag bg-primary/15 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                {plan.badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
        </div>
        {highlighted && <StellaMascot mood="budgeting" size="sm" floating className="-mr-1 -mt-1 shrink-0" />}
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        {/* Display face, not mono — see the note on the subscriptions total. */}
        <span className="font-display tabular text-4xl font-bold tracking-[-0.03em] text-foreground md:text-5xl">
          {plan.price}
        </span>
        <span className="text-sm text-muted-foreground">{plan.period}</span>
      </div>
      {plan.note && <p className="mt-1.5 text-xs text-muted-foreground">{plan.note}</p>}

      {/* The tear between what it costs and what it buys */}
      <div className="mt-7 border-t border-dashed border-border" />

      <ul className="mt-6 space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-baseline gap-3">
            <span
              className={cn(
                'shrink-0 font-mono text-sm',
                highlighted ? 'text-primary' : 'text-epargne'
              )}
              aria-hidden="true"
            >
              +
            </span>
            <span className="text-sm leading-relaxed text-foreground/85">{feature}</span>
          </li>
        ))}
      </ul>

      <AnimatedButton
        asChild
        size="lg"
        variant={highlighted ? 'default' : 'outline'}
        wrapperClassName="mt-auto block w-full pt-8"
        className={cn(
          // h-12 with a 1.25rem radius reproduces the app's 56/24 button ratio.
          'w-full h-12 rounded-button text-base font-semibold',
          highlighted
            ? 'luxa-cta text-primary-foreground'
            : 'luxa-ghost border-0 bg-transparent text-foreground'
        )}
      >
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
          <AppleLogo className="mr-2 h-5 w-5" />
          {plan.cta}
        </a>
      </AnimatedButton>
    </div>
  )
}

export function Pricing() {
  const { t } = useTranslation()
  const free = t('pricing.free') as unknown as Plan
  const plus = t('pricing.plus') as unknown as Plan

  return (
    <Section id="pricing" tone="primary" divider>
      <h2 className="max-w-[18ch] font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground text-balance">
        {t('pricing.title') as string}{' '}
        <span className="text-primary">{t('pricing.titleHighlight') as string}</span>
      </h2>
      <p className="mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground md:text-base">
        {t('pricing.subtitle') as string}
      </p>

      <div className="mt-12 grid max-w-4xl items-stretch gap-6 md:grid-cols-2">
        <PlanCard plan={free} />
        <PlanCard plan={plus} highlighted />
      </div>
    </Section>
  )
}
