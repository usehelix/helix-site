import type { ReactNode } from 'react'

/*
  Terminal narrative data. Agent A discovers a 429 fix and writes a Repair Pattern
  to the Repair Graph; Agent B inherits it instantly. The separator fires between
  A's last LEARN line and B's first FAIL line.

  Tailwind colors inside the dark code surface are allowed — the brand rule that
  amber lives only inside the logo and the terminal applies here.
*/
export interface TerminalLine {
  agent: 'a' | 'b'
  tag: 'FAIL' | 'HEAL' | 'DONE' | 'LEARN' | 'MATCH'
  body: ReactNode
  time: string
}

export const TERMINAL_AGENT_A: TerminalLine[] = [
  {
    agent: 'a',
    tag: 'FAIL',
    body: (
      <>
        RPC call &middot;{' '}
        <span className="text-amber-300">429 Too Many Requests</span> from primary endpoint
      </>
    ),
    time: '14:22:01',
  },
  {
    agent: 'a',
    tag: 'HEAL',
    body: (
      <>
        no pattern match &middot;{' '}
        <span className="text-zinc-500">LLM diagnosing failure...</span>
      </>
    ),
    time: '14:22:02',
  },
  {
    agent: 'a',
    tag: 'HEAL',
    body: 'apply fix · switch to fallback endpoint + backoff 1.2s',
    time: '14:22:03',
  },
  {
    agent: 'a',
    tag: 'DONE',
    body: (
      <>
        response <span className="text-blue-300">200 OK</span> &middot; 2.3s end-to-end
      </>
    ),
    time: '14:22:04',
  },
  {
    agent: 'a',
    tag: 'LEARN',
    body: (
      <>
        new pattern <span className="text-amber-300">rate-limited-429</span> → written to Repair Graph
      </>
    ),
    time: '14:22:04',
  },
]

export const TERMINAL_AGENT_B: TerminalLine[] = [
  {
    agent: 'b',
    tag: 'FAIL',
    body: (
      <>
        RPC call &middot;{' '}
        <span className="text-amber-300">429 Too Many Requests</span> from primary endpoint
      </>
    ),
    time: '14:34:11',
  },
  {
    agent: 'b',
    tag: 'MATCH',
    body: (
      <>
        inherited pattern <span className="text-amber-300">rate-limited-429</span> &middot; q=0.94
      </>
    ),
    time: '14:34:11',
  },
  {
    agent: 'b',
    tag: 'DONE',
    body: (
      <>
        response <span className="text-blue-300">200 OK</span> &middot; 0.3s &middot;{' '}
        <span className="text-zinc-500">auto-immune · $0 LLM cost</span>
      </>
    ),
    time: '14:34:11',
  },
]

export const TERMINAL_SEP_TEXT = 'pattern shared across the network'
