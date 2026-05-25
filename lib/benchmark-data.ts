export type BenchmarkRow = {
  name: string
  score: number
  isHelix: boolean
}

export const BENCHMARK_ROWS: BenchmarkRow[] = [
  { name: 'GPT-4o-mini',       score: 50,  isHelix: false },
  { name: 'GPT-4o',            score: 80,  isHelix: false },
  { name: 'Claude 4.5 Sonnet', score: 90,  isHelix: false },
  { name: 'GPT-5.4-mini',      score: 90,  isHelix: false },
  { name: 'GPT-5.4',           score: 90,  isHelix: false },
  { name: 'Helix (PCEC)',      score: 100, isHelix: true  },
]

export const BENCHMARK_META = {
  title: 'EVM revert classification · 10 failure modes',
  subtitle: 'N=10 · Experiment 7 · Apr 2026',
  foot: {
    text: 'All 5 LLMs failed on the same case:',
    highlight: 'execution reverted',
    suffix: 'with no reason string',
  },
}
