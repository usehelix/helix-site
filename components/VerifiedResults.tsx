import { Reveal } from '@/components/ui/Reveal'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { StatCluster } from '@/components/StatCluster'
import { ForwardStat } from '@/components/ForwardStat'
import { LINKS } from '@/lib/config'
import type { StatTileProps } from '@/components/StatTile'

const cryptoTiles: StatTileProps[] = [
  {
    value: 99.9,
    suffix: '%',
    label: 'Success rate with Helix',
    detail: 'vs 81.9% with blind retry',
    color: 'indigo',
  },
  {
    value: 195,
    label: 'Reverts prevented',
    detail: 'in a single 12-hour window',
    color: 'indigo',
  },
  {
    value: 1083,
    label: 'Base mainnet transactions',
    detail: 'verifiable on-chain',
    color: 'indigo',
  },
]

const web2Tiles: StatTileProps[] = [
  {
    value: 91,
    suffix: '%',
    label: 'Autonomous resolution',
    detail: 'across 4 production services',
    color: 'green',
  },
  {
    value: '$0',
    label: 'LLM cost per repair',
    detail: 'Repair Graph hits, not inference',
    color: 'green',
  },
  {
    value: '<1',
    suffix: 'ms',
    label: 'Hot-path latency',
    detail: 'when pattern is cached',
    color: 'green',
  },
]

export function VerifiedResults() {
  return (
    <section className="relative z-10 py-16">
      <div className="mx-auto max-w-container px-7">
        <Reveal>
          <SectionEyebrow
            rightSlot={
              <a
                href={LINKS.liveBase}
                className="inline-flex items-center gap-1.5 text-[11.5px] font-medium normal-case tracking-[0.04em] text-fg-3 no-underline transition-colors hover:text-indigo"
              >
                <span className="helix-live-dot" />
                Live on Base mainnet ↗
              </a>
            }
          >
            Verified results
          </SectionEyebrow>
          <h2 className="mb-3.5 max-w-[720px] text-[38px] font-semibold leading-[1.08] tracking-h2 text-fg">
            Real proof. Across <span className="text-indigo">multiple domains.</span>
          </h2>
          <p className="mb-9 max-w-[580px] text-[16px] font-normal leading-[1.55] text-fg-2">
            Verifiable A/B tests on production systems. Crypto agents on Base mainnet. Web2
            microservices in autonomous resolution. Every number is reproducible.
          </p>
        </Reveal>

        <Reveal>
          <StatCluster
            dotColor="indigo"
            label="Crypto agents · Base mainnet A/B test"
            meta={
              <>
                1,083 txns &middot; 12 hours &middot;{' '}
                <a
                  href={LINKS.rawTxData}
                  className="border-b border-border-2 text-fg-3 no-underline transition-colors hover:border-indigo hover:text-indigo"
                >
                  raw tx data ↗
                </a>
              </>
            }
            tiles={cryptoTiles}
          />
        </Reveal>

        <div className="mt-6">
          <Reveal>
            <StatCluster
              dotColor="green"
              label="Web2 agents · production microservices"
              meta={<>4 services &middot; zero LLM calls</>}
              tiles={web2Tiles}
            />
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3.5 md:grid-cols-4">
            <ForwardStat
              num="growing"
              label="Patterns in Repair Graph"
              desc="Cross-tenant repair patterns learned across all deployments."
            />
            <ForwardStat
              num="5"
              live
              label="Active integrations"
              desc="Agent platforms currently building on Helix in private beta."
            />
            <ForwardStat
              num="live"
              label="Failures auto-resolved"
              desc="Production agent calls saved from manual intervention per day."
            />
            <ForwardStat
              num="soon"
              label="Cross-tenant lifts"
              desc="Pattern q-value gains contributed by shared Repair Graph."
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
