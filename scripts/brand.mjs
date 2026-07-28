// ヘッダーとスタック表記を自作SVGで作る。
// capsule-render / skillicons を置き換えるためのもので、外部サービスに依存しない。
// 文言を変えたいときは NAME / TAGLINE / STACK をいじって再生成する。
//
//   node scripts/brand.mjs

import { writeFile, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { FONT, CSS_VARS, CHAR, esc } from './theme.mjs'

const NAME = 'shimano yuuki'
const TAGLINE = 'building quiet, solid things'

const STACK = [
  ['LANGUAGES', ['Dart', 'TypeScript', 'Go', 'PHP']],
  ['FRAMEWORKS', ['Flutter', 'Next.js', 'React', 'Tailwind']],
  ['INFRA', ['Firebase', 'PostgreSQL', 'MySQL', 'Docker']],
]

const W = 880

export function renderHeader() {
  const H = 168
  const SIZE = 40
  const TRACK = 5 // letter-spacing
  const step = SIZE * CHAR + TRACK
  const width = NAME.length * step - TRACK
  const x0 = (W - width) / 2
  const baseline = 84

  const letters = NAME.split('')
    .map((ch, i) =>
      ch === ' '
        ? ''
        : `  <text class="ch" x="${(x0 + i * step).toFixed(1)}" y="${baseline}" style="animation-delay:${(i * 0.045).toFixed(3)}s">${esc(ch)}</text>`,
    )
    .filter(Boolean)
    .join('\n')

  const caretX = x0 + NAME.length * step + 4
  const ruleW = 300

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(NAME)}">
  <style>${CSS_VARS}
    text { font-family: ${FONT}; }
    .ch {
      font-size: ${SIZE}px; font-weight: 600; fill: var(--fg);
      opacity: 0; transform: translateY(8px);
      animation: rise .55s cubic-bezier(.2,.7,.3,1) forwards;
    }
    @keyframes rise { to { opacity: 1; transform: translateY(0); } }

    .caret { fill: var(--accent); opacity: 0; animation: blink 1.1s steps(1) infinite; animation-delay: ${(NAME.length * 0.045 + 0.4).toFixed(2)}s; }
    @keyframes blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }

    .rule { stroke: var(--accent); stroke-width: 1.5; stroke-dasharray: ${ruleW}; stroke-dashoffset: ${ruleW};
      animation: draw .9s cubic-bezier(.3,.8,.3,1) forwards; animation-delay: ${(NAME.length * 0.045 + 0.15).toFixed(2)}s; }
    @keyframes draw { to { stroke-dashoffset: 0; } }

    .tag { font-size: 13px; letter-spacing: 4px; fill: var(--muted); text-anchor: middle;
      opacity: 0; animation: fade .8s ease forwards; animation-delay: ${(NAME.length * 0.045 + 0.55).toFixed(2)}s; }
    @keyframes fade { to { opacity: 1; } }
  </style>
${letters}
  <rect class="caret" x="${caretX.toFixed(1)}" y="${baseline - SIZE + 8}" width="4" height="${SIZE - 6}" />
  <line class="rule" x1="${(W - ruleW) / 2}" y1="112" x2="${(W + ruleW) / 2}" y2="112" />
  <text class="tag" x="${W / 2}" y="140">${esc(TAGLINE.toUpperCase())}</text>
</svg>
`
}

export function renderStack() {
  const SIZE = 14
  const ch = SIZE * CHAR
  const ROW = 34
  const TOP = 34
  const H = TOP + STACK.length * ROW + 6
  const LABEL_X = 40
  const ITEM_X = 190

  const rows = STACK.map(([label, items], i) => {
    const y = TOP + i * ROW
    const delay = (0.15 + i * 0.14).toFixed(2)
    const spans = items
      .map(
        (it, j) =>
          `${j ? '<tspan class="sep">  ·  </tspan>' : ''}<tspan class="item">${esc(it)}</tspan>`,
      )
      .join('')
    return `  <g class="row" style="animation-delay:${delay}s">
    <text class="label" x="${LABEL_X}" y="${y}">${esc(label)}</text>
    <text class="items" x="${ITEM_X}" y="${y}" xml:space="preserve">${spans}</text>
  </g>`
  }).join('\n')

  // ラベル列と項目列を隔てる細い縦線
  const dividerX = ITEM_X - 26

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="stack">
  <style>${CSS_VARS}
    text { font-family: ${FONT}; font-size: ${SIZE}px; }
    .label { fill: var(--muted); letter-spacing: 2px; font-size: 11px; }
    .item  { fill: var(--fg); }
    .sep   { fill: var(--line); }
    .row { opacity: 0; transform: translateX(-6px); animation: slide .6s cubic-bezier(.2,.7,.3,1) forwards; }
    @keyframes slide { to { opacity: 1; transform: translateX(0); } }
    .divider { stroke: var(--line); stroke-width: 1; stroke-dasharray: ${H}; stroke-dashoffset: ${H};
      animation: draw 1s ease forwards; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
  </style>
  <line class="divider" x1="${dividerX}" y1="14" x2="${dividerX}" y2="${H - 14}" />
${rows}
</svg>
`
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await mkdir('assets', { recursive: true })
  await writeFile('assets/header.svg', renderHeader())
  await writeFile('assets/stack.svg', renderStack())
  console.log('wrote assets/header.svg, assets/stack.svg')
}
