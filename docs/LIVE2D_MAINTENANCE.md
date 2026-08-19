# Live2D 保守ガイド

## 構成

- `src/SDKv2/` — legacy SDKv2 runtime
- `src/SDKv4/` — SDKv4 runtime/framework
- `model/` — model definition、texture、motion、sound
- `dist/live2d_bundle.js` — 公開ページ用browser bundle
- `dist/live2d_bundle.js.gz`, `.br` — 圧縮版
- `waifu-tips.js`, `waifu-tips.json` — マスコット動作/日本語コンテンツ
- `assets/waifu.css` — 表示
- `assets/waifu-route.js` — route bootstrap glue

## モデル変更前

まずSDK世代を特定してください。SDKv2とSDKv4のモデル形式は互換ではありません。モデルJSON、binary、texture、motion、physics、soundを一緒に管理します。

テクスチャ交換/最適化時:

- モデル定義が対応するサイズを維持する。
- transparencyを維持する。
- 全texture pathを確認する。
- alternate format削除前に元形式をテストする。
- 透明edgeに継ぎ目が出るlossy変換を避ける。

## ソースと生成物

`src/`はauthored runtime source、`dist/`は生成browser outputとして分離します。本番挙動に影響するsource変更はbundle再生成を伴いますが、無関係なコンテンツ変更でbundleを再生成しないでください。

## 本番検証

1. 本番ビルド。
2. canonicalホームとnested routeを開く。
3. canvasがconsole errorなしで初期化されることを確認。
4. 対応していればmotion/expressionを1つ以上実行。
5. close/reopenを確認。
6. マスコット初期化失敗でもサイトが動くことを確認。
7. narrow mobileでoverflow/touch干渉を確認。

## パフォーマンス

- runtime対応の圧縮画像代替を維持する。
- 全model/motion/soundをglobal preloadしない。
- route UI変更ごとにruntimeを再構築しない。
- optional integration破棄時にtimer/listener/observerを解放する。
- reduced-motionでは装飾motionを無効化する。

## 互換性

SDKv4があるからという理由だけでSDKv2を削除しないでください。古いruntimeに依存する公開モデル/ルートがないことを先に確認します。Cubism framework更新もcore/runtime互換性を無視して単独更新しないでください。

## ライセンス

SDKツリーのupstream license、changelog、redistributable noticeは改変せず維持してください。新しいモデルは再配布権が明確な場合だけ追加します。
