# Project Rev アーキテクチャ

## システム構成

Project Revは意図的に静的ファーストです。長く残すストアは通常HTML + 共通CSS/JavaScriptで構成し、BlogfaとLive2Dは任意の拡張レイヤーとして分離します。

```text
public HTML routes
  ├─ assets/store.css
  ├─ assets/ja.css
  ├─ assets/store.js
  ├─ assets/waifu-route.js
  ├─ dist/live2d_bundle.js
  └─ waifu-tips.js

Blogfa surface
  ├─ blogfa-final-template.html
  ├─ blogfa-custom-html-snippet.html
  ├─ assets/blogfa-bootstrap.js
  ├─ assets/blogfa-supervisor.js
  └─ assets/blogfa-live2d-addon.js
```

## 公開ルート層

`index.html`、`shop.html`、`journal.html`、`about.html`、`faq.html`は独立した文書として動きます。製品/記事ルートは`products/`と`posts/`以下です。

この層が日本語の長期コンテンツ、canonical URL、クロール可能なナビゲーション、metadata、JavaScript失敗時のfallbackを所有します。

## 共通ストアランタイム

`assets/store.css`がビジュアル/レスポンシブ動作を定義し、`assets/ja.css`が日本語向けタイポグラフィを補正します。`assets/store.js`は次を追加します。

- モバイルナビゲーション状態
- 現在ページのsemantics
- `data-filter`/`data-type`ベースの言語非依存カタログフィルター
- reveal効果
- 読書進捗
- 軽量カウンター/ポインター効果

ストレージ制限、reduced-motion、ブラウザAPI不足があっても静的ページは利用可能でなければなりません。

## Live2Dレイヤー

`dist/live2d_bundle.js`はLive2Dソースから生成したブラウザバンドルです。モデルは`model/`、日本語マスコットメッセージは`waifu-tips.json`、UI接続は`waifu-tips.js`と`assets/waifu-route.js`が担当します。

## Blogfa互換レイヤー

Blogfa連携はcanonical静的サイトから隔離されています。bootstrap/supervisorは前提条件が健全な場合だけGitHub管理ストアを読み込み、失敗時はBlogfaネイティブ面を残します。

契約:

1. canonical GitHubルートがBlogfaを必須にしない。
2. 任意リモートアセット失敗でBlogfaネイティブ面を空にしない。
3. `<-BlogUrl->`等をリポジトリパスではなくランタイムトークンとして扱う。
4. Live2D失敗をストア失敗から分離する。
5. 復旧用のsafe/native bypassを維持する。

## SEO / discovery

`robots.txt`、`sitemap.xml`、`sitemap.html`、`site.webmanifest`が公開面を記述します。新しい恒久ルートはサイトマップへ追加し、少なくとも1つのクロール可能ページからリンクしてください。
