import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { Button } from '@/components/ui/Button'
import { DocsTOC } from '@/components/docs/DocsTOC'
import { Bash, Code, CodeBlock, JSONBlock, TS } from '@/components/docs/CodeBlock'
import { INSTALL_COMMAND, LINKS } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'Get started with Helix. Wrap any async function. PCEC handles classification, repair, and learning across the entire agent network.',
}

const h2Class = 'mb-3 mt-12 text-[22px] font-semibold tracking-[-0.02em] text-fg'
const h3Class = 'mb-3 mt-8 text-[18px] font-semibold tracking-[-0.015em] text-fg'
const proseClass = 'mb-4 text-[15px] leading-[1.7] text-fg-2'
const sectionClass = 'scroll-mt-20'

const CONFIG_JSON = `{
  "projectName": "my-agent",
  "mode": "auto",                  // "auto" | "gated"
  "maxRetries": 3,
  "timeoutMs": 30000,
  "telemetry": true,               // submit repair patterns to managed Repair Graph
  "repairGraphPath": "./helix-graph.db",
  "adapter": "evm"                 // "evm" | "solana" | "x402" | "http"
}`

const QUICKSTART_TS = `import { wrap } from '@helix-agent/core'

// Wrap any async function — RPC calls, API requests, anything.
const safeCall = wrap(myFunction, { mode: 'auto' })

// On failure: PCEC classifies -> Repair Graph lookup -> applies fix -> retries.
// On success after repair: pattern is committed back to the Repair Graph.
const result = await safeCall(args)`

const WRAP_TS = `import { wrap } from '@helix-agent/core'

const safeCall = wrap(myFunction, { mode: 'auto' })

const result = await safeCall(args)
// Identical signature, identical return type. Your tests don't change.`

const ENGINE_TS = `import { createEngine } from '@helix-agent/core'

const { engine, repairGraph } = createEngine({
  projectName: 'payments-agent',
  repairGraphPath: './repair-graph.db',
})

try {
  await sendPayment(invoice)
} catch (error) {
  const result = await engine.repair(error, {
    agentId: 'payments-agent',
    context: { /* whatever your repair logic needs */ },
  })

  if (result.success) {
    console.log('Repaired via ' + result.winner.strategy + ' in ' + result.totalMs + 'ms')
    await sendPayment(invoice)
  } else {
    notifyOperator(result.failure)
  }
}

// Inspect engine stats
const stats = engine.getStats()
// { repairs: 47, savedRevenue: 12500, immuneHits: 31, patternCount: 12 }`

const PRIMITIVES_TS = `import { perceive, construct, evaluate, commit } from '@helix-agent/core'
import { RepairGraph } from '@helix-agent/core'

const graph = new RepairGraph('./repair-graph.db')

// P — Perceive: classify the failure
const failure = perceive(error, context)
// { code: 'rate-limited-429', category: 'rpc', severity: 0.6, ... }

// Check Repair Graph (immunity)
const known = graph.lookup(failure.code, failure.category)
if (known) {
  // Skip C+E, apply known fix
}

// C — Construct: generate repair candidates
const candidates = construct(failure, graph)

// E — Evaluate: score and rank
const ranked = evaluate(candidates, failure)

// C — Commit: execute the winner
const result = await commit(ranked[0], failure, context)

if (result.success) {
  graph.store({
    failureCode: failure.code,
    category: failure.category,
    strategy: ranked[0].strategy,
    q: 0.7,
  })
}`

const REPAIR_GRAPH_TS = `import { RepairGraph } from '@helix-agent/core'

const graph = new RepairGraph('./repair-graph.db')

// Query
graph.lookup('rate-limited-429', 'rpc')      // -> RepairPattern | null
graph.list()                                  // -> RepairPattern[]
graph.immuneCount()                           // -> number of patterns
graph.getSuccessRate('rate-limited-429', 'endpoint_fallback')  // -> 0.94

// Store
graph.store({
  failureCode: 'rate-limited-429',
  category: 'rpc',
  strategy: 'endpoint_fallback',
  params: { fallback: 'secondary-rpc' },
  q: 0.7,
})

graph.close()`

const TYPES_TS = `// What wrap() returns
type WrappedFunction<T> = (...args: Parameters<T>) => ReturnType<T>

// What engine.repair() returns
interface RepairResult {
  success: boolean
  failure: FailureClassification
  candidates: RepairCandidate[]
  winner: RepairCandidate | null
  pattern: RepairPattern | null
  immune: boolean         // true = Repair Graph hit, instant fix
  totalMs: number
}

interface FailureClassification {
  code: string            // 'rate-limited-429' | 'nonce-conflict' | ...
  category: string        // 'rpc' | 'auth' | 'gas' | ...
  severity: number        // 0–1
  details: string
  timestamp: number
}

interface RepairCandidate {
  id: string
  strategy: string
  description: string
  score: number           // 0–100
  q: number               // from Repair Graph history
}

interface RepairPattern {
  failureCode: string
  category: string
  strategy: string
  params: Record<string, unknown>
  q: number               // Bayesian confidence, 0–1
  usedBy: number          // how many agents have applied this
}`

const CLI_ROWS: Array<{ id?: string; cmd: string; desc: string }> = [
  { id: 'cli-init', cmd: 'npx helix init', desc: 'Interactive setup wizard, generates helix.config.json' },
  { id: 'cli-status', cmd: 'npx helix status', desc: 'Live PCEC event stream (colored P→C→E→C)' },
  { id: 'cli-dash', cmd: 'npx helix dash', desc: 'Start local dashboard server on :7842' },
  { cmd: 'npx helix graph list', desc: 'List all local Repair Patterns' },
  { cmd: 'npx helix graph sync', desc: 'Sync local graph with managed Repair Graph' },
]

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main className="relative pb-24">
        <div className="mx-auto max-w-container px-7">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
            <DocsTOC />

            <article className="max-w-[760px]">
              {/* Hero */}
              <header className="pb-10 pt-20">
                <SectionEyebrow>Documentation</SectionEyebrow>
                <h1 className="mb-4 text-[36px] font-bold leading-[1.05] tracking-[-0.03em] text-fg">
                  Get started with Helix
                </h1>
                <p className="max-w-[520px] text-[16px] leading-[1.6] text-fg-2">
                  Wrap any async function. PCEC handles classification, repair, and learning. The
                  Repair Graph remembers — every fix makes the next one faster.
                </p>
              </header>

              {/* 1. Install */}
              <section id="install" className={sectionClass}>
                <h2 className={h2Class}>Install</h2>
                <CodeBlock language="bash">
                  <Bash>{INSTALL_COMMAND}</Bash>
                </CodeBlock>
                <p className="mt-4 text-[13px] text-fg-3">
                  Also available: <Code>pip install helix-agent-sdk</Code> (Python), Docker image
                  at <Code>adrianhihi/helix-server</Code>.
                </p>
              </section>

              {/* 2. Quickstart */}
              <section id="quickstart" className={sectionClass}>
                <h2 className={h2Class}>Quickstart</h2>
                <p className={proseClass}>30 seconds. One line. Zero config.</p>
                <CodeBlock language="TypeScript" filename="agent.ts">
                  <TS>{QUICKSTART_TS}</TS>
                </CodeBlock>
                <p className="mt-4 text-[13.5px] leading-[1.6] text-fg-3">
                  <Code>wrap()</Code> returns an identical function signature. TypeScript types
                  are preserved. Your tests don&rsquo;t change. Your calling code doesn&rsquo;t change.
                </p>
              </section>

              {/* 3. Configuration */}
              <section id="config" className={sectionClass}>
                <h2 className={h2Class}>Configuration</h2>
                <p className={proseClass}>
                  Optional. <Code>wrap()</Code> works without any config — but here&rsquo;s the full
                  surface:
                </p>
                <CodeBlock language="JSON" filename="helix.config.json">
                  <JSONBlock>{CONFIG_JSON}</JSONBlock>
                </CodeBlock>
                <p className={`${proseClass} mt-5`}>
                  <Code>mode: &lsquo;auto&rsquo;</Code> applies repairs above q-value threshold
                  automatically. Use <Code>&lsquo;gated&rsquo;</Code> to require human approval
                  for low-confidence repairs.
                </p>
                <p className={proseClass}>
                  <Code>telemetry: false</Code> disables cross-tenant Repair Graph submission.
                  Self-hosted runs locally with full isolation.
                </p>
              </section>

              {/* 4. wrap() */}
              <section id="wrap" className={sectionClass}>
                <h2 className={h2Class}>wrap() — zero config</h2>
                <p className={proseClass}>
                  The fastest integration. Wrap any async function — the call site is unchanged.
                </p>
                <CodeBlock language="TypeScript">
                  <TS>{WRAP_TS}</TS>
                </CodeBlock>
              </section>

              {/* 5. createEngine() */}
              <section id="engine" className={sectionClass}>
                <h2 className={h2Class}>createEngine() — manual control</h2>
                <p className={proseClass}>
                  Use this when you want to inspect repair results before retrying, or pass rich
                  context to PCEC.
                </p>
                <CodeBlock language="TypeScript">
                  <TS>{ENGINE_TS}</TS>
                </CodeBlock>
              </section>

              {/* 6. PCEC primitives */}
              <section id="primitives" className={sectionClass}>
                <h2 className={h2Class}>PCEC primitives — full control</h2>
                <p className={proseClass}>
                  Each PCEC step exported individually for maximum flexibility. Build custom
                  repair pipelines or audit trails.
                </p>
                <CodeBlock language="TypeScript">
                  <TS>{PRIMITIVES_TS}</TS>
                </CodeBlock>
              </section>

              {/* 7. Repair Graph API */}
              <section id="repair-graph" className={sectionClass}>
                <h2 className={h2Class}>Repair Graph API</h2>
                <p className={proseClass}>
                  Query, inspect, and store repair patterns directly. SQLite-backed by default;
                  bring your own storage adapter for production.
                </p>
                <CodeBlock language="TypeScript">
                  <TS>{REPAIR_GRAPH_TS}</TS>
                </CodeBlock>
              </section>

              {/* 8. TypeScript types */}
              <section id="types" className={sectionClass}>
                <h2 className={h2Class}>TypeScript types</h2>
                <p className={proseClass}>
                  All public types exported from <Code>@helix-agent/core</Code>.
                </p>
                <CodeBlock language="TypeScript">
                  <TS>{TYPES_TS}</TS>
                </CodeBlock>
              </section>

              {/* 9. Adapters */}
              <section id="adapters" className={sectionClass}>
                <h2 className={h2Class}>Adapters</h2>

                <div id="adapter-evm" className={sectionClass}>
                  <h3 className={h3Class}>EVM</h3>
                  <CodeBlock language="bash">
                    <Bash>npm install @helix-agent/adapter-evm</Bash>
                  </CodeBlock>
                  <p className="mt-4 text-[14.5px] leading-[1.65] text-fg-2">
                    Supports Base, Ethereum, Arbitrum, Optimism. Auto-handles nonce conflicts,
                    gas estimation failures, RPC rate limits, revert classification.
                  </p>
                </div>

                <div id="adapter-solana" className={sectionClass}>
                  <h3 className={h3Class}>Solana</h3>
                  <CodeBlock language="bash">
                    <Bash>npm install @helix-agent/adapter-solana</Bash>
                  </CodeBlock>
                  <p className="mt-4 text-[14.5px] leading-[1.65] text-fg-2">
                    RPC failover, Jupiter aggregator routing on swap failures, blockhash refresh
                    on transaction expiry.
                  </p>
                </div>

                <div id="adapter-x402" className={sectionClass}>
                  <h3 className={h3Class}>x402</h3>
                  <CodeBlock language="bash">
                    <Bash>npm install @helix-agent/adapter-x402</Bash>
                  </CodeBlock>
                  <p className="mt-4 text-[14.5px] leading-[1.65] text-fg-2">
                    Coinbase Agent Payments (x402) integration. Handles payment-insufficient,
                    session expiry, currency mismatch.
                  </p>
                </div>
              </section>

              {/* 10. CLI */}
              <section id="cli" className={sectionClass}>
                <h2 className={h2Class}>CLI</h2>
                <p className={proseClass}>
                  Helix ships a <Code>helix</Code> CLI for local development, telemetry
                  inspection, and Repair Graph management.
                </p>
                <div className="overflow-x-auto rounded-[10px] border border-border">
                  <table className="w-full border-collapse text-[13.5px]">
                    <thead>
                      <tr className="border-b border-border bg-bg-muted text-left">
                        <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-3">
                          Command
                        </th>
                        <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-3">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {CLI_ROWS.map((row, i) => (
                        <tr
                          key={i}
                          id={row.id}
                          className={`scroll-mt-20 border-b border-border last:border-b-0`}
                        >
                          <td className="px-4 py-3 align-top">
                            <code className="font-mono text-[12.5px] text-indigo">{row.cmd}</code>
                          </td>
                          <td className="px-4 py-3 text-fg-2">{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* CTA */}
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
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
