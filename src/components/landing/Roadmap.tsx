'use client'

import { motion } from 'framer-motion'
import { Smartphone, Rocket, Monitor, Users, CheckCircle, Clock, Calendar } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/design-system/Container'
import { SectionTitle } from '@/components/design-system/SectionTitle'
import { section } from '@/lib/design-tokens'
import { fadeInUp, viewport } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

const iconMap = {
  0: Smartphone,
  1: Rocket,
  2: Monitor,
  3: Users,
}

export function Roadmap() {
  const { t } = useTranslation()

  const roadmapData = t('roadmap.items') as unknown as Array<{ title: string; description: string }>

  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30',
      badge: t('roadmap.completed'),
      badgeVariant: 'default' as const,
    },
    current: {
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      badge: t('roadmap.current'),
      badgeVariant: 'secondary' as const,
    },
    upcoming: {
      icon: Calendar,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-border',
      badge: t('roadmap.upcoming'),
      badgeVariant: 'outline' as const,
    },
  }

  const roadmapItems = roadmapData.map((item, index) => ({
    id: `roadmap-${index + 1}`,
    title: item.title,
    description: item.description,
    status: index === 0 ? 'completed' : index === 1 ? 'current' : 'upcoming',
    icon: index,
  }))

  return (
    <section
      id="roadmap"
      className={cn('bg-background', section.padding.combined)}
    >
      <Container>
        <SectionTitle
          badge={t('roadmap.badge') as string}
          title={t('roadmap.title') as string}
          subtitle={t('roadmap.subtitle') as string}
        />

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line - Hidden on mobile */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 hidden sm:block" />

            <div className="space-y-6 md:space-y-8">
              {roadmapItems.map((item, index) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap]
                const status = statusConfig[item.status as keyof typeof statusConfig]
                const StatusIcon = status.icon

                return (
                  <motion.div
                    key={item.id}
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={viewport}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-center"
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0 w-8 h-8 md:w-12 md:h-12 mr-4 md:mr-6 flex items-center justify-center self-center">
                      <div className={cn(
                        'w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center',
                        status.bgColor,
                        'border-2',
                        status.borderColor,
                        'shadow-sm'
                      )}>
                        <StatusIcon className={cn('w-4 h-4 md:w-5 md:h-5', status.color)} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <Card className={cn(
                        'border-2 transition-all duration-300 hover:shadow-md',
                        status.borderColor,
                        'bg-card'
                      )}>
                        <CardHeader className="p-4 md:p-6">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center',
                                status.bgColor
                              )}>
                                <Icon className={cn('w-5 h-5', status.color)} />
                              </div>
                              <CardTitle className="text-base md:text-lg font-bold text-foreground">
                                {item.title}
                              </CardTitle>
                            </div>
                            <Badge variant={status.badgeVariant} className="shrink-0">
                              {status.badge as string}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm md:text-base text-muted-foreground leading-relaxed pl-0 md:pl-13">
                            {item.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
