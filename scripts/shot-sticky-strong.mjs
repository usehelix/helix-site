// Stronger sticky proof: drop the viewport short so the feature list outruns
// the code block's natural height. The code should remain pinned to top-20
// while the bottom of the section comes into view.
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 600, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })

// Scroll deep into the section.
await page.evaluate(() => {
  const el = document.getElementById('code')
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY
  window.scrollTo(0, top + 250)
})
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: '/tmp/helix-shots/step8-sticky-strong.png', fullPage: false })
await browser.close()
console.log('ok')
