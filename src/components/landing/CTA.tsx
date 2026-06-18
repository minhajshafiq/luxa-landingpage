'use client'

import { motion } from 'framer-motion'
import { Rocket, Star, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { WaitlistForm } from '@/components/design-system/WaitlistForm'
import { AnimatedButton } from '@/components/design-system/AnimatedButton'
import { Container } from '@/components/design-system/Container'
import { section, typography } from '@/lib/design-tokens'
import { fadeInUp, viewport } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function CTA() {
  const { t } = useTranslation()
  return (
    <section
      className={cn(
        'bg-primary text-primary-foreground relative overflow-hidden',
        section.padding.combined
      )}
    >
      <Container className="relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={viewport}
          className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={viewport}
            className="flex justify-center"
          >
            <Badge
              variant="secondary"
              className="bg-white dark:bg-white/95 text-primary dark:text-primary border-white/20 dark:border-white/30 px-4 md:px-6 py-2 text-xs md:text-sm font-medium shadow-lg backdrop-blur-sm"
            >
              <Star className="h-3 w-3 md:h-4 md:w-4 mr-2 fill-primary text-primary" />
              {t('cta.badge') as string}
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={viewport}
            transition={{ delay: 0.1 }}
            className={cn(
              typography.h1.combined,
              'font-bold leading-tight tracking-tight text-white'
            )}
          >
            {t('cta.title') as string}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={viewport}
            transition={{ delay: 0.2 }}
            className={cn(
              typography.bodyLg.combined,
              'text-white max-w-3xl mx-auto leading-relaxed'
            )}
          >
            {t('cta.subtitle') as string}
          </motion.p>

          {/* CTA Buttons - Mobile First */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={viewport}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4"
          >
            <WaitlistForm>
              <AnimatedButton
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/95 px-6 md:px-8 py-4 md:py-5 text-base md:text-lg font-semibold shadow-xl w-full sm:w-auto cursor-pointer"
              >
                <Rocket className="h-5 w-5 mr-2" />
                {t('cta.joinWaitlist') as string}
              </AnimatedButton>
            </WaitlistForm>

            <AnimatedButton
              asChild
              size="lg"
              variant="secondary"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 md:px-8 py-4 md:py-5 text-base md:text-lg font-semibold w-full sm:w-auto cursor-pointer"
            >
              <a href="#screenshots">
                <Play className="h-5 w-5 mr-2" />
                {t('cta.watchDemo') as string}
              </a>
            </AnimatedButton>
          </motion.div>

          {/* Trust Indicators - Mobile First */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={viewport}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm md:text-base text-white font-medium pt-4 md:pt-6"
          >
            <span>{t('cta.freeToStart') as string}</span>
            <span className="text-white/50">•</span>
            <span>{t('cta.realTimeTracking') as string}</span>
            <span className="text-white/50">•</span>
            <span>{t('cta.guaranteedSavings') as string}</span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
