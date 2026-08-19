# Project Rev / Live2D on Web

[![CI](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/ci.yml/badge.svg)](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/ci.yml)
[![Static integrity](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/static-integrity.yml/badge.svg)](https://github.com/pvtkyron/Live2dOnWebv1.0.0/actions/workflows/static-integrity.yml)

Project Revは、静的ファーストのストア兼編集サイトです。必要に応じてLive2D表示レイヤーを追加でき、Blogfa向けには障害に強い互換経路を用意しています。

Live2Dランタイムの系譜は[`Konata09/Live2dOnWeb`](https://github.com/Konata09/Live2dOnWeb)に由来します。一方、Project Revのストア、Blogfa分離レイヤー、公開ルート/SEO、検証自動化、保守ドキュメントはこのリポジトリ独自のレイヤーとして管理しています。

基本ルールはひとつです。**任意の拡張レイヤーが失敗しても、長く残すコンテンツとナビゲーションは動き続けること。**

## このリポジトリに含まれるもの

- **静的ストア** — ホーム、カタログ、製品、ジャーナル、ガイド、FAQ、Aboutの通常HTMLルート。
- **プログレッシブUI** — レスポンシブCSSと軽量JavaScriptによるナビゲーション、フィルター、読書進捗、モーション効果。
- **日本語ローカライズ** — 公開UI、メタデータ、Blogfa表示、Live2Dメッセージを日本語で統一。
- **Live2D** — SDKv2/SDKv4ランタイムソース、モデルアセット、生成済みブラウザバンドル。
- **Blogfa互換** — GitHub管理ストアを公開しつつ、Blogfaネイティブ面を独立して維持するbootstrap/supervisorレイヤー。
- **検索・発見用メタデータ** — canonical URL、`robots.txt`、XML/HTMLサイトマップ、web manifest。

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

静的リンク/サイトマップ検証:

```bash
npm run check:static
```

ポート5001で配信:

```bash
npm run serve
```

## 品質ゲート

Pull Requestでは主に2つのワークフローを使います。

- **Static integrity** — ローカル`href`/`src`とサイトマップを検証し、Blogfaの`<-...->`はファイルパスではなくランタイムトークンとして扱います。
- **CI** — lock済み依存関係の導入、本番依存関係監査、Live2D本番バンドル生成、生成物確認、JavaScript構文確認、JSON/設定ファイル解析を行います。

## ランタイム原則

1. **Static first.** JavaScriptなしでも主要コンテンツとルートを利用できること。
2. **Progressive enhancement.** UIとLive2Dは拡張であり、文書の必須依存にしないこと。
3. **Fail soft.** ブラウザAPI、マスコット、Blogfa拡張が失敗しても健全なコンテンツを消さないこと。
4. **境界をレビュー可能に保つ。** 生成済みLive2Dバンドルの変更を無関係な編集/SEO/Blogfa変更と混ぜないこと。
5. **ブラウザへ届くデータは公開情報として扱う。** 秘密トークン、認証情報、Cookie、本番専用secretをコミットしないこと。

## デプロイモデル

canonicalな静的サイトとLive2Dアセットは同じリポジトリで管理します。Blogfa連携は専用bootstrap/supervisorに隔離し、拡張が安全に初期化できない場合でもBlogfaネイティブ面を維持します。

`robots.txt`、`sitemap.xml`、`site.webmanifest`などSEO向けファイルは公開ルートと一緒に管理し、ルート変更時は同時に更新してください。
