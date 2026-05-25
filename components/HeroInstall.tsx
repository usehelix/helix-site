'use client'

import { useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { INSTALL_COMMAND, LINKS, NPM_PACKAGE } from '@/lib/config'

export function HeroInstall() {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
    void navigator.clipboard?.writeText(INSTALL_COMMAND).catch(() => {})
  }

  return (
    <Reveal>
      <div className="mb-[52px] flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex cursor-pointer items-center gap-2.5 rounded-lg border border-border-2 bg-white px-3.5 py-2 font-mono text-[13px] text-fg shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-border-3 hover:bg-bg-muted"
        >
          <span className="select-none text-fg-4">$</span>
          <span>
            npm install <span>{NPM_PACKAGE}</span>
          </span>
          <span
            className={`ml-1.5 select-none border-l border-border-2 pl-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.02em] ${
              copied ? 'text-signal-green' : 'text-fg-3'
            }`}
          >
            {copied ? '✓ copied' : 'copy'}
          </span>
        </button>

        <a
          href={LINKS.github}
          target="_blank"
          rel="noopener"
          className="group inline-flex items-center gap-2 rounded-lg border border-border-2 bg-white px-3.5 py-2 text-[13px] text-fg-2 no-underline shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-border-3 hover:bg-bg-muted hover:text-fg"
        >
          <span className="text-[#fbbf24] text-[13px]">★</span>
          <span>Star on GitHub</span>
          <span className="text-fg-4 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo">
            ↗
          </span>
        </a>
      </div>
    </Reveal>
  )
}
