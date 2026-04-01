# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

引越し費用シミュレーター — 引越し費用の概算を出し、正確な見積もりへの導線を作るReact静的サイト。
収益モデル: AdSense + 引越し一括見積もりアフィリエイト。

## Commands

```bash
npm run dev      # 開発サーバー起動
npm run build    # TypeScript型チェック + Viteビルド（dist/に出力）
npm run lint     # ESLintチェック
npm run preview  # ビルド結果をローカルプレビュー
```

## Architecture

- **Vite + React + TypeScript** (SPA, BrowserRouter)
- **Cloudflare Pages** でホスティング（`public/_redirects` でSPAフォールバック）
- DB不使用。料金データは `src/data/` のTypeScriptファイルで管理

### ディレクトリ構成

```
src/
  components/  # 共通UIコンポーネント（Layout, CtaButton, Disclaimer）
  data/        # 料金テーブル・都道府県距離マトリクス等のデータ定数
  pages/       # 各ページコンポーネント（ルート単位）
  utils/       # 計算ロジック・ユーティリティ
public/        # 静的ファイル（robots.txt, sitemap.xml, _redirects, favicon）
```

### ページ構成（ルーティング: App.tsx）

| パス | コンポーネント | 内容 |
|---|---|---|
| `/` | HomePage | ツール一覧 + 相場表 |
| `/estimate` | EstimatePage | メインの引越し費用シミュレーター（ステップ形式） |
| `/tanshin` | TanshinPage | 単身パック比較 |
| `/shoki-hiyo` | ShokiHiyoPage | 初期費用トータル計算 |
| `/fuyohin` | FuyohinPage | 不用品処分コスト計算 |
| `/about` | AboutPage | 概要・免責 |

### 計算ロジック

- `utils/calculateEstimate.ts`: (基本料金 + 距離加算) × 時期係数 × 曜日係数 × 時間帯係数 + オプション → ±15%レンジで出力
- 料金テーブル: `data/priceTable.ts`（間取り×荷物量、距離加算、月別係数、オプション）
- 都道府県距離: `data/prefectureDistances.ts`（47×47マトリクス、道路距離概算）

### 環境変数

- `VITE_GA4_MEASUREMENT_ID` — GA4 測定ID
- `VITE_ADSENSE_PUBLISHER_ID` — AdSense パブリッシャーID
- `VITE_AFFILIATE_URL` — アフィリエイトリンクURL
