import type { ReactNode } from 'react'

/*
  Tiny single-line TS/JS lexer. Per-line tokenization is enough because we
  don't use multi-line strings in any of the doc snippets, so each line can
  be lexed independently.
*/
const KEYWORDS = new Set([
  'import', 'export', 'const', 'let', 'var', 'await', 'async',
  'from', 'new', 'return', 'if', 'else', 'try', 'catch', 'throw',
  'type', 'interface', 'class', 'extends', 'implements', 'function',
  'true', 'false', 'null', 'undefined', 'this', 'as', 'of', 'in',
])

type Token = { type: 'ws' | 'cm' | 'str' | 'kw' | 'fn' | 'id' | 'num' | 'punct'; text: string }

function tokenize(line: string): Token[] {
  const out: Token[] = []
  let i = 0
  while (i < line.length) {
    const c = line[i]
    if (/\s/.test(c)) {
      let j = i
      while (j < line.length && /\s/.test(line[j])) j++
      out.push({ type: 'ws', text: line.slice(i, j) })
      i = j
    } else if (c === '/' && line[i + 1] === '/') {
      out.push({ type: 'cm', text: line.slice(i) })
      i = line.length
    } else if (c === "'" || c === '"' || c === '`') {
      const q = c
      let j = i + 1
      while (j < line.length && line[j] !== q) {
        if (line[j] === '\\') j++
        j++
      }
      out.push({ type: 'str', text: line.slice(i, j + 1) })
      i = j + 1
    } else if (/[a-zA-Z_$]/.test(c)) {
      let j = i
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++
      const word = line.slice(i, j)
      // skip whitespace, then check the next non-ws char
      let k = j
      while (k < line.length && /\s/.test(line[k])) k++
      const next = line[k]
      if (KEYWORDS.has(word)) out.push({ type: 'kw', text: word })
      else if (next === '(') out.push({ type: 'fn', text: word })
      else out.push({ type: 'id', text: word })
      i = j
    } else if (/[0-9]/.test(c)) {
      let j = i
      while (j < line.length && /[0-9.]/.test(line[j])) j++
      out.push({ type: 'num', text: line.slice(i, j) })
      i = j
    } else {
      out.push({ type: 'punct', text: c })
      i++
    }
  }
  return out
}

const COLORS: Record<Token['type'], string> = {
  ws: '',
  cm: 'italic text-zinc-400',
  str: 'text-emerald-300',
  kw: 'text-pink-400',
  fn: 'text-amber-300',
  id: 'text-blue-300',
  num: 'text-emerald-300',
  punct: '',
}

/** Renders a multi-line TS/JS snippet with token highlighting. */
export function TS({ children }: { children: string }) {
  const lines = children.replace(/\n+$/, '').split('\n')
  return (
    <>
      {lines.map((line, i) => {
        if (line.length === 0) {
          return <div key={i}>&nbsp;</div>
        }
        const tokens = tokenize(line)
        return (
          <div key={i} className="whitespace-pre">
            {tokens.map((t, j) =>
              t.type === 'punct' || t.type === 'ws' ? (
                <span key={j}>{t.text}</span>
              ) : (
                <span key={j} className={COLORS[t.type]}>
                  {t.text}
                </span>
              ),
            )}
          </div>
        )
      })}
    </>
  )
}

/** Bash snippet: dollar prompt + command, no fancy highlighting. */
export function Bash({ children }: { children: string }) {
  const lines = children.replace(/\n+$/, '').split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre">
          <span className="text-zinc-400">$</span>{' '}
          <span className="text-zinc-100">{line.replace(/^\$\s*/, '')}</span>
        </div>
      ))}
    </>
  )
}

/** JSON snippet — distinguishes keys (quoted before `:`) from string values. */
export function JSONBlock({ children }: { children: string }) {
  const lines = children.replace(/\n+$/, '').split('\n')
  return (
    <>
      {lines.map((line, i) => {
        // Token regex order matters — capture comment last (// trailing).
        const parts: Array<{ type: string; text: string }> = []
        let rest = line
        while (rest.length > 0) {
          const ws = rest.match(/^\s+/)
          if (ws) {
            parts.push({ type: 'ws', text: ws[0] })
            rest = rest.slice(ws[0].length)
            continue
          }
          const cm = rest.match(/^\/\/.*$/)
          if (cm) {
            parts.push({ type: 'cm', text: cm[0] })
            break
          }
          // string — possibly followed by ':' (key) or not (value)
          const str = rest.match(/^"([^"\\]|\\.)*"/)
          if (str) {
            const afterStr = rest.slice(str[0].length).match(/^\s*:/)
            parts.push({ type: afterStr ? 'key' : 'str', text: str[0] })
            rest = rest.slice(str[0].length)
            continue
          }
          const num = rest.match(/^-?\d+(\.\d+)?/)
          if (num) {
            parts.push({ type: 'num', text: num[0] })
            rest = rest.slice(num[0].length)
            continue
          }
          const word = rest.match(/^(true|false|null)\b/)
          if (word) {
            parts.push({ type: 'bool', text: word[0] })
            rest = rest.slice(word[0].length)
            continue
          }
          parts.push({ type: 'punct', text: rest[0] })
          rest = rest.slice(1)
        }
        const cls: Record<string, string> = {
          ws: '',
          cm: 'italic text-zinc-400',
          key: 'text-indigo-300',
          str: 'text-emerald-300',
          num: 'text-emerald-300',
          bool: 'text-pink-400',
          punct: '',
        }
        return (
          <div key={i} className="whitespace-pre">
            {parts.map((t, j) => (
              <span key={j} className={cls[t.type]}>
                {t.text}
              </span>
            ))}
          </div>
        )
      })}
    </>
  )
}

/** Dark code surface that wraps tokenized content. */
export function CodeBlock({
  filename,
  language,
  children,
}: {
  filename?: string
  language?: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[11px] border border-code-border bg-code-bg shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]">
      {(filename || language) && (
        <div className="flex items-center gap-2.5 border-b border-code-border bg-white/[0.015] px-4 py-2.5 font-mono text-[11px] text-zinc-400">
          {language && (
            <span className="rounded bg-indigo-500/15 px-2 py-1 text-[10px] font-semibold text-indigo-300">
              {language}
            </span>
          )}
          {filename && <span>{filename}</span>}
        </div>
      )}
      <div className="px-[26px] py-[22px] font-mono text-[12.5px] leading-[1.9] text-zinc-300">
        {children}
      </div>
    </div>
  )
}

/** Inline code chip — same indigo-soft style as everywhere else. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm border border-indigo/10 bg-indigo-soft px-1.5 py-px font-mono text-[12.5px] text-indigo">
      {children}
    </code>
  )
}
