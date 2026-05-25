'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export type StatTileProps = {
  value: number | string
  suffix?: string
  label: string
  detail: string
  color: 'indigo' | 'green'
}

const ANIM_MS = 1200

const formatNumber = (n: number, target: number): string => {
  if (Number.isInteger(target)) {
    const rounded = Math.round(n)
    return target >= 1000 ? rounded.toLocaleString('en-US') : rounded.toString()
  }
  return n.toFixed(1)
}

// cubic-bezier(0.215, 0.61, 0.355, 1) — easeOutCubic
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export function StatTile({ value, suffix, label, detail, color }: StatTileProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const isNumeric = typeof value === 'number'
  const [display, setDisplay] = useState<string>(isNumeric ? '0' : String(value))

  useEffect(() => {
    if (!inView || !isNumeric) return
    const target = value as number
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / ANIM_MS, 1)
      const eased = easeOutCubic(p)
      setDisplay(formatNumber(target * eased, target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, isNumeric, value])

  const valueColor = color === 'green' ? 'text-signal-green' : 'text-indigo'

  return (
    <div
      ref={ref}
      className="group relative border-r border-border px-7 py-8 transition-colors last:border-r-0 hover:bg-bg-muted"
    >
      <div
        className={`mb-2.5 font-sans text-[50px] font-bold leading-none tracking-tightest tabular-nums ${valueColor}`}
      >
        {display}
        {suffix ? (
          <span className="ml-[2px] text-[28px] font-semibold text-fg-4">{suffix}</span>
        ) : null}
      </div>
      <div className="mb-1 text-[13.5px] font-[550] tracking-body text-fg">{label}</div>
      <div className="font-mono text-[12.5px] tracking-[-0.01em] text-fg-3">{detail}</div>
    </div>
  )
}
