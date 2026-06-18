import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { Hero } from "@/components/landing/Hero"
import { ProblemPromise } from "@/components/landing/ProblemPromise"
import { Features } from "@/components/landing/Features"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Screenshots } from "@/components/landing/Screenshots"
import { Testimonials } from "@/components/landing/Testimonials"
import { FAQ } from "@/components/landing/FAQ"
import { Roadmap } from "@/components/landing/Roadmap"
import { CTA } from "@/components/landing/CTA"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProblemPromise />
        <Features />
        <HowItWorks />
        <Screenshots />
        <Testimonials />
        <FAQ />
        <Roadmap />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
