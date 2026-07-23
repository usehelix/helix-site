import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { KidsLab } from '@/components/KidsLab'

export const metadata: Metadata = {
  title: 'Helix Kids Lab',
  description:
    'A free interactive lesson for kids ages 8–12 about self-repairing software: try, notice, fix, remember. Six chapters, three things to play with. No sign-up, no data collection.',
  openGraph: {
    title: 'Helix Kids Lab — How Robots Learn to Fix Themselves',
    description:
      'A free STEM outreach program for ages 8–12. Interactive demo plus a free 45-minute unplugged classroom kit. No computers, no sign-up, no data collection.',
    url: 'https://tryhelix.dev/kids-lab',
  },
}

export default function KidsLabPage() {
  return (
    <>
      <Nav />
      <main className="relative">
        <KidsLab />
      </main>
      <Footer />
    </>
  )
}
