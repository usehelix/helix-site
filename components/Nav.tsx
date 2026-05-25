import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { NavMobileSheet } from '@/components/NavMobileSheet'
import { LINKS } from '@/lib/config'

const middleLinks = [
  { href: '#how', label: 'How it works' },
  { href: '#benchmark', label: 'Benchmarks' },
  { href: '#use-cases', label: 'Use cases' },
  { href: LINKS.docs, label: 'Docs' },
  { href: LINKS.research, label: 'Research' },
  { href: LINKS.blog, label: 'Blog' },
]

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-8 px-7 py-[13px]">
        <Link href="/" className="flex items-center gap-2.5 text-fg no-underline">
          <Image src="/logo.png" alt="" width={26} height={26} priority />
          <span className="text-[15px] font-semibold tracking-[-0.015em]">Helix</span>
        </Link>

        <div className="hidden flex-1 items-center gap-7 min-[880px]:flex">
          {middleLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[13.5px] font-medium text-fg-2 no-underline transition-colors hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" href={LINKS.github} external className="hidden min-[880px]:inline-flex">
            GitHub
          </Button>
          <Button variant="primary" size="sm" href={LINKS.calendly} external className="hidden min-[880px]:inline-flex">
            Book a demo →
          </Button>
          <NavMobileSheet />
        </div>
      </div>
    </nav>
  )
}
