import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { Button } from '@/components/ui/Button'
import { INSTALL_COMMAND, LINKS, NPM_PACKAGE } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'Get started with Helix. Wrap any async function. PCEC handles classification, repair, and learning across the entire agent network.',
}

/* Same token classes as the homepage CodeIntegration block. */
const kw = 'text-pink-400'
const fn = 'text-amber-300'
const id = 'text-blue-300'
const str = 'text-emerald-300'
const cm = 'italic text-zinc-400'

/* A reusable dark code surface, smaller header than the homepage block. */
function CodeBlock({
  filename,
  language = 'TypeScript',
  children,
}: {
  filename: string
  language?: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[11px] border border-code-border bg-code-bg shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-2.5 border-b border-code-border bg-white/[0.015] px-4 py-2.5 font-mono text-[11px] text-zinc-400">
        <span className="rounded bg-indigo-500/15 px-2 py-1 text-[10px] font-semibold text-indigo-300">
          {language}
        </span>
        <span>{filename}</span>
      </div>
      <div className="px-[26px] py-[22px] font-mono text-[12.5px] leading-[1.9] text-zinc-300">
        {children}
      </div>
    </div>
  )
}

/* Inline `code` chip for the configuration prose. */
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-sm border border-indigo/10 bg-indigo-soft px-1.5 py-px font-mono text-[12.5px] text-indigo">
      {children}
    </code>
  )
}

const ADAPTERS = [
  {
    title: 'EVM',
    chains: 'Base, Ethereum, Arbitrum, Optimism',
    install: 'npm install @helix-agent/adapter-evm',
  },
  {
    title: 'Solana',
    chains: 'RPC + Jupiter aggregator',
    install: 'npm install @helix-agent/adapter-solana',
  },
  {
    title: 'x402',
    chains: 'Coinbase Agent Payments',
    install: 'npm install @helix-agent/adapter-x402',
  },
]

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main className="relative pb-24">
        <div className="mx-auto max-w-[760px] px-7">
          {/* 1. Hero */}
          <section className="pb-14 pt-20">
            <SectionEyebrow>Documentation</SectionEyebrow>
            <h1 className="mb-4 text-[36px] font-bold leading-[1.05] tracking-[-0.03em] text-fg">
              Get started with Helix
            </h1>
            <p className="max-w-[520px] text-[16px] leading-[1.6] text-fg-2">
              Wrap any async function. PCEC handles classification, repair, and learning. The
              Repair Graph remembers — every fix makes the next one faster.
            </p>
          </section>

          {/* 2. Install */}
          <section>
            <h2 className="mb-4 mt-12 text-[22px] font-semibold tracking-[-0.02em] text-fg">
              Install
            </h2>
            <CodeBlock filename="terminal" language="bash">
              <div>
                <span className="text-zinc-400">$</span>{' '}
                <span className="text-zinc-100">{INSTALL_COMMAND}</span>
              </div>
            </CodeBlock>
            <p className="mt-4 text-[13px] text-fg-3">
              Also available: <Code>pip install helix-agent-sdk</Code> (Python), Docker image at{' '}
              <Code>adrianhihi/helix-server</Code>
            </p>
          </section>

          {/* 3. 30-second example */}
          <section>
            <h2 className="mb-4 mt-12 text-[22px] font-semibold tracking-[-0.02em] text-fg">
              30-second example
            </h2>
            <CodeBlock filename="agent.ts">
              <div>
                <span className={kw}>import</span> {'{ '}
                <span className={fn}>wrap</span>
                {' } '}
                <span className={kw}>from</span>{' '}
                <span className={str}>{`'${NPM_PACKAGE}'`}</span>
              </div>
              <div className="h-[1.9em]" aria-hidden />
              <div className={cm}>// Wrap any async function — RPC calls, API requests, anything.</div>
              <div>
                <span className={kw}>const</span>{' '}
                <span className={id}>safeCall</span> = <span className={fn}>wrap</span>(
                <span className={id}>myFunction</span>, {'{ '}
                <span className={id}>mode</span>: <span className={str}>{`'auto'`}</span>
                {' }'})
              </div>
              <div className="h-[1.9em]" aria-hidden />
              <div className={cm}>
                // On failure: PCEC classifies → Repair Graph lookup → applies fix → retries.
              </div>
              <div className={cm}>
                // On success after repair: pattern is committed back to the Repair Graph.
              </div>
              <div>
                <span className={kw}>const</span>{' '}
                <span className={id}>result</span> = <span className={kw}>await</span>{' '}
                <span className={fn}>safeCall</span>(<span className={id}>args</span>)
              </div>
            </CodeBlock>
          </section>

          {/* 4. Configuration */}
          <section className="max-w-[640px]">
            <h2 className="mb-4 mt-12 text-[22px] font-semibold tracking-[-0.02em] text-fg">
              Configuration
            </h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-fg-2">
              <Code>mode: &lsquo;auto&rsquo;</Code> applies repairs above q-value threshold
              automatically. Use <Code>&lsquo;gated&rsquo;</Code> to require human approval for
              low-confidence repairs.
            </p>
            <p className="mb-4 text-[15px] leading-[1.7] text-fg-2">
              <Code>adapter</Code> — optional. Default is HTTP/RPC. Available:{' '}
              <Code>@helix-agent/adapter-evm</Code>, <Code>@helix-agent/adapter-solana</Code>,{' '}
              <Code>@helix-agent/adapter-x402</Code>.
            </p>
            <p className="mb-4 text-[15px] leading-[1.7] text-fg-2">
              <Code>telemetry: false</Code> — disables cross-tenant Repair Graph submission.
              Self-hosted runs locally with full Repair Graph isolation.
            </p>
          </section>

          {/* 5. Adapters */}
          <section>
            <h2 className="mb-4 mt-12 text-[22px] font-semibold tracking-[-0.02em] text-fg">
              Adapters
            </h2>
            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
              {ADAPTERS.map((a) => (
                <div
                  key={a.title}
                  className="rounded-[10px] border border-border bg-bg p-5 transition-colors hover:border-border-3 hover:bg-bg-muted"
                >
                  <div className="mb-1.5 text-[15px] font-semibold text-fg">{a.title}</div>
                  <div className="mb-3 text-[12.5px] leading-[1.55] text-fg-3">{a.chains}</div>
                  <div className="font-mono text-[11px] text-fg-2">{a.install}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. CTA */}
          <section className="mt-20 rounded-[12px] border border-border bg-bg-muted p-8 text-center">
            <p className="mb-5 text-[15.5px] text-fg-2">
              Full API reference and source code on GitHub.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button variant="indigo" size="lg" href={LINKS.github} external>
                View on GitHub →
              </Button>
              <Button variant="secondary" size="lg" href="/">
                Back to home
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
