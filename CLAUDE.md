# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

引越し費用シミュレーター — 引越し費用の概算を出し、正確な見積もりへの導線を作るReact静的サイト。
収益モデル: AdSense + 引越し侍アフィリエイト（A8.net） + Amazon/楽天アフィリエイト。

- 本番URL: https://hikkoshi.simtool.dev/
- GitHub: https://github.com/motte12345/hikkoshi-sim
- Cloudflare Pagesで自動デプロイ（mainへのpush）

## Commands

```bash
npm run dev      # 開発サーバー起動
npm run build    # TypeScript型チェック + Viteビルド（dist/に出力）
npm run lint     # ESLintチェック
npm run preview  # ビルド結果をローカルプレビュー
node scripts/generate-ogp.mjs  # OGP画像を再生成（要@napi-rs/canvas）
```

## Architecture

- **Vite + React + TypeScript** (SPA, BrowserRouter)
- **Cloudflare Pages** でホスティング（`public/_redirects` でSPAフォールバック）
- DB不使用。料金データは `src/data/` のTypeScriptファイルで管理
- フォーム入力値は `useSessionState` フックで sessionStorage に保持（タブ閉じるまで）

### ディレクトリ構成

```
src/
  components/  # 共通UI（Layout, CtaButton, Disclaimer, Seo, AdSense, ProductLinks）
  data/        # 料金テーブル・都道府県距離マトリクス・単身パック・不用品・アフィリエイト商品
  hooks/       # カスタムフック（useSessionState）
  pages/       # 各ページコンポーネント（ルート単位）
  utils/       # 計算ロジック（calculateEstimate）・formatCurrency・analytics
public/        # 静的ファイル（robots.txt, sitemap.xml, _redirects, _headers, ogp.png, favicon）
scripts/       # ビルドスクリプト（OGP画像生成）
```

### ページ構成（ルーティング: App.tsx）

| パス | コンポーネント | 内容 |
|---|---|---|
| `/` | HomePage | ツール一覧 + 相場表 + 商品リンク |
| `/estimate` | EstimatePage | 引越し費用シミュレーター（ステップ形式） |
| `/tanshin` | TanshinPage | 単身パック比較 |
| `/shoki-hiyo` | ShokiHiyoPage | 初期費用トータル計算 |
| `/fuyohin` | FuyohinPage | 不用品処分コスト計算 |
| `/about` | AboutPage | 概要・免責・運営者情報 |

### 計算ロジック

- `utils/calculateEstimate.ts`: (基本料金 + 距離加算) × 時期係数 × 曜日係数 × 時間帯係数 + オプション → ±15%レンジで出力
- 料金テーブル: `data/priceTable.ts`（間取り×荷物量、距離加算、月別係数、オプション）
- 都道府県距離: `data/prefectureDistances.ts`（47×47マトリクス、道路距離概算）

### 収益導線

| 導線 | 場所 | 詳細 |
|---|---|---|
| 引越し侍CTA | 全ツールの結果画面 | A8.net経由、見積完了667円 |
| AdSense | 全ツールの結果画面 + トップ | ca-pub-6514048542181621 |
| Amazon/楽天 | トップ + estimate結果 + tanshin結果 | 引越しグッズ6商品 |

### GA4カスタムイベント

- `calculate` — 各ツールの計算実行（tool_name, パラメータ付き）
- `cta_click` — CTAボタンクリック（tool_name）
- `affiliate_click` — Amazon/楽天リンククリック（store, product）

### SEO

- 各ページ個別のtitle/description/OGP（react-helmet-async）
- FAQSchema構造化データ（トップ・estimate・tanshin・shoki-hiyo・fuyohin）
- WebSiteスキーマ（トップページのみ）
- OGP画像: `public/ogp.png`（1200×630）
- sitemap.xml / robots.txt

### セキュリティ

- `public/_headers`: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- URLパラメータ（moving-cost）に上限チェック（1000万円）
- formatCurrencyにNaN/Infinityガード
- 外部リンクに rel="noopener noreferrer nofollow"
