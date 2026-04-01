# 引越し費用シミュレーター 実装計画

## Phase 1: プロジェクト基盤（Vite + React + ルーティング）

- Vite + React + TypeScript プロジェクト作成
- React Router でページルーティング設定
- 共通レイアウト（ヘッダー、フッター、免責事項）
- レスポンシブCSS基盤
- .env.example 作成

## Phase 2: 料金データ整備

- 料金テーブルJSON（basePriceByLayout, distanceSurcharge, seasonMultiplier, options等）
- 都道府県間距離マトリクスJSON（47×47）
- 単身パック料金データJSON
- 不用品処分費用データJSON

## Phase 3: メインツール — 引越し費用シミュレーター `/estimate`

- ステップ形式フォーム（間取り→距離→時期→オプション）
- 計算ロジック（±15%レンジ出力）
- 結果表示（概算費用、内訳テーブル）
- CTAボタン（アフィリエイトリンク仮）

## Phase 4: サブツール3種

- 単身パック比較 `/tanshin`
- 初期費用トータル計算 `/shoki-hiyo`
- 不用品処分コスト計算 `/fuyohin`

## Phase 5: トップページ + About + SEO

- トップページ（ツール一覧カード）
- About・免責ページ
- SEO（meta, OGP, FAQSchema, sitemap.xml, robots.txt）
- 404ページ

## Phase 6: 広告・アナリティクス連携

- AdSense スクリプト埋め込み + 広告ユニット配置
- GA4 埋め込み + カスタムイベント送信
- 環境変数からID注入

## Phase 7: デプロイ

- GitHub リポジトリ作成
- Cloudflare Pages 連携設定
- 本番確認

---

## 現在のフェーズ: Phase 5 途中（SEO詳細設定が残り）→ Phase 6 待ち
