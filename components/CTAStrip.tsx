import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { LINKS } from '@/lib/config'

export function CTAStrip() {
  return (
    <section
      id="cta"
      className="relative z-10 overflow-hidden border-t border-border bg-gradient-to-b from-bg to-bg-muted py-[104px]"
    >
      {/* Soft indigo ambient glow centered above the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-200px] h-[500px] w-[900px] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[920px] px-7 text-center">
        <Reveal>
          <h2 className="mb-3.5 text-[44px] font-bold leading-[1.1] tracking-[-0.03em] text-fg">
            Stop watching your agents
            <br />
            fail in production.
          </h2>
        </Reveal>
        <Reveal>
          <p className="mx-auto mb-8 max-w-[520px] text-[16px] text-fg-2">
            A small number of design partner slots per quarter. Tell us what your agent does and
            where it breaks.
          </p>
        </Reveal>
        <Reveal>
          <div className="flex flex-wrap justify-center gap-2.5">
            <Button variant="primary" size="lg" href={LINKS.calendly} external>
              Book a demo →
            </Button>
            <Button variant="secondary" size="lg" href={LINKS.docs}>
              Read the docs ↗
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
