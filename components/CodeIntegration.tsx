import { Reveal } from '@/components/ui/Reveal'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { INSTALL_COMMAND, NPM_PACKAGE } from '@/lib/config'

type Feature = {
  num: string
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  {
    num: '01',
    title: 'Drop-in for LangChain, Vercel AI, Mastra, custom agents',
    desc: 'No rewrite. Wrap once at the tool boundary.',
  },
  {
    num: '02',
    title: 'EVM, Solana, x402, off-chain APIs',
    desc: 'Chain-agnostic core. Adapters ship as separate packages.',
  },
  {
    num: '03',
    title: 'Self-hosted or managed Repair Graph',
    desc: 'Run on your own infra, or use ours for cross-tenant learning.',
  },
  {
    num: '04',
    title: '~12ms p50 overhead on successful calls',
    desc: 'Failures resolve in 1–3 seconds vs minutes of retry/escalation.',
  },
]

/* Token classes — kept short, used inline below for the wrap() example. */
const kw = 'text-pink-400'
const fn = 'text-amber-300'
const id = 'text-blue-300'
const str = 'text-emerald-300'
const cm = 'italic text-zinc-500'

function CodeBlock() {
  return (
    <div className="overflow-hidden rounded-[11px] border border-code-border bg-code-bg shadow-[0_20px_40px_-20px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2.5 border-b border-code-border bg-white/[0.015] px-4 py-2.5 font-mono text-[11px] text-zinc-500">
        <span className="rounded bg-indigo-500/15 px-2 py-1 text-[10px] font-semibold text-indigo-300">
          TypeScript
        </span>
        <span>agent.ts</span>
      </div>
      <div className="px-[26px] py-[22px] font-mono text-[12.5px] leading-[1.9] text-zinc-300">
        <div>
          <span className={kw}>import</span> {'{ '}
          <span className={fn}>wrap</span>
          {' } '}
          <span className={kw}>from</span>{' '}
          <span className={str}>{`'${NPM_PACKAGE}'`}</span>
        </div>
        <div className="h-[1.9em]" aria-hidden />
        <div className={cm}>// Wrap any async function — payments, API calls, anything.</div>
        <div>
          <span className={kw}>const</span>{' '}
          <span className={id}>safeCall</span> = <span className={fn}>wrap</span>(
          <span className={id}>myFunction</span>, {'{ '}
          <span className={id}>mode</span>: <span className={str}>{`'auto'`}</span>
          {' }'})
        </div>
        <div className="h-[1.9em]" aria-hidden />
        <div className={cm}>// Errors are auto-diagnosed, repaired, and remembered.</div>
        <div>
          <span className={kw}>const</span>{' '}
          <span className={id}>result</span> = <span className={kw}>await</span>{' '}
          <span className={fn}>safeCall</span>(<span className={id}>args</span>)
        </div>
      </div>
    </div>
  )
}

export function CodeIntegration() {
  return (
    <section
      id="code"
      className="relative z-10 border-y border-border bg-bg-muted py-[96px]"
    >
      <div className="mx-auto max-w-container px-7">
        <div className="grid grid-cols-1 items-start gap-8 min-[880px]:grid-cols-[1fr_1.15fr] min-[880px]:gap-14">
          <Reveal>
            <div>
              <SectionEyebrow>Integration</SectionEyebrow>
              <h2 className="mb-3.5 max-w-[720px] text-[38px] font-semibold leading-[1.08] tracking-h2 text-fg">
                Wrap your agent.
                <br />
                <span className="text-indigo">Three lines.</span>
              </h2>
              <p className="max-w-[580px] text-[16px] font-normal leading-[1.55] text-fg-2">
                Helix is an SDK layer, not a platform migration. Your wallet, your chain, your
                tools — unchanged. We sit between the agent and the call.
              </p>

              <div className="mt-8 border-t border-border">
                {FEATURES.map((f) => (
                  <div
                    key={f.num}
                    className="grid grid-cols-[32px_1fr] items-start gap-4 border-b border-border py-[18px] transition-[padding-left] duration-150 hover:pl-1.5"
                  >
                    <span className="mt-0.5 font-mono text-[11px] font-semibold tracking-[0.06em] text-indigo">
                      {f.num}
                    </span>
                    <div>
                      <div className="mb-1 text-[14.5px] font-semibold text-fg">{f.title}</div>
                      <div className="text-[13px] leading-[1.55] text-fg-3">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/*
            Sticky wrapper sits OUTSIDE the Reveal motion.div so the transform
            on the animated element doesn't break `position: sticky`.
          */}
          <div className="min-[880px]:sticky min-[880px]:top-20">
            <Reveal>
              <CodeBlock />
            </Reveal>
            <div className="mt-3 px-1 text-right font-mono text-[11px] text-fg-3">
              <span className="text-fg-4">$</span> {INSTALL_COMMAND}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
