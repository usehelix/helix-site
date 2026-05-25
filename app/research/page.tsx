import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { Button } from '@/components/ui/Button'
import { PROOF_GIST } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Reproducible experiments on Base mainnet and frontier LLMs. Every claim on the Helix homepage is backed by public data.',
}

function ProofLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={PROOF_GIST}
      target="_blank"
      rel="noopener"
      className="text-[13px] text-indigo no-underline transition-colors hover:underline"
    >
      {children}
    </a>
  )
}

export default function ResearchPage() {
  return (
    <>
      <Nav />
      <main className="relative pb-24">
        <div className="mx-auto max-w-[760px] px-7">
          {/* 1. Hero */}
          <section className="pb-14 pt-20">
            <SectionEyebrow>Research</SectionEyebrow>
            <h1 className="mb-4 text-[36px] font-bold leading-[1.05] tracking-[-0.03em] text-fg">
              Verified evidence.
            </h1>
            <p className="max-w-[520px] text-[16px] leading-[1.6] text-fg-2">
              Every claim on the homepage is backed by a reproducible experiment. Raw data,
              methodology, and on-chain proofs below.
            </p>
          </section>

          {/* 2. Featured experiments */}
          <section>
            <h2 className="mb-6 text-[22px] font-semibold tracking-[-0.02em] text-fg">
              Featured experiments
            </h2>
            <div className="space-y-6">
            {/* Card 1 — Base mainnet A/B */}
            <article className="rounded-[12px] border border-border bg-bg p-7">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">
                April 2026 · Base mainnet
              </div>
              <h3 className="mb-3 text-[20px] font-semibold tracking-[-0.015em] text-fg">
                Crypto agents · 1,083 transactions · 12 hours
              </h3>
              <div className="mb-5 font-mono text-[12px] text-fg-2">
                <span>81.9% control</span>
                <span className="mx-2 text-fg-4">·</span>
                <span className="text-indigo">99.9% Helix</span>
                <span className="mx-2 text-fg-4">·</span>
                <span>195 reverts prevented</span>
                <span className="mx-2 text-fg-4">·</span>
                <span>100% on-chain</span>
              </div>
              <p className="mb-5 text-[14.5px] leading-[1.6] text-fg-2">
                Paired A/B test on Base mainnet (chain ID 8453). Every failure scenario sent to
                both arms at the same block. Control = blind retry on revert. Helix = PCEC
                pipeline with Repair Graph lookup. Result: 195 reverts prevented over a 12-hour
                window. Every tx hash is verifiable on BaseScan.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <ProofLink>Raw transaction data ↗</ProofLink>
                <ProofLink>Repair strategy breakdown ↗</ProofLink>
                <ProofLink>Methodology ↗</ProofLink>
              </div>
            </article>

            {/* Card 2 — LLM classification benchmark */}
            <article className="rounded-[12px] border border-border bg-bg p-7">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">
                April 2026 · 5 frontier models
              </div>
              <h3 className="mb-3 text-[20px] font-semibold tracking-[-0.015em] text-fg">
                EVM revert classification · 10 failure modes
              </h3>
              <div className="mb-5 font-mono text-[12px] text-fg-2">
                <span>GPT-4o-mini 50%</span>
                <span className="mx-2 text-fg-4">·</span>
                <span>GPT-4o 80%</span>
                <span className="mx-2 text-fg-4">·</span>
                <span>Claude 4.5 Sonnet 90%</span>
                <span className="mx-2 text-fg-4">·</span>
                <span>GPT-5.4-mini 90%</span>
                <span className="mx-2 text-fg-4">·</span>
                <span>GPT-5.4 90%</span>
                <span className="mx-2 text-fg-4">·</span>
                <span className="text-indigo">Helix (PCEC) 100%</span>
              </div>
              <p className="mb-5 text-[14.5px] leading-[1.6] text-fg-2">
                Ten production revert messages from Base and Ethereum mainnet, classified by
                failure cause. All five frontier models failed on the same case: a bare{' '}
                <code className="rounded-sm border border-indigo/10 bg-indigo-soft px-1.5 py-px font-mono text-[12px] text-indigo">
                  execution reverted
                </code>{' '}
                with no reason string. Helix converges to 100% because the Repair Graph remembers
                — model capability is not the ceiling, accumulated repair data is.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <ProofLink>Methodology and N=10 results ↗</ProofLink>
              </div>
            </article>
            </div>
          </section>

          {/* 3. Upcoming */}
          <section className="mt-16 max-w-[640px]">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-fg">
              What&rsquo;s next
            </h2>
            <p className="text-[15px] leading-[1.7] text-fg-2">
              We&rsquo;re writing up two further experiments: (a) Web2 microservices in autonomous
              resolution (91% across 4 production services, zero LLM calls); (b) the PCEC
              architecture as it scales past 500 patterns in the public Repair Graph. Expected Q3
              2026.
            </p>
          </section>

          {/* 4. CTA */}
          <section className="mt-20 rounded-[12px] border border-border bg-bg-muted p-8 text-center">
            <p className="mb-5 text-[15.5px] text-fg-2">
              All raw data and methodology are public. We do not believe in unreproducible claims.
            </p>
            <Button variant="secondary" size="lg" href="/">
              Back to home
            </Button>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
