// Acceptance checks 5, 7, 8 against the running production server on :3001.
import puppeteer from 'puppeteer'

const ALLOWED_AMBER = new Set(['rgb(245, 158, 11)', 'rgb(252, 211, 77)', 'rgb(251, 191, 36)'])
const PURPLE_FORBIDDEN = [
  /rgb\(128,\s*0,\s*128\)/, // pure purple
  /rgb\(168,\s*85,\s*247\)/, // tailwind purple-500
  /rgb\(147,\s*51,\s*234\)/, // purple-600
  /rgb\(192,\s*132,\s*252\)/, // purple-400
  /rgb\(217,\s*70,\s*239\)/, // fuchsia-500
]

async function newPage(width, height) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' })
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
  return { browser, page }
}

// ============ 5. Mobile breakpoint sweep =============
console.log('=== 5. Breakpoint sweep ===')
for (const w of [375, 768, 1280]) {
  const { browser, page } = await newPage(w, 900)
  // Walk the page so all Reveals fire, then check for horizontal scrollbar.
  await page.evaluate(async (vh) => {
    const total = document.documentElement.scrollHeight
    for (let y = 0; y <= total; y += Math.floor(vh * 0.6)) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 150))
    }
    window.scrollTo(0, 0)
  }, 900)
  await new Promise((r) => setTimeout(r, 300))

  const overflow = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    viewW: window.innerWidth,
    docH: document.documentElement.scrollHeight,
  }))
  const hOverflow = overflow.docW > overflow.viewW
  console.log(`  ${w}px  doc=${overflow.docW}  view=${overflow.viewW}  doc-h=${overflow.docH}  hOverflow=${hOverflow ? 'FAIL' : 'PASS'}`)
  await page.screenshot({ path: `/tmp/helix-shots/step10-sweep-${w}.png`, fullPage: true })
  await browser.close()
}

// ============ 7. Link audit =============
console.log('\n=== 7. Link audit ===')
{
  const { browser, page } = await newPage(1280, 900)
  // Make all sections visible (some Reveals affect link rendering inside CTA / footer).
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight
    for (let y = 0; y <= total; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 100))
    }
    window.scrollTo(0, 0)
  })
  await new Promise((r) => setTimeout(r, 200))

  const links = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('a[href]'))
    return all.map((a) => ({
      text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      href: a.getAttribute('href'),
      target: a.getAttribute('target'),
      rel: a.getAttribute('rel'),
    }))
  })

  const calendly = links.filter((l) => /Book a demo/i.test(l.text))
  const github = links.filter((l) => l.text === 'GitHub' || /Star on GitHub/.test(l.text))
  const live = links.find((l) => /Live on Base mainnet/i.test(l.text))
  const rawTx = links.find((l) => /raw tx data/i.test(l.text))
  const meth = links.find((l) => /Read methodology/i.test(l.text))
  const twitter = links.find((l) => l.text === 'Twitter')
  const ucNav = links.find((l) => l.text === 'Use cases' && l.href === '#use-cases')

  const checks = []
  for (const l of calendly) {
    checks.push({
      name: 'Book a demo → calendly',
      pass: l.href === 'https://calendly.com/digitalnomadsnick/30min' && l.target === '_blank' && /noopener/.test(l.rel || ''),
      detail: `${l.text} → ${l.href}  target=${l.target}  rel=${l.rel}`,
    })
  }
  for (const l of github) {
    checks.push({
      name: 'GitHub → usehelix/helix',
      pass: l.href === 'https://github.com/usehelix/helix' && l.target === '_blank',
      detail: `${l.text} → ${l.href}`,
    })
  }
  const GIST = 'https://gist.github.com/adrianhihi/ca534f22dee0a1fe2eb4e0e47cb9c3e8'
  checks.push({ name: 'Live on Base mainnet → gist', pass: live?.href === GIST, detail: live?.href })
  checks.push({ name: 'raw tx data → gist',          pass: rawTx?.href === GIST, detail: rawTx?.href })
  checks.push({ name: 'Read methodology → gist',     pass: meth?.href === GIST, detail: meth?.href })
  checks.push({ name: 'Twitter → x.com/dapanji_eth', pass: twitter?.href === 'https://x.com/dapanji_eth', detail: twitter?.href })
  checks.push({ name: 'Nav #use-cases exists',       pass: ucNav?.href === '#use-cases',                  detail: ucNav?.href })

  for (const c of checks) console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}  (${c.detail})`)
  await browser.close()
}

// ============ 8. Color audit =============
console.log('\n=== 8. Color audit ===')
{
  const { browser, page } = await newPage(1280, 900)
  // Walk the page to render all Reveals.
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight
    for (let y = 0; y <= total; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 100))
    }
    window.scrollTo(0, 0)
  })
  await new Promise((r) => setTimeout(r, 200))

  const purples = await page.evaluate((PURPLE) => {
    const re = PURPLE.map((s) => new RegExp(s))
    const offenders = []
    const all = document.querySelectorAll('*')
    for (const el of all) {
      const cs = getComputedStyle(el)
      const candidates = [cs.color, cs.backgroundColor, cs.borderTopColor, cs.borderBottomColor, cs.borderLeftColor, cs.borderRightColor]
      for (const c of candidates) {
        for (const r of re) {
          if (r.test(c)) {
            offenders.push({ tag: el.tagName, cls: el.className?.toString().slice(0,80), color: c })
          }
        }
      }
      if (offenders.length > 8) break
    }
    return offenders
  }, PURPLE_FORBIDDEN.map((r) => r.source))

  console.log(`  purple-family in UI: ${purples.length === 0 ? 'PASS' : 'FAIL — ' + JSON.stringify(purples.slice(0, 4))}`)

  // Amber is allowed in three places per spec + preview.html:
  // 1. Inside .terminal-wrap (HEAL/LEARN tags, accents, cursor)
  // 2. Inside the dark code block in #code (the wrap() function token)
  // 3. The ★ in the GitHub pill (preview.html canon: `.gh-pill .star{color:#fbbf24}`)
  const ambers = await page.evaluate(() => {
    const AMBER = new Set(['rgb(245, 158, 11)', 'rgb(252, 211, 77)', 'rgb(251, 191, 36)'])
    const offenders = []
    const all = document.querySelectorAll('*')
    for (const el of all) {
      if (el.closest('.terminal-wrap')) continue
      if (el.tagName === 'IMG' || el.tagName === 'svg' || el.tagName === 'SVG') continue
      // Allowed: descendants of a dark code surface (bg-code-bg) inside #code.
      const inDarkCode = el.closest('#code') && el.closest('.bg-code-bg')
      if (inDarkCode) continue
      // Allowed: the GitHub star pill literal (preview.html canon).
      if (el.tagName === 'SPAN' && el.textContent?.trim() === '★') continue
      const cs = getComputedStyle(el)
      const fields = { color: cs.color, bg: cs.backgroundColor, border: cs.borderTopColor }
      for (const [k, v] of Object.entries(fields)) {
        if (AMBER.has(v)) {
          offenders.push({ where: k, tag: el.tagName, cls: el.className?.toString().slice(0,60), value: v })
          if (offenders.length > 10) break
        }
      }
    }
    return offenders
  })
  console.log(`  amber in UI chrome: ${ambers.length === 0 ? 'PASS (allowed zones: .terminal-wrap, dark code block in #code, ★ icon)' : 'FAIL — ' + JSON.stringify(ambers.slice(0,4))}`)
  await browser.close()
}
