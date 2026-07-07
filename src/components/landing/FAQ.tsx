'use client'

import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Container } from '@/components/design-system/Container'
import { SectionHeading } from '@/components/design-system/SectionHeading'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function FAQ() {
  const { t } = useTranslation()
  const faqs = t('faq.items') as unknown as Array<{ question: string; answer: string }>

  return (
    <section id="faq" className="relative isolate overflow-hidden py-24 md:py-32">
      <Container className="relative">
        <div className="mx-auto flex justify-center" data-animate="stella">
          <StellaMascot mood="thinking" size="md" floating />
        </div>

        <SectionHeading
          eyebrow={t('faq.eyebrow') as string}
          title={t('faq.title') as string}
          className="mt-6 mb-10 md:mb-12"
        />

        <div className="mx-auto max-w-3xl" data-animate="card">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {Array.isArray(faqs) &&
              faqs.map((faq, index) => (
                <AccordionItem
                  key={`faq-${index}`}
                  value={`faq-${index}`}
                  className="rounded-2xl border border-border bg-card px-5 transition-colors hover:border-primary/30 md:px-6"
                >
                  <AccordionTrigger className="py-4 text-left text-base font-semibold text-foreground hover:no-underline md:py-5 md:text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            <Link
              href="/contact"
              className="underline decoration-primary/40 underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary"
            >
              {t('faq.subtitle') as string}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
