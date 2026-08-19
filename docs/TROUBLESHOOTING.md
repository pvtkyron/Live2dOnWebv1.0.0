# トラブルシューティング

## 最初に失敗レイヤーを特定する

1. 静的HTML/CSS/storefront JavaScript
2. Live2D拡張
3. Blogfa bootstrap/supervisor

全部にretryを足すのではなく、最初に失敗した境界を直してください。

## ページは開くがスタイルがない

ルート深度と相対stylesheet pathを確認します。rootページは`./assets/...`、`products/`/`posts/`は`../assets/...`を使います。`assets/store.css`と`assets/ja.css`が正しいMIME/URLで取得できることも確認してください。

## モバイルメニューが開かない

- `.topbar`がある。
- その内部に`nav`がある。
- toggleに`data-menu-toggle`がある。
- `assets/store.js`に構文エラーがない。
- 初期化後に別scriptがnavを置換していない。

## 製品フィルターが動かない

`shop.html`では`.filterbar`ボタンの`data-filter`と`.product-card`の`data-type`を対応させます。表示文字列は日本語のままで構いません。フィルターの内部キーは`all`, `essential`, `creator`, `utility`, `archive`, `support`, `bundle`を維持してください。

## reveal/counterが動かない

`prefers-reduced-motion`を確認してください。reduced-motionでは意図的に最終表示状態を即時適用します。古いブラウザでは`IntersectionObserver`も確認します。

## Live2Dが出ない

1. `dist/live2d_bundle.js`が読み込める。
2. model/texture 404をconsoleで確認。
3. model JSON pathの大小文字を確認。
4. canvas要素がある。
5. `waifu-tips.js` / `assets/waifu-route.js`が先に失敗していない。
6. Live2Dが壊れてもストア本体が使える。

## Blogfaが空白/部分overlayになる

native Blogfa → stable snippet → bootstrap/supervisor → remote asset preflight → mount → health → optional Live2Dの順で確認します。拡張が失敗したらnative Blogfaが残るのが正しい挙動です。

## validatorがBlogfa URLをmissing file扱いする

`<-BlogUrl->`や`<-PostLink->`はランタイムトークンです。未解決`<-...->`はskipし、実在するローカル`href`/`src`だけ検証します。

## sitemap/canonical不一致

公開ルート改名時はcanonical URL、`sitemap.xml`、そのルートを指すクロール可能リンクを一緒に更新します。`robots.txt`はcanonical sitemapを指し、`404.html`は`noindex`を維持します。

## ローカルでは動くがGitHubで失敗する

大小文字、未commitファイル、bundle再生成漏れ、ローカル絶対path、CDN cache、整形で壊れたBlogfa placeholderを確認します。
