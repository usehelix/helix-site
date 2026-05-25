'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type TocItem = {
  id: string
  label: string
  external?: string
}

type TocGroup = {
  title: string
  items: TocItem[]
}

const TOC_GROUPS: TocGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { id: 'install', label: 'Install' },
      { id: 'quickstart', label: 'Quickstart' },
      { id: 'config', label: 'Configuration' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { id: 'wrap', label: 'wrap() — zero config' },
      { id: 'engine', label: 'createEngine() — manual' },
      { id: 'primitives', label: 'PCEC primitives — full control' },
      { id: 'repair-graph', label: 'Repair Graph API' },
      { id: 'types', label: 'TypeScript types' },
    ],
  },
  {
    title: 'Adapters',
    items: [
      { id: 'adapter-evm', label: 'EVM (Base, Ethereum, Arbitrum)' },
      { id: 'adapter-solana', label: 'Solana' },
      { id: 'adapter-x402', label: 'x402' },
    ],
  },
  {
    title: 'CLI',
    items: [
      { id: 'cli', label: 'Commands reference' },
      { id: 'cli-init', label: 'helix init' },
      { id: 'cli-status', label: 'helix status' },
      { id: 'cli-dash', label: 'helix dash' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { id: '', label: 'GitHub', external: 'https://github.com/usehelix/helix' },
      { id: '', label: 'Changelog', external: 'https://github.com/usehelix/helix/releases' },
    ],
  },
]

export function DocsTOC() {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Collect every anchor id from the TOC that has a matching DOM element.
    const ids = TOC_GROUPS.flatMap((g) => g.items.map((i) => i.id)).filter(Boolean)
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    // Top-of-band intersection: a section becomes "active" once its top crosses
    // roughly 1/4 of the viewport. The 70% bottom margin prevents lower
    // sections from stealing focus while you're still reading an upper one.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Documentation table of contents"
      className="hidden text-[12.5px] lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-5rem)] lg:self-start lg:overflow-y-auto lg:pr-2"
    >
      {TOC_GROUPS.map((group) => (
        <div key={group.title}>
          <div className="mb-2 mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-fg-3">
            {group.title}
          </div>
          {group.items.map((item, i) => {
            const isActive = item.id !== '' && activeId === item.id
            const baseClass = 'block py-1 transition-colors duration-100'
            const stateClass = isActive
              ? '-ml-[2px] border-l-2 border-indigo pl-3 text-indigo'
              : 'text-fg-2 hover:text-indigo'

            if (item.external) {
              return (
                <a
                  key={`${group.title}-${i}`}
                  href={item.external}
                  target="_blank"
                  rel="noopener"
                  className={`${baseClass} ${stateClass}`}
                >
                  {item.label}
                </a>
              )
            }
            return (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={`${baseClass} ${stateClass}`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
