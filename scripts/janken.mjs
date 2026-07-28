// Issue 経由で来訪者とじゃんけんする。
// timburgan/timburgan（Issueでチェスを指す）と同じ仕組みを、自前実装したもの。
//
// 呼び出しは .github/workflows/janken.yml から。
// 入力はシェル展開ではなく環境変数で受け取る（Issueタイトルは任意の文字列なので、
// ${{ github.event.issue.title }} を run: に直接埋めるとスクリプトインジェクションになる）。

import { readFile, writeFile, mkdir } from 'node:fs/promises'

const HANDS = {
  rock: { ja: 'グー', emoji: '✊' },
  scissors: { ja: 'チョキ', emoji: '✌️' },
  paper: { ja: 'パー', emoji: '✋' },
}
const BEATS = { rock: 'scissors', scissors: 'paper', paper: 'rock' } // key が value に勝つ

const STATE = 'data/janken.json'
const README = 'README.md'
const BEGIN = '<!-- janken starts -->'
const END = '<!-- janken ends -->'

const OWNER = process.env.OWNER || 'shimano-yuuki'
const REPO = process.env.REPO || `${OWNER}/${OWNER}`

async function loadState() {
  try {
    return JSON.parse(await readFile(STATE, 'utf8'))
  } catch {
    return { wins: 0, losses: 0, draws: 0, history: [] }
  }
}

function relative(iso, now) {
  const mins = Math.floor((now - Date.parse(iso)) / 60000)
  if (mins < 60) return `${Math.max(mins, 0)}m ago`
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
  return `${Math.floor(mins / 1440)}d ago`
}

function issueUrl(hand) {
  const title = encodeURIComponent(`janken:${hand}`)
  const body = encodeURIComponent('そのまま Submit を押してください。')
  return `https://github.com/${REPO}/issues/new?title=${title}&body=${body}`
}

function badge(hand) {
  const { emoji, ja } = HANDS[hand]
  const label = encodeURIComponent(`${emoji} ${ja}`)
  return `https://img.shields.io/badge/${label}-0d1117?style=for-the-badge&labelColor=0d1117&color=39d353`
}

export function renderSection(state, now) {
  const buttons = Object.keys(HANDS)
    .map((h) => `  <a href="${issueUrl(h)}"><img src="${badge(h)}" alt="${h}" /></a>`)
    .join('\n')

  const total = state.wins + state.losses + state.draws
  const rate = total ? ((state.wins / total) * 100).toFixed(0) : '--'

  const log = state.history
    .slice(0, 5)
    .map((h) => {
      const verdict = h.result === 'win' ? 'BOT WIN' : h.result === 'loss' ? 'YOU WIN' : 'DRAW'
      return `| \`${verdict}\` | @${h.user} | ${HANDS[h.player].emoji} ${HANDS[h.player].ja} | ${HANDS[h.bot].emoji} ${HANDS[h.bot].ja} | ${relative(h.at, now)} |`
    })
    .join('\n')

  return `${BEGIN}
<div align="center">

**押すだけで対戦できます。Issueが立って、数秒後にBotが手を出します。**

${buttons}

\`BOT ${state.wins}W\` &nbsp;·&nbsp; \`${state.losses}L\` &nbsp;·&nbsp; \`${state.draws}D\` &nbsp;·&nbsp; \`win rate ${rate}%\` &nbsp;·&nbsp; \`${total} games\`

</div>

${
  log
    ? `| 結果 | 挑戦者 | 挑戦者の手 | BOTの手 | |\n|---|---|---|---|---|\n${log}`
    : '_まだ誰も挑戦していません。_'
}
${END}`
}

function pickBotHand() {
  const keys = Object.keys(HANDS)
  return keys[Math.floor(Math.random() * keys.length)]
}

function judge(player, bot) {
  if (player === bot) return 'draw'
  return BEATS[bot] === player ? 'win' : 'loss' // BOT視点
}

async function main() {
  const title = (process.env.ISSUE_TITLE ?? '').trim()
  const user = (process.env.ISSUE_USER ?? 'unknown').replace(/[^A-Za-z0-9-]/g, '')
  const now = Date.now()

  const matched = /^janken:(rock|scissors|paper)$/.exec(title)
  if (!matched) {
    await mkdir('data', { recursive: true })
    await writeFile(
      'data/last-comment.md',
      `タイトルが \`janken:rock\` / \`janken:scissors\` / \`janken:paper\` のいずれでもないため、この対戦は無効です。\n\nREADMEのボタンから開き直してください。`,
    )
    console.log(`invalid title: ${title}`)
    return
  }

  const player = matched[1]
  const bot = pickBotHand()
  const result = judge(player, bot)

  const state = await loadState()
  if (result === 'win') state.wins += 1
  else if (result === 'loss') state.losses += 1
  else state.draws += 1
  state.history.unshift({ user, player, bot, result, at: new Date(now).toISOString() })
  state.history = state.history.slice(0, 50)

  await mkdir('data', { recursive: true })
  await writeFile(STATE, JSON.stringify(state, null, 2) + '\n')

  const readme = await readFile(README, 'utf8')
  const start = readme.indexOf(BEGIN)
  const end = readme.indexOf(END)
  if (start === -1 || end === -1) throw new Error(`markers not found in ${README}`)
  await writeFile(
    README,
    readme.slice(0, start) + renderSection(state, now) + readme.slice(end + END.length),
  )

  const verdict =
    result === 'draw'
      ? 'あいこです。もう一回どうぞ。'
      : result === 'win'
        ? 'Botの勝ちです。'
        : 'あなたの勝ちです。おめでとうございます。'

  await writeFile(
    'data/last-comment.md',
    `**${HANDS[player].emoji} ${HANDS[player].ja}** vs **${HANDS[bot].emoji} ${HANDS[bot].ja}**\n\n` +
      `${verdict}\n\n` +
      `通算 \`${state.wins}W / ${state.losses}L / ${state.draws}D\` — 戦績はプロフィールのREADMEに反映されます。`,
  )

  console.log(`${user}: ${player} vs ${bot} -> ${result}`)
}

if (import.meta.url === (await import('node:url')).pathToFileURL(process.argv[1] ?? '').href) {
  await main()
}
