// Capture the full Hero with the Terminal at full-cycle (everything settled).
import puppeteer from 'puppeteer'
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 1500, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
await page.evaluate(() => document.querySelector('.terminal-wrap')?.scrollIntoView({ block: 'center' }))
await new Promise((r) => setTimeout(r, 13500)) // let full Agent A + sep + Agent B finish
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 200))
await page.screenshot({ path: '/tmp/helix-shots/step4-hero-full.png' })

// Also capture mid-cycle so reviewer can see the typing motion
await page.reload({ waitUntil: 'networkidle2' })
await page.evaluate(() => document.querySelector('.terminal-wrap')?.scrollIntoView({ block: 'center' }))
await new Promise((r) => setTimeout(r, 2500))
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 100))
await page.screenshot({ path: '/tmp/helix-shots/step4-hero-mid.png' })
await browser.close()
console.log('ok')
