'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { buttonSpring } from '@/lib/animations'
import type { ButtonProps } from '@/components/ui/button'

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
}

export function AnimatedButton({ children, className, ...props }: AnimatedButtonProps) {
  return (
    <motion.div
      {...buttonSpring}
      className="inline-block"
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}
