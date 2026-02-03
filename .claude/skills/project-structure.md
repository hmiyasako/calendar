# カレンダーアプリ プロジェクト構造

## ディレクトリ構成

```
/calendar
├── client/                 # フロントエンド (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # UIコンポーネント
│   │   ├── hooks/          # カスタムフック
│   │   ├── styles/         # グローバルスタイル・テーマ
│   │   ├── api.ts          # APIクライアント
│   │   └── types.ts        # 型定義
│   └── vite.config.ts      # Vite設定（プロキシ含む）
├── server/                 # バックエンド (Express + SQLite)
│   └── src/
│       ├── db.ts           # データベース設定
│       ├── routes/         # APIルート
│       └── index.ts        # サーバーエントリー
└── package.json            # ルートスクリプト
```

## 開発コマンド

```bash
npm run install:all   # 全依存関係インストール
npm run dev           # フロント+バック同時起動
npm run dev:client    # フロントのみ (port 5173)
npm run dev:server    # バックのみ (port 3001)
```
