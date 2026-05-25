'use client'

import { useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { FAQItem } from '@/components/FAQItem'
import { FAQ_ENTRIES } from '@/lib/faq-data'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative z-10 py-[88px]">
      <div className="mx-auto max-w-[920px] px-7">
        <Reveal>
          <SectionEyebrow>Common questions</SectionEyebrow>
        </Reveal>

        <div className="mt-6 border-t border-border">
          {FAQ_ENTRIES.map((entry, i) => (
            <FAQItem
              key={entry.q}
              question={entry.q}
              answer={entry.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
