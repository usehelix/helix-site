// Reliable full-page screenshot: scroll slowly so IntersectionObserver fires
// for every Reveal before we capture.
import puppeteer from 'puppeteer'

async function fullPageShot(width, height, out) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })

  // Walk the page in viewport-height steps, pausing long enough for
  // IntersectionObserver to fire on each Reveal (it's async).
  await page.evaluate(async (vh) => {
    const total = document.documentElement.scrollHeight
    const step = Math.floor(vh * 0.6)
    for (let y = 0; y <= total; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 220))
    }
    // Settle, then return to top for capture.
    await new Promise((r) => setTimeout(r, 400))
    window.scrollTo(0, 0)
  }, height)
  await new Promise((r) => setTimeout(r, 500))

  await page.screenshot({ path: out, fullPage: true })
  await browser.close()
  console.log('ok', out)
}

await fullPageShot(1280, 1200, '/tmp/helix-shots/step9-fullpage-desktop.png')
await fullPageShot(375, 900, '/tmp/helix-shots/step9-fullpage-mobile.png')
