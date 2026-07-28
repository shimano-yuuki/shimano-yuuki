// Issue 経由で来訪者と Connect Four（四目並べ）を打つ。
// 盤面は自作SVGで描き、直前に落ちた駒だけ落下アニメーションを付ける。
//
// 呼び出しは .github/workflows/connect4.yml から。
// Issueタイトルは誰でも任意の文字列を書けるので、run: に ${{ ... }} で直接埋めず
// 必ず env 経由で渡し、厳密な正規表現で受け付ける（埋めるとコマンドインジェクション）。

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { FONT, CSS_VARS } from './theme.mjs'

export const COLS = 7
export const ROWS = 6
const EMPTY = 0
const HUMAN = 1
const BOT = 2

const STATE = 'data/connect4.json'
const BOARD_SVG = 'assets/connect4.svg'
const README = 'README.md'
const BEGIN = '<!-- connect4 starts -->'
const END = '<!-- connect4 ends -->'

const REPO = process.env.REPO || 'shimano-yuuki/shimano-yuuki'

const at = (b, r, c) => b[r * COLS + c]

export const emptyGame = () => ({
  board: Array(ROWS * COLS).fill(EMPTY),
  over: false,
  winner: null, // 'human' | 'bot' | 'draw'
  recent: [], // 直前の手のマス番号（落下アニメーション用）
  by: null, // 直前に打った来訪者
})

export const emptyState = () => ({
  wins: 0,
  losses: 0,
  draws: 0,
  results: [],
  game: emptyGame(),
})

// ── ルール ────────────────────────────────────────────────

export function dropAt(board, col) {
  for (let r = ROWS - 1; r >= 0; r--) if (at(board, r, col) === EMPTY) return r * COLS + col
  return -1
}

const DIRS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
]

export function winnerAt(board, cell) {
  const r0 = Math.floor(cell / COLS)
  const c0 = cell % COLS
  const p = at(board, r0, c0)
  if (p === EMPTY) return 0
  for (const [dr, dc] of DIRS) {
    let n = 1
    for (const sign of [1, -1]) {
      for (let k = 1; k < 4; k++) {
        const r = r0 + dr * k * sign
        const c = c0 + dc * k * sign
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS || at(board, r, c) !== p) break
        n++
      }
    }
    if (n >= 4) return p
  }
  return 0
}

const isFull = (board) => board.every((v) => v !== EMPTY)

// ── AI（アルファベータ法） ────────────────────────────────

// 盤上に存在しうる4連windowのマス番号。探索のたびに作り直すと遅いので一度だけ求める
const WINDOWS = (() => {
  const out = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      for (const [dr, dc] of DIRS) {
        const cells = []
        for (let k = 0; k < 4; k++) {
          const rr = r + dr * k
          const cc = c + dc * k
          if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) {
            cells.length = 0
            break
          }
          cells.push(rr * COLS + cc)
        }
        if (cells.length === 4) out.push(cells)
      }
  return out
})()

// 4連window内の自駒/敵駒の数から評価する、Connect Four の定番ヒューリスティック
function score(board, me) {
  const you = me === BOT ? HUMAN : BOT
  let total = 0
  for (const w of WINDOWS) {
    let mine = 0
    let theirs = 0
    for (const cell of w) {
      const v = board[cell]
      if (v === me) mine++
      else if (v === you) theirs++
    }
    if (mine && theirs) continue
    if (mine === 3) total += 60
    else if (mine === 2) total += 8
    else if (theirs === 3) total -= 70 // 相手のリーチは自分のリーチより重く見る
    else if (theirs === 2) total -= 9
  }
  // 中央列は勝ち筋が最も多く通るので加点する
  for (let r = 0; r < ROWS; r++) {
    const v = at(board, r, 3)
    if (v === me) total += 6
    else if (v === you) total -= 6
  }
  return total
}

// 中央から外へ探索すると枝刈りが早く効く
const ORDER = [3, 2, 4, 1, 5, 0, 6]

function negamax(board, depth, alpha, beta, me, lastCell) {
  // lastCell は「手番が回ってくる直前に相手が打った手」。それが4連なら me の負け。
  // 深いほど絶対値を小さくして、負けるなら少しでも先延ばしする手を選ばせる。
  if (lastCell >= 0 && winnerAt(board, lastCell)) {
    return { value: -(100000 + depth), col: -1 }
  }
  if (isFull(board)) return { value: 0, col: -1 }
  if (depth === 0) return { value: score(board, me), col: -1 }

  let best = -Infinity
  let bestCol = -1
  for (const c of ORDER) {
    const cell = dropAt(board, c)
    if (cell < 0) continue
    board[cell] = me
    const child = negamax(board, depth - 1, -beta, -alpha, me === BOT ? HUMAN : BOT, cell)
    board[cell] = EMPTY
    const value = -child.value
    if (value > best) {
      best = value
      bestCol = c
    }
    alpha = Math.max(alpha, value)
    if (alpha >= beta) break
  }
  return { value: best, col: bestCol }
}

export function chooseMove(board, depth = 6) {
  const { col } = negamax([...board], depth, -Infinity, Infinity, BOT, -1)
  if (col >= 0) return col
  return ORDER.find((c) => dropAt(board, c) >= 0) ?? -1
}

// ── 盤面SVG ───────────────────────────────────────────────

export function renderBoard(game) {
  const CELL = 56
  const R = 21
  const PAD = 22
  const TOP = 46
  const W = PAD * 2 + COLS * CELL
  const H = TOP + ROWS * CELL + PAD

  const labels = Array.from({ length: COLS }, (_, c) => {
    const x = PAD + c * CELL + CELL / 2
    const open = dropAt(game.board, c) >= 0 && !game.over
    return `  <text class="col ${open ? '' : 'closed'}" x="${x}" y="28">${c + 1}</text>`
  }).join('\n')

  const discs = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = r * COLS + c
      const v = at(game.board, r, c)
      const cx = PAD + c * CELL + CELL / 2
      const cy = TOP + r * CELL + CELL / 2
      const fresh = game.recent.indexOf(cell)
      const cls = v === HUMAN ? 'human' : v === BOT ? 'bot' : 'empty'
      const drop =
        fresh >= 0
          ? ` drop" style="animation-delay:${(fresh * 0.35).toFixed(2)}s`
          : ''
      discs.push(`  <circle class="${cls}${drop}" cx="${cx}" cy="${cy}" r="${R}" />`)
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="connect four board">
  <style>${CSS_VARS}
    .col { font-family: ${FONT}; font-size: 12px; fill: var(--muted); text-anchor: middle; }
    .col.closed { fill: var(--line); }
    .empty { fill: none; stroke: var(--line); stroke-width: 1.5; }
    .human { fill: var(--accent); }
    .bot   { fill: var(--muted); }
    .frame { fill: none; stroke: var(--line); }
    .drop { animation: fall .5s cubic-bezier(.45,0,.55,1) backwards; }
    @keyframes fall { from { transform: translateY(-${TOP + ROWS * CELL}px); } to { transform: translateY(0); } }
  </style>
  <rect class="frame" x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="8" />
${labels}
${discs.join('\n')}
</svg>
`
}

// ── README セクション ─────────────────────────────────────

function moveUrl(col) {
  const title = encodeURIComponent(`c4:${col}`)
  const body = encodeURIComponent('そのまま Submit を押してください。')
  return `https://github.com/${REPO}/issues/new?title=${title}&body=${body}`
}

function chip(text, color = '1a7f37') {
  return `https://img.shields.io/badge/${encodeURIComponent(text)}-${color}?style=flat-square&labelColor=${color}`
}

export function renderSection(state) {
  const g = state.game
  let controls
  if (g.over) {
    controls = `  <a href="${moveUrl('new')}"><img src="${chip('▸  NEW GAME')}" alt="new game" /></a>`
  } else {
    controls = Array.from({ length: COLS }, (_, c) => {
      const open = dropAt(g.board, c) >= 0
      return open
        ? `  <a href="${moveUrl(c + 1)}"><img src="${chip(String(c + 1))}" alt="drop in column ${c + 1}" /></a>`
        : `  <img src="${chip(String(c + 1), '8b949e')}" alt="column ${c + 1} full" />`
    }).join('\n')
  }

  const status = g.over
    ? g.winner === 'human'
      ? `**@${g.by} の勝ち。** 列を4つ繋がれました。`
      : g.winner === 'bot'
        ? `**BOT の勝ち。** 次は誰か止めてください。`
        : '**引き分け。** 盤面が埋まりました。'
    : g.by
      ? `直前の手は @${g.by}。緑があなた、グレーがBOTです。`
      : '緑があなた、グレーがBOTです。好きな列の番号を押してください。'

  const total = state.wins + state.losses + state.draws
  const recent = state.results
    .slice(0, 5)
    .map((r) =>
      r.winner === 'human'
        ? `\`YOU WIN\` @${r.by}`
        : r.winner === 'bot'
          ? `\`BOT WIN\` vs @${r.by}`
          : `\`DRAW\` vs @${r.by}`,
    )
    .join(' &nbsp;·&nbsp; ')

  return `${BEGIN}
<div align="center">

<img src="./assets/connect4.svg" alt="connect four" width="440" />

${controls}

${status}

\`BOT ${state.wins}W\` &nbsp;·&nbsp; \`${state.losses}L\` &nbsp;·&nbsp; \`${state.draws}D\` &nbsp;·&nbsp; \`${total} games\`
${recent ? `\n${recent}\n` : ''}
</div>
${END}`
}

// ── 実行 ──────────────────────────────────────────────────

async function loadState() {
  try {
    const s = JSON.parse(await readFile(STATE, 'utf8'))
    if (!s.game) s.game = emptyGame()
    return s
  } catch {
    return emptyState()
  }
}

function finish(state, winner, by) {
  state.game.over = true
  state.game.winner = winner
  if (winner === 'bot') state.wins += 1
  else if (winner === 'human') state.losses += 1
  else state.draws += 1
  state.results.unshift({ winner, by })
  state.results = state.results.slice(0, 20)
}

export function play(state, col, user) {
  const g = state.game
  if (g.over) return { ok: false, note: 'この対局はもう終わっています。**NEW GAME** から始めてください。' }

  const cell = dropAt(g.board, col - 1)
  if (cell < 0) return { ok: false, note: `${col} 列は満杯です。別の列を選んでください。` }

  g.board[cell] = HUMAN
  g.recent = [cell]
  g.by = user

  if (winnerAt(g.board, cell) === HUMAN) {
    finish(state, 'human', user)
    return { ok: true, note: `${col} 列に落として4つ繋がりました。あなたの勝ちです。` }
  }
  if (isFull(g.board)) {
    finish(state, 'draw', user)
    return { ok: true, note: '盤面が埋まりました。引き分けです。' }
  }

  const botCol = chooseMove(g.board)
  const botCell = dropAt(g.board, botCol)
  g.board[botCell] = BOT
  g.recent.push(botCell)

  if (winnerAt(g.board, botCell) === BOT) {
    finish(state, 'bot', user)
    return { ok: true, note: `あなたが ${col} 列、BOTが ${botCol + 1} 列。BOTが4つ繋げました。` }
  }
  if (isFull(g.board)) {
    finish(state, 'draw', user)
    return { ok: true, note: '盤面が埋まりました。引き分けです。' }
  }

  return { ok: true, note: `あなたが ${col} 列、BOTが ${botCol + 1} 列に置きました。続けてどうぞ。` }
}

async function main() {
  const title = (process.env.ISSUE_TITLE ?? '').trim()
  const user = (process.env.ISSUE_USER ?? 'unknown').replace(/[^A-Za-z0-9-]/g, '')

  const matched = /^c4:(new|[1-7])$/.exec(title)
  await mkdir('data', { recursive: true })

  if (!matched) {
    await writeFile(
      'data/last-comment.md',
      'タイトルが `c4:1` 〜 `c4:7` または `c4:new` ではないため無効です。READMEのボタンから開き直してください。',
    )
    console.log(`invalid title: ${title}`)
    return
  }

  const state = await loadState()
  let note

  if (matched[1] === 'new') {
    state.game = emptyGame()
    note = '新しい対局を始めました。好きな列の番号を押してください。'
  } else {
    const result = play(state, Number(matched[1]), user)
    note = result.note
  }

  await writeFile(STATE, JSON.stringify(state, null, 2) + '\n')
  await mkdir('assets', { recursive: true })
  await writeFile(BOARD_SVG, renderBoard(state.game))

  const readme = await readFile(README, 'utf8')
  const start = readme.indexOf(BEGIN)
  const end = readme.indexOf(END)
  if (start === -1 || end === -1) throw new Error(`markers not found in ${README}`)
  await writeFile(
    README,
    readme.slice(0, start) + renderSection(state) + readme.slice(end + END.length),
  )

  await writeFile(
    'data/last-comment.md',
    `${note}\n\n盤面はプロフィールの [README](https://github.com/${REPO}#readme) に反映されます。\n\n` +
      `通算 \`BOT ${state.wins}W / ${state.losses}L / ${state.draws}D\``,
  )
  console.log(`${user}: ${title} -> ${note}`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main()
