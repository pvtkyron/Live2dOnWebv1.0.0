# Blogfa ランタイム契約

## 目的

Blogfaネイティブページを基本可用性の依存先にせず、GitHub管理のProject Revストアを拡張として追加します。

基本ルール: **不健全な拡張が健全なBlogfaページを壊してはいけない。**

## 主なファイル

- `blogfa-final-template.html` — Blogfaネイティブテンプレート。
- `blogfa-custom-html-snippet.html` — 安定したカスタムHTML/JS入口。
- `assets/blogfa-bootstrap.js` — ストアbootstrap。
- `assets/blogfa-supervisor.js` — health監視とfallback所有。
- `assets/blogfa-live2d-addon.js` — 任意のマスコット層。
- `assets/blogfa-runtime-manifest.json` — runtime policy/threshold。
- `assets/blogfa-widget*.js` — 互換/履歴用widget。

## ランタイムplaceholder

```text
<-BlogUrl->
<-BlogTitle->
<-PostLink->
<-PostTitle->
```

これらはBlogfaが実行時に解決するトークンで、ローカルファイルパスではありません。静的validatorは未解決`<-...->`をfilesystem targetとして扱わないでください。

## 起動順

```text
native Blogfa page
  ↓
stable custom snippet
  ↓
storefront bootstrap/supervisor
  ↓
health check
  ├─ healthy → Project Rev layerを公開
  └─ unhealthy → native Blogfaを維持
  ↓
optional Live2D addon
```

Live2Dをストアの必須依存にしてはいけません。

## 障害分離

- ネットワーク失敗でもnative contentを表示する。
- malformedなremote contentでページを置換しない。
- Live2D失敗はマスコット層だけ劣化させる。
- cached/last-known-goodは検証が通る場合だけ利用する。
- safe/native bypassを維持する。
- watchdog復旧でreload loopを作らない。

## 変更チェックリスト

1. Blogfa template tag/placeholderを正確に維持する。
2. native pageへ漏れるglobal CSSを避ける。
3. mount/commitを可能な限りtransactionalにする。
4. 外部fetchには必ず失敗経路を用意する。
5. cleanupで所有するobserver/timer/listenerを解放する。
6. JavaScriptブロック/remote source unavailableでもnative pageを試す。
7. Live2D unavailableでもストアを試す。

## デバッグ

利用可能なら`REV_SYSTEM_HEALTH()`と`REV_LIVE2D_HEALTH()`を使用します。空白/部分表示では、native template → bootstrap → asset preflight → mount → supervisor health → Live2Dの順で、最初に失敗した境界を直してください。

## セキュリティ境界

GitHub token、private repository credential、session cookie、secret API keyをBlogfa template/client bootstrapへ埋め込まないでください。ブラウザへ届くものはすべて公開情報として扱います。
