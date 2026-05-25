// Capture the Verified Results section at desktop + mobile, after count-up completes.
import puppeteer from 'puppeteer'

async function shoot(width, height, out) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
  await page.evaluate(() => {
    document.querySelector('section.relative.z-10.py-16')?.scrollIntoView({ block: 'start' })
  })
  await new Promise((r) => setTimeout(r, 1800))
  await page.screenshot({ path: out, fullPage: false })
  await browser.close()
  console.log('ok', out)
}

await shoot(1280, 1100, '/tmp/helix-shots/step5-desktop.png')
await shoot(375, 1600, '/tmp/helix-shots/step5-mobile.png')
