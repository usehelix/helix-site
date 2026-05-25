// Capture Benchmark at mid-animation (proves stagger) + full settled state.
// We load the page at top (no anchor) so the IntersectionObserver hasn't fired
// yet, then trigger scroll and screenshot at precise offsets.
import puppeteer from 'puppeteer'

async function shoot({ width, height, out, settle, beforeScreenshot }) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })

  // Jump to just above the benchmark so the rows are NOT yet in view.
  await page.evaluate(() => {
    const el = document.getElementById('benchmark')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top - 600, behavior: 'instant' })
  })
  await new Promise((r) => setTimeout(r, 200))

  // Now scroll the section into view — this fires the IntersectionObserver.
  await page.evaluate(() => {
    document.getElementById('benchmark')?.scrollIntoView({ block: 'start' })
    window.scrollBy(0, -60)
  })
  await new Promise((r) => setTimeout(r, settle))
  if (beforeScreenshot) await beforeScreenshot(page)
  await page.screenshot({ path: out, fullPage: false })
  await browser.close()
  console.log('ok', out, '(', settle, 'ms after trigger )')
}

// Early stagger frame: row 0 has been animating ~250ms, row 5 just started.
await shoot({ width: 1280, height: 1100, settle: 250, out: '/tmp/helix-shots/step6-mid.png' })
// Full settled: every row at target width.
await shoot({ width: 1280, height: 1100, settle: 1800, out: '/tmp/helix-shots/step6-full.png' })
// Mobile (375): single column should compress to 140/1fr/50 columns.
await shoot({ width: 375, height: 1500, settle: 1800, out: '/tmp/helix-shots/step6-mobile.png' })
