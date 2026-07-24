'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MessageCircle, Clock, Loader2, Check, AlertCircle, Instagram, Music2 } from 'lucide-react'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { socialLinks } from '@/constants/site'

const socialIcons = { tiktok: Music2, instagram: Instagram } as const

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (error) setError(null)
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      let data
      try {
        data = await response.json()
      } catch {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.')
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Une erreur est survenue. Veuillez réessayer.')
      }

      setIsSubmitting(false)
      setIsSuccess(true)
      setForm(initialForm)
    } catch (err) {
      setIsSubmitting(false)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 sm:px-6 py-24 sm:py-28 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12 md:mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Contactez-nous
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une question, un retour, un bug à signaler ? Notre équipe vous répond sous 48h ouvrées.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
              {/* Form */}
              <Card className="lg:col-span-3 border border-border/50 shadow-sm">
                <CardContent className="p-6 md:p-8">
                  {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-foreground">
                            Nom
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange('name')}
                            placeholder="Votre nom"
                            autoComplete="name"
                            required
                            disabled={isSubmitting}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange('email')}
                            placeholder="vous@exemple.com"
                            autoComplete="email"
                            required
                            disabled={isSubmitting}
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-foreground">
                          Sujet
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange('subject')}
                          placeholder="De quoi voulez-vous parler ?"
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-foreground">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={form.message}
                          onChange={handleChange('message')}
                          placeholder="Votre message..."
                          required
                          disabled={isSubmitting}
                          rows={6}
                        />
                      </div>

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 text-sm text-destructive"
                            role="alert"
                          >
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          'Envoyer le message'
                        )}
                      </Button>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center py-12"
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-epargne/10">
                        <Check className="h-8 w-8 text-epargne" />
                      </div>
                      <p className="text-xl font-bold text-foreground mb-2">Message envoyé !</p>
                      <p className="text-muted-foreground max-w-sm">
                        Merci de nous avoir écrit. Notre équipe vous répondra sous 48h ouvrées.
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Direct contact info */}
              <div className="lg:col-span-2">
                <Card className="border border-border/50 shadow-sm h-full">
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Par email</p>
                        <a
                          href="mailto:contact@getluxa.app"
                          className="text-sm text-primary hover:underline"
                        >
                          contact@getluxa.app
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-epargne/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-epargne" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Temps de réponse</p>
                        <p className="text-sm text-muted-foreground">Sous 48h ouvrées</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground mb-2">Réseaux sociaux</p>
                        <div className="flex gap-2">
                          {socialLinks.map((link) => {
                            const Icon = socialIcons[link.icon as keyof typeof socialIcons]
                            return (
                              <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={link.name}
                                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                              >
                                <Icon className="h-4 w-4" />
                              </a>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
