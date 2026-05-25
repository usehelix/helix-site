// Final full-page screenshots (desktop + mobile) against the prod server.
import puppeteer from 'puppeteer'

async function walk(page, height) {
  await page.evaluate(async (vh) => {
    const total = document.documentElement.scrollHeight
    for (let y = 0; y <= total; y += Math.floor(vh * 0.55)) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 220))
    }
    await new Promise((r) => setTimeout(r, 400))
    window.scrollTo(0, 0)
  }, height)
  await new Promise((r) => setTimeout(r, 400))
}

async function shoot(width, height, out) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' })
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
  await walk(page, height)
  await page.screenshot({ path: out, fullPage: true })
  await browser.close()
  console.log('ok', out)
}

await shoot(1280, 1200, '/tmp/helix-shots/final-desktop.png')
await shoot(375, 900, '/tmp/helix-shots/final-mobile.png')
