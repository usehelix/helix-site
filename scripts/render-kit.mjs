// Render the Kids Lab classroom kit (print HTML) to a PDF.
//   Source: content/kids-lab/classroom-kit.html
//   Output: public/kids-lab/helix-kids-classroom-kit.pdf
// The HTML owns the page geometry via @page (US Letter, margin 0), so we render
// with preferCSSPageSize + printBackground and no puppeteer margins.
import puppeteer from 'puppeteer'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const src = resolve(root, 'content/kids-lab/classroom-kit.html')
const out = resolve(root, 'public/kids-lab/helix-kids-classroom-kit.pdf')

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle0' })
// Make sure webfonts are fully loaded before painting the PDF.
await page.evaluate(async () => { await document.fonts.ready })

await page.pdf({
  path: out,
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: false,
})

await browser.close()
console.log('ok →', out)
