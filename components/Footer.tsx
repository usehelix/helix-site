import Image from 'next/image'
import Link from 'next/link'
import { LINKS } from '@/lib/config'

type FooterLink = { label: string; href: string; external?: boolean }

const product: FooterLink[] = [
  { label: 'How it works', href: '#how' },
  { label: 'Benchmarks', href: '#benchmark' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'Changelog', href: LINKS.changelog, external: true },
]

const resources: FooterLink[] = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Research', href: '/research' },
  { label: 'GitHub', href: LINKS.github, external: true },
]

const ColHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-3">
    {children}
  </div>
)

const Anchor = ({ link }: { link: FooterLink }) => (
  <a
    href={link.href}
    target={link.external ? '_blank' : undefined}
    rel={link.external ? 'noopener' : undefined}
    className="block py-1 text-[13.5px] text-fg-2 no-underline transition-colors duration-150 hover:text-indigo"
  >
    {link.label}
  </a>
)

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg pb-8 pt-14">
      <div className="mx-auto max-w-container px-7">
        <div className="mb-10 grid grid-cols-2 gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 text-fg no-underline">
              <Image src="/logo.png" alt="" width={26} height={26} />
              <span className="text-[15px] font-semibold tracking-[-0.015em]">Helix</span>
            </Link>
            <p className="mt-3.5 max-w-[280px] text-[13.5px] leading-[1.55] text-fg-3">
              The self-healing layer for AI agents.
            </p>
          </div>

          <div>
            <ColHeader>Product</ColHeader>
            {product.map((l) => (
              <Anchor key={l.label} link={l} />
            ))}
          </div>

          <div>
            <ColHeader>Resources</ColHeader>
            {resources.map((l) => (
              <Anchor key={l.label} link={l} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 border-t border-border pt-6 font-mono text-[12px] text-fg-3">
          <span>© 2026 Helix Labs, Inc.</span>
          <span className="flex gap-5">
            <a
              href={LINKS.calendly}
              target="_blank"
              rel="noopener"
              className="text-fg-3 no-underline transition-colors hover:text-indigo"
            >
              Contact
            </a>
            <a
              href={LINKS.twitter}
              target="_blank"
              rel="noopener"
              className="text-fg-3 no-underline transition-colors hover:text-indigo"
            >
              Twitter
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
