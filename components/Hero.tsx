import { HeroBadge } from '@/components/HeroBadge'
import { HeroCTA } from '@/components/HeroCTA'
import { HeroInstall } from '@/components/HeroInstall'
import { Terminal } from '@/components/Terminal'
import { Reveal } from '@/components/ui/Reveal'

export function Hero() {
  return (
    <section className="relative z-10 px-7 pb-14 pt-[84px] text-center">
      <div className="mx-auto max-w-[900px]">
        <HeroBadge />

        <Reveal>
          <h1 className="mb-[22px] text-[44px] font-bold leading-[1.02] tracking-h1 text-fg sm:text-[56px] lg:text-[64px]">
            One agent fails.
            <br />
            The next is{' '}
            <span className="relative inline-block text-indigo">
              already immune.
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 -z-10 h-1.5 rounded-[3px] bg-gradient-to-r from-[rgba(99,102,241,0.18)] to-[rgba(99,102,241,0.03)]"
              />
            </span>
          </h1>
        </Reveal>

        <Reveal>
          <p className="mx-auto mb-8 max-w-[560px] text-[18px] font-normal leading-[1.5] text-fg-2">
            Helix turns every agent failure into a shared Repair Pattern. When one agent figures
            out a fix, every other agent on the network inherits it instantly — no LLM call, no
            diagnosis. <strong className="font-semibold text-fg">Fix once. Immune everywhere.</strong>
          </p>
        </Reveal>

        <HeroCTA />
        <HeroInstall />

        <Reveal>
          <Terminal />
        </Reveal>
      </div>
    </section>
  )
}
