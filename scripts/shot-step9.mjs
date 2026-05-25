// Step 9 verification: full-page strips + FAQ interaction + nav anchors.
import puppeteer from 'puppeteer'

async function newPage(width, height) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
  // Pre-warm every Reveal by scrolling to the bottom then back so all in-view
  // animations have settled before we capture.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await new Promise((r) => setTimeout(r, 800))
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 400))
  return { browser, page }
}

// 1) Full-page desktop strip (after Reveals settled).
{
  const { browser, page } = await newPage(1280, 1200)
  await page.screenshot({ path: '/tmp/helix-shots/step9-fullpage-desktop.png', fullPage: true })
  await browser.close()
  console.log('ok full desktop')
}

// 2) Full-page mobile strip.
{
  const { browser, page } = await newPage(375, 900)
  await page.screenshot({ path: '/tmp/helix-shots/step9-fullpage-mobile.png', fullPage: true })
  await browser.close()
  console.log('ok full mobile')
}

// 3) FAQ interaction sequence.
{
  const { browser, page } = await newPage(1280, 900)
  // Scroll to FAQ section (no id; find by SectionEyebrow text).
  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find((s) =>
      s.textContent?.trim().toLowerCase() === 'common questions',
    )
    eyebrow?.closest('section')?.scrollIntoView({ block: 'start' })
  })
  await new Promise((r) => setTimeout(r, 600))

  // Filter to FAQ buttons only — exclude the mobile-nav hamburger which also
  // uses aria-expanded.
  const buttons = await page.$$('button[aria-expanded]:not([aria-label="Open menu"])')
  // a) closed state
  await page.screenshot({ path: '/tmp/helix-shots/step9-faq-closed.png', fullPage: false })

  // b) open Q1
  await buttons[0].click()
  await new Promise((r) => setTimeout(r, 450))
  const state1 = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button[aria-expanded]')).map((b) => b.getAttribute('aria-expanded')),
  )
  await page.screenshot({ path: '/tmp/helix-shots/step9-faq-q1-open.png', fullPage: false })

  // c) open Q2 (should close Q1)
  await buttons[1].click()
  await new Promise((r) => setTimeout(r, 450))
  const state2 = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button[aria-expanded]')).map((b) => b.getAttribute('aria-expanded')),
  )
  await page.screenshot({ path: '/tmp/helix-shots/step9-faq-q2-open.png', fullPage: false })

  console.log('FAQ states:')
  console.log('  after Q1 click:', state1.join(','))
  console.log('  after Q2 click:', state2.join(','))
  await browser.close()
}

// 4) Nav anchor click smoke test.
{
  const { browser, page } = await newPage(1280, 900)
  // Click "Use cases" nav link
  const before = await page.evaluate(() => window.scrollY)
  await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(
      (a) => a.textContent?.trim() === 'Use cases' && a.getAttribute('href') === '#use-cases',
    )
    link?.click()
  })
  await new Promise((r) => setTimeout(r, 700))
  const after = await page.evaluate(() => {
    const el = document.getElementById('use-cases')
    if (!el) return { scrollY: window.scrollY, visible: false }
    const r = el.getBoundingClientRect()
    return { scrollY: window.scrollY, top: r.top, visible: r.top < window.innerHeight }
  })
  console.log('nav anchor:', { before, after })
  await browser.close()
}
