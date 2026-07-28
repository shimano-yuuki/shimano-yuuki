// 最近 push したリポジトリと、その最新コミットを README に流し込む。
// simonw/simonw の <!-- x starts --> / <!-- x ends --> マーカー方式を借りている。
//
//   GITHUB_TOKEN=xxx node scripts/activity.mjs <login>

import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const BEGIN = '<!-- activity starts -->'
const END = '<!-- activity ends -->'
const README = 'README.md'

const QUERY = `
query($login: String!) {
  user(login: $login) {
    repositories(first: 6, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        name
        url
        description
        pushedAt
        primaryLanguage { name }
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 1) { nodes { messageHeadline url } }
            }
          }
        }
      }
    }
  }
}`

async function fetchActivity(login, token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'activity-readme',
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data.user.repositories.nodes
}

function relative(iso, now) {
  const mins = Math.floor((now - Date.parse(iso)) / 60000)
  if (mins < 60) return `${Math.max(mins, 0)}m ago`
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
  return `${Math.floor(mins / 1440)}d ago`
}

// テーブルのセルを壊す文字だけ潰す
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')

const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s)

export function renderSection(repos, now) {
  const rows = repos
    .map((r) => {
      const commit = r.defaultBranchRef?.target?.history?.nodes?.[0]
      const headline = commit
        ? `[\`${cell(truncate(commit.messageHeadline, 52))}\`](${commit.url})`
        : '—'
      const lang = r.primaryLanguage?.name ? ` \`${cell(r.primaryLanguage.name)}\`` : ''
      return `| **[${cell(r.name)}](${r.url})**${lang} | ${headline} | ${relative(r.pushedAt, now)} |`
    })
    .join('\n')

  return `${BEGIN}
| repository | latest commit | |
|---|---|---|
${rows}
${END}`
}

async function updateReadme(section) {
  const readme = await readFile(README, 'utf8')
  const start = readme.indexOf(BEGIN)
  const end = readme.indexOf(END)
  if (start === -1 || end === -1) throw new Error(`markers not found in ${README}`)
  await writeFile(README, readme.slice(0, start) + section + readme.slice(end + END.length))
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const login = process.argv[2] ?? 'shimano-yuuki'
  if (!process.env.GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN is required')
    process.exit(1)
  }
  const repos = await fetchActivity(login, process.env.GITHUB_TOKEN)
  await updateReadme(renderSection(repos, Date.now()))
  console.log(`updated ${README} with ${repos.length} repos`)
}
