<!-- ========================= HEADER ========================= -->
<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=venom&color=gradient&customColorList=0,2,2,5,30&height=220&section=header&text=shimano%20yuuki&fontSize=46&fontColor=39d353&animation=fadeIn" width="100%" />
</div>
<!-- 文言は lines= の中身をセミコロン区切りで編集 -->
<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=2800&pause=900&color=39D353&center=true&vCenter=true&width=560&height=40&lines=Flutter+%2F+Go+%2F+Next.js;quiet+code%2C+solid+things;still+shipping" alt="tagline" />
</div>

<!-- ========================= BOOT LOG =========================
     scripts/bootlog.mjs が GitHub API から実データを取って生成する。
     数字はすべて本物（リポジトリ数・言語比率・最終pushなど）。 -->
<div align="center">
  <img src="./assets/bootlog.svg" alt="boot log" width="100%" />
</div>

<!-- ========================= 3D CONTRIBUTION =========================
     .github/workflows/profile.yml が生成。差し替え候補:
       profile-night-view.svg     夜景（これ）
       profile-night-rainbow.svg  夜景・虹色
       profile-gitblock.svg       マイクラのブロック風
       profile-season-animate.svg 季節で色が変わる + アニメーション -->
<div align="center">
  <img src="./profile-3d-contrib/profile-night-view.svg" alt="3d contribution calendar" width="100%" />
</div>

<!-- ========================= SNAKE =========================
     .github/workflows/snake.yml が output ブランチに生成 -->
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/shimano-yuuki/shimano-yuuki/output/snake-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/shimano-yuuki/shimano-yuuki/output/snake.svg" />
    <img alt="contribution snake animation" src="https://raw.githubusercontent.com/shimano-yuuki/shimano-yuuki/output/snake.svg" width="100%" />
  </picture>
</div>

---

## じゃんけん

<!-- ここから ↓ は scripts/janken.mjs が自動生成する。手で書き換えても次の対戦で上書きされる。 -->
<!-- janken starts -->
<div align="center">

**押すだけで対戦できます。Issueが立って、数秒後にBotが手を出します。**

  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=janken%3Arock&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/%E2%9C%8A%20%E3%82%B0%E3%83%BC-0d1117?style=for-the-badge&labelColor=0d1117&color=39d353" alt="rock" /></a>
  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=janken%3Ascissors&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/%E2%9C%8C%EF%B8%8F%20%E3%83%81%E3%83%A7%E3%82%AD-0d1117?style=for-the-badge&labelColor=0d1117&color=39d353" alt="scissors" /></a>
  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=janken%3Apaper&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/%E2%9C%8B%20%E3%83%91%E3%83%BC-0d1117?style=for-the-badge&labelColor=0d1117&color=39d353" alt="paper" /></a>

`BOT 1W` &nbsp;·&nbsp; `1L` &nbsp;·&nbsp; `0D` &nbsp;·&nbsp; `win rate 50%` &nbsp;·&nbsp; `2 games`

</div>

| 結果 | 挑戦者 | 挑戦者の手 | BOTの手 | |
|---|---|---|---|---|
| `YOU WIN` | @shimano-yuuki | ✌️ チョキ | ✋ パー | 0m ago |
| `BOT WIN` | @shimano-yuuki | ✋ パー | ✌️ チョキ | 2m ago |
<!-- janken ends -->

---

<!-- ========================= STATS =========================
     vercel から直リンクせず、profile.yml で取得してリポジトリに保存したものを使う。
     vercel 側が落ちても README が壊れない（rickstaa/rickstaa と同じ方針）。 -->
<div align="center">
  <img src="./assets/stats.svg" alt="github stats" height="150" />
  <img src="./assets/top-langs.svg" alt="top languages" height="150" />
</div>
<div align="center">
  <img src="./assets/activity-graph.svg" alt="activity graph" width="100%" />
</div>

## 最近書いたコード

<!-- ここから ↓ は scripts/activity.mjs が自動生成する。 -->
<!-- activity starts -->
_初回の `generate profile assets` 実行で埋まります。_
<!-- activity ends -->

## 構成

<!-- mermaid は GitHub がネイティブでレンダリングする。画像ではないので
     ダークモードに自動追従し、外部サービスにも依存しない。 -->

```mermaid
flowchart LR
  subgraph CLIENT
    FL["Flutter<br/>iOS · Android"]
    NX["Next.js<br/>React · TypeScript"]
  end

  subgraph API
    GO["Go · Gin<br/>:8080"]
    LV["Laravel<br/>PHP"]
  end

  subgraph DATA
    PG[("PostgreSQL")]
    MY[("MySQL")]
    FB["Firebase<br/>Auth · Storage"]
  end

  FL --> FB
  NX --> GO
  NX --> LV
  GO --> PG
  LV --> MY

  DOCKER["Docker Compose — 全部これで立ち上げる"]
  DOCKER -.-> API
  DOCKER -.-> DATA

  classDef box fill:transparent,stroke:#39d353,stroke-width:1.5px
  classDef note fill:transparent,stroke:#30363d
  class FL,NX,GO,LV,PG,MY,FB box
  class DOCKER note
```

<!-- ========================= STACK =========================
     アイコン一覧: https://skillicons.dev -->
<div align="center">
  <img src="https://skillicons.dev/icons?i=dart,ts,go,php,flutter,nextjs,react,tailwind,firebase,postgres,mysql,docker&theme=dark&perline=6" />
</div>

<!-- ========================= BADGES ========================= -->
<div align="center">
  <img src="https://komarev.com/ghpvc/?username=shimano-yuuki&color=39d353&style=for-the-badge&label=VIEWS" />
  <img src="https://img.shields.io/github/followers/shimano-yuuki?style=for-the-badge&color=39d353&labelColor=0d1117&logo=github&label=FOLLOWERS" />
  <img src="https://img.shields.io/github/stars/shimano-yuuki?style=for-the-badge&color=39d353&labelColor=0d1117&logo=github&label=STARS" />
</div>

<!-- ========================= WORKS =========================
     作ったアプリの動作GIFを assets/ に置いてコメントを外す。
     シミュレータの画面収録を GIF にして 3本並べるのが一番効く。
<div align="center">
  <img src="./assets/mshare.gif" width="30%" />
  <img src="./assets/strength-chronicle.gif" width="30%" />
  <img src="./assets/sloth-shift.gif" width="30%" />
</div>
-->

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,2,5,30&height=100&section=footer" width="100%" />
</div>
