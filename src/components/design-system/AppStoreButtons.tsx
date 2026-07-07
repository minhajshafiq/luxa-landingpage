'use client'

import { Apple, Smartphone } from 'lucide-react'
import { AnimatedButton } from '@/components/design-system/AnimatedButton'
import { WaitlistForm } from '@/components/design-system/WaitlistForm'
import { APP_STORE_URL } from '@/constants/site'
import { cn } from '@/lib/utils'

interface AppStoreButtonsProps {
  downloadLabel: string
  androidLabel: string
  className?: string
}

export function AppStoreButtons({
  downloadLabel,
  androidLabel,
  className,
}: AppStoreButtonsProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row items-center gap-3', className)}>
      <AnimatedButton
        asChild
        size="lg"
        className={cn(
          'w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-base font-semibold',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          'shadow-[0_0_32px_-8px_hsl(var(--primary)/0.55)]'
        )}
      >
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
          <Apple className="mr-2 h-5 w-5" />
          {downloadLabel}
        </a>
      </AnimatedButton>

      <WaitlistForm>
        <AnimatedButton
          size="lg"
          variant="outline"
          className={cn(
            'w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-base font-semibold',
            'bg-transparent border border-border text-foreground/90',
            'hover:bg-accent hover:border-primary/40'
          )}
        >
          <Smartphone className="mr-2 h-5 w-5" />
          {androidLabel}
        </AnimatedButton>
      </WaitlistForm>
    </div>
  )
}
