import puppeteer from 'puppeteer'

async function shoot(width, height, out) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    document.getElementById('how')?.scrollIntoView({ block: 'start' })
  })
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({ path: out, fullPage: false })
  await browser.close()
  console.log('ok', out)
}

async function shootHover(out) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 1400, deviceScaleFactor: 2 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    document.getElementById('how')?.scrollIntoView({ block: 'start' })
  })
  await new Promise((r) => setTimeout(r, 800))
  // Hover row 2 (Construct) to demonstrate digit color shift.
  const rows = await page.$$('#how .group')
  if (rows[1]) await rows[1].hover()
  await new Promise((r) => setTimeout(r, 300))
  await page.screenshot({ path: out, fullPage: false })
  await browser.close()
  console.log('ok', out)
}

await shoot(1280, 1400, '/tmp/helix-shots/step7-desktop.png')
await shoot(375, 2400, '/tmp/helix-shots/step7-mobile.png')
await shootHover('/tmp/helix-shots/step7-hover.png')
