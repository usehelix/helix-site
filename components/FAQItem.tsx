'use client'

import type { ReactNode } from 'react'

type Props = {
  question: string
  answer: ReactNode
  isOpen: boolean
  onClick: () => void
}

export function FAQItem({ question, answer, isOpen, onClick }: Props) {
  return (
    <div
      className={`group border-b border-border transition-[padding] duration-150 ${
        isOpen ? 'pl-1.5' : ''
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        className={`flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-[15.5px] font-[550] tracking-[-0.01em] transition-colors duration-150 ${
          isOpen ? 'text-fg' : 'text-fg group-hover:text-indigo'
        }`}
      >
        <span>{question}</span>
        <span
          className={`shrink-0 font-mono text-[18px] leading-none transition-[transform,color] duration-300 ${
            isOpen ? 'rotate-45 text-indigo' : 'rotate-0 text-fg-4'
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden text-[14px] leading-[1.7] text-fg-2 transition-[max-height,padding] duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] pb-5' : 'max-h-0 pb-0'
        }`}
      >
        <div className="[&_code]:rounded-sm [&_code]:border [&_code]:border-indigo/10 [&_code]:bg-indigo-soft [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:text-[12.5px] [&_code]:text-indigo">
          {answer}
        </div>
      </div>
    </div>
  )
}
