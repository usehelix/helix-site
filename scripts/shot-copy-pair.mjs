import puppeteer from 'puppeteer'
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const ctx = await browser.createBrowserContext()
await ctx.overridePermissions('http://localhost:3000', ['clipboard-read', 'clipboard-write'])
const page = await ctx.newPage()
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 800))

const box = await page.$eval('button[aria-label="Copy install command"]', (el) => {
  const r = el.getBoundingClientRect()
  return { x: r.left - 10, y: r.top - 10, width: r.width + 20, height: r.height + 20 }
})

await page.screenshot({ path: '/tmp/helix-shots/step3-copy-before.png', clip: box })
await page.click('button[aria-label="Copy install command"]')
await new Promise((r) => setTimeout(r, 200))
await page.screenshot({ path: '/tmp/helix-shots/step3-copy-after.png', clip: box })
const clip = await page.evaluate(() => navigator.clipboard.readText())
console.log('clipboard:', clip)
await browser.close()
