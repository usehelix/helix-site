// Click-through + dead-link audit for the revision pass.
// Uses URL polling because Next.js Link does client-side routing
// (waitForNavigation never fires on a soft nav).
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })

async function newPage() {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 })
  return page
}

async function waitForUrl(page, predicate, timeoutMs = 5000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (predicate(page.url())) return true
    await new Promise((r) => setTimeout(r, 100))
  }
  return false
}

// 1. Homepage Docs nav link -> /docs.
{
  const page = await newPage()
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' })
  await page.click('nav a[href="/docs"]')
  const ok = await waitForUrl(page, (u) => u.endsWith('/docs'))
  const h1 = ok ? await page.$eval('h1', (el) => el.textContent) : 'TIMEOUT'
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  /docs via nav  (h1="${h1}")`)
  await page.close()
}

// 2. Homepage Research nav link -> /research.
{
  const page = await newPage()
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' })
  await page.click('nav a[href="/research"]')
  const ok = await waitForUrl(page, (u) => u.endsWith('/research'))
  const h1 = ok ? await page.$eval('h1', (el) => el.textContent) : 'TIMEOUT'
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  /research via nav  (h1="${h1}")`)
  await page.close()
}

// 3. "Back to home" on docs -> /.
{
  const page = await newPage()
  await page.goto('http://localhost:3001/docs', { waitUntil: 'networkidle2' })
  await page.evaluate(() => {
    const back = Array.from(document.querySelectorAll('a')).find((a) => a.textContent?.trim() === 'Back to home')
    back?.click()
  })
  const ok = await waitForUrl(page, (u) => u.endsWith('/'))
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  docs Back to home -> ${page.url()}`)
  await page.close()
}

// 4. "Back to home" on research -> /.
{
  const page = await newPage()
  await page.goto('http://localhost:3001/research', { waitUntil: 'networkidle2' })
  await page.evaluate(() => {
    const back = Array.from(document.querySelectorAll('a')).find((a) => a.textContent?.trim() === 'Back to home')
    back?.click()
  })
  const ok = await waitForUrl(page, (u) => u.endsWith('/'))
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  research Back to home -> ${page.url()}`)
  await page.close()
}

// 5. Footer Resources column resolves.
{
  const page = await newPage()
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' })
  const resources = await page.evaluate(() => {
    const targets = ['Documentation', 'Research', 'GitHub']
    const out = {}
    for (const t of targets) {
      const a = Array.from(document.querySelectorAll('footer a')).find((a) => a.textContent?.trim() === t)
      out[t] = a?.getAttribute('href') ?? null
    }
    return out
  })
  const ok =
    resources.Documentation === '/docs' &&
    resources.Research === '/research' &&
    resources.GitHub?.includes('github.com/usehelix')
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  Footer Resources  ${JSON.stringify(resources)}`)
  await page.close()
}

// 6. No bare "#" placeholder anchors (excluding #how/#benchmark/#use-cases which ARE valid).
{
  const page = await newPage()
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' })
  const placeholders = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href="#"]')).map((a) => ({
      text: (a.textContent || '').trim().slice(0, 50),
    }))
  })
  console.log(`  ${placeholders.length === 0 ? 'PASS' : 'FAIL'}  no bare "#" anchors  (${placeholders.length} found: ${JSON.stringify(placeholders.slice(0, 3))})`)
  await page.close()
}

// 7. Footer should NOT contain Blog / Privacy / Terms / Company / About / Careers anchors.
{
  const page = await newPage()
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' })
  const forbidden = await page.evaluate(() => {
    const ban = ['Blog', 'Privacy', 'Terms', 'Company', 'About', 'Careers']
    const out = []
    const footer = document.querySelector('footer')
    if (!footer) return ['NO_FOOTER']
    for (const t of ban) {
      const a = Array.from(footer.querySelectorAll('*')).find((el) => el.textContent?.trim() === t)
      if (a) out.push(t)
    }
    return out
  })
  console.log(`  ${forbidden.length === 0 ? 'PASS' : 'FAIL'}  removed footer items  (still present: ${JSON.stringify(forbidden)})`)
  await page.close()
}

// 8. Bottom bar has Contact + Twitter.
{
  const page = await newPage()
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' })
  const bottom = await page.evaluate(() =>
    Array.from(document.querySelectorAll('footer a')).map((a) => a.textContent?.trim()).filter(Boolean),
  )
  const hasContact = bottom.includes('Contact')
  const hasTwitter = bottom.includes('Twitter')
  console.log(`  ${hasContact && hasTwitter ? 'PASS' : 'FAIL'}  Contact + Twitter in footer  (texts: ${JSON.stringify(bottom)})`)
  await page.close()
}

// 9. CTAStrip "Read the docs" -> /docs.
{
  const page = await newPage()
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' })
  const href = await page.$eval(
    'a',
    () => {
      const cta = Array.from(document.querySelectorAll('a')).find((a) => /Read the docs/i.test(a.textContent || ''))
      return cta?.getAttribute('href') ?? null
    },
  )
  console.log(`  ${href === '/docs' ? 'PASS' : 'FAIL'}  CTAStrip Read the docs href = ${href}`)
  await page.close()
}

// 10. Nav no longer has Blog link.
{
  const page = await newPage()
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' })
  const blog = await page.evaluate(() => {
    const nav = document.querySelector('nav')
    if (!nav) return 'NO_NAV'
    return Array.from(nav.querySelectorAll('a')).find((a) => a.textContent?.trim() === 'Blog')?.getAttribute('href') ?? null
  })
  console.log(`  ${blog === null ? 'PASS' : 'FAIL'}  Nav has no Blog link  (got: ${blog})`)
  await page.close()
}

await browser.close()
