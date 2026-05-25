import type { CodeLine, PCECStep } from '@/lib/pcec-data'

function CodeLineRow({ line }: { line: CodeLine }) {
  // A raw line that starts with `//` is itself a comment — render it muted+italic.
  if (line.raw) {
    const isCommentLine = line.raw.trim().startsWith('//')
    return (
      <div>
        <span
          className={
            isCommentLine
              ? 'italic text-zinc-500'
              : line.comment
                ? 'text-indigo-300'
                : ''
          }
        >
          {line.raw}
        </span>
        {line.comment ? (
          <span className="ml-2 italic text-zinc-500">{line.comment}</span>
        ) : null}
      </div>
    )
  }

  return (
    <div>
      <span className="text-indigo-300">{line.key}</span>
      <span>: </span>
      <span className="text-emerald-300">{line.value}</span>
      {line.comment ? (
        <span className="ml-2 italic text-zinc-500">{line.comment}</span>
      ) : null}
    </div>
  )
}

export function Step({ num, name, desc, codeLabel, codeLines }: PCECStep) {
  return (
    <div
      className={
        'group grid items-center gap-[18px] border-b border-border py-7 transition-colors duration-150 hover:bg-bg-muted ' +
        'grid-cols-1 ' +
        'min-[880px]:grid-cols-[120px_1fr_1fr] min-[880px]:gap-10 min-[880px]:py-9'
      }
    >
      <div className="pl-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-4">
        STEP
        <span className="mt-1.5 block font-sans text-[46px] font-bold leading-none tracking-tightest text-fg-5 transition-colors duration-200 group-hover:text-indigo">
          {num}
        </span>
      </div>

      <div>
        <h3 className="mb-2.5 text-[22px] font-semibold tracking-[-0.02em] text-fg">
          {name}
        </h3>
        <p className="max-w-[380px] text-[14.5px] leading-[1.55] text-fg-2">{desc}</p>
      </div>

      <div className="rounded-[9px] border border-code-border bg-code-bg px-[18px] py-4 font-mono text-[12px] leading-[1.7] text-zinc-300">
        <div className="mb-2 text-[10px] uppercase tracking-[0.1em] text-zinc-500">
          {codeLabel}
        </div>
        {codeLines.map((line, i) => (
          <CodeLineRow key={i} line={line} />
        ))}
      </div>
    </div>
  )
}
