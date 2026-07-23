import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ConditionalAnalytics } from '@/components/ConditionalAnalytics'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tryhelix.dev'),
  title: {
    default: 'Helix — Self-healing infrastructure for AI agents',
    template: '%s — Helix',
  },
  description:
    'One agent fails. The next is already immune. Helix turns every agent failure into a shared Repair Pattern. 99.9% success on Base mainnet · 91% autonomous resolution on Web2 microservices.',
  keywords: [
    'AI agents',
    'self-healing',
    'agent reliability',
    'PCEC',
    'Repair Graph',
    'crypto payments',
    'EVM',
    'Base mainnet',
    'agent infrastructure',
  ],
  authors: [{ name: 'Helix' }],
  openGraph: {
    title: 'Helix — Self-healing infrastructure for AI agents',
    description: 'Fix once. Immune everywhere. One agent learns, every agent inherits.',
    url: 'https://tryhelix.dev',
    siteName: 'Helix',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Helix — Self-healing infrastructure for AI agents',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Helix — Self-healing infrastructure for AI agents',
    description: 'One agent fails. The next is already immune.',
    site: '@dapanji_eth',
    creator: '@dapanji_eth',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans">
        {children}
        <ConditionalAnalytics />
      </body>
    </html>
  )
}
