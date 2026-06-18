'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { Container } from '@/components/design-system/Container'
import { SectionTitle } from '@/components/design-system/SectionTitle'
import { section } from '@/lib/design-tokens'
import { fadeInUp, viewport } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

const images = [
  '/Group 84-portrait.png',
  '/Group 85-portrait.png',
  '/Group 86-portrait.png',
]

export function Screenshots() {
  const { t } = useTranslation()

  const items = t('screenshots.items') as unknown as Array<{ title: string; description: string; callout: string }>

  return (
    <section id="screenshots" className={cn('bg-muted/30', section.padding.combined)}>
      <Container>
        <SectionTitle
          badge={t('screenshots.badge') as string}
          title={t('screenshots.title') as string}
          subtitle={t('screenshots.subtitle') as string}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-6 max-w-4xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={viewport}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-full max-w-[220px] mx-auto mb-5 transition-transform duration-300 hover:scale-105">
                <Image
                  src={images[index]}
                  alt={item.title}
                  width={280}
                  height={600}
                  className="w-full h-auto drop-shadow-2xl rounded-[2rem]"
                />
                <div className="animate-luxa-float absolute top-6 -right-6 flex items-center gap-1.5 bg-card border border-primary/20 rounded-full shadow-lg px-3 py-1.5">
                  <Sparkles className="w-3 h-3 text-secondary flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
                    {item.callout}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1.5">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
