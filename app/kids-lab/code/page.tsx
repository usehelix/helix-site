import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { CodeLab } from '@/components/CodeLab'

export const metadata: Metadata = {
  title: 'Hexa Code Lab',
  description:
    'A free block-based coding playground for kids ages 8–12. Guide Hexa the robot, watch programs fail honestly, and write your first self-repairing code. No sign-up, no data collection.',
  openGraph: {
    title: 'Hexa Code Lab — Write Your First Self-Repairing Program',
    description:
      'Build a program from blocks, watch it fail honestly, and teach it to repair itself. A free coding playground for ages 8–12 — no sign-up, no data collection.',
    url: 'https://tryhelix.dev/kids-lab/code',
  },
}

export default function CodeLabPage() {
  return (
    <>
      <Nav />
      <main className="relative">
        <CodeLab />
      </main>
      <Footer />
    </>
  )
}
