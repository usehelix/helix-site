/*
  PCEC (Perceive, Construct, Evaluate, Commit) — the four-step loop that runs
  on every wrapped tool call. Each step has a tiny code snippet showing the
  shape of its output, rendered in the right-hand column of the row.
*/
export interface CodeLine {
  // key:value form
  key?: string
  value?: string
  // free-form line, e.g. "q > 0.7" or "// Repair Graph query"
  raw?: string
  // trailing italic comment, rendered after key/value or raw
  comment?: string
}

export interface PCECStep {
  num: string
  name: string
  desc: string
  codeLabel: string
  codeLines: CodeLine[]
}

export const PCEC_STEPS: PCECStep[] = [
  {
    num: '01',
    name: 'Perceive',
    desc:
      'Classify what failed. Error code, rate-limit signature, auth expiry, hallucinated endpoint — all mapped to a known failure type.',
    codeLabel: '→ classified output',
    codeLines: [
      { key: 'failure_code', value: '"rate-limited-429"' },
      { key: 'severity', value: '0.6' },
      { key: 'source', value: '"rpc-primary"' },
    ],
  },
  {
    num: '02',
    name: 'Construct',
    desc:
      'Look up the Repair Graph. If we’ve seen this failure before — anywhere in the network — load the known fix as a Repair Pattern.',
    codeLabel: '→ pattern matched',
    codeLines: [
      { raw: '// Repair Graph query' },
      { key: 'match', value: '"rate-limited-429"' },
      { key: 'q', value: '0.94', comment: '(412 wins)' },
      { key: 'fix', value: '"endpoint_fallback + backoff"' },
    ],
  },
  {
    num: '03',
    name: 'Evaluate',
    desc:
      'Score the candidate fix against confidence bounds. Below threshold? Fall back to LLM reasoning. Above? Auto-apply with deterministic params.',
    codeLabel: '→ gate decision',
    codeLines: [
      { raw: 'q > 0.7', comment: '// auto-apply' },
      { key: 'decision', value: '"APPLY"' },
      { key: 'fallback', value: '"none"' },
    ],
  },
  {
    num: '04',
    name: 'Commit',
    desc:
      'Whether it worked or didn’t, the outcome updates the pattern’s score. Cross-tenant. Live. Compounding with every agent that runs.',
    codeLabel: '→ writeback',
    codeLines: [
      { key: 'pattern.q', value: '0.94 → 0.95' },
      { key: 'used_by', value: '413 agents' },
      { key: 'shared', value: '"opt-in tenants"' },
    ],
  },
]
