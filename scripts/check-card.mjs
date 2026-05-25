import puppeteer from 'puppeteer'
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1100, height: 1200, deviceScaleFactor: 1 })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })

const info = await page.evaluate(() => {
  const section = document.getElementById('benchmark')
  if (!section) return 'no section'
  const allMatches = Array.from(section.querySelectorAll('[class*="rounded-[12px]"]'))
  return {
    sectionFirstChild: section.firstElementChild?.outerHTML?.slice(0, 200),
    matchesCount: allMatches.length,
    firstMatchClass: allMatches[0]?.className,
    firstMatchTag: allMatches[0]?.tagName,
    sectionInner: section.outerHTML.slice(0, 500),
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
