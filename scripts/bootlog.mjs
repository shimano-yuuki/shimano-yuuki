// GitHub API から実データを取得して、ターミナル起動ログ風の SVG を生成する。
//
//   GITHUB_TOKEN=xxx node scripts/bootlog.mjs <login> <outfile>
//
// 数字はすべて API 由来なので、README に貼った時点でハリボテにならない。

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

const QUERY = `
query($login: String!) {
  user(login: $login) {
    createdAt
    followers { totalCount }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      contributionCalendar { totalContributions }
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        pushedAt
        stargazerCount
        languages(first: 12, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name } }
        }
      }
    }
  }
}`

async function fetchProfile(login, token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'bootlog-svg',
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data.user
}

// Flutter や Xcode が自動生成するプラットフォームコードは「書いた言語」ではないので数えない
const GENERATED = new Set(['CMake', 'C++', 'C', 'Objective-C', 'Swift', 'Kotlin', 'Java', 'Ruby', 'HTML', 'CSS', 'Shell', 'Dockerfile'])

function summarize(user, now) {
  const repos = user.repositories.nodes
  const bytes = new Map()
  for (const repo of repos) {
    for (const { size, node } of repo.languages.edges) {
      if (GENERATED.has(node.name)) continue
      bytes.set(node.name, (bytes.get(node.name) ?? 0) + size)
    }
  }
  const ranked = [...bytes].sort((a, b) => b[1] - a[1])
  const total = ranked.reduce((sum, [, size]) => sum + size, 0) || 1
  const [topName, topSize] = ranked[0] ?? ['n/a', 0]

  const latest = repos[0]
  const ageDays = Math.floor((now - Date.parse(user.createdAt)) / 86400000)
  const stars = repos.reduce((sum, r) => sum + r.stargazerCount, 0)

  return {
    repos: user.repositories.totalCount,
    topLanguage: `${topName} ${((topSize / total) * 100).toFixed(1)}%`,
    stack: ranked.slice(0, 4).map(([name]) => name).join(' / '),
    commits: user.contributionsCollection.totalCommitContributions,
    contributions: user.contributionsCollection.contributionCalendar.totalContributions,
    pullRequests: user.contributionsCollection.totalPullRequestContributions,
    stars,
    lastPush: latest ? `${ago(now - Date.parse(latest.pushedAt))} · ${latest.name}` : 'n/a',
    uptime: `${ageDays.toLocaleString('en-US')} days`,
  }
}

function ago(ms) {
  const mins = Math.floor(ms / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const COLS = 58 // ドットリーダーを揃える桁数

export function renderSvg(d) {
  const rows = [
    ['mounting /dev/' + d.login, 'OK'],
    ['repositories', String(d.repos)],
    ['primary language', d.topLanguage],
    ['active stack', d.stack],
    ['commits (1y)', String(d.commits)],
    ['pull requests (1y)', String(d.pullRequests)],
    ['stars earned', String(d.stars)],
    ['last push', d.lastPush],
    ['uptime', d.uptime],
  ]

  const CH = 8.4 // monospace 14px の実測字幅
  const X = 26
  const TOP = 78
  const LH = 22
  const height = TOP + rows.length * LH + 44
  const width = Math.max(720, X * 2 + COLS * CH + 40)

  const lines = rows
    .map(([label, value], i) => {
      const dots = '.'.repeat(Math.max(3, COLS - label.length - value.length - 4))
      return `    <text class="ln l${i}" x="${X}" y="${TOP + i * LH}" xml:space="preserve"><tspan class="mark">&gt; </tspan><tspan class="key">${esc(label)}</tspan> <tspan class="dot">${dots}</tspan> <tspan class="val">${esc(value)}</tspan></text>`
    })
    .join('\n')

  const cursorY = TOP + rows.length * LH
  const delay = (i) => (0.2 + i * 0.13).toFixed(2)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(d.login)} boot log">
  <style>
    .ln, .prompt { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace; font-size: 14px; }
    .mark { fill: #39d353; }
    .key  { fill: #8b949e; }
    .dot  { fill: #30363d; }
    .val  { fill: #39d353; font-weight: 600; }
    .head { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; fill: #6e7681; }
    .ln { opacity: 0; animation: reveal 0.01s linear forwards; }
${rows.map((_, i) => `    .l${i} { animation-delay: ${delay(i)}s; }`).join('\n')}
    @keyframes reveal { to { opacity: 1; } }
    .cursor { fill: #39d353; opacity: 0; animation: blink 1s steps(1) infinite; animation-delay: ${delay(rows.length)}s; }
    @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  </style>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="10" fill="#0d1117" stroke="#30363d" />
  <line x1="0" y1="38" x2="${width}" y2="38" stroke="#21262d" />
  <circle cx="22" cy="19" r="5.5" fill="#ff5f57" /><circle cx="41" cy="19" r="5.5" fill="#febc2e" /><circle cx="60" cy="19" r="5.5" fill="#28c840" />
  <text class="head" x="${width / 2}" y="23" text-anchor="middle">${esc(d.login)} — boot</text>
${lines}
  <text class="ln l${rows.length - 1} prompt" x="${X}" y="${cursorY + 8}" xml:space="preserve"><tspan class="mark">&gt; </tspan><tspan class="val">READY</tspan></text>
  <rect class="cursor" x="${X + 8.4 * 8}" y="${cursorY - 3}" width="8" height="15" />
</svg>
`
}

// テストから renderSvg だけ import できるよう、直接実行時のみ走らせる
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [login = 'shimano-yuuki', out = 'assets/bootlog.svg'] = process.argv.slice(2)
  if (!process.env.GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN is required')
    process.exit(1)
  }
  const user = await fetchProfile(login, process.env.GITHUB_TOKEN)
  const svg = renderSvg({ login, ...summarize(user, Date.now()) })
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, svg)
  console.log(`wrote ${out} (${svg.length} bytes)`)
}
