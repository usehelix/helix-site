// Drive /docs through a scroll sequence, sampling the active TOC item at each stop.
// "Active" = the TOC anchor with `border-l-2 border-indigo` applied.
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:3001/docs', { waitUntil: 'networkidle2' })
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })

const activeText = async () =>
  page.evaluate(() => {
    const a = document.querySelector('nav a.border-indigo')
    return a?.textContent?.trim() ?? null
  })

const sectionTop = (id) => page.evaluate((id) => {
  const el = document.getElementById(id)
  if (!el) return null
  return el.getBoundingClientRect().top + window.scrollY
}, id)

const ids = ['install', 'quickstart', 'config', 'wrap', 'engine', 'primitives', 'repair-graph', 'types', 'adapters', 'cli']

console.log('Section          | Scroll Y (px) | Active TOC item')
console.log('-----------------+---------------+--------------------------------')
for (const id of ids) {
  const top = await sectionTop(id)
  if (top === null) {
    console.log(id.padEnd(16), '|  (not found)')
    continue
  }
  // Scroll so the section is just below the sticky nav (60px down from top)
  await page.evaluate((y) => window.scrollTo(0, y), top - 60)
  await new Promise((r) => setTimeout(r, 350))
  const active = await activeText()
  console.log(id.padEnd(16), '|  y=' + String(top).padStart(6), '   | ', active)
}

// Click test: click a TOC link and verify the URL hash changes.
console.log('\n--- Click test: TOC item -> hash + scroll ---')
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 200))
await page.evaluate(() => {
  const a = Array.from(document.querySelectorAll('nav a')).find((el) =>
    el.textContent?.includes('Repair Graph API'),
  )
  a?.click()
})
await new Promise((r) => setTimeout(r, 600))
const after = await page.evaluate(() => ({ y: window.scrollY, hash: location.hash }))
console.log('after click:', after)

await browser.close()
