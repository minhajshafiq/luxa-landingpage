'use client'

import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Section } from '@/components/design-system/Section'
import { StellaMascot } from '@/components/design-system/StellaMascot'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function FAQ() {
  const { t } = useTranslation()
  const faqs = t('faq.items') as unknown as Array<{ question: string; answer: string }>

  return (
    <Section id="faq" divider>
        {/* La FAQ et la clôture sont les deux moments de fin de la page,
            pas du contenu documentaire : elles se centrent. Les lignes de
            l'accordéon gardent le bord partagé de l'acte II. */}
        <div className="flex justify-center" data-animate="stella">
          <StellaMascot mood="thinking" size="md" floating />
        </div>

        <h2 data-animate="lead" className="mx-auto mt-6 max-w-[18ch] text-center font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground text-balance">
          {t('faq.title') as string}
        </h2>

        {/* Les lignes s'étendent jusqu'au bord du Container comme le reste de
            l'acte II ; c'est la mesure du texte de réponse qui est bridée, pas
            la largeur des lignes. */}
        <div className="mt-10 md:mt-12" data-animate="card">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {Array.isArray(faqs) &&
              faqs.map((faq, index) => (
                <AccordionItem
                  key={`faq-${index}`}
                  value={`faq-${index}`}
                  className="luxa-card luxa-hairline luxa-card-hover overflow-hidden rounded-tile border-b-0 px-5 md:px-6"
                >
                  <AccordionTrigger className="py-4 text-left text-base font-semibold text-foreground hover:no-underline md:py-5 md:text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground md:text-base">
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
    </Section>
  )
}
