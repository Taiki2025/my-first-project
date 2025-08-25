// データローダー - JSONファイルからデータを読み込む
class DataLoader {
    constructor() {
        this.cache = {};
        this.loadedFiles = new Set();
    }

    // JSONファイルを読み込む
    async loadData(filePath) {
        if (this.cache[filePath]) {
            return this.cache[filePath];
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.cache[filePath] = data;
            this.loadedFiles.add(filePath);
            console.log(`データを読み込みました: ${filePath}`);
            return data;
        } catch (error) {
            console.error(`データの読み込みに失敗しました: ${filePath}`, error);
            throw error;
        }
    }

    // チャット応答データを取得
    async getChatResponses() {
        return await this.loadData('data/chat-responses.json');
    }

    // ゲームデータを取得
    async getGameData() {
        return await this.loadData('data/game-data.json');
    }

    // 月間データを取得
    async getMonthlyData() {
        return await this.loadData('data/monthly-data.json');
    }

    // 通知データを取得
    async getNotifications() {
        return await this.loadData('data/notifications.json');
    }

    // 複数のデータファイルを同時に読み込む
    async loadAllData() {
        try {
            const [chatResponses, gameData, monthlyData, notifications] = await Promise.all([
                this.getChatResponses(),
                this.getGameData(),
                this.getMonthlyData(),
                this.getNotifications()
            ]);

            return {
                chatResponses,
                gameData,
                monthlyData,
                notifications
            };
        } catch (error) {
            console.error('データの一括読み込みに失敗しました:', error);
            throw error;
        }
    }

    // キャッシュをクリア
    clearCache() {
        this.cache = {};
        this.loadedFiles.clear();
    }

    // 読み込み済みファイルの一覧を取得
    getLoadedFiles() {
        return Array.from(this.loadedFiles);
    }
}

// グローバルインスタンスを作成
window.dataLoader = new DataLoader();

// データの初期化（ページ読み込み時に実行）
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // データを読み込む
        const allData = await window.dataLoader.loadAllData();
        
        // グローバル変数として設定
        window.appData = allData;
        
        console.log('すべてのデータの読み込みが完了しました');
        
        // データ読み込み完了後に初期化処理を実行
        if (typeof initializeApp === 'function') {
            initializeApp();
        }
    } catch (error) {
        console.error('アプリケーションの初期化に失敗しました:', error);
    }
});
