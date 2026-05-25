import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { VerifiedResults } from '@/components/VerifiedResults'
import { Benchmark } from '@/components/Benchmark'
import { HowItWorks } from '@/components/HowItWorks'
import { CodeIntegration } from '@/components/CodeIntegration'
import { UseCases } from '@/components/UseCases'
import { FAQ } from '@/components/FAQ'
import { CTAStrip } from '@/components/CTAStrip'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="relative">
        {/* Ambient + grid live inside main so they stay scoped to the hero area */}
        <div className="helix-ambient" />
        <div className="helix-grid" />
        <Hero />
        <VerifiedResults />
        <Benchmark />
        <HowItWorks />
        <CodeIntegration />
        <UseCases />
        <FAQ />
        <CTAStrip />
      </main>
      <Footer />
    </>
  )
}
