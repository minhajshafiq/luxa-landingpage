'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Container } from '@/components/design-system/Container'
import { SectionTitle } from '@/components/design-system/SectionTitle'
import { section } from '@/lib/design-tokens'
import { fadeInUp, cardSpring, viewport } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function Testimonials() {
  const { t } = useTranslation()

  const testimonialsData = t('testimonials.items') as unknown as Array<{ name: string; role: string; text: string }>
  const stats = t('testimonials.stats') as unknown as Array<{ value: string; label: string }>

  const testimonials = testimonialsData.map((item, index) => ({
    id: index + 1,
    name: item.name,
    role: item.role,
    initials: item.name.split(' ').map((n: string) => n[0]).join(''),
    rating: 5,
    text: item.text,
  }))

  return (
    <section
      id="testimonials"
      className={cn('relative overflow-hidden bg-muted/30', section.padding.combined)}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      <Container className="relative">
        <SectionTitle
          badge={t('testimonials.badge') as string}
          title={t('testimonials.title') as string}
          subtitle={t('testimonials.subtitle') as string}
        />

        {/* Stats Row */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={viewport}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 mb-12 md:mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid - Mobile First */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={viewport}
              transition={{ delay: index * 0.1 }}
              {...cardSpring}
            >
              <Card className="h-full border border-border/50 hover:border-primary/30 transition-all duration-300 bg-card shadow-sm">
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Quote className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 flex-1">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm md:text-base text-foreground truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
