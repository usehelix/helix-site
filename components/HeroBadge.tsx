import { Reveal } from '@/components/ui/Reveal'

export function HeroBadge() {
  return (
    <Reveal>
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border-2 bg-white py-[5px] pl-[6px] pr-3 text-[12px] font-medium text-fg-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-soft text-[10px] font-bold text-indigo">
          ✦
        </span>
        <span>Cross-agent learning &middot; shared repair memory</span>
        <span className="text-fg-4">·</span>
        <a href="#how" className="font-semibold text-indigo no-underline hover:underline">
          how it works →
        </a>
      </div>
    </Reveal>
  )
}
