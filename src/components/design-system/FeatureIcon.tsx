'use client'

import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type FeatureIconColor = 'primary' | 'epargne' | 'secondary' | 'besoins' | 'foreground'

interface FeatureIconProps {
  icon: LucideIcon
  className?: string
  size?: 'sm' | 'md' | 'lg'
  color?: FeatureIconColor
}

const sizeClasses = {
  sm: {
    wrapper: 'w-10 h-10',
    icon: 'w-5 h-5',
  },
  md: {
    wrapper: 'w-12 h-12',
    icon: 'w-6 h-6',
  },
  lg: {
    wrapper: 'w-14 h-14',
    icon: 'w-7 h-7',
  },
}

const colorClasses: Record<FeatureIconColor, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  epargne: { bg: 'bg-epargne/10', text: 'text-epargne' },
  secondary: { bg: 'bg-secondary/15', text: 'text-secondary' },
  besoins: { bg: 'bg-besoins/10', text: 'text-besoins' },
  foreground: { bg: 'bg-foreground/10', text: 'text-foreground' },
}

export function FeatureIcon({ icon: Icon, className, size = 'md', color = 'primary' }: FeatureIconProps) {
  const sizes = sizeClasses[size]
  const colors = colorClasses[color]

  return (
    <div
      className={cn(
        sizes.wrapper,
        colors.bg,
        'rounded-xl flex items-center justify-center',
        'transition-transform duration-300 group-hover:scale-110',
        className
      )}
    >
      <Icon className={cn(sizes.icon, colors.text)} />
    </div>
  )
}
