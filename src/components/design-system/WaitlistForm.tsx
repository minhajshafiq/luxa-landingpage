'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Check, Loader2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/useTranslation'

interface WaitlistFormProps {
  children: React.ReactNode
}

export function WaitlistForm({ children }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      let data
      try {
        data = await response.json()
      } catch {
        throw new Error(t('androidBeta.errorNetwork') as string)
      }

      if (!response.ok) {
        const errorMessage = data.error || data.details || (t('androidBeta.errorGeneric') as string)
        throw new Error(errorMessage)
      }

      setIsSubmitting(false)
      setIsSuccess(true)
      setError(null)

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setEmail('')
        setIsOpen(false)
        setError(null)
      }, 3000)
    } catch (error) {
      setIsSubmitting(false)
      setError(error instanceof Error ? error.message : (t('androidBeta.errorGeneric') as string))
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) {
      setError(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_36px_-10px_hsl(var(--primary))]">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center font-display text-2xl md:text-3xl font-semibold tracking-tight">
            {isSuccess ? (t('androidBeta.successTitle') as string) : (t('androidBeta.title') as string)}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {isSuccess ? (t('androidBeta.successDescription') as string) : (t('androidBeta.description') as string)}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <form 
            onSubmit={handleSubmit} 
            className="space-y-4 mt-4"
            autoComplete="off"
            noValidate
          >
            <div className="space-y-2">
              <label htmlFor="waitlist-email" className="sr-only">
                {t('androidBeta.emailPlaceholder') as string}
              </label>
              <Input
                id="waitlist-email"
                name="email"
                type="email"
                placeholder={t('androidBeta.emailPlaceholder') as string}
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                required
                disabled={isSubmitting}
                className={cn(
                  'h-12 text-base',
                  error && 'border-destructive focus-visible:ring-destructive'
                )}
                aria-label={t('androidBeta.emailPlaceholder') as string}
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'email-error' : undefined}
              />
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 text-sm text-destructive"
                    id="email-error"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              className={cn(
                'luxa-cta w-full h-12 rounded-button text-base font-semibold',
                'text-primary-foreground'
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('androidBeta.submitting') as string}
                </>
              ) : (
                <>
                  <Smartphone className="mr-2 h-5 w-5" />
                  {t('androidBeta.submit') as string}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              {t('androidBeta.disclaimer') as string}
            </p>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            {/* The page has no light mode — success uses the app's own
                "saved" green (--epargne), not Tailwind's light-mode palette. */}
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-epargne/15">
              <Check className="h-10 w-10 text-epargne" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">
              {t('androidBeta.checkEmail') as string}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              {t('androidBeta.successDescription') as string}
            </p>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
