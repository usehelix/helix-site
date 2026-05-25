import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { LINKS } from '@/lib/config'

export function HeroCTA() {
  return (
    <Reveal>
      <div className="mb-[22px] flex flex-wrap justify-center gap-2.5">
        <Button variant="indigo" size="lg" href={LINKS.calendly} external>
          Book a demo →
        </Button>
        <Button variant="secondary" size="lg" href="#benchmark">
          See the benchmark ↗
        </Button>
      </div>
    </Reveal>
  )
}
