import { Reveal } from '@/components/ui/Reveal'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { BenchRow } from '@/components/BenchRow'
import { BENCHMARK_META, BENCHMARK_ROWS } from '@/lib/benchmark-data'
import { LINKS } from '@/lib/config'

export function Benchmark() {
  return (
    <section id="benchmark" className="relative z-10 py-[88px]">
      <div className="mx-auto max-w-[920px] px-7">
        <Reveal>
          <SectionEyebrow>Benchmark</SectionEyebrow>
          <h2 className="mb-3.5 max-w-[720px] text-[38px] font-semibold leading-[1.08] tracking-h2 text-fg">
            Frontier models <span className="text-indigo">plateau.</span> Helix doesn&rsquo;t.
          </h2>
          <p className="max-w-[580px] text-[16px] font-normal leading-[1.55] text-fg-2">
            10 production revert messages from Base &amp; Ethereum mainnet. Each model
            classifies the failure cause. Then the same set runs through Helix.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-8 overflow-hidden rounded-[12px] border border-border-2 bg-bg shadow-sm shadow-black/[0.04]">
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-bg-muted px-[22px] py-[18px]">
              <span className="text-[14px] font-semibold text-fg">{BENCHMARK_META.title}</span>
              <span className="font-mono text-[11px] text-fg-3">{BENCHMARK_META.subtitle}</span>
            </div>

            <div className="py-1.5">
              {BENCHMARK_ROWS.map((row, i) => (
                <BenchRow key={row.name} {...row} index={i} />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border bg-bg-muted px-[22px] py-[14px] font-mono text-[12px] text-fg-3">
              <span>
                {BENCHMARK_META.foot.text}{' '}
                <code className="rounded-sm border border-indigo/[0.1] bg-indigo-soft px-1.5 py-px font-mono text-[11.5px] text-indigo">
                  {BENCHMARK_META.foot.highlight}
                </code>{' '}
                {BENCHMARK_META.foot.suffix}
              </span>
              <a href={LINKS.methodology} className="text-indigo no-underline hover:underline">
                Read methodology →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
