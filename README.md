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
| repository | latest commit | |
|---|---|---|
| **[shimano-yuuki](https://github.com/shimano-yuuki/shimano-yuuki)** `JavaScript` | [`chore: connect four vs @shimano-yuuki`](https://github.com/shimano-yuuki/shimano-yuuki/commit/28be0441afb2ef7c30848b24c306b92acf66487f) | 2h ago |
| **[shimano-yuuki.github.io](https://github.com/shimano-yuuki/shimano-yuuki.github.io)** `TypeScript` | [`WebGL 流体を軸にモノクロームへ全面リデザインする`](https://github.com/shimano-yuuki/shimano-yuuki.github.io/commit/f7decf46abd7ad40e1c4be724fbb29240d02863c) | 3h ago |
| **[shimanpo](https://github.com/shimano-yuuki/shimanpo)** `TypeScript` | [`fix : about`](https://github.com/shimano-yuuki/shimanpo/commit/a14c0bbdfec37d9a391b3d5b754be6cc575aec37) | 187d ago |
| **[clash_analytics](https://github.com/shimano-yuuki/clash_analytics)** `PHP` | [`内容の修正`](https://github.com/shimano-yuuki/clash_analytics/commit/0cfe862127c9c691e9d17f94ebc90f6ae63410ad) | 190d ago |
| **[git_hub_cotribution_app](https://github.com/shimano-yuuki/git_hub_cotribution_app)** `Dart` | [`リードミーの更新`](https://github.com/shimano-yuuki/git_hub_cotribution_app/commit/c3be5f69efd2ac68c2cfd001b37e64a5404b7bc0) | 195d ago |
| **[sloth_shift](https://github.com/shimano-yuuki/sloth_shift)** `Dart` | [`Merge pull request #48 from shimano-yuuki/feature_s…`](https://github.com/shimano-yuuki/sloth_shift/commit/d880a25e415c0342b91ddf02c5aee0babf5fb473) | 746d ago |
<!-- activity ends -->

## Connect Four

<!-- ここから ↓ は scripts/connect4.mjs が自動生成する。手で書き換えても次の一手で上書きされる。 -->
<!-- connect4 starts -->
<div align="center">

<img src="./assets/connect4.svg" alt="connect four" width="440" />

  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=c4%3A1&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/1-1a7f37?style=flat-square&labelColor=1a7f37" alt="drop in column 1" /></a>
  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=c4%3A2&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/2-1a7f37?style=flat-square&labelColor=1a7f37" alt="drop in column 2" /></a>
  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=c4%3A3&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/3-1a7f37?style=flat-square&labelColor=1a7f37" alt="drop in column 3" /></a>
  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=c4%3A4&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/4-1a7f37?style=flat-square&labelColor=1a7f37" alt="drop in column 4" /></a>
  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=c4%3A5&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/5-1a7f37?style=flat-square&labelColor=1a7f37" alt="drop in column 5" /></a>
  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=c4%3A6&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/6-1a7f37?style=flat-square&labelColor=1a7f37" alt="drop in column 6" /></a>
  <a href="https://github.com/shimano-yuuki/shimano-yuuki/issues/new?title=c4%3A7&body=%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%20Submit%20%E3%82%92%E6%8A%BC%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82"><img src="https://img.shields.io/badge/7-1a7f37?style=flat-square&labelColor=1a7f37" alt="drop in column 7" /></a>

直前の手は @shimano-yuuki。緑があなた、グレーがBOTです。

`BOT 0W` &nbsp;·&nbsp; `0L` &nbsp;·&nbsp; `0D` &nbsp;·&nbsp; `0 games`

</div>
<!-- connect4 ends -->

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
