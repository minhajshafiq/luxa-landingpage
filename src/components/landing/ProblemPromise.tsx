'use client'

import { motion } from 'framer-motion'
import { HelpCircle, PiggyBank, HeartCrack, ArrowDown, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Container } from '@/components/design-system/Container'
import { SectionTitle } from '@/components/design-system/SectionTitle'
import { section } from '@/lib/design-tokens'
import { fadeInUp, viewport } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

const icons = [HelpCircle, PiggyBank, HeartCrack]

export function ProblemPromise() {
  const { t } = useTranslation()

  const items = t('problem.items') as unknown as Array<{
    title: string
    pain: string
    solution: string
  }>

  return (
    <section className={cn('relative overflow-hidden bg-muted/30', section.padding.combined)}>
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      <Container className="relative">
        <SectionTitle
          badge={t('problem.badge') as string}
          title={t('problem.title') as string}
          subtitle={t('problem.subtitle') as string}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, index) => {
            const Icon = icons[index]
            return (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={viewport}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border border-border/50 bg-card shadow-sm overflow-hidden">
                  <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    {/* Pain */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {item.pain}
                    </p>

                    {/* Arrow */}
                    <div className="flex justify-center my-4">
                      <ArrowDown className="w-5 h-5 text-primary" />
                    </div>

                    {/* Solution */}
                    <div className="flex items-start gap-3 mt-auto pt-4 border-t border-primary/15">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm md:text-base text-foreground leading-relaxed font-medium">
                        {item.solution}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
