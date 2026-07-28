<!-- 自作SVG。文言・スタックは scripts/brand.mjs を編集して再生成する。
     色は scripts/theme.mjs に集約してあるので、変えると全部の自作SVGに効く。 -->
<div align="center">
  <img src="./assets/header.svg" alt="shimano yuuki" width="100%" />
</div>

<!-- 実データのブートログ。scripts/bootlog.mjs が GitHub API から生成する。 -->
<div align="center">
  <img src="./assets/bootlog.svg" alt="boot log" width="100%" />
</div>

<!-- 草を食べる蛇。.github/workflows/snake.yml が output ブランチに生成する。 -->
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/shimano-yuuki/shimano-yuuki/output/snake-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/shimano-yuuki/shimano-yuuki/output/snake.svg" />
    <img alt="contribution snake animation" src="https://raw.githubusercontent.com/shimano-yuuki/shimano-yuuki/output/snake.svg" width="100%" />
  </picture>
</div>

<!-- 3D草グラフ。蛇と同じデータの別表現なので普段は出さない。
     入れ替えたいときは蛇のブロックと差し替える。
     profile.yml が profile-3d-contrib/ 以下に複数の絵柄を生成している。
<div align="center">
  <img src="./profile-3d-contrib/profile-green-animate.svg" alt="3d contribution calendar" width="100%" />
</div>
-->

<div align="center">
  <img src="./assets/stack.svg" alt="stack" width="100%" />
</div>

<!-- statsカードは vercel から直リンクせず profile.yml で取得して保存したものを使う。
     vercel が落ちても README が壊れない。 -->
<div align="center">
  <img src="./assets/stats.svg" alt="github stats" height="150" />
  <img src="./assets/top-langs.svg" alt="top languages" height="150" />
</div>

<!-- 年間アクティビティの折れ線。蛇と同じデータなので普段は出さない。
<div align="center">
  <img src="./assets/activity-graph.svg" alt="activity graph" width="100%" />
</div>
-->

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

## じゃんけん

<!-- ここから ↓ は scripts/janken.mjs が自動生成する。手で書き換えても次の対戦で上書きされる。 -->
<!-- janken starts -->
<div align="center">

押すとIssueが立ち、数秒後にBotが手を出して結果を返します。

  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=janken%3Arock&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/%E2%9C%8A%20%20%E3%82%B0%E3%83%BC-1a7f37?style=flat-square&labelColor=1a7f37" alt="rock" /></a>
  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=janken%3Ascissors&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/%E2%9C%8C%EF%B8%8F%20%20%E3%83%81%E3%83%A7%E3%82%AD-1a7f37?style=flat-square&labelColor=1a7f37" alt="scissors" /></a>
  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=janken%3Apaper&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/%E2%9C%8B%20%20%E3%83%91%E3%83%BC-1a7f37?style=flat-square&labelColor=1a7f37" alt="paper" /></a>

`BOT 1W` &nbsp;·&nbsp; `1L` &nbsp;·&nbsp; `0D` &nbsp;·&nbsp; `win rate 50%` &nbsp;·&nbsp; `2 games`

</div>

| 結果 | 挑戦者 | 挑戦者の手 | BOTの手 | |
|---|---|---|---|---|
| `YOU WIN` | @shimano-yuuki | ✌️ チョキ | ✋ パー | 2m ago |
| `BOT WIN` | @shimano-yuuki | ✋ パー | ✌️ チョキ | 5m ago |
<!-- janken ends -->

<!-- 作ったアプリの動作GIFを assets/ に置いてコメントを外す。
     シミュレータの画面収録を GIF にして 3本並べるのが一番効く。
## つくったもの

<div align="center">
  <img src="./assets/mshare.gif" width="30%" />
  <img src="./assets/strength-chronicle.gif" width="30%" />
  <img src="./assets/sloth-shift.gif" width="30%" />
</div>
-->

<div align="center">
  <img src="https://komarev.com/ghpvc/?username=shimano-yuuki&style=flat-square&color=39d353&labelColor=57606a&label=views" alt="views" />
</div>
