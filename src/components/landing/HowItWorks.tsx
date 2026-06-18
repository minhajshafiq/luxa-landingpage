'use client'

import { motion } from 'framer-motion'
import { UserPlus, LayoutDashboard, Target } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionTitle } from '@/components/design-system/SectionTitle'
import { section } from '@/lib/design-tokens'
import { fadeInUp, viewport } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

const icons = [UserPlus, LayoutDashboard, Target]

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = t('howItWorks.steps') as unknown as Array<{ title: string; description: string }>

  return (
    <section id="how-it-works" className={cn('bg-background', section.padding.combined)}>
      <Container>
        <SectionTitle
          badge={t('howItWorks.badge') as string}
          title={t('howItWorks.title') as string}
          subtitle={t('howItWorks.subtitle') as string}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line - desktop only */}
          <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((step, index) => {
              const Icon = icons[index]
              return (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={viewport}
                  transition={{ delay: index * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 mb-5">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center shadow">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
