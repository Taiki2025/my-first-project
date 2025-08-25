# My九電アプリ

九州電力の顧客向けWebアプリケーションです。

## 機能

- 電気使用量の確認
- 料金プランの管理
- 省エネチャレンジ
- 省エネゲーム
- チャットサポート（選択肢ボタン対応）

## チャットボット機能

### 新機能：選択肢ボタン対応
- **初期選択肢**: チャット開始時に6つの主要カテゴリから選択可能
- **分岐選択肢**: 各トピック内で具体的な選択肢をボタンで表示
- **自由入力対応**: 選択肢ボタンと同時に自由なテキスト入力も可能
- **視覚的改善**: アイコン付きの選択肢ボタンで直感的な操作

### 対応トピック
1. **電力契約**: 新規契約、契約変更、解約手続き、契約内容確認
2. **料金プラン**: プラン変更相談、詳細説明、おすすめ提案、プラン比較、ライフスタイル診断
3. **ご利用料金**: 今月の料金確認、過去履歴、料金理由、支払い方法変更、計算方法
4. **停電情報**: 現在の停電状況確認
5. **ライフスタイル診断**: 家族人数、オール電化、使用時間帯に基づくプラン提案
6. **その他**: その他のお問い合わせ対応

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
チャットボットの応答パターンと選択肢を管理します。選択肢ボタンと自由入力の両方に対応しています。

```json
{
  "normalChatResponses": {
    "0": {
      "message": "お客様のお名前を教えてください。",
      "nextStep": 1,
      "choices": null
    },
    "4": {
      "message": "この内容で申込みを完了しますか？",
      "nextStep": 5,
      "choices": [
        {"text": "はい、申込みを完了する", "value": "yes"},
        {"text": "いいえ、内容を修正する", "value": "no"}
      ]
    }
  },
  "lifestyleChatResponses": {
    "0": {
      "message": "こんにちは！ライフスタイルに合わせた料金プランをご提案します。",
      "nextStep": 1,
      "choices": [
        {"text": "1人", "value": "1"},
        {"text": "2人", "value": "2"},
        {"text": "3人", "value": "3"},
        {"text": "4人", "value": "4"},
        {"text": "5人以上", "value": "5"}
      ]
    }
  },
  "supportResponses": {
    "contract": {
      "0": {
        "message": "電力契約についてご案内いたします。",
        "nextStep": 1,
        "choices": [
          {"text": "新規契約", "value": "新規契約"},
          {"text": "契約変更", "value": "契約変更"},
          {"text": "解約手続き", "value": "解約手続き"},
          {"text": "契約内容の確認", "value": "確認"}
        ]
      }
    }
  },
  "generalResponses": {
    "outage": "停電情報についてお答えいたします。",
    "default": "申し訳ございません。もう一度詳しく教えてください。",
    "end": "他にご質問はございますか？"
  },
  "initialChoices": [
    {"text": "電力契約について", "value": "contract", "icon": "fas fa-file-contract"},
    {"text": "料金プランについて", "value": "plan", "icon": "fas fa-credit-card"},
    {"text": "ご利用料金について", "value": "billing", "icon": "fas fa-yen-sign"},
    {"text": "停電情報の確認", "value": "outage", "icon": "fas fa-exclamation-triangle"},
    {"text": "ライフスタイル診断", "value": "lifestyle", "icon": "fas fa-user-check"},
    {"text": "その他のお問い合わせ", "value": "other", "icon": "fas fa-question-circle"}
  ]
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

