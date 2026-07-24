import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { Hero } from "@/components/landing/Hero"
import { ProductProof } from "@/components/landing/ProductProof"
import { Disperse } from "@/components/landing/Disperse"
import { AppTour } from "@/components/landing/AppTour"
import { Stella } from "@/components/landing/Stella"
import { Subscriptions } from "@/components/landing/Subscriptions"
import { Benefits } from "@/components/landing/Benefits"
import { Difference } from "@/components/landing/Difference"
import { Privacy } from "@/components/landing/Privacy"
import { Pricing } from "@/components/landing/Pricing"
import { FAQ } from "@/components/landing/FAQ"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { ScrollAnimations } from "@/components/motion/ScrollAnimations"

/**
 * The page is a journey, not a stack of blocks:
 * night sky (hero) → the problem (money scatters) → the answer (pockets)
 * → the companion (Stella) → the silent leak (subscriptions) → daily life
 * → why not a bank → trust → price → questions → calm.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollAnimations />
      <Header />
      <main className="flex-1">
        <Hero />
        <ProductProof />
        <Disperse />
        <AppTour />
        <Stella />
        <Subscriptions />
        <Benefits />
        <Difference />
        <Privacy />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
