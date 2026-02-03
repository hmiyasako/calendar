# テーマシステム

## 構成ファイル

- `client/src/styles/themes.css` - CSS変数によるテーマ定義
- `client/src/hooks/useTheme.ts` - テーマ切り替えフック
- `client/src/components/ThemeSelector.tsx` - テーマ選択UI

## 新しいテーマの追加手順

### 1. themes.css にテーマ定義を追加

```css
[data-theme="sunset"] {
  --bg-primary: #fff5eb;
  --bg-secondary: #ffe4cc;
  --text-primary: #5c3d2e;
  --text-secondary: #8b6b5a;
  --text-muted: #a08070;
  --border-color: #dcc4b0;
  --accent-color: #e07020;
  --danger-color: #c44040;
  --shadow: 0 2px 8px rgba(92, 61, 46, 0.15);
  --calendar-today: rgba(224, 112, 32, 0.15);
  --calendar-weekend: rgba(224, 112, 32, 0.05);
}
```

### 2. types.ts のTheme型に追加

```typescript
export type Theme = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset';
```

### 3. ThemeSelector.tsx にオプション追加

```typescript
const themes: { value: Theme; label: string }[] = [
  // 既存テーマ...
  { value: 'sunset', label: 'Sunset' },
];
```

## テーマのCSS変数一覧

| 変数名 | 用途 |
|--------|------|
| --bg-primary | メイン背景色 |
| --bg-secondary | セカンダリ背景色 |
| --text-primary | メインテキスト色 |
| --text-secondary | サブテキスト色 |
| --text-muted | 薄いテキスト色 |
| --border-color | ボーダー色 |
| --accent-color | アクセント色（ボタンなど） |
| --danger-color | 危険色（削除ボタンなど） |
| --shadow | ボックスシャドウ |
| --calendar-today | 今日の背景色 |
| --calendar-weekend | 週末の背景色 |
