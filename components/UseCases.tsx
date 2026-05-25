import { Reveal } from '@/components/ui/Reveal'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { UseCaseCard } from '@/components/UseCaseCard'

/* Icon strokes — kept inline so the SVGs travel with the data. */
const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

const USE_CASES = [
  {
    icon: (
      <Icon>
        <path d="M4 12h16M4 6h16M4 18h16" />
      </Icon>
    ),
    title: 'Crypto payments & trading',
    desc: 'Recovering from nonce conflicts, gas estimation failures, RPC rate limits, cross-chain message timeouts. Every revert = lost money.',
    tag: 'EVM · Solana · x402',
  },
  {
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3v18" />
      </Icon>
    ),
    title: 'Workflow automation',
    desc: 'API drift, auth expiry, rate limits, schema changes. n8n integration ships first — every node a healing boundary.',
    tag: 'n8n · Zapier-class flows',
  },
  {
    icon: (
      <Icon>
        <path d="M12 2v8M5 12l7 7 7-7" />
      </Icon>
    ),
    title: 'Agent platforms',
    desc: 'Building your own agent product? Helix runs as middleware, not a competitor — your users get reliability, you keep the relationship.',
    tag: 'SDK · self-hosted',
  },
]

export function UseCases() {
  return (
    <section id="use-cases" className="relative z-10 py-[88px]">
      <div className="mx-auto max-w-container px-7">
        <Reveal>
          <SectionEyebrow>Built for</SectionEyebrow>
          <h2 className="mb-3.5 max-w-[720px] text-[38px] font-semibold leading-[1.08] tracking-h2 text-fg">
            Agents that move <span className="text-indigo">real value.</span>
          </h2>
          <p className="max-w-[580px] text-[16px] font-normal leading-[1.55] text-fg-2">
            Helix is built for the failure surface where mistakes cost money or block users — not
            for chat assistants where errors are recoverable by retry.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-[18px]">
            {USE_CASES.map((u) => (
              <UseCaseCard key={u.title} {...u} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
