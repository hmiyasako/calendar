# 新機能追加パターン

## イベント関連機能の追加手順

1. **型定義** (`client/src/types.ts`)
   - 新しいインターフェースやプロパティを追加

2. **API関数** (`client/src/api.ts`)
   - eventsApiオブジェクトに新しいメソッド追加

3. **カスタムフック** (`client/src/hooks/useEvents.ts`)
   - 新しい操作をフックに追加

4. **コンポーネント** (`client/src/components/`)
   - 新しいコンポーネント作成またはコンポーネント更新

5. **バックエンドAPI** (`server/src/routes/events.ts`)
   - 新しいエンドポイント追加

6. **データベース** (`server/src/db.ts`)
   - 必要に応じてスキーマ・クエリ追加

## 例: 繰り返しイベント機能

```typescript
// 1. types.ts
interface CalendarEvent {
  // 既存フィールド...
  recurrence?: 'daily' | 'weekly' | 'monthly';
}

// 2. api.ts - 既存のcreate/updateで対応

// 3. useEvents.ts - 繰り返し展開ロジック追加

// 4. EventModal.tsx - 繰り返し選択UI追加

// 5. routes/events.ts - 繰り返し保存対応

// 6. db.ts - recurrenceカラム追加
```
