'use client'

import { useEffect, useRef } from 'react'

/*
  Helix Kids Lab · Code Lab — block-coding playground, ported from the drop-in
  reference (helix-kids-code-lab.html) into the site's React/Next stack.

  Porting notes (same pattern as KidsLab.tsx):
  - Client component; styles scoped under #kids-lab-code so nothing leaks.
  - Fonts defer to the site's next/font vars (--font-inter / --font-mono); the
    external Google Fonts <link> is dropped.
  - The game is a self-contained state machine driven imperatively from a single
    effect over the static shell (positions, async run loop, droplets rely on DOM
    geometry — a faithful port keeps the tested behavior intact). Listeners are
    cleaned up on unmount (Strict Mode safe).
  - COPPA-safe: no free-text inputs, no forms, nothing stored or transmitted.
    Analytics is additionally suppressed on this route by ConditionalAnalytics.
  - Block background colors are darkened vs. the reference so white block labels
    clear WCAG AA contrast (Lighthouse Accessibility 100).
*/

type BlockKey = 'right' | 'left' | 'water' | 'refill' | 'guard'

interface Level {
  title: string
  mission: string
  tiles: number
  plants: number[]
  capacity: number
  palette: BlockKey[]
  maxBlocks: number
  lesson?: string
  winText: string
}

const LEVELS: Level[] = [
  {
    title: 'Water the garden',
    mission:
      '<div class="m-title">Mission 1</div>Move Hexa <strong>right</strong> and <strong>water both plants</strong>. The can starts full — this one is a warm-up.',
    tiles: 6,
    plants: [2, 4],
    capacity: 3,
    palette: ['right', 'left', 'water'],
    maxBlocks: 8,
    winText:
      'You just wrote a program: a list of steps a robot follows exactly. Exactly is the fun part — and the dangerous part. On to Level 2.',
  },
  {
    title: 'Three thirsty plants',
    mission:
      '<div class="m-title">Mission 2</div>Three plants this time. Plan the whole route <strong>before</strong> you press RUN — a program runs all at once, exactly as written.',
    tiles: 7,
    plants: [1, 3, 5],
    capacity: 3,
    palette: ['right', 'left', 'water'],
    maxBlocks: 12,
    winText:
      'Nice planning. You predicted what the program would do before it ran — engineers call that "thinking like the machine." Level 3 has a surprise for you.',
  },
  {
    title: 'The can runs dry',
    mission:
      '<div class="m-title">Mission 3</div>Three plants, but the can only holds <strong>2 water</strong>. Try your Level-2 style program and see what happens. (Hint: the <strong>REFILL</strong> block only works at the sink, tile 0.)',
    tiles: 7,
    plants: [2, 4, 6],
    capacity: 2,
    palette: ['right', 'left', 'water', 'refill'],
    maxBlocks: 18,
    lesson: 'empty can → go refill at the sink',
    winText:
      "THAT was real debugging: your program failed, the error told you exactly why, and you fixed the plan. Lesson earned — check your memory book. But wasn't walking back by hand a lot of work? Level 4 fixes that forever.",
  },
  {
    title: 'Teach the program to fix itself',
    mission:
      '<div class="m-title">Mission 4 · The big one</div>FIVE plants, a 2-water can, and only <strong>14 blocks</strong> — not enough to write every refill trip by hand. Use the new green <strong>SELF-REPAIR</strong> block: put it anywhere in your program, and whenever the can is empty, Hexa will automatically go refill and come back. You\'re not writing every step anymore — you\'re writing the <strong>rule</strong>.',
    tiles: 8,
    plants: [1, 3, 4, 6, 7],
    capacity: 2,
    palette: ['right', 'left', 'water', 'refill', 'guard'],
    maxBlocks: 14,
    lesson: 'write the fix as a rule → the program repairs itself',
    winText:
      'You just wrote a SELF-REPAIRING PROGRAM. Instead of listing every step, you taught it a rule for fixing its own problem — and it handled every empty can on its own. This is genuinely what the engineers at Helix do all day, just with bigger robots. Welcome to the club.',
  },
]

const BLOCK_DEFS: Record<BlockKey, { label: string; glyph: string; cls: string }> = {
  right: { label: 'MOVE', glyph: '→', cls: 'b-right' },
  left: { label: 'MOVE', glyph: '←', cls: 'b-left' },
  water: { label: 'WATER', glyph: '💧', cls: 'b-water' },
  refill: { label: 'REFILL', glyph: '🚰', cls: 'b-refill' },
  guard: { label: 'SELF-REPAIR: IF EMPTY → REFILL', glyph: '', cls: 'b-guard' },
}

const HEXA_SVG =
  '<div class="body"><svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<rect x="10" y="14" width="32" height="26" rx="7" fill="white"/>' +
  '<circle cx="21" cy="25" r="3.4" fill="#4f46e5"/><circle cx="31" cy="25" r="3.4" fill="#4f46e5"/>' +
  '<path d="M20 33 Q26 37 32 33" stroke="#4f46e5" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
  '<line x1="26" y1="14" x2="26" y2="8" stroke="white" stroke-width="2.6" stroke-linecap="round"/>' +
  '<circle cx="26" cy="6" r="2.6" fill="white"/></svg></div>'

function plantSVG(watered: boolean): string {
  const leaf = watered ? '#10b981' : '#9ca3af'
  return (
    '<svg class="plant-pot" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M14 30h16l-2.5 10h-11z" fill="#f59e0b" opacity="' + (watered ? 1 : 0.55) + '"/>' +
    '<path class="leaf" d="M22 30V18" stroke="' + leaf + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path class="leaf" d="M22 22c-6 0-8-5-8-8 5 0 8 3 8 8zM22 20c6 0 8-5 8-8-5 0-8 3-8 8z" fill="' + leaf + '"/>' +
    (watered ? '<circle cx="22" cy="10" r="2.4" fill="#f472b6"/>' : '') +
    '</svg>'
  )
}

const SINK_SVG =
  '<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<rect x="8" y="24" width="28" height="12" rx="4" fill="#4f46e5" opacity=".85"/>' +
  '<path d="M14 24v-8h10" stroke="#4f46e5" stroke-width="3" stroke-linecap="round" fill="none"/>' +
  '<path d="M24 18v3" stroke="#60a5fa" stroke-width="2.6" stroke-linecap="round"/></svg>'

const CODE_LAB_CSS = `
#kids-lab-code {
  --indigo: #4f46e5; --indigo-deep: #3730a3; --indigo-light: #eef2ff;
  --sun: #f59e0b; --sun-light: #fef3c7;
  --mint: #10b981; --mint-light: #d1fae5;
  --gray-900: #111827; --gray-700: #374151; --gray-600: #4b5563;
  --gray-200: #e5e7eb; --gray-100: #f3f4f6; --gray-50: #f9fafb;
  --mono: var(--font-mono), 'JetBrains Mono', monospace;
  font-family: var(--font-inter), 'Inter', sans-serif;
  color: var(--gray-900); background: #fff; line-height: 1.6;
}
#kids-lab-code *, #kids-lab-code *::before, #kids-lab-code *::after { margin: 0; padding: 0; box-sizing: border-box; }
#kids-lab-code button { font-family: var(--font-inter), 'Inter', sans-serif; }
#kids-lab-code .wrap { max-width: 980px; margin: 0 auto; padding: 0 20px; }

@media (prefers-reduced-motion: reduce) {
  #kids-lab-code *, #kids-lab-code *::before, #kids-lab-code *::after { animation: none !important; transition: none !important; }
}

/* ===== header ===== */
#kids-lab-code .top { padding: 72px 0 40px; text-align: center; }
#kids-lab-code .top .tag {
  font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase; color: var(--indigo); background: var(--indigo-light);
  padding: 7px 14px; border-radius: 999px; display: inline-block; margin-bottom: 20px;
}
#kids-lab-code .top h1 { font-size: clamp(30px, 4.5vw, 44px); font-weight: 900; letter-spacing: -.03em; line-height: 1.12; }
#kids-lab-code .top h1 em { font-style: normal; color: var(--indigo); }
#kids-lab-code .top p { font-size: 17px; color: var(--gray-600); max-width: 560px; margin: 14px auto 0; }

/* ===== level pills ===== */
#kids-lab-code .levels { display: flex; gap: 8px; justify-content: center; margin: 32px 0 0; flex-wrap: wrap; }
#kids-lab-code .levels button {
  font-family: var(--mono); font-size: 12px; font-weight: 600; letter-spacing: .04em;
  padding: 9px 16px; border-radius: 999px; border: 1.5px solid var(--gray-200);
  background: #fff; color: var(--gray-600); cursor: pointer; transition: all .15s;
}
#kids-lab-code .levels button.active { background: var(--indigo); border-color: var(--indigo); color: #fff; }
#kids-lab-code .levels button.done:not(.active) { border-color: #047857; color: #047857; }
#kids-lab-code .levels button.done:not(.active)::before { content: '✓ '; }
#kids-lab-code .levels button:disabled { opacity: .4; cursor: default; }
#kids-lab-code .levels button:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }

/* ===== mission card ===== */
#kids-lab-code .mission {
  margin: 28px auto 0; max-width: 760px; background: var(--indigo-light);
  border-left: 4px solid var(--indigo); border-radius: 0 14px 14px 0;
  padding: 18px 22px; font-size: 15px; color: var(--indigo-deep); text-align: left;
}
#kids-lab-code .mission strong { font-weight: 700; }
#kids-lab-code .mission .m-title { font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; margin-bottom: 6px; }

/* ===== garden stage ===== */
#kids-lab-code .stage-card { border: 1px solid var(--gray-200); border-radius: 20px; overflow: hidden; margin: 28px 0; }
#kids-lab-code .stage-head { background: var(--gray-50); border-bottom: 1px solid var(--gray-200); padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
#kids-lab-code .stage-head .hud { display: flex; gap: 18px; font-family: var(--mono); font-size: 12px; color: var(--gray-700); flex-wrap: wrap; }
#kids-lab-code .stage-head .hud > span { white-space: nowrap; flex-shrink: 0; }
#kids-lab-code .stage-head .hud b { color: var(--indigo); font-weight: 600; }
#kids-lab-code .stage-head .hud .water-pips { display: inline-flex; align-items: center; gap: 7px; }
#kids-lab-code #hud-water { display: inline-flex; align-items: center; gap: 3px; }
#kids-lab-code #hud-water span { width: 10px; height: 13px; border-radius: 0 0 6px 6px; border: 1.5px solid var(--indigo); flex-shrink: 0; }
#kids-lab-code #hud-water span.full { background: var(--indigo); }

#kids-lab-code .garden { padding: 40px 22px 30px; overflow-x: auto; }
#kids-lab-code .track { display: flex; gap: 8px; justify-content: center; min-width: fit-content; position: relative; }
#kids-lab-code .tile {
  width: 84px; height: 96px; border-radius: 14px; background: var(--gray-50);
  border: 1.5px solid var(--gray-200); position: relative; flex-shrink: 0;
  display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px;
}
#kids-lab-code .tile .t-num { position: absolute; top: 6px; left: 8px; font-family: var(--mono); font-size: 10px; color: var(--gray-600); }
#kids-lab-code .tile.sink { background: var(--indigo-light); border-color: #c7d2fe; }
#kids-lab-code .tile svg { width: 44px; height: 44px; }
#kids-lab-code .plant-pot .leaf { transition: fill .4s; }
#kids-lab-code .tile.watered { border-color: var(--mint); background: var(--mint-light); }

#kids-lab-code .hexa-sprite {
  position: absolute; top: -34px; left: 0; width: 64px; height: 64px;
  transition: transform .45s ease; z-index: 3; pointer-events: none;
}
#kids-lab-code .hexa-sprite .body {
  width: 64px; height: 64px; border-radius: 16px; background: var(--indigo);
  display: grid; place-items: center; transition: background .3s;
}
#kids-lab-code .hexa-sprite.sad .body { background: var(--sun); animation: clab-shake .45s ease; }
#kids-lab-code .hexa-sprite.happy .body { background: var(--mint); }
@keyframes clab-shake { 0%,100% { transform: translateX(0);} 25% { transform: translateX(-4px);} 75% { transform: translateX(4px);} }
#kids-lab-code .hexa-sprite svg { width: 40px; height: 40px; }

#kids-lab-code .droplet {
  position: absolute; width: 12px; height: 16px; background: #60a5fa;
  border-radius: 0 50% 50% 50%; transform: rotate(45deg); opacity: 0;
  z-index: 2; animation: clab-drop .5s ease forwards;
}
@keyframes clab-drop { 0% { opacity: 1; translate: 0 -20px; } 100% { opacity: 0; translate: 0 12px; } }

/* ===== console ===== */
#kids-lab-code .console {
  margin: 0 22px 22px; background: var(--gray-900); border-radius: 12px;
  padding: 14px 18px; font-family: var(--mono); font-size: 13px; line-height: 1.7;
  color: #d1d5db; min-height: 58px;
}
#kids-lab-code .console .ok { color: #6ee7b7; }
#kids-lab-code .console .err { color: #fcd34d; }
#kids-lab-code .console .sys { color: #a5b4fc; }

/* ===== builder ===== */
#kids-lab-code .builder { display: grid; grid-template-columns: 240px 1fr; gap: 20px; margin-bottom: 40px; }
#kids-lab-code .palette, #kids-lab-code .program-card { border: 1px solid var(--gray-200); border-radius: 16px; padding: 18px; }
#kids-lab-code .panel-label { font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--gray-600); margin-bottom: 12px; display: block; }
#kids-lab-code .palette .blocks { display: flex; flex-direction: column; gap: 8px; }
#kids-lab-code .block {
  font-size: 14px; font-weight: 700; padding: 12px 14px; border-radius: 10px;
  border: none; cursor: pointer; text-align: left; color: #fff; width: 100%;
  transition: transform .1s, filter .15s; display: flex; align-items: center; gap: 8px;
}
#kids-lab-code .block:hover { filter: brightness(1.08); }
#kids-lab-code .block:active { transform: scale(.97); }
#kids-lab-code .block:focus-visible { outline: 2px solid var(--gray-900); outline-offset: 2px; }
#kids-lab-code .block:disabled { opacity: .35; cursor: default; }
#kids-lab-code .block .glyph { font-family: var(--mono); font-weight: 600; }
#kids-lab-code .b-right, #kids-lab-code .b-left { background: var(--indigo); }
#kids-lab-code .b-water { background: #2563eb; }
#kids-lab-code .b-refill { background: #0369a1; }
#kids-lab-code .b-guard { background: #047857; }
#kids-lab-code .palette .hint { font-size: 12px; color: var(--gray-600); margin-top: 12px; }

#kids-lab-code .program-strip {
  display: flex; flex-wrap: wrap; gap: 8px; min-height: 116px;
  background: var(--gray-50); border: 1.5px dashed var(--gray-200);
  border-radius: 12px; padding: 12px; align-content: flex-start;
}
#kids-lab-code .program-strip.empty::after {
  content: 'Tap blocks on the left to build Hexa’s program →';
  font-size: 13px; color: var(--gray-600); align-self: center; margin: auto;
}
#kids-lab-code .p-block {
  display: inline-flex; align-items: center; gap: 6px; color: #fff;
  font-size: 12.5px; font-weight: 700; padding: 9px 10px; border-radius: 9px;
  border: none; cursor: pointer; position: relative; transition: transform .1s;
}
#kids-lab-code .p-block .idx { font-family: var(--mono); font-size: 10px; opacity: .75; font-weight: 600; }
#kids-lab-code .p-block .x { font-weight: 400; opacity: .7; margin-left: 2px; }
#kids-lab-code .p-block:hover .x { opacity: 1; }
#kids-lab-code .p-block:focus-visible { outline: 2px solid var(--gray-900); outline-offset: 2px; }
#kids-lab-code .p-block.running { outline: 3px solid var(--gray-900); outline-offset: 2px; }
#kids-lab-code .p-block.failed { outline: 3px solid var(--sun); outline-offset: 2px; animation: clab-shake .4s; }
#kids-lab-code .p-block.b-guard::before { content: '🛡'; }

#kids-lab-code .program-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; flex-wrap: wrap; gap: 10px; }
#kids-lab-code .slots { font-family: var(--mono); font-size: 12px; color: var(--gray-600); }
#kids-lab-code .slots b { color: var(--indigo); }
#kids-lab-code .run-controls { display: flex; gap: 10px; }
#kids-lab-code .btn-primary {
  background: var(--indigo); color: #fff; border: 2px solid var(--indigo);
  font-size: 14px; font-weight: 700; padding: 11px 22px; border-radius: 11px; cursor: pointer;
  transition: background .15s, transform .1s;
}
#kids-lab-code .btn-primary:hover { background: var(--indigo-deep); }
#kids-lab-code .btn-primary:active { transform: scale(.97); }
#kids-lab-code .btn-primary:disabled { opacity: .45; cursor: default; }
#kids-lab-code .btn-ghost {
  background: #fff; color: var(--gray-700); border: 2px solid var(--gray-200);
  font-size: 14px; font-weight: 600; padding: 11px 18px; border-radius: 11px; cursor: pointer;
  transition: border-color .15s;
}
#kids-lab-code .btn-ghost:hover { border-color: var(--indigo); }
#kids-lab-code .btn-ghost:disabled { opacity: .45; cursor: default; }

/* ===== win banner ===== */
#kids-lab-code .win {
  display: none; margin: 0 0 40px; background: var(--mint-light); border: 1.5px solid var(--mint);
  border-radius: 16px; padding: 22px 26px; text-align: center;
}
#kids-lab-code .win.show { display: block; }
#kids-lab-code .win h2 { font-size: 20px; font-weight: 800; color: #065f46; }
#kids-lab-code .win p { font-size: 14.5px; color: #047857; margin: 6px auto 14px; max-width: 560px; }

/* ===== memory book ===== */
#kids-lab-code .membook { border: 1px solid var(--gray-200); border-radius: 16px; padding: 18px 22px; margin-bottom: 40px; }
#kids-lab-code .membook ul { list-style: none; }
#kids-lab-code .membook li { font-family: var(--mono); font-size: 13px; color: var(--indigo-deep); background: var(--indigo-light); border-radius: 8px; padding: 8px 12px; margin: 4px 6px 4px 0; display: inline-block; }
#kids-lab-code .membook li::before { content: '✓ '; color: var(--mint); font-weight: 700; }
#kids-lab-code .membook .empty { background: none; color: var(--gray-600); font-family: var(--font-inter), 'Inter', sans-serif; font-size: 13px; padding: 0; }
#kids-lab-code .membook .empty::before { content: none; }

#kids-lab-code .foot-note { text-align: center; font-size: 13px; color: var(--gray-600); padding: 8px 0 56px; }
#kids-lab-code .foot-note a { color: var(--indigo); font-weight: 600; text-decoration: none; }
#kids-lab-code .privacy-line { font-family: var(--mono); font-size: 11px; color: var(--gray-600); text-align: center; padding-bottom: 32px; }

@media (max-width: 720px) {
  #kids-lab-code .builder { grid-template-columns: 1fr; }
  #kids-lab-code .palette .blocks { flex-direction: row; flex-wrap: wrap; }
  #kids-lab-code .palette .blocks .block { width: auto; }
  #kids-lab-code .tile { width: 64px; height: 80px; }
  #kids-lab-code .tile svg { width: 34px; height: 34px; }
  #kids-lab-code .hexa-sprite { width: 52px; height: 52px; top: -28px; }
  #kids-lab-code .hexa-sprite .body { width: 52px; height: 52px; }
}
`

export function CodeLab() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const STEP_MS = reduced ? 0 : 520

    const $ = (id: string): any => root.querySelector('#' + id)
    const levelsEl = $('levels')
    const missionEl = $('mission')
    const trackEl = $('track')
    const consoleEl = $('console')
    const paletteEl = $('palette')
    const programEl = $('program')
    const winEl = $('win')

    let levelIdx = 0
    let unlocked = 0
    let program: BlockKey[] = []
    let running = false
    let pos = 0
    let water = 0
    let wateredSet: Record<number, boolean> = {}
    const lessons: string[] = []

    const L = () => LEVELS[levelIdx]

    function renderLevels() {
      levelsEl.innerHTML = ''
      LEVELS.forEach((_lv, i) => {
        const b = document.createElement('button')
        b.textContent = 'LEVEL ' + (i + 1)
        b.disabled = i > unlocked
        if (i === levelIdx) b.classList.add('active')
        if (i < unlocked) b.classList.add('done')
        b.addEventListener('click', () => { if (!running) loadLevel(i) })
        levelsEl.appendChild(b)
      })
    }

    function renderTrack() {
      trackEl.innerHTML = ''
      for (let i = 0; i < L().tiles; i++) {
        const t = document.createElement('div')
        t.className = 'tile' + (i === 0 ? ' sink' : '')
        t.setAttribute('data-tile', String(i))
        t.innerHTML = '<span class="t-num">' + i + '</span>'
        if (i === 0) t.innerHTML += SINK_SVG
        if (L().plants.indexOf(i) !== -1) {
          const w = !!wateredSet[i]
          t.innerHTML += plantSVG(w)
          if (w) t.classList.add('watered')
        }
        trackEl.appendChild(t)
      }
      const sprite = document.createElement('div')
      sprite.className = 'hexa-sprite'
      sprite.id = 'hexa'
      sprite.innerHTML = HEXA_SVG
      trackEl.appendChild(sprite)
      positionHexa()
    }

    function positionHexa() {
      const tile = trackEl.querySelector('[data-tile="' + pos + '"]')
      const sprite = $('hexa')
      if (!tile || !sprite) return
      const x = tile.offsetLeft + (tile.offsetWidth - sprite.offsetWidth) / 2
      sprite.style.transform = 'translateX(' + x + 'px)'
    }

    function hexaMood(m?: string) {
      const s = $('hexa')
      if (!s) return
      s.classList.remove('sad', 'happy')
      if (m) s.classList.add(m)
    }

    function renderHUD(status?: string) {
      $('hud-level').textContent = String(levelIdx + 1)
      let pips = ''
      for (let i = 0; i < L().capacity; i++) pips += '<span class="' + (i < water ? 'full' : '') + '"></span>'
      $('hud-water').innerHTML = pips
      $('hud-plants').textContent = Object.keys(wateredSet).length + '/' + L().plants.length
      if (status) $('hud-status').textContent = status
    }

    function renderPalette() {
      paletteEl.innerHTML = ''
      L().palette.forEach((key: BlockKey) => {
        const d = BLOCK_DEFS[key]
        const b = document.createElement('button')
        b.className = 'block ' + d.cls
        b.innerHTML = (d.glyph ? '<span class="glyph">' + d.glyph + '</span>' : '') + d.label
        b.addEventListener('click', () => {
          if (running) return
          if (key === 'guard' && program.indexOf('guard') !== -1) {
            log('sys', '» One SELF-REPAIR block is enough — the rule protects the whole program.')
            return
          }
          if (program.length >= L().maxBlocks) {
            log('err', '» Program is full (' + L().maxBlocks + ' blocks). Can you do it with fewer steps — or a smarter rule?')
            return
          }
          program.push(key)
          renderProgram()
        })
        paletteEl.appendChild(b)
      })
    }

    function renderProgram(activeIdx?: number | null, failIdx?: number | null) {
      programEl.innerHTML = ''
      programEl.classList.toggle('empty', program.length === 0)
      program.forEach((key: BlockKey, i: number) => {
        const d = BLOCK_DEFS[key]
        const b = document.createElement('button')
        b.className = 'p-block ' + d.cls
        if (i === activeIdx) b.classList.add('running')
        if (i === failIdx) b.classList.add('failed')
        b.innerHTML =
          '<span class="idx">' + (i + 1) + '</span>' +
          (d.glyph ? '<span class="glyph">' + d.glyph + '</span>' : '') +
          d.label + '<span class="x">×</span>'
        b.setAttribute('aria-label', 'Step ' + (i + 1) + ': ' + d.label + '. Tap to remove.')
        b.addEventListener('click', () => {
          if (running) return
          program.splice(i, 1)
          renderProgram()
        })
        programEl.appendChild(b)
      })
      $('slots-used').textContent = String(program.length)
      $('slots-max').textContent = String(L().maxBlocks)
    }

    function renderMembook() {
      const ul = $('membook-list')
      if (lessons.length === 0) return
      ul.innerHTML = ''
      lessons.forEach((t) => {
        const li = document.createElement('li')
        li.textContent = t
        ul.appendChild(li)
      })
    }

    function log(cls: string, msg: string) {
      consoleEl.innerHTML = '<span class="' + cls + '">' + msg + '</span>'
    }
    function logAppend(cls: string, msg: string) {
      consoleEl.innerHTML += '<br><span class="' + cls + '">' + msg + '</span>'
    }

    function loadLevel(i: number) {
      levelIdx = i
      program = []
      resetRun()
      missionEl.innerHTML = L().mission
      winEl.classList.remove('show')
      renderLevels()
      renderPalette()
      renderProgram()
      renderTrack()
      renderHUD('READY')
      log('sys', '» Level ' + (i + 1) + ': ' + L().title + '. Build a program and press RUN.')
    }

    function resetRun() {
      pos = 0
      water = L().capacity
      wateredSet = {}
    }

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    function dropletAt() {
      const tile = trackEl.querySelector('[data-tile="' + pos + '"]')
      if (!tile || reduced) return
      const d = document.createElement('div')
      d.className = 'droplet'
      d.style.left = tile.offsetLeft + tile.offsetWidth / 2 - 6 + 'px'
      d.style.top = '30px'
      trackEl.appendChild(d)
      setTimeout(() => { d.remove() }, 600)
    }

    async function autoRepair() {
      logAppend('ok', '» 🛡 SELF-REPAIR: can is empty → heading to the sink…')
      hexaMood('happy')
      renderHUD('SELF-REPAIRING')
      const home = pos
      while (pos > 0) { pos--; positionHexa(); await sleep(STEP_MS * 0.55) }
      water = L().capacity
      renderHUD('SELF-REPAIRING')
      logAppend('ok', '» 🛡 Refilled. Heading back to tile ' + home + '…')
      await sleep(STEP_MS * 0.7)
      while (pos < home) { pos++; positionHexa(); await sleep(STEP_MS * 0.55) }
      hexaMood('')
    }

    async function run() {
      if (running || program.length === 0) {
        if (program.length === 0) log('err', '» The program is empty — add some blocks first!')
        return
      }
      running = true
      $('btn-run').disabled = true
      $('btn-clear').disabled = true
      winEl.classList.remove('show')
      resetRun()
      renderTrack()
      renderHUD('RUNNING')
      hexaMood('')
      log('sys', '» RUN: executing ' + program.length + ' blocks, exactly as written…')
      const hasGuard = program.indexOf('guard') !== -1
      await sleep(STEP_MS)

      for (let i = 0; i < program.length; i++) {
        const key = program[i]
        renderProgram(i)
        if (key === 'guard') {
          logAppend('ok', '» STEP ' + (i + 1) + ' · 🛡 SELF-REPAIR rule armed: IF empty THEN refill.')
          await sleep(STEP_MS)
          continue
        }

        if (key === 'right') {
          if (pos >= L().tiles - 1) { return fail(i, 'MOVE → failed — Hexa is at the last tile (' + pos + '). There\'s no garden past the edge!') }
          pos++; positionHexa()
        } else if (key === 'left') {
          if (pos <= 0) { return fail(i, 'MOVE ← failed — Hexa is already at tile 0.') }
          pos--; positionHexa()
        } else if (key === 'water') {
          if (L().plants.indexOf(pos) === -1) { return fail(i, 'WATER failed — there\'s no plant on tile ' + pos + '. Clue: where are the plants?') }
          if (wateredSet[pos]) { return fail(i, 'WATER failed — the plant on tile ' + pos + ' is already watered. Watering twice drowns it!') }
          if (water <= 0) {
            if (hasGuard) { await autoRepair(); renderProgram(i) }
            else { return fail(i, 'WATER failed — the can is empty (0 left). Clue: where can Hexa get more water?') }
          }
          water--
          wateredSet[pos] = true
          dropletAt()
          const tile = trackEl.querySelector('[data-tile="' + pos + '"]')
          tile.classList.add('watered')
          tile.innerHTML = '<span class="t-num">' + pos + '</span>' + plantSVG(true)
          logAppend('ok', '» STEP ' + (i + 1) + ' · 💧 Plant on tile ' + pos + ' watered. (' + water + ' water left)')
        } else if (key === 'refill') {
          if (pos !== 0) { return fail(i, 'REFILL failed — Hexa isn\'t at the sink. The sink is tile 0; Hexa is on tile ' + pos + '.') }
          water = L().capacity
          logAppend('ok', '» STEP ' + (i + 1) + ' · 🚰 Can refilled to ' + water + '.')
        }
        renderHUD('RUNNING')
        await sleep(STEP_MS)
      }

      renderProgram()
      const done = Object.keys(wateredSet).length
      if (done === L().plants.length) {
        hexaMood('happy')
        renderHUD('COMPLETE ✓')
        logAppend('ok', '» PROGRAM COMPLETE — all ' + done + ' plants watered. 🌱')
        levelWin()
      } else {
        hexaMood('sad')
        renderHUD('INCOMPLETE')
        logAppend('err', '» Program ended, but ' + (L().plants.length - done) + ' plant(s) are still thirsty. The program did exactly what it said — it just didn\'t say enough. Add the missing steps!')
      }
      running = false
      $('btn-run').disabled = false
      $('btn-clear').disabled = false
    }

    function fail(i: number, msg: string) {
      renderProgram(null, i)
      hexaMood('sad')
      renderHUD('ERROR')
      logAppend('err', '» STEP ' + (i + 1) + ' · ⚠ ' + msg)
      logAppend('sys', '» A good error tells you WHAT went wrong and WHERE. That\'s your clue — fix the program and RUN again.')
      if (levelIdx === 2 && msg.indexOf('empty') !== -1 && lessons.indexOf(LEVELS[2].lesson as string) === -1) {
        logAppend('sys', '» (This is the famous empty-can problem from Chapter 3. You know what Hexa did…)')
      }
      running = false
      $('btn-run').disabled = false
      $('btn-clear').disabled = false
    }

    function levelWin() {
      const lv = L()
      if (lv.lesson && lessons.indexOf(lv.lesson) === -1) {
        lessons.push(lv.lesson)
        renderMembook()
      }
      $('win-title').textContent = levelIdx === LEVELS.length - 1 ? '🏆 You did it — a self-repairing program!' : 'Level ' + (levelIdx + 1) + ' complete!'
      $('win-text').textContent = lv.winText
      $('btn-next').style.display = levelIdx === LEVELS.length - 1 ? 'none' : ''
      winEl.classList.add('show')
      winEl.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
      if (levelIdx >= unlocked) { unlocked = levelIdx + 1; renderLevels() }
    }

    const onClear = () => { if (!running) { program = []; renderProgram(); log('sys', '» Program cleared.') } }
    const onNext = () => { loadLevel(levelIdx + 1) }

    const btnRun = $('btn-run')
    const btnClear = $('btn-clear')
    const btnNext = $('btn-next')
    btnRun.addEventListener('click', run)
    btnClear.addEventListener('click', onClear)
    btnNext.addEventListener('click', onNext)
    window.addEventListener('resize', positionHexa)

    loadLevel(0)

    return () => {
      btnRun.removeEventListener('click', run)
      btnClear.removeEventListener('click', onClear)
      btnNext.removeEventListener('click', onNext)
      window.removeEventListener('resize', positionHexa)
    }
  }, [])

  return (
    <div id="kids-lab-code" ref={rootRef}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: CODE_LAB_CSS }} />

      <header className="top">
        <div className="wrap">
          <span className="tag">Helix Kids Lab · Code Lab · Ages 8–12 · No sign-up</span>
          <h1>
            Write your first <em>self-repairing program</em>
          </h1>
          <p>
            Build a program from blocks, press RUN, and guide Hexa through the garden. Fair warning: real
            programs fail sometimes. That&rsquo;s where it gets fun.
          </p>
          <div className="levels" id="levels" role="group" aria-label="Levels" />
        </div>
      </header>

      <main className="wrap">
        <div className="mission" id="mission" aria-live="polite" />

        <div className="stage-card">
          <div className="stage-head">
            <div className="hud">
              <span>
                LEVEL <b id="hud-level">1</b>
              </span>
              <span className="water-pips">
                WATER <span id="hud-water" />
              </span>
              <span>
                PLANTS <b id="hud-plants">0/0</b>
              </span>
            </div>
            <div className="hud">
              <span id="hud-status">READY</span>
            </div>
          </div>
          <div className="garden">
            <div className="track" id="track" />
          </div>
          <div className="console" id="console" aria-live="polite">
            <span className="sys">» Hexa is ready. Build a program and press RUN.</span>
          </div>
        </div>

        <div className="builder">
          <div className="palette">
            <span className="panel-label">Blocks</span>
            <div className="blocks" id="palette" />
            <p className="hint" id="palette-hint">
              Tap a block to add it to the program. Tap a block in the program to remove it.
            </p>
          </div>
          <div className="program-card">
            <span className="panel-label">Hexa&rsquo;s program</span>
            <div className="program-strip empty" id="program" />
            <div className="program-foot">
              <span className="slots">
                BLOCKS USED <b id="slots-used">0</b> / <span id="slots-max">8</span>
              </span>
              <div className="run-controls">
                <button className="btn-ghost" id="btn-clear">
                  Clear
                </button>
                <button className="btn-primary" id="btn-run">
                  ▶ RUN
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="win" id="win">
          <h2 id="win-title">Level complete!</h2>
          <p id="win-text" />
          <button className="btn-primary" id="btn-next">
            Next level →
          </button>
        </div>

        <div className="membook">
          <span className="panel-label">Your memory book — lessons you&rsquo;ve earned</span>
          <ul id="membook-list">
            <li className="empty">
              Empty so far. Lessons appear when you learn them the real way — by fixing something.
            </li>
          </ul>
        </div>
      </main>

      <p className="foot-note">
        Part of <a href="/kids-lab">Helix Kids Lab</a> — free coding &amp; problem-solving lessons for schools,
        libraries, and code clubs.
      </p>
      <p className="privacy-line">
        PRIVACY: nothing you build here is saved or sent anywhere. Refreshing the page starts fresh. No forms,
        no accounts, no tracking.
      </p>
    </div>
  )
}
