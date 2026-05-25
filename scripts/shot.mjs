// Headless screenshot helper using puppeteer with proper mobile viewport emulation.
// Usage: node scripts/shot.mjs <url> <width> <height> <outPath> [--full]
// Chrome headless ignores --window-size below 500px; puppeteer's setViewport
// (which speaks the DevTools Protocol) is the only reliable way to emulate
// narrow viewports like iPhone 375px.
import puppeteer from 'puppeteer'

const [url, w, h, out, ...rest] = process.argv.slice(2)
if (!url || !w || !h || !out) {
  console.error('usage: node scripts/shot.mjs <url> <width> <height> <out> [--full]')
  process.exit(1)
}
const fullPage = rest.includes('--full')

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 2 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 400))
  await page.screenshot({ path: out, fullPage })
} finally {
  await browser.close()
}
console.log('ok', out)
