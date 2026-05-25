import type { ReactNode } from 'react'

export interface FAQEntry {
  q: string
  a: ReactNode
}

export const FAQ_ENTRIES: FAQEntry[] = [
  {
    q: 'How is Helix different from try/catch with retry?',
    a: (
      <>
        Retry is stateless and dumb — it tries the same call again with the same parameters.
        Helix classifies what actually failed, looks up a known fix from a cross-tenant memory of
        past failures (the Repair Graph), and applies a different strategy. On simple ETH
        transfers, retry works. On rate-limited RPC endpoints, nonce conflicts, or stale gas
        estimates, retry compounds the error. Our A/B test on Base mainnet shows 81.9% (blind
        retry) vs 99.9% (Helix) over 1,083 transactions.
      </>
    ),
  },
  {
    q: "Won't a better LLM solve this on its own?",
    a: (
      <>
        We tested five frontier models on real EVM revert classification. The best (Claude 4.5
        Sonnet, GPT-5.4) hit 90%. All five failed on the same case — a bare{' '}
        <code>execution reverted</code> with no reason string. Helix&rsquo;s ceiling isn&rsquo;t
        model capability — it&rsquo;s the volume of repair data accumulated across all customers.
        That&rsquo;s why it converges to 100% while frontier models plateau.
      </>
    ),
  },
  {
    q: 'What does the Repair Graph store? Is my agent’s data shared?',
    a: (
      <>
        Repair Patterns store the failure signature (revert hash, error class, parameter bounds)
        and the repair strategy — never your agent&rsquo;s payload, user data, or transaction
        content. Cross-tenant learning is opt-in. Self-hosted deployments keep the Repair Graph
        on your own infrastructure. Schema details in the docs.
      </>
    ),
  },
  {
    q: 'Does Helix work for non-EVM chains? For non-crypto agents?',
    a: (
      <>
        Yes. The PCEC core is chain-agnostic. We ship adapters for EVM (Base, Ethereum,
        Arbitrum), Solana, and x402 today. For non-crypto agents — anything wrapping HTTP/RPC
        calls — the same SDK works. We&rsquo;ve validated 91% autonomous resolution across 4
        production-scale Web2 microservices, with zero LLM calls.
      </>
    ),
  },
  {
    q: "What’s the latency overhead?",
    a: (
      <>
        ~12ms p50 on successful calls (Repair Graph lookup is rejected fast when no pattern
        matches). When a pattern is cached, the hot-path is sub-millisecond. On failures, where
        you&rsquo;d otherwise lose seconds-to-minutes on retry/escalation, Helix typically
        resolves in 1–3 seconds end-to-end.
      </>
    ),
  },
  {
    q: 'Self-hosted or SaaS?',
    a: (
      <>
        Both. The Helix runtime is MIT-licensed and runs on your infra. The managed Repair Graph
        (with cross-tenant learning) is the hosted product. Most enterprise customers run
        self-hosted with optional managed Repair Graph sync.
      </>
    ),
  },
]
