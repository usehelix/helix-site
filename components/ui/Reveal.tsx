'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'

type Tag = 'div' | 'section' | 'span'

type Props = {
  children: ReactNode
  delay?: number
  as?: Tag
  className?: string
}

const easing = [0.2, 0.8, 0.2, 1] as const

export function Reveal({ children, delay = 0, as = 'div', className }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const MotionTag = motion[as] as typeof motion.div

  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.5, ease: easing, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
