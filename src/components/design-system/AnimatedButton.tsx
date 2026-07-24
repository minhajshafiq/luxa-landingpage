'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { buttonSpring } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { ButtonProps } from '@/components/ui/button'

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
  wrapperClassName?: string
}

export function AnimatedButton({ children, className, wrapperClassName, ...props }: AnimatedButtonProps) {
  return (
    <motion.div
      {...buttonSpring}
      className={cn('inline-block rounded-xl', wrapperClassName)}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}
