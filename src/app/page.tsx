import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { Hero } from "@/components/landing/Hero"
import { Statement } from "@/components/statement/Statement"
import { StatementCloseSlot } from "@/components/statement/StatementCloseSlot"
import { DayIncome } from "@/components/landing/DayIncome"
import { DayImport } from "@/components/landing/DayImport"
import { DaySubscriptions } from "@/components/landing/DaySubscriptions"
import { DayTranslate } from "@/components/landing/DayTranslate"
import { DayStella } from "@/components/landing/DayStella"
import { DayRemaining } from "@/components/landing/DayRemaining"
import { DayClose } from "@/components/landing/DayClose"
import { Trust } from "@/components/landing/Trust"
import { Pricing } from "@/components/landing/Pricing"
import { FAQ } from "@/components/landing/FAQ"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { ScrollAnimations } from "@/components/motion/ScrollAnimations"

/**
 * Deux actes. L'acte I est un relevé qu'on lit du 1er au 31, annoté par Stella
 * dans la marge — il démontre le produit. La césure arrête le filet. L'acte II
 * traite la décision : confiance, prix, objections, téléchargement.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollAnimations />
      <Header />
      <main className="flex-1">
        <Hero />

        <Statement>
          <DayIncome />
          <DayImport />
          <DaySubscriptions />
          <DayTranslate />
          <DayStella />
          <DayRemaining />
          <DayClose />
        </Statement>

        <StatementCloseSlot />

        <Trust />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
