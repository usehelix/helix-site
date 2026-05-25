import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  rightSlot?: ReactNode
}

export function SectionEyebrow({ children, rightSlot }: Props) {
  return (
    <div className="mb-3.5 inline-flex items-center gap-[7px] font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-indigo">
      <span className="inline-block h-[5px] w-[5px] rounded-full bg-indigo" />
      <span>{children}</span>
      {rightSlot ? (
        <>
          <span className="mx-1 inline-block h-2.5 w-px bg-border-3" />
          {rightSlot}
        </>
      ) : null}
    </div>
  )
}
