'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { LINKS } from '@/lib/config'

const links = [
  { href: '#how', label: 'How it works' },
  { href: '#benchmark', label: 'Benchmarks' },
  { href: '#use-cases', label: 'Use cases' },
  { href: LINKS.docs, label: 'Docs' },
  { href: LINKS.research, label: 'Research' },
  { href: LINKS.blog, label: 'Blog' },
]

export function NavMobileSheet() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-2 transition-colors hover:bg-bg-card hover:text-fg min-[880px]:hidden"
      >
        <Menu size={18} strokeWidth={1.75} />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] h-screen w-screen bg-white min-[880px]:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-full w-full flex-col">
            <div className="flex items-center justify-between border-b border-border px-7 py-3.5">
              <span className="text-[15px] font-semibold tracking-[-0.015em]">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-2 transition-colors hover:bg-bg-card hover:text-fg"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-7 py-6">
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-[16px] font-medium text-fg-2 transition-colors hover:bg-bg-muted hover:text-fg"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t border-border px-7 py-6">
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-center text-[14.5px] font-medium text-fg-2 transition-colors hover:bg-bg-muted hover:text-fg"
              >
                GitHub
              </a>
              <a
                href={LINKS.calendly}
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-lg bg-fg px-5 py-3 text-[14.5px] font-[550] text-white transition-colors hover:bg-[#27272a]"
              >
                Book a demo →
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
