import puppeteer from 'puppeteer'
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 375, height: 700, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
await page.click('button[aria-label="Open menu"]')
await new Promise((r) => setTimeout(r, 200))
const html = await page.evaluate(() => {
  const dlg = document.querySelector('[role="dialog"]')
  if (!dlg) return 'NO DIALOG'
  const r = dlg.getBoundingClientRect()
  const innerSheet = dlg.querySelector('.relative')
  const innerR = innerSheet ? innerSheet.getBoundingClientRect() : null
  const innerStyle = innerSheet ? getComputedStyle(innerSheet) : null
  return JSON.stringify({
    dialog: { top: r.top, left: r.left, width: r.width, height: r.height, zIndex: getComputedStyle(dlg).zIndex },
    innerRect: innerR ? { top: innerR.top, left: innerR.left, width: innerR.width, height: innerR.height } : null,
    innerStyle: innerStyle ? { bg: innerStyle.backgroundColor, display: innerStyle.display, position: innerStyle.position } : null,
    bodyHeight: document.body.scrollHeight,
    viewport: { w: innerWidth, h: innerHeight },
    sheetOuter: dlg.outerHTML.slice(0, 1500),
  }, null, 2)
})
console.log(html)
await browser.close()
