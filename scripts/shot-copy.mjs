import puppeteer from 'puppeteer'
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const ctx = await browser.createBrowserContext()
await ctx.overridePermissions('http://localhost:3000', ['clipboard-read', 'clipboard-write'])
const page = await ctx.newPage()
page.on('console', (m) => { if (m.type() !== 'error') console.log('PAGE>', m.type(), m.text()) })
page.on('pageerror', (e) => console.log('PAGE-ERROR>', e.message))
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 800)) // let Reveal finish

// Method 1: puppeteer click
console.log('-- method 1: page.click --')
await page.click('button[aria-label="Copy install command"]')
await new Promise(r => setTimeout(r, 250))
console.log('text:', await page.$eval('button[aria-label="Copy install command"]', el => el.textContent))

// reload state
await page.reload({ waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 800))

// Method 2: native dispatchEvent
console.log('-- method 2: dispatchEvent click --')
await page.evaluate(() => {
  const btn = document.querySelector('button[aria-label="Copy install command"]')
  btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
})
await new Promise(r => setTimeout(r, 250))
console.log('text:', await page.$eval('button[aria-label="Copy install command"]', el => el.textContent))

await browser.close()
