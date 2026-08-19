# Project Rev アーキテクチャ

## システム構成

Project Revは意図的に静的ファーストです。長く残すストアは通常のHTMLと共通CSS/JavaScriptで構成し、BlogfaとLive2Dは任意の拡張レイヤーとして分離します。

```text
公開HTMLルート
  ├─ assets/store.css
  ├─ assets/ja.css
  ├─ assets/store.js
  ├─ assets/waifu-route.js
  ├─ dist/live2d_bundle.js
  └─ waifu-tips.js

Blogfa表示面
  ├─ blogfa-final-template.html
  ├─ blogfa-custom-html-snippet.html
  ├─ assets/blogfa-bootstrap.js
  ├─ assets/blogfa-supervisor.js
  └─ assets/blogfa-live2d-addon.js
```

## 公開ルート層

`index.html`、`shop.html`、`journal.html`、`about.html`、`faq.html`は独立した文書として動きます。製品/記事ルートは`products/`と`posts/`以下です。

この層が日本語の長期コンテンツ、正規URL、クロール可能なナビゲーション、メタデータ、JavaScript失敗時のフォールバックを所有します。

## 共通ストアランタイム

`assets/store.css`がビジュアルとレスポンシブ動作を定義し、`assets/ja.css`が日本語向けタイポグラフィを補正します。`assets/store.js`は次を追加します。

- モバイルナビゲーション状態
- 現在ページの意味づけ
- `data-filter`/`data-type`ベースの言語非依存カタログフィルター
- 表示アニメーション
- 読書進捗
- 軽量カウンター/ポインター効果

ストレージ制限、モーション低減設定、ブラウザAPI不足があっても静的ページは利用可能でなければなりません。

## Live2Dレイヤー

`dist/live2d_bundle.js`はLive2Dソースから生成したブラウザバンドルです。モデルは`model/`、日本語マスコットメッセージは`waifu-tips.json`、UI接続は`waifu-tips.js`と`assets/waifu-route.js`が担当します。

生成済みバンドルは、可能な限り手書きソースの変更と分けて扱います。レビュー時に生成物と人が書いた変更を区別しやすくするためです。

## Blogfa互換レイヤー

Blogfa連携は正規の静的サイトから隔離されています。起動/監視レイヤーは前提条件が健全な場合だけGitHub管理ストアを読み込み、失敗時はBlogfaネイティブ面を残します。

契約:

1. 正規のGitHubルートがBlogfaを必須にしない。
2. 任意のリモートアセット失敗でBlogfaネイティブ面を空にしない。
3. `<-BlogUrl->`等をリポジトリパスではなくランタイムトークンとして扱う。
4. Live2D失敗をストア失敗から分離する。
5. 復旧用の安全/ネイティブ経路を維持する。

## SEOと検索導線

`robots.txt`、`sitemap.xml`、`sitemap.html`、`site.webmanifest`が公開面を記述します。新しい恒久ルートはサイトマップへ追加し、少なくとも1つのクロール可能ページからリンクしてください。

## 変更境界

できるだけ変更範囲を分けてください。

- ストアのコンテンツ/レイアウト
- Blogfaランタイム
- Live2Dソース/モデル
- 生成済みバンドル
- リポジトリ用ツール/ドキュメント

境界を分けることで、不具合の原因特定とロールバックが簡単になります。
