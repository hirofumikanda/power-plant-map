# 原子力発電所稼働マップ（MapLibre + PMTiles）

このプロジェクトは、[国土数値情報](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P03.html)で提供されている発電施設データを使用し、MapLibre GL JS + React を用いて Web 上に原子力発電所の所在と稼働状況を表示したビューアです。

## 機能

- [国土数値情報の行政区域データ](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2025.html)を背景に使用
- 原子力発電所データに再稼働及び審査状況を示すステータス属性を追加して、色分けして表示
- 原子力発電所をクリックすると詳細情報をポップアップ表示
- 電力量から全体発電量からの比率を表示

## デモ
[GitHub Pagesで公開中](https://hirofumikanda.github.io/power-plant-map/)

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

