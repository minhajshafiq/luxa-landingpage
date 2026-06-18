'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PieChart, PiggyBank, Coins, Languages, Fingerprint, Moon, ArrowRight } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedButton } from '@/components/design-system/AnimatedButton'
import { Container } from '@/components/design-system/Container'
import { SectionTitle } from '@/components/design-system/SectionTitle'
import { FeatureIcon } from '@/components/design-system/FeatureIcon'
import { section } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

gsap.registerPlugin(ScrollTrigger)

export function Features() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const { t } = useTranslation()

  const features = [
    {
      id: 1,
      title: t('features.budgetMethod.title'),
      description: t('features.budgetMethod.description'),
      icon: PieChart,
      color: 'primary' as const,
    },
    {
      id: 2,
      title: t('features.savingsGoals.title'),
      description: t('features.savingsGoals.description'),
      icon: PiggyBank,
      color: 'epargne' as const,
    },
    {
      id: 3,
      title: t('features.multiCurrency.title'),
      description: t('features.multiCurrency.description'),
      icon: Coins,
      color: 'secondary' as const,
    },
    {
      id: 4,
      title: t('features.multiLanguage.title'),
      description: t('features.multiLanguage.description'),
      icon: Languages,
      color: 'besoins' as const,
    },
    {
      id: 5,
      title: t('features.security.title'),
      description: t('features.security.description'),
      icon: Fingerprint,
      color: 'primary' as const,
    },
    {
      id: 6,
      title: t('features.darkMode.title'),
      description: t('features.darkMode.description'),
      icon: Moon,
      color: 'foreground' as const,
    },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return

    const cards = cardsRef.current.filter(Boolean)

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: (index % 3) * 0.1,
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section id="features" className={cn('relative overflow-hidden bg-background', section.padding.combined)}>
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <Container className="relative">
        <SectionTitle
          title={t('features.title') as string}
          subtitle={t('features.subtitle') as string}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
            >
              <Card className="h-full group hover:border-primary/30 transition-all duration-300 border shadow-sm hover:shadow-md">
                <CardHeader className="p-6">
                  <FeatureIcon icon={feature.icon} color={feature.color} className="mb-3" />
                  <CardTitle className="text-lg md:text-xl font-bold text-foreground mb-2">
                    {feature.title as string}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {feature.description as string}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center">
          <AnimatedButton
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold shadow-lg cursor-pointer"
          >
            <a href="#screenshots">
              {t('features.cta') as string}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </AnimatedButton>
        </div>
      </Container>
    </section>
  )
}
