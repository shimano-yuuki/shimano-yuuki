// 自作SVG（header / stack / bootlog）で共有するデザイントークン。
// 色をここ1か所に集約しているので、全部の見た目がまとめて変わる。

export const FONT = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'

// 明るい方をベースにして、dark はメディアクエリで上書きする。
// GitHub の <img> 埋め込みSVGでも prefers-color-scheme は効く。
export const CSS_VARS = `
  :root {
    --fg: #1f2328;
    --muted: #59636e;
    --accent: #1a7f37;
    --line: #d1d9e0;
    --faint: #eaeef2;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --fg: #e6edf3;
      --muted: #8b949e;
      --accent: #39d353;
      --line: #30363d;
      --faint: #21262d;
    }
  }`

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// monospace の実測字幅（font-size に対する比率）
export const CHAR = 0.6
