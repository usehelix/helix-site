import type { ReactNode } from 'react'
import { StatTile, type StatTileProps } from '@/components/StatTile'

type Props = {
  dotColor: 'indigo' | 'green'
  label: string
  meta: ReactNode
  tiles: StatTileProps[]
}

export function StatCluster({ dotColor, label, meta, tiles }: Props) {
  const dotClass = dotColor === 'green' ? 'bg-signal-green' : 'bg-indigo'

  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-fg-3">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
        <span>{label}</span>
        <span className="ml-auto font-mono text-[10.5px] font-normal normal-case tracking-normal text-fg-4">
          {meta}
        </span>
      </div>
      <div className="grid grid-cols-1 overflow-hidden rounded-[14px] border border-border bg-bg md:grid-cols-3">
        {tiles.map((t, i) => (
          <StatTile key={i} {...t} />
        ))}
      </div>
    </div>
  )
}
