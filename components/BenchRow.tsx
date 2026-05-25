'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import type { BenchmarkRow } from '@/lib/benchmark-data'

type Props = BenchmarkRow & { index: number }

const STAGGER_MS = 100

export function BenchRow({ name, score, isHelix, index }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setFilled(true), index * STAGGER_MS)
    return () => clearTimeout(t)
  }, [inView, index])

  const nameClass = isHelix
    ? 'font-sans text-[13px] font-bold text-indigo'
    : 'font-mono text-[12.5px] text-fg-2'

  const valueClass = isHelix
    ? 'font-mono text-[13.5px] font-semibold text-indigo text-right tabular-nums'
    : 'font-mono text-[12.5px] font-semibold text-fg-2 text-right tabular-nums'

  const fillClass = isHelix
    ? 'h-full rounded-full bg-gradient-to-r from-indigo to-indigo-2'
    : 'h-full rounded-full bg-fg-5'

  const rowBase =
    'grid items-center transition-colors duration-150 hover:bg-bg-muted ' +
    'grid-cols-[140px_1fr_50px] gap-2.5 px-4 py-2.5 ' +
    'min-[680px]:grid-cols-[200px_1fr_70px] min-[680px]:gap-[18px] min-[680px]:px-[22px] min-[680px]:py-3'

  const helixDecoration = isHelix
    ? 'relative border-t border-border bg-gradient-to-r from-indigo/[0.04] to-transparent before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-indigo before:content-[""]'
    : ''

  return (
    <div ref={ref} className={`${rowBase} ${helixDecoration}`}>
      <div className={nameClass}>{name}</div>
      <div className="h-1.5 overflow-hidden rounded-full bg-bg-card">
        <div
          className={`${fillClass} transition-[width] duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]`}
          style={{ width: filled ? `${score}%` : '0%' }}
        />
      </div>
      <div className={valueClass}>{score}%</div>
    </div>
  )
}
