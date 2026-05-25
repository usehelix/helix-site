import puppeteer from 'puppeteer'
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1100, height: 1200, deviceScaleFactor: 1 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto'
  const section = document.getElementById('benchmark')
  const card = section?.querySelector('[class*="rounded-[12px]"]')
  if (card) card.id = 'bench-card'
})

await page.evaluate(() => {
  const card = document.getElementById('bench-card')
  card?.scrollIntoView({ block: 'center', behavior: 'instant' })
})
await new Promise((r) => setTimeout(r, 100))

const info = await page.evaluate(() => {
  const card = document.getElementById('bench-card')
  if (!card) return 'no card'
  const r = card.getBoundingClientRect()
  return {
    cardRect: { x: r.left, y: r.top, w: r.width, h: r.height },
    scrollY: window.scrollY,
    docHeight: document.documentElement.scrollHeight,
    viewportH: window.innerHeight,
    bodyComputed: getComputedStyle(document.body).overflow,
    htmlComputed: getComputedStyle(document.documentElement).overflow,
  }
})
console.log(JSON.stringify(info, null, 2))
await page.screenshot({ path: '/tmp/helix-shots/debug-fullpage.png', fullPage: true })
await browser.close()
