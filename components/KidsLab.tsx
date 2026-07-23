'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Helix Kids Lab — full curriculum page, ported from the drop-in reference
  (helix-kids-lab-full.html) into the site's React/Next stack.

  Fidelity / porting notes:
  - Six chapters + three interactives (Hexa demo, immunity wave, quiz) + word lab,
    all copy preserved verbatim.
  - Styles are the reference styles, scoped under #kids-lab so nothing leaks into
    Nav/Footer. Font literals defer to the site's next/font CSS vars
    (--font-inter / --font-mono) — no external Google Fonts request.
  - Vanilla JS is reimplemented in React: an IntersectionObserver drives the .rv
    scroll-reveal (imperative, over static nodes only); each interactive is a
    stateful sub-component.
  - COPPA-safe: no forms, inputs, cookies, or analytics — same as the reference.
    Vercel Analytics is additionally suppressed on this route (see
    ConditionalAnalytics).
  - Reduced motion: CSS forces .rv visible and disables animations; the reveal
    effect reveals everything immediately, and the wave collapses its timeline to
    0ms so all content still renders visible.
*/

const KIDS_LAB_CSS = `
#kids-lab {
  --indigo: #4f46e5;
  --indigo-deep: #3730a3;
  --indigo-light: #eef2ff;
  --sun: #f59e0b;
  --sun-light: #fef3c7;
  --mint: #10b981;
  --mint-light: #d1fae5;
  --gray-900: #111827;
  --gray-700: #374151;
  --gray-600: #4b5563;
  --gray-200: #e5e7eb;
  --gray-100: #f3f4f6;
  --gray-50: #f9fafb;
  --mono: var(--font-mono), 'JetBrains Mono', monospace;
  font-family: var(--font-inter), 'Inter', sans-serif;
  color: var(--gray-900);
  background: #fff;
  line-height: 1.6;
}
#kids-lab *, #kids-lab *::before, #kids-lab *::after { margin: 0; padding: 0; box-sizing: border-box; }
#kids-lab button { font-family: var(--font-inter), 'Inter', sans-serif; }
#kids-lab svg text { font-family: var(--mono); }

#kids-lab .kl-wrap { max-width: 1060px; margin: 0 auto; padding: 0 24px; }

/* ============ scroll reveal ============ */
#kids-lab .rv { opacity: 0; transform: translateY(22px); transition: opacity .6s ease, transform .6s ease; }
#kids-lab .rv.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  #kids-lab .rv { opacity: 1; transform: none; transition: none; }
  #kids-lab *, #kids-lab *::before, #kids-lab *::after { animation: none !important; transition: none !important; }
}

/* ============ chapter chrome ============ */
#kids-lab .chapter { padding: 88px 0; }
#kids-lab .chapter + .chapter { border-top: 1px solid var(--gray-100); }
#kids-lab .ch-eyebrow {
  font-family: var(--mono); font-size: 11px; font-weight: 600;
  letter-spacing: .14em; text-transform: uppercase; color: var(--indigo);
  display: inline-flex; align-items: center; gap: 8px; margin-bottom: 14px;
}
#kids-lab .ch-eyebrow::before {
  content: ''; width: 13px; height: 15px; background: var(--indigo);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
#kids-lab .ch-title { font-size: 34px; font-weight: 800; letter-spacing: -.025em; line-height: 1.18; max-width: 620px; }
#kids-lab .ch-title em { font-style: normal; color: var(--indigo); }
#kids-lab .ch-sub { font-size: 17px; color: var(--gray-600); max-width: 580px; margin-top: 12px; }

/* ============ HERO ============ */
#kids-lab .hero { padding: 96px 0 72px; text-align: center; position: relative; overflow: hidden; }
#kids-lab .hero-bg-shape { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .5; pointer-events: none; }
#kids-lab .hero-bg-shape.a { width: 380px; height: 380px; background: var(--indigo-light); top: -120px; left: -80px; }
#kids-lab .hero-bg-shape.b { width: 300px; height: 300px; background: var(--mint-light); bottom: -100px; right: -60px; }
#kids-lab .hero-tag {
  font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase; color: var(--indigo); background: var(--indigo-light);
  padding: 7px 14px; border-radius: 999px; display: inline-block; margin-bottom: 22px;
}
#kids-lab .hero h1 {
  font-size: clamp(34px, 5.5vw, 56px); font-weight: 900; letter-spacing: -.035em;
  line-height: 1.1; max-width: 780px; margin: 0 auto;
}
#kids-lab .hero h1 em { font-style: normal; color: var(--indigo); position: relative; white-space: nowrap; }
#kids-lab .hero h1 em::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 10px;
  background: var(--sun-light); z-index: -1; border-radius: 3px;
}
#kids-lab .hero p { font-size: 18px; color: var(--gray-600); max-width: 520px; margin: 18px auto 0; }

#kids-lab .hero-hexa { margin: 44px auto 0; width: 150px; height: 150px; position: relative; }
#kids-lab .hero-hexa .bot {
  width: 150px; height: 150px; border-radius: 32px; background: var(--indigo);
  display: grid; place-items: center; animation: kl-float 3.4s ease-in-out infinite;
}
@keyframes kl-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
#kids-lab .hero-hexa svg { width: 96px; height: 96px; }
#kids-lab .hexa-eye { animation: kl-blink 4.2s infinite; transform-origin: center; }
@keyframes kl-blink { 0%,94%,100% { transform: scaleY(1); } 96%,98% { transform: scaleY(.08); } }

#kids-lab .hero-nav { margin-top: 48px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
#kids-lab .hero-nav a {
  font-size: 13px; font-weight: 600; color: var(--gray-700); text-decoration: none;
  border: 1.5px solid var(--gray-200); border-radius: 999px; padding: 9px 16px;
  transition: border-color .15s, background .15s, color .15s;
}
#kids-lab .hero-nav a:hover, #kids-lab .hero-nav a:focus-visible { border-color: var(--indigo); background: var(--indigo-light); color: var(--indigo-deep); }
#kids-lab .hero-nav a span { font-family: var(--mono); font-size: 10px; color: var(--indigo); margin-right: 6px; }

/* ============ CH1 — Mars story ============ */
#kids-lab .mars-scene {
  margin-top: 44px; border: 1px solid var(--gray-200); border-radius: 20px;
  background: linear-gradient(180deg, #f8f7ff 0%, #fff 60%); padding: 40px 32px; text-align: center;
  position: relative; overflow: hidden;
}
#kids-lab .mars-orbit { width: min(420px, 90%); margin: 0 auto; display: block; }
#kids-lab .mars-craft { animation: kl-drift 7s ease-in-out infinite alternate; transform-origin: center; }
@keyframes kl-drift { from { transform: translateX(-8px) rotate(-4deg); } to { transform: translateX(8px) rotate(4deg); } }
#kids-lab .mars-cap { font-size: 15px; color: var(--gray-600); max-width: 560px; margin: 22px auto 0; }
#kids-lab .mars-cap strong { color: var(--gray-900); }

#kids-lab .fact-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 28px; text-align: left; }
#kids-lab .fact-card { background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 14px; padding: 20px; }
#kids-lab .fact-card .k { font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--indigo); margin-bottom: 8px; }
#kids-lab .fact-card p { font-size: 14px; color: var(--gray-700); }

#kids-lab .lesson-band {
  margin-top: 28px; background: var(--indigo-light); border-left: 4px solid var(--indigo);
  border-radius: 0 12px 12px 0; padding: 20px 24px; font-size: 16px; color: var(--indigo-deep);
  text-align: left;
}
#kids-lab .lesson-band strong { font-weight: 700; }

/* ============ CH2 — the loop ============ */
#kids-lab .loop-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 44px; }
#kids-lab .loop-step {
  border: 1.5px solid var(--gray-200); border-radius: 16px; padding: 24px 20px;
  position: relative; transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
  background: #fff;
}
#kids-lab .loop-step:hover { transform: translateY(-4px); border-color: var(--indigo); box-shadow: 0 10px 28px rgba(79,70,229,.1); }
#kids-lab .loop-step .n { font-family: var(--mono); font-size: 11px; font-weight: 600; color: var(--gray-600); letter-spacing: .12em; }
#kids-lab .loop-step h3 { font-size: 21px; font-weight: 800; margin: 8px 0 6px; letter-spacing: -.01em; }
#kids-lab .loop-step p { font-size: 14px; color: var(--gray-600); }
#kids-lab .loop-step .icon { width: 44px; height: 44px; margin-bottom: 14px; border-radius: 12px; display: grid; place-items: center; }
#kids-lab .loop-step:nth-child(1) .icon { background: var(--indigo-light); }
#kids-lab .loop-step:nth-child(2) .icon { background: var(--sun-light); }
#kids-lab .loop-step:nth-child(3) .icon { background: var(--indigo-light); }
#kids-lab .loop-step:nth-child(4) .icon { background: var(--mint-light); }
#kids-lab .loop-step .icon svg { width: 24px; height: 24px; }
#kids-lab .loop-step::after {
  content: '→'; position: absolute; right: -14px; top: 50%; transform: translateY(-50%);
  font-size: 18px; color: var(--indigo); font-weight: 700; z-index: 2;
}
#kids-lab .loop-step:last-child::after { content: none; }

#kids-lab .loop-back { margin-top: 18px; text-align: center; font-family: var(--mono); font-size: 12px; color: var(--mint); font-weight: 600; letter-spacing: .06em; }
#kids-lab .loop-motto { text-align: center; margin-top: 36px; font-size: 22px; font-weight: 800; letter-spacing: -.015em; }
#kids-lab .loop-motto span { color: var(--mint); }

/* ============ demo shared card ============ */
#kids-lab .demo-card { border: 1px solid var(--gray-200); border-radius: 20px; overflow: hidden; margin-top: 44px; }
#kids-lab .demo-head { background: var(--indigo-light); padding: 18px 26px; display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
#kids-lab .demo-head h3 { font-size: 17px; font-weight: 700; color: var(--indigo-deep); }
#kids-lab .demo-head span { font-family: var(--mono); font-size: 11px; color: var(--indigo); letter-spacing: .08em; }
#kids-lab .demo-body { padding: 30px 26px; }

/* ---- Hexa demo ---- */
#kids-lab .kl-robot-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
#kids-lab .kl-robot {
  width: 88px; height: 88px; border-radius: 20px; flex-shrink: 0;
  background: var(--indigo); display: grid; place-items: center;
  transition: background .35s ease, transform .2s ease;
}
#kids-lab .kl-robot svg { width: 54px; height: 54px; }
#kids-lab .kl-robot.sad { background: var(--sun); animation: kl-shake .45s ease; }
#kids-lab .kl-robot.happy { background: var(--mint); transform: scale(1.06); }
@keyframes kl-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-2deg); } 75% { transform: translateX(5px) rotate(2deg); } }
#kids-lab .kl-speech { flex: 1; min-width: 240px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 14px; padding: 16px 18px; font-size: 15px; color: var(--gray-700); }
#kids-lab .kl-speech strong { color: var(--gray-900); }
#kids-lab .kl-choices { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
#kids-lab .kl-choices button, #kids-lab .btn-pill {
  font-size: 14px; font-weight: 600; padding: 12px 18px; border-radius: 12px; cursor: pointer;
  border: 2px solid var(--gray-200); background: #fff; color: var(--gray-900);
  transition: border-color .15s, background .15s, transform .1s;
}
#kids-lab .kl-choices button:hover, #kids-lab .kl-choices button:focus-visible, #kids-lab .btn-pill:hover, #kids-lab .btn-pill:focus-visible { border-color: var(--indigo); background: var(--indigo-light); }
#kids-lab .kl-choices button:focus-visible, #kids-lab .btn-pill:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }
#kids-lab .kl-choices button:active { transform: scale(.97); }
#kids-lab .kl-choices button:disabled { opacity: .45; cursor: default; }
#kids-lab .kl-memory { margin-top: 22px; border-top: 1px dashed var(--gray-200); padding-top: 18px; }
#kids-lab .kl-memory .label { font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--gray-600); margin-bottom: 10px; display: block; }
#kids-lab .kl-memory ul { list-style: none; }
#kids-lab .kl-memory li { font-family: var(--mono); font-size: 13px; color: var(--indigo-deep); background: var(--indigo-light); border-radius: 8px; padding: 8px 12px; margin-bottom: 6px; display: inline-block; }
#kids-lab .kl-memory li::before { content: '\\2713 '; color: var(--mint); font-weight: 700; }
#kids-lab .kl-memory .empty { font-size: 13px; color: var(--gray-600); background: none; padding: 0; font-family: var(--font-inter), 'Inter', sans-serif; }
#kids-lab .kl-memory .empty::before { content: none; }

/* ============ CH4 — immunity wave ============ */
#kids-lab .wave-stage { text-align: center; }
#kids-lab .wave-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 14px; max-width: 640px; margin: 0 auto; }
#kids-lab .wave-bot { aspect-ratio: 1; border-radius: 22%; background: var(--gray-100); display: grid; place-items: center; transition: background .4s ease, transform .3s ease; }
#kids-lab .wave-bot svg { width: 62%; height: 62%; }
#kids-lab .wave-bot .face { fill: var(--gray-600); transition: fill .4s ease; }
#kids-lab .wave-bot.fail { background: var(--sun); animation: kl-shake .5s ease; }
#kids-lab .wave-bot.fail .face { fill: #fff; }
#kids-lab .wave-bot.immune { background: var(--mint); transform: scale(1.06); }
#kids-lab .wave-bot.immune .face { fill: #fff; }
#kids-lab .wave-caption { margin: 24px auto 0; font-size: 16px; color: var(--gray-700); max-width: 520px; min-height: 52px; }
#kids-lab .wave-caption strong { color: var(--gray-900); }
#kids-lab .wave-controls { margin-top: 18px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
#kids-lab .btn-primary {
  background: var(--indigo); color: #fff; border: 2px solid var(--indigo);
  font-size: 14px; font-weight: 700; padding: 12px 22px; border-radius: 12px; cursor: pointer;
  transition: background .15s, transform .1s;
}
#kids-lab .btn-primary:hover { background: var(--indigo-deep); }
#kids-lab .btn-primary:active { transform: scale(.97); }
#kids-lab .btn-primary:disabled { opacity: .45; cursor: default; }
#kids-lab .wave-book { margin: 26px auto 0; max-width: 380px; background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 14px; padding: 16px 20px; text-align: left; }
#kids-lab .wave-book .label { font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--gray-600); }
#kids-lab .wave-book .rule { font-family: var(--mono); font-size: 13px; color: var(--indigo-deep); margin-top: 8px; opacity: 0; transition: opacity .5s ease; }
#kids-lab .wave-book .rule.show { opacity: 1; }
#kids-lab .wave-book .rule::before { content: '\\2713 '; color: var(--mint); font-weight: 700; }

/* ============ CH5 — quiz ============ */
#kids-lab .quiz-progress { display: flex; gap: 6px; margin-bottom: 22px; }
#kids-lab .quiz-progress i { flex: 1; height: 6px; border-radius: 3px; background: var(--gray-200); transition: background .3s; }
#kids-lab .quiz-progress i.done { background: var(--indigo); }
#kids-lab .quiz-q { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
#kids-lab .quiz-scenario { font-size: 15px; color: var(--gray-600); margin-bottom: 18px; }
#kids-lab .quiz-opts { display: grid; gap: 10px; }
#kids-lab .quiz-opts button {
  text-align: left; font-size: 15px; font-weight: 500; padding: 14px 16px;
  border: 2px solid var(--gray-200); border-radius: 12px; background: #fff; cursor: pointer;
  transition: border-color .15s, background .15s;
}
#kids-lab .quiz-opts button:hover, #kids-lab .quiz-opts button:focus-visible { border-color: var(--indigo); background: var(--indigo-light); }
#kids-lab .quiz-opts button:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }
#kids-lab .quiz-opts button.right { border-color: var(--mint); background: var(--mint-light); }
#kids-lab .quiz-opts button.wrong { border-color: var(--sun); background: var(--sun-light); }
#kids-lab .quiz-opts button:disabled { cursor: default; }
#kids-lab .quiz-explain { margin-top: 16px; font-size: 14px; color: var(--gray-700); background: var(--gray-50); border-radius: 12px; padding: 14px 16px; display: none; }
#kids-lab .quiz-explain.show { display: block; }
#kids-lab .quiz-explain strong { color: var(--gray-900); }
#kids-lab .quiz-next { margin-top: 16px; display: none; }
#kids-lab .quiz-next.show { display: inline-block; }
#kids-lab .quiz-score { text-align: center; padding: 12px 0; }
#kids-lab .quiz-score .big { font-size: 46px; font-weight: 900; color: var(--indigo); letter-spacing: -.02em; }
#kids-lab .quiz-score p { font-size: 16px; color: var(--gray-600); margin-top: 6px; }

/* ============ CH6 — body analogy ============ */
#kids-lab .body-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 40px; }
#kids-lab .body-card { border: 1px solid var(--gray-200); border-radius: 18px; padding: 28px; background: var(--gray-50); }
#kids-lab .body-card .who { font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 14px; }
#kids-lab .body-card.you .who { color: var(--sun); }
#kids-lab .body-card.bot .who { color: var(--indigo); }
#kids-lab .body-card ol { list-style: none; counter-reset: s; }
#kids-lab .body-card li { counter-increment: s; font-size: 14.5px; color: var(--gray-700); padding: 10px 0 10px 40px; position: relative; }
#kids-lab .body-card li + li { border-top: 1px dashed var(--gray-200); }
#kids-lab .body-card li::before {
  content: counter(s); position: absolute; left: 0; top: 9px;
  width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center;
  font-family: var(--mono); font-size: 12px; font-weight: 600; color: #fff;
}
#kids-lab .body-card.you li::before { background: var(--sun); }
#kids-lab .body-card.bot li::before { background: var(--indigo); }
#kids-lab .body-punch { grid-column: 1 / -1; text-align: center; font-size: 17px; font-weight: 700; padding: 18px; background: var(--mint-light); border-radius: 14px; color: #065f46; }

/* ============ word lab ============ */
#kids-lab .word-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 40px; }
#kids-lab .word-card { border: 1.5px solid var(--gray-200); border-radius: 14px; padding: 18px 16px; cursor: pointer; background: #fff; text-align: left; transition: border-color .15s, transform .15s; }
#kids-lab .word-card:hover, #kids-lab .word-card:focus-visible { border-color: var(--indigo); transform: translateY(-3px); }
#kids-lab .word-card:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }
#kids-lab .word-card .w { font-family: var(--mono); font-size: 15px; font-weight: 600; color: var(--indigo); display: block; }
#kids-lab .word-card .d { font-size: 13px; color: var(--gray-600); margin-top: 8px; display: none; }
#kids-lab .word-card.open .d { display: block; }
#kids-lab .word-card .hint { font-size: 11px; color: var(--gray-600); margin-top: 8px; font-family: var(--mono); display: block; }
#kids-lab .word-card.open .hint { display: none; }

/* ============ grown-ups ============ */
#kids-lab .grownups { background: var(--gray-900); color: #fff; border-radius: 22px; padding: 44px 40px; display: grid; grid-template-columns: 1.5fr 1fr; gap: 28px; align-items: center; margin-top: 44px; }
#kids-lab .grownups h3 { font-size: 24px; font-weight: 800; letter-spacing: -.02em; margin-bottom: 10px; }
#kids-lab .grownups p { font-size: 15px; color: #d1d5db; }
#kids-lab .grownups .cta { text-align: right; }
#kids-lab .grownups a.btn { display: inline-block; background: #fff; color: var(--gray-900); font-weight: 700; font-size: 15px; padding: 14px 26px; border-radius: 12px; text-decoration: none; transition: transform .1s; }
#kids-lab .grownups a.btn:hover { transform: translateY(-2px); }
#kids-lab .grownups .privacy { grid-column: 1 / -1; font-family: var(--mono); font-size: 11px; color: #9ca3af; border-top: 1px solid #374151; padding-top: 18px; margin-top: 8px; }
/* ============ CH7 — Code Lab teaser ============ */
#kids-lab .codelab-teaser {
  display: flex; align-items: center; justify-content: space-between; gap: 28px;
  text-decoration: none; color: inherit; border: 1.5px solid var(--gray-200);
  border-radius: 20px; padding: 32px 34px; margin-top: 8px;
  background: linear-gradient(180deg, var(--indigo-light), #fff 72%);
  transition: border-color .15s, box-shadow .2s, transform .2s;
}
#kids-lab .codelab-teaser:hover { border-color: var(--indigo); box-shadow: 0 12px 30px rgba(79,70,229,.12); transform: translateY(-3px); }
#kids-lab .codelab-teaser:focus-visible { outline: 2px solid var(--indigo); outline-offset: 3px; }
#kids-lab .codelab-teaser .ct-cta { display: inline-block; margin-top: 16px; font-weight: 700; color: var(--indigo); font-size: 15px; }
#kids-lab .codelab-teaser .ct-art { flex: none; }
@media (max-width: 620px) {
  #kids-lab .codelab-teaser { flex-direction: column; align-items: flex-start; padding: 26px 22px; }
}

#kids-lab .footer-line { text-align: center; font-size: 13px; color: var(--gray-600); padding: 36px 0 56px; }

/* ============ responsive ============ */
@media (max-width: 860px) {
  #kids-lab .loop-grid { grid-template-columns: 1fr 1fr; }
  #kids-lab .loop-step::after { content: none; }
  #kids-lab .word-grid { grid-template-columns: repeat(3, 1fr); }
  #kids-lab .wave-grid { grid-template-columns: repeat(6, 1fr); }
}
@media (max-width: 620px) {
  #kids-lab .chapter { padding: 64px 0; }
  #kids-lab .ch-title { font-size: 27px; }
  #kids-lab .fact-cards, #kids-lab .body-grid { grid-template-columns: 1fr; }
  #kids-lab .word-grid { grid-template-columns: 1fr 1fr; }
  #kids-lab .grownups { grid-template-columns: 1fr; padding: 32px 24px; }
  #kids-lab .grownups .cta { text-align: left; }
  #kids-lab .wave-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; }
}
`

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ===================== CH3 — Hexa demo ===================== */

type Choice = { id: string; label: string }
type Mood = '' | 'sad' | 'happy'

const HEXA_START = '<strong>Hexa wants to water the plants</strong> — but the watering can is empty! What should Hexa do?'
const HEXA_START_BUTTONS: Choice[] = [
  { id: 'retry', label: 'Try again the same way' },
  { id: 'think', label: 'Stop and figure out why' },
  { id: 'quit', label: 'Give up forever' },
]

function HexaDemo() {
  const [stage, setStage] = useState(0)
  const [mood, setMood] = useState<Mood>('')
  const [speech, setSpeech] = useState(HEXA_START)
  const [buttons, setButtons] = useState<Choice[]>(HEXA_START_BUTTONS)
  const [disabled, setDisabled] = useState<Set<string>>(new Set())
  const [lessons, setLessons] = useState<string[]>([])

  const disable = (id: string) => setDisabled((p) => new Set(p).add(id))

  function handle(c: string) {
    if (disabled.has(c)) return
    if (stage === 0) {
      if (c === 'retry') {
        setMood('sad')
        setSpeech(
          'Hexa tried again the same way… still empty! <strong>Doing the same thing gives the same mistake.</strong> What else could Hexa try?',
        )
        disable('retry')
      } else if (c === 'quit') {
        setMood('sad')
        setSpeech(
          'Hexa sat down and felt sad. But wait — <strong>giving up means never learning.</strong> Real engineers never pick this one. Try another idea!',
        )
        disable('quit')
      } else if (c === 'think') {
        setMood('happy')
        setLessons(['empty can → refill at the sink first'])
        setSpeech(
          'Hexa stopped, looked inside the can, and saw the problem: <strong>no water!</strong> Hexa refilled it at the sink — plants watered! 🌱 Hexa wrote the fix in the memory book. Ready for the next day?',
        )
        setButtons([{ id: 'next', label: 'Next day →' }])
        setStage(1)
      }
    } else if (stage === 1 && c === 'next') {
      setMood('')
      setSpeech(
        'The next morning, Hexa picks up the watering can. <strong>It feels empty again!</strong> What happens now?',
      )
      setButtons([
        { id: 'panic', label: 'Uh oh, same problem!' },
        { id: 'memory', label: 'Check the memory book' },
      ])
      setStage(2)
    } else if (stage === 2) {
      if (c === 'panic') {
        setSpeech(
          'It <em>is</em> the same problem — but is it really a problem anymore? <strong>Hexa has seen this before…</strong>',
        )
        disable('panic')
      } else if (c === 'memory') {
        setMood('happy')
        setSpeech(
          'Hexa checks the memory book: <strong>"empty can → refill at the sink first."</strong> Fixed in two seconds, no help needed! That\'s self-repair: <strong>fix once, and the mistake never wins twice.</strong> Now scroll on — because it gets even better when robots share one book.',
        )
        setButtons([{ id: 'restart', label: 'Play again' }])
        setStage(3)
      }
    } else if (stage === 3 && c === 'restart') {
      setStage(0)
      setLessons([])
      setMood('')
      setDisabled(new Set())
      setSpeech(HEXA_START)
      setButtons(HEXA_START_BUTTONS)
    }
  }

  return (
    <div className="demo-body">
      <div className="kl-robot-row">
        <div
          className={['kl-robot', mood].filter(Boolean).join(' ')}
          id="kl-robot"
          role="img"
          aria-label="Hexa the robot"
        >
          <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="10" y="14" width="32" height="26" rx="7" fill="white" />
            <circle cx="21" cy="25" r="3.4" fill="#4f46e5" />
            <circle cx="31" cy="25" r="3.4" fill="#4f46e5" />
            <path d="M20 33 Q26 37 32 33" stroke="#4f46e5" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            <line x1="26" y1="14" x2="26" y2="8" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="26" cy="6" r="2.6" fill="white" />
          </svg>
        </div>
        <div className="kl-speech" aria-live="polite" dangerouslySetInnerHTML={{ __html: speech }} />
      </div>
      <div className="kl-choices">
        {buttons.map((b) => (
          <button key={b.id} disabled={disabled.has(b.id)} onClick={() => handle(b.id)}>
            {b.label}
          </button>
        ))}
      </div>
      <div className="kl-memory">
        <span className="label">Hexa&rsquo;s memory book</span>
        <ul>
          {lessons.length === 0 ? (
            <li className="empty">Empty so far — help Hexa learn something!</li>
          ) : (
            lessons.map((l) => <li key={l}>{l}</li>)
          )}
        </ul>
      </div>
    </div>
  )
}

/* ===================== CH4 — immunity wave ===================== */

const BOTS = 24
const FAIL_INDEX = 10
const WAVE_INTRO =
  '<strong>24 robots, one team.</strong> Tomorrow morning, one of them is going to hit the empty-can problem…'

function botDistance(a: number, b: number) {
  const ax = a % 8
  const ay = Math.floor(a / 8)
  const bx = b % 8
  const by = Math.floor(b / 8)
  return Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by))
}

function WaveFace() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect className="face" x="4" y="6" width="16" height="13" rx="3.6" fill="#4b5563" />
      <circle cx="9.6" cy="11.4" r="1.5" fill="#fff" />
      <circle cx="14.4" cy="11.4" r="1.5" fill="#fff" />
      <path d="M9.2 15 Q12 17 14.8 15" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <line x1="12" y1="6" x2="12" y2="3.4" stroke="#4b5563" className="face" strokeWidth="1.4" />
    </svg>
  )
}

function ImmunityWave() {
  const [statuses, setStatuses] = useState<string[]>(() => Array(BOTS).fill('idle'))
  const [caption, setCaption] = useState(WAVE_INTRO)
  const [ruleShown, setRuleShown] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [canReset, setCanReset] = useState(false)
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }
  useEffect(() => () => clearTimers(), [])

  const setStatus = (i: number, v: string) =>
    setStatuses((s) => {
      const c = s.slice()
      c[i] = v
      return c
    })

  function play() {
    if (playing) return
    setPlaying(true)
    const t = prefersReduced() ? 0 : 1
    const push = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms))
    }

    setCaption("Robot #11 picks up the can… <strong>it's empty!</strong>")
    push(() => {
      setStatus(FAIL_INDEX, 'fail')
      push(() => {
        setCaption('Robot #11 stops, figures it out, and <strong>writes the fix into the shared book.</strong>')
        setRuleShown(true)
        setStatus(FAIL_INDEX, 'immune')
        push(() => {
          setCaption('The book syncs. <strong>Watch the immunity spread…</strong>')
          for (let idx = 0; idx < BOTS; idx++) {
            if (idx === FAIL_INDEX) continue
            push(() => setStatus(idx, 'immune'), t * (200 + botDistance(FAIL_INDEX, idx) * 160))
          }
          push(() => {
            setCaption(
              "<strong>All 24 robots are now immune</strong> — including ones that never saw the problem. One lesson, learned once, protecting everyone. That's the superpower.",
            )
            setCanReset(true)
          }, t * 1400)
        }, t * 900)
      }, t * 900)
    }, t * 600)
  }

  function reset() {
    clearTimers()
    setStatuses(Array(BOTS).fill('idle'))
    setRuleShown(false)
    setCaption(WAVE_INTRO)
    setPlaying(false)
    setCanReset(false)
  }

  return (
    <div className="demo-body wave-stage">
      <div className="wave-grid" role="img" aria-label="A team of 24 robots">
        {statuses.map((st, i) => (
          <div key={i} className={'wave-bot' + (st !== 'idle' ? ' ' + st : '')}>
            <WaveFace />
          </div>
        ))}
      </div>
      <div className="wave-book">
        <span className="label">Shared memory book</span>
        <div className={'rule' + (ruleShown ? ' show' : '')}>empty can → refill at the sink first</div>
      </div>
      <p className="wave-caption" dangerouslySetInnerHTML={{ __html: caption }} />
      <div className="wave-controls">
        <button className="btn-primary" onClick={play} disabled={playing}>
          ▶ Play the wave
        </button>
        <button className="btn-pill" onClick={reset} disabled={!canReset}>
          Reset
        </button>
      </div>
    </div>
  )
}

/* ===================== CH5 — quiz ===================== */

type QuizItem = { q: string; s: string; opts: { t: string; ok: boolean }[]; why: string }

const QUIZ: QuizItem[] = [
  {
    q: 'The class robot vacuum keeps bumping the same chair leg every single day.',
    s: "It bumps, backs up, and bumps again tomorrow. What's the smartest upgrade?",
    opts: [
      { t: 'Make it back up faster after each bump', ok: false },
      { t: 'Have it remember where the chair is and steer around it', ok: true },
      { t: 'Tell it to stop vacuuming that room', ok: false },
    ],
    why: 'Backing up faster just repeats the mistake faster — and avoiding the room means giving up. <strong>Remembering the fix</strong> turns one bump into permanent smartness. That\'s step 4 of the loop.',
  },
  {
    q: 'Your paper airplane nose-dives. You fold an identical one. It nose-dives too.',
    s: 'What does the second crash tell you?',
    opts: [
      { t: "Paper airplanes just don't work", ok: false },
      { t: 'You need to throw it harder', ok: false },
      { t: 'Same design → same result. Something about the design needs to change', ok: true },
    ],
    why: 'Two identical tries giving two identical crashes is <strong>information</strong> — the clue points at the design, not your throw. Notice → figure out why → change one thing → try again.',
  },
  {
    q: 'A robot fails a job and shows the message: "Oops! Something went wrong :)"',
    s: 'Why would a repair engineer say this is a bad message?',
    opts: [
      { t: 'It should apologize more', ok: false },
      { t: 'It hides the clue. Without knowing WHAT went wrong, nobody can fix it', ok: true },
      { t: 'The smiley face is unprofessional', ok: false },
    ],
    why: 'A mistake is a clue — but only if you can see it! Good machines say exactly what went wrong, so step 3 (fix) is possible. <strong>Hiding the clue is worse than the mistake.</strong>',
  },
  {
    q: 'A new student joins your class in the middle of the year.',
    s: 'Your class has a "memory book" poster of every mistake you\'ve solved. What\'s the best move?',
    opts: [
      { t: 'Let them make all the same mistakes — it builds character', ok: false },
      { t: 'Show them the memory book on day one, so they start immune', ok: true },
      { t: 'Keep the book secret so your team stays ahead', ok: false },
    ],
    why: '<strong>Shared memory means nobody pays for the same lesson twice</strong> — not even someone who just arrived. That\'s exactly how Helix robots welcome a brand-new teammate.',
  },
]

function quizMessage(score: number) {
  if (score === 4) return 'Perfect. You think exactly like a repair engineer — mistakes are clues, and memory is a superpower.'
  if (score >= 2) return "Nice work! You've got the loop. Replay to catch the tricky ones — even engineers take two tries."
  return 'Every engineer starts somewhere — and you just did step 1 and 2 of the loop: you tried, and you noticed. Replay for step 3!'
}

function Quiz() {
  const [phase, setPhase] = useState<'q' | 'score'>('q')
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState<boolean[]>([false, false, false, false])
  const answered = picked !== null

  function answer(idx: number) {
    if (answered) return
    setPicked(idx)
    if (QUIZ[qi].opts[idx].ok) setScore((s) => s + 1)
    setDone((d) => {
      const c = d.slice()
      c[qi] = true
      return c
    })
  }

  function next() {
    if (qi < QUIZ.length - 1) {
      setQi(qi + 1)
      setPicked(null)
    } else {
      setPhase('score')
    }
  }

  function replay() {
    setPhase('q')
    setQi(0)
    setPicked(null)
    setScore(0)
    setDone([false, false, false, false])
  }

  return (
    <div className="demo-body">
      <div className="quiz-progress">
        {done.map((d, i) => (
          <i key={i} className={d ? 'done' : ''} />
        ))}
      </div>

      {phase === 'q' ? (
        <div>
          <div className="quiz-q">
            Q{qi + 1}. {QUIZ[qi].q}
          </div>
          <div className="quiz-scenario">{QUIZ[qi].s}</div>
          <div className="quiz-opts">
            {QUIZ[qi].opts.map((o, idx) => {
              let cls = ''
              if (answered) {
                if (o.ok) cls = 'right'
                else if (idx === picked) cls = 'wrong'
              }
              return (
                <button key={idx} className={cls} disabled={answered} onClick={() => answer(idx)}>
                  {o.t}
                </button>
              )
            })}
          </div>
          <div
            className={'quiz-explain' + (answered ? ' show' : '')}
            dangerouslySetInnerHTML={{ __html: QUIZ[qi].why }}
          />
          <button className={'btn-primary quiz-next' + (answered ? ' show' : '')} onClick={next}>
            {qi < QUIZ.length - 1 ? 'Next question →' : 'See my result →'}
          </button>
        </div>
      ) : (
        <div className="quiz-score">
          <div className="big">{score} / 4</div>
          <p>{quizMessage(score)}</p>
          <div className="wave-controls" style={{ marginTop: 18 }}>
            <button className="btn-primary" onClick={replay}>
              ↺ Play again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ===================== word lab ===================== */

const WORDS = [
  { w: 'bug', d: 'A mistake in software. Named after a real moth found stuck inside a computer in 1947!' },
  { w: 'debug', d: 'To hunt down a bug and fix it. What you did for Hexa in Chapter 3.' },
  { w: 'loop', d: 'Steps that repeat. Try → notice → fix → remember, then back to try.' },
  { w: 'memory', d: 'Where a computer keeps what it has learned — like Hexa’s notebook.' },
  { w: 'immune', d: 'Protected from a problem because you (or your team) already learned the fix.' },
]

/* ===================== main ===================== */

export function KidsLab() {
  const rootRef = useRef<HTMLDivElement>(null)

  // Scroll-reveal: mirrors the reference's IntersectionObserver, run imperatively
  // over the static .rv nodes (which React never re-renders, so the added `.in`
  // class persists). Reduced motion / no-IO → reveal everything immediately.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = root.querySelectorAll<HTMLElement>('.rv')
    if ('IntersectionObserver' in window && !prefersReduced()) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0.12 },
      )
      els.forEach((el) => io.observe(el))
      return () => io.disconnect()
    }
    els.forEach((el) => el.classList.add('in'))
  }, [])

  return (
    <div id="kids-lab" ref={rootRef}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: KIDS_LAB_CSS }} />

      {/* ================= HERO ================= */}
      <header className="hero">
        <div className="hero-bg-shape a" />
        <div className="hero-bg-shape b" />
        <div className="kl-wrap">
          <span className="hero-tag">Helix Kids Lab · Free for schools &amp; families · Ages 8–12</span>
          <h1>
            How do robots learn to <em>fix their own mistakes?</em>
          </h1>
          <p>
            A hands-on mini-course from the engineers at Helix Labs. Six short chapters, three things to play
            with, zero sign-ups.
          </p>

          <div className="hero-hexa" aria-hidden="true">
            <div className="bot">
              <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="14" width="32" height="26" rx="7" fill="white" />
                <circle className="hexa-eye" cx="21" cy="25" r="3.4" fill="#4f46e5" />
                <circle className="hexa-eye" cx="31" cy="25" r="3.4" fill="#4f46e5" />
                <path d="M20 33 Q26 37 32 33" stroke="#4f46e5" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                <line x1="26" y1="14" x2="26" y2="8" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
                <circle cx="26" cy="6" r="2.6" fill="white" />
              </svg>
            </div>
          </div>

          <nav className="hero-nav" aria-label="Chapters">
            <a href="#ch1"><span>01</span>Even NASA</a>
            <a href="#ch2"><span>02</span>The Loop</a>
            <a href="#ch3"><span>03</span>Teach Hexa</a>
            <a href="#ch4"><span>04</span>The Wave</a>
            <a href="#ch5"><span>05</span>Quiz</a>
            <a href="#ch6"><span>06</span>Your Body</a>
            <a href="#ch7"><span>07</span>Code Lab</a>
          </nav>
        </div>
      </header>

      {/* ================= CH1 — EVEN NASA ================= */}
      <section className="chapter" id="ch1">
        <div className="kl-wrap">
          <div className="rv">
            <span className="ch-eyebrow">Chapter 01 · A true story</span>
            <h2 className="ch-title">
              Even NASA makes mistakes. <em>Really big ones.</em>
            </h2>
            <p className="ch-sub">
              In 1999, NASA sent a spacecraft called the Mars Climate Orbiter all the way to Mars. It never
              arrived. Here&rsquo;s why.
            </p>
          </div>

          <div className="mars-scene rv">
            <svg
              className="mars-orbit"
              viewBox="0 0 420 220"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="A spacecraft drifting off course near Mars"
            >
              <circle cx="320" cy="120" r="58" fill="#fde9d9" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="300" cy="104" r="9" fill="#fbd6b3" />
              <circle cx="336" cy="140" r="6" fill="#fbd6b3" />
              <path d="M20 60 Q160 20 262 78" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="7 7" fill="none" />
              <path d="M262 78 Q300 100 330 178" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 6" fill="none" />
              <text x="60" y="42" fontSize="10" fill="#4f46e5">PLANNED PATH</text>
              <text x="212" y="196" fontSize="10" fill="#b45309">ACTUAL PATH · TOO LOW</text>
              <g className="mars-craft">
                <rect x="248" y="66" width="26" height="16" rx="4" fill="#4f46e5" />
                <rect x="236" y="70" width="10" height="8" rx="2" fill="#818cf8" />
                <rect x="276" y="70" width="10" height="8" rx="2" fill="#818cf8" />
              </g>
            </svg>
            <p className="mars-cap">
              Two engineering teams worked on the same spacecraft. One team measured pushes in{' '}
              <strong>metric units</strong>. The other used <strong>English units</strong>. Nobody noticed the
              mismatch — so every tiny course correction was a little bit wrong. After 400 million miles of tiny
              wrongs, the spacecraft flew too close to Mars and was lost.
            </p>

            <div className="fact-cards">
              <div className="fact-card rv">
                <div className="k">The mistake</div>
                <p>
                  Two teams used two different measuring systems for the same job — like one friend counting in
                  inches while the other counts in centimeters.
                </p>
              </div>
              <div className="fact-card rv">
                <div className="k">The cost</div>
                <p>
                  A spacecraft worth hundreds of millions of dollars, and years of work by very smart people —
                  gone in one morning.
                </p>
              </div>
              <div className="fact-card rv">
                <div className="k">What NASA did next</div>
                <p>
                  They didn&rsquo;t hide it. They studied exactly what went wrong, wrote the lesson down, and
                  changed how every future mission double-checks units.
                </p>
              </div>
            </div>

            <div className="lesson-band rv">
              <strong>The big idea:</strong> smart people and smart machines still make mistakes. What makes them
              smart is what happens <strong>next</strong> — they notice, they fix, and they make sure the same
              mistake never wins twice.
            </div>
          </div>
        </div>
      </section>

      {/* ================= CH2 — THE LOOP ================= */}
      <section className="chapter" id="ch2">
        <div className="kl-wrap">
          <div className="rv">
            <span className="ch-eyebrow">Chapter 02 · The secret</span>
            <h2 className="ch-title">The four-step loop every good problem-solver uses</h2>
            <p className="ch-sub">
              Engineers at Helix teach software this exact loop. It works for robots, for astronauts — and for
              homework.
            </p>
          </div>

          <div className="loop-grid">
            <div className="loop-step rv">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h13M13 6l6 6-6 6" stroke="#4f46e5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="n">STEP 1</div>
              <h3>Try</h3>
              <p>Have a go. You can&rsquo;t learn anything by standing still.</p>
            </div>
            <div className="loop-step rv">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke="#f59e0b" strokeWidth="2.4" />
                  <path d="M16 16l4 4" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="n">STEP 2</div>
              <h3>Notice</h3>
              <p>Did it work? If not — great, you just found a clue.</p>
            </div>
            <div className="loop-step rv">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14.5 4.5a4.5 4.5 0 0 0-6 6L4 15v3h3l4.5-4.5a4.5 4.5 0 0 0 6-6l-2.8 2.8-2.5-2.5L14.5 4.5z"
                    stroke="#4f46e5"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="n">STEP 3</div>
              <h3>Fix</h3>
              <p>Ask <em>why</em> it went wrong, then try a smarter way.</p>
            </div>
            <div className="loop-step rv">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 4h11a3 3 0 0 1 3 3v13l-4-2.5L11 20V4z" stroke="#10b981" strokeWidth="2.2" strokeLinejoin="round" />
                  <path d="M5 4v16" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="n">STEP 4</div>
              <h3>Remember</h3>
              <p>Write the fix down, so the mistake never wins twice.</p>
            </div>
          </div>
          <div className="loop-back rv">↺ …and back to TRY, a little bit smarter each time</div>

          <p className="loop-motto rv">
            Fix once. <span>Never fooled twice.</span>
          </p>
        </div>
      </section>

      {/* ================= CH3 — TEACH HEXA ================= */}
      <section className="chapter" id="ch3">
        <div className="kl-wrap">
          <div className="rv">
            <span className="ch-eyebrow">Chapter 03 · You try it</span>
            <h2 className="ch-title">
              Teach Hexa the robot to <em>fix itself</em>
            </h2>
            <p className="ch-sub">
              Hexa is stuck. Use the loop from Chapter 2 to help — and watch what happens the next day.
            </p>
          </div>

          <div className="demo-card rv">
            <div className="demo-head">
              <h3>Hexa&rsquo;s morning job</h3>
              <span>INTERACTIVE · NO SIGN-UP</span>
            </div>
            <HexaDemo />
          </div>
        </div>
      </section>

      {/* ================= CH4 — THE WAVE ================= */}
      <section className="chapter" id="ch4">
        <div className="kl-wrap">
          <div className="rv">
            <span className="ch-eyebrow">Chapter 04 · The superpower</span>
            <h2 className="ch-title">
              What if robots could <em>share</em> one memory book?
            </h2>
            <p className="ch-sub">
              Here&rsquo;s the part that makes engineers&rsquo; eyes light up. Watch what happens when one
              robot&rsquo;s lesson spreads to the whole team.
            </p>
          </div>

          <div className="demo-card rv">
            <div className="demo-head">
              <h3>The immunity wave</h3>
              <span>PRESS PLAY · WATCH THE WAVE</span>
            </div>
            <ImmunityWave />
          </div>
        </div>
      </section>

      {/* ================= CH5 — QUIZ ================= */}
      <section className="chapter" id="ch5">
        <div className="kl-wrap">
          <div className="rv">
            <span className="ch-eyebrow">Chapter 05 · Your turn</span>
            <h2 className="ch-title">Think like a repair engineer</h2>
            <p className="ch-sub">
              Four tricky situations. Pick the smartest next step. Nothing is recorded — this is just between you
              and Hexa.
            </p>
          </div>

          <div className="demo-card rv">
            <div className="demo-head">
              <h3>The repair engineer quiz</h3>
              <span>4 QUESTIONS · NO SCORES SAVED</span>
            </div>
            <Quiz />
          </div>
        </div>
      </section>

      {/* ================= CH6 — YOUR BODY ================= */}
      <section className="chapter" id="ch6">
        <div className="kl-wrap">
          <div className="rv">
            <span className="ch-eyebrow">Chapter 06 · The oldest self-repair machine</span>
            <h2 className="ch-title">You already own the world&rsquo;s best self-repair system</h2>
            <p className="ch-sub">
              Engineers didn&rsquo;t invent self-repair. Your body has been doing it since before you could walk.
            </p>
          </div>

          <div className="body-grid">
            <div className="body-card you rv">
              <div className="who">Your body · a scraped knee</div>
              <ol>
                <li>You fall off your bike and scrape your knee. <em>(try → notice)</em></li>
                <li>Your body rushes helpers to the scrape and builds a scab. <em>(fix)</em></li>
                <li>Your immune system files away what the germs looked like. <em>(remember)</em></li>
                <li>Next time those germs show up, your body beats them before you even feel sick.</li>
              </ol>
            </div>
            <div className="body-card bot rv">
              <div className="who">Helix software · a failed job</div>
              <ol>
                <li>A software helper tries a job and it fails. <em>(try → notice)</em></li>
                <li>It figures out why, and tries a smarter way that works. <em>(fix)</em></li>
                <li>It writes the fix into a shared memory book. <em>(remember)</em></li>
                <li>Every other helper reads the book — so none of them ever trips on that problem again.</li>
              </ol>
            </div>
            <div className="body-punch rv">
              Same loop. Your body learned it from nature. Robots learned it from engineers. You can use it on
              anything.
            </div>
          </div>

          <div className="rv" style={{ marginTop: 72 }}>
            <span className="ch-eyebrow">Bonus · Word Lab</span>
            <h2 className="ch-title" style={{ fontSize: 26 }}>
              Talk like an engineer
            </h2>
            <p className="ch-sub">Tap a word to reveal what it means. Use one at dinner tonight.</p>
          </div>
          <div className="word-grid">
            {WORDS.map((word) => (
              <button
                key={word.w}
                className="word-card rv"
                onClick={(e) => e.currentTarget.classList.toggle('open')}
              >
                <span className="w">{word.w}</span>
                <span className="d">{word.d}</span>
                <span className="hint">tap to reveal</span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ================= CH7 — CODE LAB TEASER ================= */}
      <section className="chapter" id="ch7">
        <div className="kl-wrap">
          <div className="rv">
            <span className="ch-eyebrow">Chapter 07 · Code Lab</span>
            <a className="codelab-teaser" href="/kids-lab/code">
              <div>
                <h2 className="ch-title">Ready to write real code?</h2>
                <p className="ch-sub">Build a program block by block — and teach it to repair itself.</p>
                <span className="ct-cta">Open the Code Lab →</span>
              </div>
              <div className="ct-art" aria-hidden="true">
                <svg width="128" height="112" viewBox="0 0 128 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="14" y="16" width="92" height="22" rx="7" fill="#4f46e5" />
                  <rect x="26" y="46" width="80" height="22" rx="7" fill="#2563eb" />
                  <rect x="14" y="76" width="70" height="22" rx="7" fill="#047857" />
                  <circle cx="112" cy="87" r="15" fill="#f59e0b" />
                  <path d="M108 81 L119 87 L108 93 Z" fill="#fff" />
                </svg>
              </div>
            </a>
          </div>

          {/* grown-ups */}
          <div className="grownups rv">
            <div>
              <h3>For parents &amp; teachers</h3>
              <p>
                Helix Kids Lab is a free STEM outreach program from Helix Labs. Download the classroom activity
                kit — a 45-minute unplugged lesson (no computers needed) with cut-out cards, a foldable memory
                book, and a class poster. We also run free workshops at libraries and code clubs.
              </p>
            </div>
            <div className="cta">
              <a className="btn" href="/kids-lab/helix-kids-classroom-kit.pdf">
                Download the free kit
              </a>
            </div>
            <p className="privacy">
              PRIVACY: This page collects no personal information from anyone, including children. No forms, no
              accounts, no tracking, no cookies set by this page. Educators can reach us through the site&rsquo;s
              contact page.
            </p>
          </div>
        </div>
      </section>

      <p className="footer-line">
        Helix Kids Lab · Free for schools, libraries, and code clubs · © Helix Labs, Inc.
      </p>
    </div>
  )
}
