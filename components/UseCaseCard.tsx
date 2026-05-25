import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  title: string
  desc: string
  tag: string
}

export function UseCaseCard({ icon, title, desc, tag }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-[12px] border border-border bg-bg p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-3 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.1)]">
      <div className="mb-[18px] inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-indigo/[0.15] bg-indigo-soft text-indigo">
        {icon}
      </div>
      <h3 className="mb-2 text-[16.5px] font-semibold tracking-[-0.015em] text-fg">{title}</h3>
      <p className="text-[13.5px] leading-[1.55] text-fg-2">{desc}</p>
      <span className="mt-3.5 inline-block rounded-md border border-border bg-bg-card px-[9px] py-[3px] font-mono text-[10.5px] text-fg-3">
        {tag}
      </span>
    </div>
  )
}
