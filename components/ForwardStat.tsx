type Props = {
  num: string
  label: string
  desc: string
  live?: boolean
}

export function ForwardStat({ num, label, desc, live }: Props) {
  return (
    <div className="rounded-[10px] border border-border bg-bg px-[22px] py-5 transition-colors hover:border-border-3 hover:bg-bg-muted">
      <div
        className={`mb-1.5 font-mono text-[20px] font-semibold lowercase tracking-[-0.02em] tabular-nums ${
          live ? 'text-indigo' : 'text-fg-3'
        }`}
      >
        {num}
      </div>
      <div className="mb-1 text-[13px] font-[550] text-fg">{label}</div>
      <div className="text-[11.5px] leading-[1.5] text-fg-3">{desc}</div>
    </div>
  )
}
