import puppeteer from 'puppeteer'
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
page.on('console', (m) => console.log('PAGE>', m.type(), m.text()))
page.on('pageerror', (e) => console.log('PAGE-ERROR>', e.message))
page.on('requestfailed', (r) => console.log('REQ-FAIL>', r.url(), r.failure()?.errorText))
await page.setViewport({ width: 1280, height: 900 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 1200))

// Inspect React fiber on the button
const info = await page.evaluate(() => {
  const btn = document.querySelector('button[aria-label="Copy install command"]')
  if (!btn) return 'no button'
  const keys = Object.keys(btn).filter(k => k.startsWith('__reactProps') || k.startsWith('__reactFiber'))
  const propsKey = keys.find(k => k.startsWith('__reactProps'))
  const props = propsKey ? btn[propsKey] : null
  return {
    keys,
    hasOnClick: props ? typeof props.onClick : 'no props',
    onClickName: props && props.onClick ? props.onClick.name : null,
  }
})
console.log('btn info:', JSON.stringify(info, null, 2))
await browser.close()
