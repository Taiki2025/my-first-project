# My九電アプリ

九州電力の顧客向けWebアプリケーションです。

## 機能

- 電気使用量の確認
- 料金プランの管理
- 省エネチャレンジ
- 省エネゲーム
- チャットサポート

## ファイル構造

```
my-first-project/
├── index.html              # メインダッシュボード
├── eco-points.html         # ecoアプリポイント確認ページ
├── eco-game.html           # 省エネゲームページ
├── script.js               # メインJavaScript
├── styles.css              # スタイルシート
├── js/
│   └── data-loader.js      # データローダー
├── data/
│   ├── chat-responses.json # チャット応答データ
│   ├── game-data.json      # ゲームデータ
│   ├── monthly-data.json   # 月間データ
│   └── notifications.json  # 通知データ
└── README.md
```

## JSONデータファイル

### data/chat-responses.json
チャットボットの応答パターンを管理します。

```json
{
  "normalChatResponses": {
    "0": {
      "message": "お客様のお名前を教えてください。",
      "nextStep": 1
    }
  },
  "lifestyleChatResponses": {
    "0": {
      "message": "こんにちは！ライフスタイルに合わせた料金プランをご提案します。",
      "nextStep": 1
    }
  },
  "supportResponses": {
    "contract": {
      "0": {
        "message": "電力契約についてご案内いたします。",
        "nextStep": 1
      }
    }
  },
  "generalResponses": {
    "outage": "停電情報についてお答えいたします。",
    "default": "申し訳ございません。もう一度詳しく教えてください。",
    "end": "他にご質問はございますか？"
  }
}
```

### data/game-data.json
ゲームのクイズデータと設定を管理します。

```json
{
  "quizData": [
    {
      "question": "エアコンの設定温度を1度上げると、年間で約何円の節約になりますか？",
      "options": ["約500円", "約1,000円", "約2,000円", "約3,000円"],
      "correct": 1,
      "explanation": "エアコンの設定温度を1度上げると、年間で約1,000円の電気代を節約できます。"
    }
  ],
  "gameSettings": {
    "quiz": {
      "timeLimit": 30,
      "pointsPerCorrect": 10,
      "totalQuestions": 5
    }
  },
  "resultMessages": {
    "excellent": {
      "title": "素晴らしい！",
      "threshold": 80
    }
  }
}
```

### data/monthly-data.json
月間の使用量データを管理します。

```json
{
  "monthsData": [
    {
      "title": "2025年8月分",
      "period": "7月25日～8月26日",
      "usage": 450,
      "cost": 12500,
      "comparison": 12
    }
  ],
  "currentYear": 2025,
  "yearlyPeriod": "2025年8月～2026年7月"
}
```

### data/notifications.json
通知データと詳細情報を管理します。

```json
{
  "notifications": [
    {
      "id": "eco",
      "icon": "fas fa-leaf",
      "title": "省エネチャレンジ成功！",
      "description": "今月の目標を達成しました",
      "type": "success"
    }
  ],
  "notificationDetails": {
    "eco": {
      "title": "省エネチャレンジの詳細",
      "content": "【省エネチャレンジとは】\n・月間の電気使用量を前年同月比で削減"
    }
  }
}
```

## データローダー

`js/data-loader.js`は、JSONファイルを非同期で読み込み、キャッシュする機能を提供します。

```javascript
// データを読み込む
const allData = await window.dataLoader.loadAllData();

// 特定のデータを取得
const chatResponses = await window.dataLoader.getChatResponses();
const gameData = await window.dataLoader.getGameData();
```

## 使用方法

1. Webブラウザで`index.html`を開く
2. 各機能を利用する
3. データの更新は対応するJSONファイルを編集

## 今後の拡張

- 新しいゲームタイプの追加
- 多言語対応
- データベース連携
- API連携

