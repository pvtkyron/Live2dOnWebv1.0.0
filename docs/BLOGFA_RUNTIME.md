# Blogfa ランタイム契約

## 目的

Blogfaネイティブページを基本可用性の依存先にせず、GitHub管理のProject Revストアを拡張として追加します。

基本ルール: **不健全な拡張が健全なBlogfaページを壊してはいけない。**

もうひとつの固定ルール: **デスクトップ向けの見た目を縮めただけのモバイル表示を作らない。** Blogfaネイティブ面、Project Revストア、Shadow DOM、Live2Dの4層すべてが同じレスポンシブ契約に従います。

## 主なファイル

- `blogfa-final-template.html` — Blogfaネイティブテンプレート。
- `blogfa-custom-html-snippet.html` — 安定したカスタムHTML/JavaScript入口。
- `assets/blogfa-responsive.css` — Blogfa全体のレスポンシブ・safe-area・タッチ・印刷・アクセシビリティ層。
- `assets/blogfa-responsive.js` — VisualViewport、Shadow DOM CSS注入、画像/iframe最適化、Live2D操作性を担当する軽量実行層。
- `assets/blogfa-bootstrap.js` — ストア起動処理。
- `assets/blogfa-supervisor.js` — 健全性監視、レスポンシブ層の冗長起動、フォールバック管理。
- `assets/blogfa-live2d-addon.js` — 任意のマスコット層。
- `assets/blogfa-runtime-manifest.json` — ランタイム方針としきい値設定。
- `assets/blogfa-widget*.js` — 互換性/履歴用ウィジェット。
- `scripts/check-blogfa-responsive.js` — レスポンシブ契約のCI検証。

## ランタイム用プレースホルダー

```text
<-BlogUrl->
<-BlogTitle->
<-PostLink->
<-PostTitle->
```

これらはBlogfaが実行時に解決するトークンで、ローカルファイルパスではありません。静的検証ツールは未解決`<-...->`をファイルシステム上の対象として扱わないでください。

## 起動順

```text
Blogfaネイティブページ
  ↓
安定したカスタムスニペット
  ↓
レスポンシブ実行層 + safe-area/viewport契約
  ↓
ストア起動/監視レイヤー
  ↓
健全性確認
  ├─ 正常 → Project Revレイヤーを公開
  │          ↓
  │       Shadow DOMへ同じレスポンシブCSSを注入
  └─ 異常 → Blogfaネイティブ表示を維持
  ↓
任意のLive2D追加レイヤー
```

Live2Dをストアの必須依存にしてはいけません。レスポンシブ層もsupervisorから冗長起動されるため、古い入口から新しいsupervisorだけが読み込まれた場合でもモバイル最適化が失われない設計にします。

## デバイス契約

主要なCSS境界は次のとおりです。

| 幅/条件 | 主目的 |
|---|---|
| `> 1440px` | 大型デスクトップで余白と2カラム密度を最適化 |
| `≤ 1180px` | ノートPC/小型デスクトップ |
| `≤ 900px` | タブレット、1カラム化、横スクロールナビ |
| `≤ 680px` | 一般的なスマートフォン、ボタン拡大、カード単列化 |
| `≤ 460px` | 小型スマートフォン、本文・Live2D・ページ余白を再調整 |
| `≤ 360px` | 極小幅端末での最終安全域 |
| `高さ≤620px + landscape` | 横向きスマートフォン/低いブラウザ表示 |
| `pointer: coarse` | 実タッチ領域を最低44–48pxへ固定 |
| `prefers-reduced-motion` | 不要なアニメーションを停止 |
| `prefers-contrast: more` | 境界線と本文コントラストを強化 |
| `print` | ナビ・Live2D・補助UIを除外して印刷可能にする |

## viewport / safe-area

`assets/blogfa-responsive.js`は`meta[name="viewport"]`を次の契約へ統一します。

```text
width=device-width,initial-scale=1,viewport-fit=cover,interactive-widget=resizes-content
```

さらに`VisualViewport`から実表示サイズを取得し、`--rev-vw`、`--rev-vh`、`--rev-viewport-width`、`--rev-viewport-height`を更新します。resizeイベントは`requestAnimationFrame`で抑制し、ソフトウェアキーボード表示中の不要な再計算を減らします。

ノッチ端末では`env(safe-area-inset-*)`を利用し、上部ナビ、左右余白、下部Live2Dが安全領域へ侵入しないようにします。

## Shadow DOM

Blogfa上のProject RevストアはShadow DOMへ表示される場合があります。通常のページCSSはShadow DOMを越えないため、`assets/blogfa-responsive.js`が`#rev-project-host.shadowRoot`を検出し、同じ`assets/blogfa-responsive.css`をShadow DOM内部にも一度だけ注入します。

Shadow DOM側のモバイルナビは以下で閉じます。

- ナビリンクを選択したとき
- ナビ外をクリックしたとき
- `Escape`を押したとき
- 760pxより広い画面へ戻ったとき

閉じる際は`aria-expanded`、`aria-label`、メニューボタン表示も同期します。

## コンテンツ最適化

レスポンシブ実行層は追加されたDOMだけを増分処理します。ページ全体をMutationごとに再走査してはいけません。

- 主要画像以外は`loading="lazy"`。
- 画像は`decoding="async"`。
- iframeはlazy-loadし、タイトルがない場合は日本語の補助タイトルを付与。
- 横長tableはスクロール可能なラッパーへ入れる。
- 埋め込みiframeは16:9を基準にレスポンシブ化。
- `target="_blank"`には`noopener noreferrer`を付与。

## Live2Dモバイル方針

**`#waifu`全体をtransformで縮小しない。** 全体scaleはツールバーの実タッチ領域まで縮めるため禁止します。

画面幅に応じてLive2Dの`canvas`だけをCSS表示サイズで縮小し、ツールボタン自体は44px以上を維持します。小型端末ではメッセージの最大幅/高さ、ツールバー位置も再調整し、横向きの低い画面ではメッセージを非表示にして本文を優先します。

Live2Dツールには日本語の`aria-label`と`title`を設定し、`Enter`/`Space`でも操作できるようにします。

## 障害分離

- ネットワーク失敗でもネイティブコンテンツを表示する。
- 壊れたリモートコンテンツでページを置換しない。
- Live2D失敗はマスコット層だけを停止させる。
- レスポンシブCSSの外部取得失敗時も、テンプレート内の基礎CSSを残す。
- キャッシュ済み/直近の正常データは検証が通る場合だけ利用する。
- 安全/ネイティブ経路を維持する。
- 監視処理による復旧で再読み込みループを作らない。

## 変更チェックリスト

1. Blogfaテンプレートタグとプレースホルダーを正確に維持する。
2. ネイティブページへ漏れる全体CSSを避ける。
3. 表示確定処理を可能な限り一括で安全に行う。
4. 外部取得には必ず失敗経路を用意する。
5. 後始末で所有する監視、タイマー、イベントリスナーを解放する。
6. JavaScriptブロック時/リモート取得不能時でもネイティブページを試す。
7. Live2D利用不能時でもストアを試す。
8. モバイル対応で`#waifu`全体をscaleしない。
9. 44px未満の主要タッチターゲットを追加しない。
10. Shadow DOMへ追加したUIはShadow内のCSS/イベントで検証する。
11. breakpoint変更時は`npm run check:blogfa`も更新する。

## 検証

```bash
npm run check:static
npm run check:ja
npm run check:blogfa
node --check assets/blogfa-responsive.js
```

`check:blogfa`はbreakpoint、safe-area、landscape、coarse pointer、reduced motion、high contrast、印刷、Live2D canvas縮小、実タッチ領域、VisualViewport、rAF抑制、Shadow DOM CSS注入、増分Mutation処理、lazy-load、キーボード操作、viewport契約、入口起動順、冗長起動、Blogfaテンプレートスロットを検証します。

## デバッグ

利用可能なら`REV_SYSTEM_HEALTH()`、`REV_LIVE2D_HEALTH()`、`REV_RESPONSIVE_REFRESH()`を使用します。空白/部分表示では、ネイティブテンプレート → レスポンシブ入口 → 起動処理 → アセット事前検証 → Shadow表示 → 監視による健全性確認 → Live2Dの順で、最初に失敗した境界を直してください。

## セキュリティ境界

GitHubトークン、非公開リポジトリ認証情報、セッションクッキー、秘密APIキーをBlogfaテンプレートやクライアント側起動処理へ埋め込まないでください。ブラウザへ届くものはすべて公開情報として扱います。
