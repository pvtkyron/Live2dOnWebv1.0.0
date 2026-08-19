# デプロイガイド

## 公開面

Project Revには2つの公開面があります。

1. canonicalな静的リポジトリページ
2. GitHub管理アセットを利用する任意のBlogfa連携

リリース時は分けて扱ってください。静的サイトで安全な変更でもBlogfa placeholder/bootstrapを壊す可能性があります。

## 公開前

```bash
npm install
npm run build:prod
npm run serve
```

最低限確認するもの:

- `/index.html`
- `/shop.html`と全フィルター
- `/journal.html`と記事
- `/about.html`, `/faq.html`, `/404.html`
- 6製品ルート
- Live2Dの読み込み/操作
- 760px付近のモバイルナビ
- reduced-motion
- canonical/metadata
- 日本語表示の折返しと文字化け

## 静的サイトチェックリスト

- ルート深度に応じた相対asset pathを維持する。
- ルート追加/削除/改名時は`sitemap.xml`を更新する。
- discovery変更時は`sitemap.html`も更新する。
- `robots.txt`がcanonical sitemapを指すことを確認する。
- `404.html`は`noindex`のままにする。
- HTML/JavaScriptにsecretや環境固有認証情報を入れない。

## Live2D変更

`src/`変更で公開バンドルも変わる場合:

1. 本番ビルドを作る。
2. `dist/live2d_bundle.js`の生成/読み込みを確認する。
3. authored sourceと生成diffを区別しやすくする。
4. 参照モデル/テクスチャの存在を確認する。
5. SDKv2/v4両方を維持するなら代表モデルを両方テストする。

## Blogfaチェックリスト

- `<-BlogUrl->`などのplaceholderを完全に維持する。
- safe/native bypassをテストする。
- GitHub/CDN取得失敗をシミュレートする。
- Blogfaネイティブ面が残ることを確認する。
- Live2D失敗が健全なストアを破壊しないことを確認する。

## ロールバック

原因となる最小変更をGit revertするのを優先します。canonicalサイトは静的ファーストなので、対象HTML/CSS/JSを戻せばDB migrationなしで以前の挙動へ戻せます。
