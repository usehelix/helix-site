// Capture the Terminal at several phases of its loop.
// Crops to just the terminal element for clarity.
import puppeteer from 'puppeteer'

// Agent A (5 lines @ ~1.0–1.5s each + 220ms inter-line) totals ~7.3s.
// + 900ms sep pause + Agent B (3 lines + inter-line) ~4.5s + 4500ms loop pause.
// Full cycle ~17–18s.
const phases = [
  { label: 'agent-a-typing',  delay: 2400 },   // mid Agent A
  { label: 'agent-a-settled', delay: 7500 },   // Agent A all settled, sep about to fire
  { label: 'separator',       delay: 8000 },   // sep visible, Agent B not yet typing
  { label: 'agent-b-typing',  delay: 10500 },  // Agent B mid-cycle
  { label: 'full-cycle',      delay: 13200 },  // both agents complete, pause begins
  { label: 'loop-restart',    delay: 19000 },  // second pass underway -> proves looping
]

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 1400, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })

// Scroll the terminal fully into view so the IntersectionObserver fires.
await page.evaluate(() => {
  document.querySelector('.terminal-wrap')?.scrollIntoView({ block: 'center' })
})
await new Promise((r) => setTimeout(r, 300))

const t0 = Date.now()
for (const phase of phases) {
  const wait = phase.delay - (Date.now() - t0)
  if (wait > 0) await new Promise((r) => setTimeout(r, wait))
  const box = await page.$eval('.terminal-wrap', (el) => {
    const r = el.getBoundingClientRect()
    return { x: r.left, y: r.top, width: r.width, height: r.height }
  })
  await page.screenshot({
    path: `/tmp/helix-shots/step4-${phase.label}.png`,
    clip: box,
  })
  console.log(`ok ${phase.label} @ ${(Date.now() - t0)}ms`)
}

await browser.close()
