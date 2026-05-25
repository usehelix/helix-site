// Capture /docs and /research at desktop + mobile.
import puppeteer from 'puppeteer'

async function shoot(url, width, height, out) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.goto(url, { waitUntil: 'networkidle2' })
  // Walk the page slowly so any in-page Reveals fire.
  await page.evaluate(async (vh) => {
    document.documentElement.style.scrollBehavior = 'auto'
    const total = document.documentElement.scrollHeight
    for (let y = 0; y <= total; y += Math.floor(vh * 0.6)) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 200))
    }
    window.scrollTo(0, 0)
  }, height)
  await new Promise((r) => setTimeout(r, 400))
  await page.screenshot({ path: out, fullPage: true })
  await browser.close()
  console.log('ok', out)
}

await shoot('http://localhost:3001/docs', 1280, 1200, '/tmp/helix-shots/docs-desktop.png')
await shoot('http://localhost:3001/docs', 375, 900, '/tmp/helix-shots/docs-mobile.png')
await shoot('http://localhost:3001/research', 1280, 1200, '/tmp/helix-shots/research-desktop.png')
await shoot('http://localhost:3001/research', 375, 900, '/tmp/helix-shots/research-mobile.png')
