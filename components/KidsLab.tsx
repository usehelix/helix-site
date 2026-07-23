'use client'

import { useState } from 'react'

/*
  Helix Kids Lab — interactive section, ported from the drop-in reference
  (helix-kids-lab-section.html) into the site's React/Next stack.

  Fidelity notes:
  - The Hexa demo state machine, copy, and privacy notice are preserved verbatim.
  - Styles are the reference styles, scoped under #kids-lab so nothing leaks into
    Nav/Footer. Font literals now defer to the site's next/font CSS vars
    (--font-inter / --font-mono) so no external Google Fonts request is needed.
  - COPPA-safe: no forms, no inputs, no analytics — same as the reference.
*/

const KIDS_LAB_CSS = `
#kids-lab {
  --indigo: #4f46e5;
  --indigo-deep: #3730a3;
  --indigo-light: #eef2ff;
  --sun: #f59e0b;
  --mint: #10b981;
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

#kids-lab { max-width: 1040px; margin: 0 auto; padding: 72px 24px 96px; }

#kids-lab .kl-eyebrow {
  font-family: var(--mono); font-size: 11px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--indigo);
  display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px;
}
#kids-lab .kl-eyebrow::before {
  content: ''; width: 14px; height: 16px; background: var(--indigo);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

#kids-lab .kl-title { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; max-width: 640px; }
#kids-lab .kl-title em { font-style: normal; color: var(--indigo); }
#kids-lab .kl-sub { font-size: 18px; color: var(--gray-600); max-width: 560px; margin-top: 16px; }

#kids-lab .kl-ideas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 48px 0; }
#kids-lab .kl-idea {
  background: var(--gray-50); border: 1px solid var(--gray-200);
  border-radius: 14px; padding: 22px;
}
#kids-lab .kl-idea .num {
  font-family: var(--mono); font-size: 11px; font-weight: 600; color: var(--indigo);
  letter-spacing: 0.1em; margin-bottom: 10px; display: block;
}
#kids-lab .kl-idea h2 { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
#kids-lab .kl-idea p { font-size: 14px; color: var(--gray-600); }

#kids-lab .kl-demo {
  border: 1px solid var(--gray-200); border-radius: 16px;
  overflow: hidden; margin: 8px 0 48px;
}
#kids-lab .kl-demo-head {
  background: var(--indigo-light); padding: 18px 24px;
  display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px;
}
#kids-lab .kl-demo-head h2 { font-size: 17px; font-weight: 700; color: var(--indigo-deep); }
#kids-lab .kl-demo-head span { font-family: var(--mono); font-size: 11px; color: var(--indigo); letter-spacing: 0.08em; }
#kids-lab .kl-demo-body { padding: 28px 24px; }

#kids-lab .kl-robot-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
#kids-lab .kl-robot {
  width: 84px; height: 84px; border-radius: 18px; flex-shrink: 0;
  background: var(--indigo); display: grid; place-items: center;
  transition: background .35s ease, transform .2s ease;
}
#kids-lab .kl-robot svg { width: 52px; height: 52px; }
#kids-lab .kl-robot.sad { background: var(--sun); animation: kl-shake .45s ease; }
#kids-lab .kl-robot.happy { background: var(--mint); transform: scale(1.05); }
@keyframes kl-shake {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-2deg); }
  75% { transform: translateX(5px) rotate(2deg); }
}
@media (prefers-reduced-motion: reduce) {
  #kids-lab .kl-robot, #kids-lab .kl-robot.sad { animation: none; transition: none; transform: none; }
}

#kids-lab .kl-speech {
  flex: 1; min-width: 240px; background: var(--gray-50);
  border: 1px solid var(--gray-200); border-radius: 12px;
  padding: 16px 18px; font-size: 15px; color: var(--gray-700);
}
#kids-lab .kl-speech strong { color: var(--gray-900); }

#kids-lab .kl-choices { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
#kids-lab .kl-choices button {
  font-family: var(--font-inter), 'Inter', sans-serif; font-size: 14px; font-weight: 600;
  padding: 12px 18px; border-radius: 10px; cursor: pointer;
  border: 2px solid var(--gray-200); background: #fff; color: var(--gray-900);
  transition: border-color .15s, background .15s;
}
#kids-lab .kl-choices button:hover, #kids-lab .kl-choices button:focus-visible { border-color: var(--indigo); background: var(--indigo-light); }
#kids-lab .kl-choices button:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }
#kids-lab .kl-choices button:disabled { opacity: .45; cursor: default; }

#kids-lab .kl-memory {
  margin-top: 22px; border-top: 1px dashed var(--gray-200); padding-top: 18px;
}
#kids-lab .kl-memory .label {
  font-family: var(--mono); font-size: 11px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--gray-600); margin-bottom: 10px; display: block;
}
#kids-lab .kl-memory ul { list-style: none; }
#kids-lab .kl-memory li {
  font-family: var(--mono); font-size: 13px; color: var(--indigo-deep);
  background: var(--indigo-light); border-radius: 8px;
  padding: 8px 12px; margin-bottom: 6px; display: inline-block;
}
#kids-lab .kl-memory li::before { content: '\\2713 '; color: var(--mint); font-weight: 700; }
#kids-lab .kl-memory .empty { font-size: 13px; color: var(--gray-600); font-family: var(--font-inter), 'Inter', sans-serif; background: none; padding: 0; }
#kids-lab .kl-memory .empty::before { content: none; }

#kids-lab .kl-grownups {
  background: var(--gray-50); border: 1px solid var(--gray-200);
  border-radius: 16px; padding: 28px; display: grid;
  grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: center;
}
#kids-lab .kl-grownups h2 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
#kids-lab .kl-grownups p { font-size: 14px; color: var(--gray-600); }
#kids-lab .kl-grownups .cta { text-align: right; }
#kids-lab .kl-grownups a.btn {
  display: inline-block; background: var(--indigo); color: #fff;
  font-weight: 600; font-size: 14px; padding: 12px 22px;
  border-radius: 10px; text-decoration: none;
}
#kids-lab .kl-grownups a.btn:hover { background: var(--indigo-deep); }
#kids-lab .kl-privacy {
  font-family: var(--mono); font-size: 11px; color: var(--gray-600);
  margin-top: 16px; grid-column: 1 / -1;
}

@media (max-width: 720px) {
  #kids-lab .kl-title { font-size: 30px; }
  #kids-lab .kl-ideas { grid-template-columns: 1fr; }
  #kids-lab .kl-grownups { grid-template-columns: 1fr; }
  #kids-lab .kl-grownups .cta { text-align: left; }
}
`

type Choice = { id: string; label: string }
type Mood = '' | 'sad' | 'happy'

const START_SPEECH =
  '<strong>Hexa wants to water the plants</strong> — but the watering can is empty! What should Hexa do?'
const START_BUTTONS: Choice[] = [
  { id: 'retry', label: 'Try again the same way' },
  { id: 'think', label: 'Stop and figure out why' },
  { id: 'quit', label: 'Give up forever' },
]
const EMPTY_MEMORY = 'Empty so far — help Hexa learn something!'

export function KidsLab() {
  const [stage, setStage] = useState(0)
  const [mood, setMood] = useState<Mood>('')
  const [speech, setSpeech] = useState(START_SPEECH)
  const [buttons, setButtons] = useState<Choice[]>(START_BUTTONS)
  const [disabled, setDisabled] = useState<Set<string>>(new Set())
  const [lessons, setLessons] = useState<string[]>([])

  function disable(id: string) {
    setDisabled((prev) => new Set(prev).add(id))
  }

  function handleChoice(c: string) {
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
          'Hexa checks the memory book: <strong>"empty can → refill at the sink first."</strong> Fixed in two seconds, no help needed! That\'s self-repair: <strong>fix once, and the mistake never wins twice.</strong> At Helix, thousands of robot helpers share one giant memory book — when one learns, they all do.',
        )
        setButtons([{ id: 'restart', label: 'Play again' }])
        setStage(3)
      }
    } else if (stage === 3 && c === 'restart') {
      setStage(0)
      setLessons([])
      setMood('')
      setDisabled(new Set())
      setSpeech(START_SPEECH)
      setButtons(START_BUTTONS)
    }
  }

  const robotClass = ['kl-robot', mood].filter(Boolean).join(' ')

  return (
    <section id="kids-lab" aria-labelledby="kl-title">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: KIDS_LAB_CSS }} />

      <span className="kl-eyebrow">Helix Kids Lab · Free for schools &amp; families</span>
      <h1 className="kl-title" id="kl-title">
        How do robots learn to <em>fix their own mistakes</em>?
      </h1>
      <p className="kl-sub">
        The engineers at Helix teach software to heal itself — the same way your body heals a
        scraped knee. Here&rsquo;s the big idea, explained for curious kids (ages 8–12).
      </p>

      <div className="kl-ideas">
        <div className="kl-idea">
          <span className="num">IDEA 1</span>
          <h2>Everything makes mistakes</h2>
          <p>
            Even the smartest robot trips sometimes — just like you did when you learned to ride a
            bike. Mistakes aren&rsquo;t bad. They&rsquo;re how learning starts.
          </p>
        </div>
        <div className="kl-idea">
          <span className="num">IDEA 2</span>
          <h2>Try, notice, fix</h2>
          <p>
            A self-repairing robot follows a loop: try something → notice it went wrong → figure out
            why → try a smarter way. Engineers call this &ldquo;self-repair.&rdquo;
          </p>
        </div>
        <div className="kl-idea">
          <span className="num">IDEA 3</span>
          <h2>Remember, so it never happens twice</h2>
          <p>
            The best part: the robot writes the fix into its memory book. Next time — and for every
            robot friend who shares the book — the mistake never happens again.
          </p>
        </div>
      </div>

      <div className="kl-demo">
        <div className="kl-demo-head">
          <h2>Try it: teach Hexa the robot</h2>
          <span>INTERACTIVE · NO SIGN-UP</span>
        </div>
        <div className="kl-demo-body">
          <div className="kl-robot-row">
            <div className={robotClass} id="kl-robot" role="img" aria-label="Hexa the robot">
              <svg
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="10" y="14" width="32" height="26" rx="7" fill="white" />
                <circle id="kl-eye-l" cx="21" cy="25" r="3.4" fill="#4f46e5" />
                <circle id="kl-eye-r" cx="31" cy="25" r="3.4" fill="#4f46e5" />
                <path
                  id="kl-mouth"
                  d="M20 33 Q26 37 32 33"
                  stroke="#4f46e5"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  fill="none"
                />
                <line x1="26" y1="14" x2="26" y2="8" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
                <circle cx="26" cy="6" r="2.6" fill="white" />
              </svg>
            </div>
            <div
              className="kl-speech"
              id="kl-speech"
              aria-live="polite"
              dangerouslySetInnerHTML={{ __html: speech }}
            />
          </div>

          <div className="kl-choices" id="kl-choices">
            {buttons.map((b) => (
              <button
                key={b.id}
                data-choice={b.id}
                disabled={disabled.has(b.id)}
                onClick={() => handleChoice(b.id)}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="kl-memory">
            <span className="label">Hexa&rsquo;s memory book</span>
            <ul id="kl-memory-list">
              {lessons.length === 0 ? (
                <li className="empty">{EMPTY_MEMORY}</li>
              ) : (
                lessons.map((l) => <li key={l}>{l}</li>)
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="kl-grownups">
        <div>
          <h2>For parents &amp; teachers</h2>
          <p>
            Helix Kids Lab is a free outreach program from Helix Labs. Download our classroom
            activity kit — a 45-minute unplugged lesson (no computers needed) that teaches the
            try–notice–fix loop with paper robots. We also run free workshops at libraries and code
            clubs.
          </p>
        </div>
        <div className="cta">
          <a className="btn" href="/kids-lab/helix-kids-classroom-kit.pdf">
            Download the free kit
          </a>
        </div>
        <p className="kl-privacy">
          PRIVACY: This page collects no personal information from anyone, including children. No
          forms, no accounts, no tracking. Educators can reach us through the contact page.
        </p>
      </div>
    </section>
  )
}
