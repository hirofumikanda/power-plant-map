# PLATEAU 建物3Dビューア（MapLibre + PMTiles）

このプロジェクトは、[国土交通省 PLATEAU プロジェクト](https://www.mlit.go.jp/plateau/)で提供されている建物データを使用し、MapLibre GL JS + React を用いて Web 上に 3D 建物を表示したビューアです。

## 機能

- OpenStreetMap タイルを背景に使用
- 建物データ（PMTiles）を 3D 表示（`top_height` 属性に基づく）
- PMTiles プロトコルによる高効率読み込み
- 建物をクリックすると詳細情報をポップアップ表示
- Vite + React + TypeScript による軽量構成

## 🗂️ ディレクトリ構成

```

.
├── public/
├── src/
│   ├── components/
│   │   └── MapView\.tsx
│   └── utils/
│       └── popup.ts
├── .env
├── index.html
└── vite.config.ts

````

## 🔧 セットアップ手順

### 1. 依存ライブラリのインストール

```bash
npm install
````

### 2. 環境変数の設定

プロジェクトルートに `.env` を作成し、PMTilesファイルのホスト先を指定してください。

```env
VITE_BASE_PATH=https://your-host.com/path-to-data
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

---

## 🧪 デモで使用している主なライブラリ

| ライブラリ                                                     | 概要                    |
| --------------------------------------------------------- | --------------------- |
| [maplibre-gl](https://maplibre.org/)                      | 軽量オープンソース地図描画ライブラリ    |
| [pmtiles](https://github.com/protomaps/PMTiles) | PMTiles 形式の読み込み用プロトコル |
| [React](https://react.dev/)                               | UIフレームワーク             |
| [Vite](https://vitejs.dev/)                               | 超高速フロントエンド開発環境        |
| [TypeScript](https://www.typescriptlang.org/)             | 型安全なJavaScript        |

