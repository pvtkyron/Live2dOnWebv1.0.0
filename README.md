# Project Rev / Live2D Web版

[![継続的検証](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/ci.yml/badge.svg)](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/ci.yml)
[![静的整合性検証](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/static-integrity.yml/badge.svg)](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/static-integrity.yml)

Project Revは、静的ファーストのストア兼編集サイトです。必要に応じてLive2D表示レイヤーを追加でき、Blogfa向けには障害に強い互換経路を用意しています。

Live2Dランタイムの系譜は[`Konata09/Live2dOnWeb`](https://github.com/Konata09/Live2dOnWeb)に由来します。一方、Project Revのストア、Blogfa分離レイヤー、公開ルートとSEO、検証自動化、保守ドキュメントはこのリポジトリ独自のレイヤーとして管理しています。

基本ルールはひとつです。**任意の拡張レイヤーが失敗しても、長く残すコンテンツとナビゲーションは動き続けること。**

## このリポジトリに含まれるもの

- **静的ストア** — ホーム、カタログ、製品、ジャーナル、ガイド、よくある質問、このサイトについて、の通常HTMLルート。
- **段階的に拡張するUI** — レスポンシブCSSと軽量JavaScriptによるナビゲーション、フィルター、読書進捗、モーション効果。
- **日本語ローカライズ** — 公開UI、メタデータ、Blogfa表示、Live2Dメッセージ、障害時のフォールバック表示を日本語で統一。
- **Live2D** — SDKv2/SDKv4ランタイムソース、モデルアセット、生成済みブラウザバンドル。
- **Blogfa互換** — GitHub管理ストアを公開しつつ、Blogfaネイティブ面を独立して維持する起動・監視レイヤー。
- **検索・発見用メタデータ** — 正規URL、`robots.txt`、XML/HTMLサイトマップ、ウェブマニフェスト。

## リポジトリ構成

- `index.html`, `shop.html`, `journal.html`, `about.html`, `faq.html` — 主要静的ルート。
- `products/` — 製品ページ。
- `posts/` — 編集記事とガイド。
- `assets/` — ストアのスタイル、UIランタイム、Blogfa連携。
- `model/` — Live2Dモデル、テクスチャ、モーション、音声。
- `src/SDKv2/`, `src/SDKv4/` — Live2Dランタイムソース。
- `dist/` — 生成済みブラウザバンドルと圧縮版。
- `blogfa-*.html` — Blogfa連携テンプレート/スニペット。
- `docs/` — アーキテクチャ、デプロイ、ランタイム、トラブルシューティング。

## ドキュメント

- [アーキテクチャ](docs/ARCHITECTURE.md)
- [デプロイとロールバック](docs/DEPLOYMENT.md)
- [Blogfaランタイム契約](docs/BLOGFA_RUNTIME.md)
- [Live2D保守](docs/LIVE2D_MAINTENANCE.md)
- [トラブルシューティング](docs/TROUBLESHOOTING.md)
- [セキュリティポリシー](SECURITY.md)
- [コントリビュート](CONTRIBUTING.md)

## ローカル開発

依存関係を導入して開発サーバーを起動します。

```bash
npm install
npm start
```

開発ビルド:

```bash
npm run build
```

本番ビルド:

```bash
npm run build:prod
```

静的リンクとサイトマップの検証:

```bash
npm run check:static
```

ポート5001で配信:

```bash
npm run serve
```

## 品質ゲート

プルリクエストでは主に2つのワークフローを使います。

- **静的整合性検証** — ローカル`href`/`src`とサイトマップを検証し、Blogfaの`<-...->`はファイルパスではなくランタイムトークンとして扱います。
- **継続的検証** — 固定済み依存関係の導入、本番依存関係監査、Live2D本番バンドル生成、生成物確認、JavaScript構文確認、JSON/設定ファイル解析を行います。

同じ静的整合性検証はローカルでも`npm run check:static`で実行できます。リンク切れをプッシュ前に検出できます。

現在のNode環境で旧Webpack構成の本番ビルドを行うため、OpenSSL互換オプションを本番ビルド工程だけに限定して使っています。ビルドツールチェーン自体を更新するまでは、この互換設定を不用意に広げないでください。

## ランタイム原則

1. **静的ファースト。** JavaScriptなしでも主要コンテンツ、ナビゲーション、製品/記事ルートを利用できること。
2. **段階的に拡張する。** ストアUIとLive2Dは便利さを足すレイヤーであり、下にある文書の必須依存にしないこと。
3. **安全に劣化する。** ブラウザAPI、マスコット、Blogfa拡張が失敗しても健全なコンテンツを消さないこと。
4. **境界をレビュー可能に保つ。** 生成済みLive2Dバンドルの変更を無関係な編集、SEO、Blogfa変更と混ぜないこと。
5. **ブラウザへ届くデータは公開情報として扱う。** 秘密トークン、認証情報、クッキー、本番専用の秘密情報をコミットしないこと。

## デプロイモデル

正規の静的サイトとLive2Dアセットは同じリポジトリで管理します。Blogfa連携は専用の起動・監視ファイルに隔離し、拡張が安全に初期化できない場合でもBlogfaネイティブ面を維持します。

`robots.txt`、`sitemap.xml`、`site.webmanifest`などSEO向けファイルは公開ルートと一緒に管理し、ルート変更時は同時に更新してください。

## 変更時の方針

変更はレビューとロールバックがしやすい大きさに分けてください。特に、ストア表示、Blogfa連携、Live2Dソース/モデル、生成バンドル、リポジトリ用ツールは、依存関係がない限り別の変更として扱うのが安全です。
