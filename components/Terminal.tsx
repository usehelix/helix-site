'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import {
  TERMINAL_AGENT_A,
  TERMINAL_AGENT_B,
  TERMINAL_SEP_TEXT,
  type TerminalLine,
} from '@/lib/terminal-data'

const CHAR_MS = 24
const MIN_LINE_MS = 420
const INTER_LINE_MS = 220
const SEP_PAUSE_MS = 900
const LOOP_PAUSE_MS = 4500

const ALL_LINES: TerminalLine[] = [...TERMINAL_AGENT_A, ...TERMINAL_AGENT_B]
const AGENT_A_COUNT = TERMINAL_AGENT_A.length

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const tagColors: Record<TerminalLine['tag'], string> = {
  FAIL: 'bg-red-500/15 text-red-300',
  HEAL: 'bg-amber-500/15 text-amber-300',
  DONE: 'bg-emerald-500/15 text-emerald-300',
  LEARN: 'bg-indigo-500/[0.18] text-indigo-300',
  MATCH: 'bg-green-500/15 text-green-300',
}

function Row({
  line,
  index,
  lineRef,
}: {
  line: TerminalLine
  index: number
  lineRef: (el: HTMLDivElement | null) => void
}) {
  const agentClass =
    line.agent === 'a'
      ? 'text-zinc-400 bg-white/[0.04] border border-white/[0.06]'
      : 'text-indigo-300 bg-indigo-500/[0.12] border border-indigo-500/[0.22]'

  return (
    <div
      ref={lineRef}
      data-i={index}
      className="t-line flex items-center gap-2.5 text-zinc-300"
      style={{ minHeight: '1.85em' }}
    >
      <span className="t-pre min-w-[14px] select-none text-zinc-600">▸</span>
      <span
        className={`t-agent shrink-0 rounded px-[7px] py-[1px] font-mono text-[10px] font-semibold tracking-[0.02em] ${agentClass}`}
      >
        agent-{line.agent}
      </span>
      <span className="t-body relative flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap">
        <span className="t-body-inner inline-flex items-center gap-1.5">
          <span
            className={`t-tag mr-1.5 rounded px-[7px] py-[1px] text-[10px] font-semibold tracking-[0.02em] ${tagColors[line.tag]}`}
          >
            {line.tag}
          </span>
          <span>{line.body}</span>
        </span>
        <span
          aria-hidden
          className="t-cursor ml-1.5 h-[14px] w-[7px] shrink-0 bg-amber-300"
        />
      </span>
      <span className="t-time ml-auto shrink-0 font-mono text-[10.5px] text-zinc-600">
        {line.time}
      </span>
    </div>
  )
}

export function Terminal() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const sepRef = useRef<HTMLDivElement | null>(null)
  const startedRef = useRef(false)
  const inView = useInView(rootRef, { once: true, margin: '0px 0px -30% 0px' })

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true
    let aborted = false

    const reset = () => {
      for (const l of lineRefs.current) l?.classList.remove('is-active', 'is-done')
      sepRef.current?.classList.remove('is-shown')
    }

    const typeLine = async (i: number) => {
      const line = lineRefs.current[i]
      if (!line) return
      const inner = line.querySelector<HTMLSpanElement>('.t-body-inner')
      const text = inner?.textContent ?? ''
      const dur = Math.max(MIN_LINE_MS, text.length * CHAR_MS)
      if (inner) inner.style.animationDuration = `${dur}ms`
      line.classList.remove('is-done')
      line.classList.add('is-active')
      await wait(dur)
      if (aborted) return
      line.classList.remove('is-active')
      line.classList.add('is-done')
    }

    const play = async () => {
      while (!aborted) {
        reset()
        // Brief beat after reset so the eye registers the wipe before retyping.
        await wait(60)
        if (aborted) return

        for (let i = 0; i < AGENT_A_COUNT; i++) {
          await typeLine(i)
          if (aborted) return
          await wait(INTER_LINE_MS)
          if (aborted) return
        }

        sepRef.current?.classList.add('is-shown')
        await wait(SEP_PAUSE_MS)
        if (aborted) return

        for (let i = AGENT_A_COUNT; i < ALL_LINES.length; i++) {
          await typeLine(i)
          if (aborted) return
          await wait(INTER_LINE_MS)
          if (aborted) return
        }

        await wait(LOOP_PAUSE_MS)
      }
    }

    void play()

    return () => {
      aborted = true
    }
  }, [inView])

  return (
    <div ref={rootRef} className="terminal-wrap relative z-10 mx-auto max-w-[780px]">
      <div className="overflow-hidden rounded-xl border border-code-border bg-code-bg shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-1.5 border-b border-code-border bg-white/[0.02] px-4 py-[11px]">
          <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
          <span className="ml-auto mr-auto font-mono text-[11px] text-zinc-500">
            agent.log · streaming
          </span>
        </div>
        <div
          className="text-left font-mono"
          style={{
            padding: '18px 22px',
            fontSize: '12.5px',
            lineHeight: '1.85',
            minHeight: 340,
          }}
        >
          {TERMINAL_AGENT_A.map((line, i) => (
            <Row
              key={`a-${i}`}
              line={line}
              index={i}
              lineRef={(el) => {
                lineRefs.current[i] = el
              }}
            />
          ))}
          <div ref={sepRef} className="t-sep">
            <span className="t-pulse-dot block h-[6px] w-[6px] rounded-full bg-indigo-2 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]" />
            <span>{TERMINAL_SEP_TEXT}</span>
            <span className="t-pulse-dot block h-[6px] w-[6px] rounded-full bg-indigo-2 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]" />
          </div>
          {TERMINAL_AGENT_B.map((line, i) => (
            <Row
              key={`b-${i}`}
              line={line}
              index={AGENT_A_COUNT + i}
              lineRef={(el) => {
                lineRefs.current[AGENT_A_COUNT + i] = el
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
