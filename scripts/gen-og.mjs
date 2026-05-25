// Generate public/og-image.png at 1200x630.
// Background: white. Logo + wordmark top-left. Centered headline with indigo
// underline accent under "already immune." Tagline below. tryhelix.dev bottom-right.
import sharp from 'sharp'

const W = 1200
const H = 630

// Reuse the existing logo at high resolution.
const logo = await sharp('public/logo-1024.png').resize(64, 64).png().toBuffer()

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="indigoUnder" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6366f1" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#6366f1" stop-opacity="0.03"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#ffffff"/>

  <!-- soft indigo ambient at the top -->
  <ellipse cx="${W / 2}" cy="-80" rx="900" ry="320" fill="#6366f1" fill-opacity="0.07"/>

  <!-- Helix wordmark next to where the logo is composited -->
  <text x="160" y="100" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="34" font-weight="600" fill="#0a0a0a" letter-spacing="-0.5">Helix</text>

  <!-- headline -->
  <text x="80" y="290" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="68" font-weight="700" fill="#0a0a0a" letter-spacing="-2.4">One agent fails.</text>

  <text x="80" y="380" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="68" font-weight="700" fill="#0a0a0a" letter-spacing="-2.4">The next is <tspan fill="#4f46e5">already immune.</tspan></text>

  <!-- indigo soft underline under "already immune." -->
  <rect x="370" y="386" width="468" height="8" rx="4" fill="url(#indigoUnder)"/>

  <!-- tagline -->
  <text x="80" y="468" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="24" font-weight="400" fill="#3f3f46" letter-spacing="-0.3">Self-healing infrastructure for AI agents.</text>

  <!-- footer line -->
  <text x="80" y="568" font-family="JetBrains Mono, ui-monospace, monospace" font-size="18" font-weight="500" fill="#71717a">99.9% success on Base mainnet  ·  91% autonomous resolution on Web2</text>

  <text x="${W - 80}" y="568" text-anchor="end" font-family="JetBrains Mono, ui-monospace, monospace" font-size="18" font-weight="500" fill="#4f46e5">tryhelix.dev →</text>
</svg>`

const base = sharp(Buffer.from(svg)).png()

await base
  .composite([{ input: logo, top: 70, left: 80 }])
  .toFile('public/og-image.png')

console.log('ok public/og-image.png  1200x630')
