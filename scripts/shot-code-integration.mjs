import puppeteer from 'puppeteer'

async function getPage(width, height) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
  return { browser, page }
}

// 1. Desktop wide: scroll to #code, capture the full 2-col section.
{
  const { browser, page } = await getPage(1280, 1500)
  await page.evaluate(() => document.getElementById('code')?.scrollIntoView({ block: 'start' }))
  await new Promise((r) => setTimeout(r, 700))
  await page.screenshot({ path: '/tmp/helix-shots/step8-desktop.png', fullPage: false })
  await browser.close()
}

// 2. Sticky proof: scroll inside #code so the feature list is mid-scroll.
// Code column should remain pinned near the top.
{
  const { browser, page } = await getPage(1280, 900)
  await page.evaluate(() => {
    const el = document.getElementById('code')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo(0, top + 360)
  })
  await new Promise((r) => setTimeout(r, 500))
  await page.screenshot({ path: '/tmp/helix-shots/step8-sticky.png', fullPage: false })
  await browser.close()
}

// 3. Mobile: stacked column.
{
  const { browser, page } = await getPage(375, 1800)
  await page.evaluate(() => document.getElementById('code')?.scrollIntoView({ block: 'start' }))
  await new Promise((r) => setTimeout(r, 700))
  await page.screenshot({ path: '/tmp/helix-shots/step8-mobile.png', fullPage: false })
  await browser.close()
}

// 4. Verify the three link hrefs after Task 1.
{
  const { browser, page } = await getPage(1280, 900)
  const hrefs = await page.evaluate(() => {
    const out = {}
    // Verified Results eyebrow link "Live on Base mainnet ↗"
    const live = Array.from(document.querySelectorAll('a')).find((a) => a.textContent?.includes('Live on Base mainnet'))
    out.live = live?.getAttribute('href') ?? null
    // Crypto cluster meta "raw tx data ↗"
    const rawTx = Array.from(document.querySelectorAll('a')).find((a) => a.textContent?.toLowerCase().includes('raw tx data'))
    out.rawTx = rawTx?.getAttribute('href') ?? null
    // Benchmark footer "Read methodology →"
    const meth = Array.from(document.querySelectorAll('a')).find((a) => a.textContent?.toLowerCase().includes('read methodology'))
    out.methodology = meth?.getAttribute('href') ?? null
    // Confirm there is NO 'methodology ↗' (with arrow) in Web2 cluster meta
    const web2Meth = Array.from(document.querySelectorAll('a')).find((a) => /methodology ↗/.test(a.textContent || ''))
    out.web2MethodologyAnchor = web2Meth?.getAttribute('href') ?? null
    return out
  })
  console.log('LINK CHECK:', JSON.stringify(hrefs, null, 2))
  await browser.close()
}
