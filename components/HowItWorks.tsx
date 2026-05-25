import { Reveal } from '@/components/ui/Reveal'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { Step } from '@/components/Step'
import { PCEC_STEPS } from '@/lib/pcec-data'

export function HowItWorks() {
  return (
    <section id="how" className="relative z-10 py-[88px]">
      <div className="mx-auto max-w-container px-7">
        <Reveal>
          <SectionEyebrow>How it works</SectionEyebrow>
          <h2 className="mb-3.5 max-w-[720px] text-[38px] font-semibold leading-[1.08] tracking-h2 text-fg">
            Four steps. Every <span className="text-indigo">tool call.</span>
          </h2>
          <p className="max-w-[580px] text-[16px] font-normal leading-[1.55] text-fg-2">
            PCEC — Perceive, Construct, Evaluate, Commit — sits between your agent and the world.
            Every failure becomes a Repair Pattern. Every pattern makes the next agent smarter.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-10 border-t border-border">
            {PCEC_STEPS.map((step) => (
              <Step key={step.num} {...step} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
