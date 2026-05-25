// Multi-frame stagger capture. Targets the benchmark card by its rounded-[12px] border.
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1100, height: 1200, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto'
})

// Tag the actual card so we can target it reliably across React/motion wrappers.
await page.evaluate(() => {
  const section = document.getElementById('benchmark')
  if (!section) return
  const card = section.querySelector('[class*="rounded-[12px]"]')
  if (card) card.id = 'bench-card'
})

// Park well above benchmark (back at top) so IntersectionObserver hasn't fired.
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 200))

// scrollIntoView on the card with block: center.
await page.evaluate(() => {
  const card = document.getElementById('bench-card')
  card?.scrollIntoView({ block: 'center', behavior: 'instant' })
})
// Force a frame so layout commits before screenshot loop starts.
await new Promise((r) => setTimeout(r, 30))

const offsets = [0, 150, 300, 500, 800, 1300]
const t0 = Date.now()
for (let i = 0; i < offsets.length; i++) {
  const target = offsets[i]
  const wait = target - (Date.now() - t0)
  if (wait > 0) await new Promise((r) => setTimeout(r, wait))
  const box = await page.evaluate(() => {
    const card = document.getElementById('bench-card')
    if (!card) return null
    const r = card.getBoundingClientRect()
    // Puppeteer's `clip` is page-relative, so add scrollY here.
    return { x: r.left, y: r.top + window.scrollY, width: r.width, height: r.height }
  })
  await page.screenshot({
    path: `/tmp/helix-shots/step6-stagger-${String(i).padStart(2, '0')}-${target}ms.png`,
    clip: box || undefined,
  })
  console.log(`frame ${i} @ ~${target}ms  box=${JSON.stringify(box)}`)
}

await browser.close()
