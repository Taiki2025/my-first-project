// チャットボットの状態管理
let chatState = {
    step: 0,
    userInfo: {},
    selectedPlan: null,
    isLifestyleChat: false, // ライフスタイル診断チャットかどうかを判定するフラグ
    lifestyleAnswers: {}
};

// 通常の申込みフローの応答パターン
const normalChatResponses = {
    0: { message: "お客様のお名前を教えてください。", nextStep: 1 },
    1: { message: "ありがとうございます。次に、お客様の電話番号を教えてください。", nextStep: 2 },
    2: { message: "承知いたしました。お客様の住所を教えてください。", nextStep: 3 },
    3: { message: "ありがとうございます！<br><br>最後に、契約開始希望日を教えてください。（例：2025年8月5日）", nextStep: 4 },
    4: { message: "ありがとうございます！<br><br>お客様の申込み内容を確認させていただきます：<br><br>お名前：{name}<br>電話番号：{phone}<br>住所：{address}<br>選択プラン：{plan}<br>契約開始日：{startDate}<br><br>この内容で申込みを完了しますか？（はい／いいえ）", nextStep: 5 },
    5: { message: "申込みありがとうございます！<br><br>お客様の申込みを受け付けました。後日、担当者よりご連絡いたします。", nextStep: -1 }
};

// ライフスタイル診断フローの応答パターン
const lifestyleChatResponses = {
    0: { message: "こんにちは！ライフスタイルに合わせた料金プランをご提案します。<br><br>まず、ご家族の人数を教えていただけますか？（例：3人）", nextStep: 1 },
    1: { message: "ありがとうございます。お住まいはオール電化住宅ですか？（はい／いいえ）", nextStep: 2 },
    2: { message: "承知いたしました。主に電気をお使いになる時間帯は昼間と夜間のどちらが多いですか？（昼間／夜間）", nextStep: 3 },
    3: { 
        message: "診断ありがとうございます！<br><br>お客様のライフスタイルから、最適なプランとして「<b>{plan}</b>」をご提案します。<br><br><div class='recommendation-reason'><b>【ご提案理由】</b><br>{reason}</div><div class='plan-details'><b>【プランの特徴】</b><br>{description}</div><br>こちらのプランで申込み手続きを進めますか？（はい／いいえ）", 
        nextStep: 4 
    },
    4: { message: "承知いたしました。それでは、申込み手続きを開始します。<br><br>" + normalChatResponses[0].message, nextStep: 'switchToNormal_0' }
};

// タブ切り替え機能（既に使われていない可能性があるため、スコープを限定）
function switchTab(tabName) {
    // ダッシュボードタブのみに限定（実績カードのタブには影響しない）
    document.querySelectorAll('.dashboard-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.chart-container').forEach(container => container.classList.remove('active'));
    const targetBtn = document.querySelector(`.dashboard-tabs [onclick="switchTab('${tabName}')"]`);
    if (targetBtn) targetBtn.classList.add('active');
    const targetChart = document.getElementById(`${tabName}-chart`);
    if (targetChart) targetChart.classList.add('active');
    animateChartBars(tabName);
}

// チャートバーのアニメーション
function animateChartBars(tabName) {
    // 実装は省略
}

// チャットボットを開く
function openChat(isLifestyle = false) {
    const modal = document.getElementById('chatModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // チャット状態をリセット
    chatState = {
        step: 0,
        userInfo: {},
        selectedPlan: null,
        isLifestyleChat: isLifestyle,
        lifestyleAnswers: {}
    };

    // チャット履歴をクリア
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    let initialMessage = '';
    if (isLifestyle) {
        initialMessage = lifestyleChatResponses[0].message;
    } else {
        initialMessage = "こんにちは！My九電のAIアシスタントです。<br>電力契約のお手続きをサポートいたします。";
        if (chatState.selectedPlan) {
            initialMessage += `<br><br>「<b>${chatState.selectedPlan}</b>」プランのお申込みですね。`;
        }
        initialMessage += `<br><br>${normalChatResponses[0].message}`;
    }
    
    addBotMessage(initialMessage);

    setTimeout(() => document.getElementById('chatInput').focus(), 300);
}

// チャットボットを閉じる
function closeChat() {
    const modal = document.getElementById('chatModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// 通常のチャットボットを開始
function startChat() {
    openChat(false);
}

// ライフスタイル診断チャットを開始
function startLifestyleChat() {
    openChat(true);
}

// プラン選択ボタンからチャットを開始
function selectPlan(planName) {
    openChat(false);
    chatState.selectedPlan = planName;
    
    // メッセージを少し調整して、選択されたプラン名を反映
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = ''; // 初期メッセージをクリア
    let initialMessage = `こんにちは！My九電のAIアシスタントです。<br>「<b>${planName}</b>」プランのお申込みですね。<br><br>${normalChatResponses[0].message}`;
    addBotMessage(initialMessage);
}

// メッセージ送信のハンドラ
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (message === '') return;

    addUserMessage(message);
    input.value = '';
    processUserInput(message);
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// UIにメッセージを追加する関数群
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `<div class="message-avatar"><i class="fas fa-user"></i></div><div class="message-content">${message}</div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `<div class="message-avatar"><i class="fas fa-robot"></i></div><div class="message-content">${message}</div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ユーザー入力を処理するメインロジック
function processUserInput(input) {
    setTimeout(() => {
        if (chatState.isLifestyleChat) {
            processLifestyleChat(input);
        } else {
            processNormalChat(input);
        }
    }, 1000);
}

// 通常の申込みフローを処理
function processNormalChat(input) {
    const currentStep = chatState.step;
    const response = normalChatResponses[currentStep];

    switch (currentStep) {
        case 0:
            chatState.userInfo.name = input;
            break;
        case 1:
            chatState.userInfo.phone = input;
            break;
        case 2:
            chatState.userInfo.address = input;
            break;
        case 3:
            chatState.userInfo.startDate = input;
            break;
        case 4:
            if (input.toLowerCase().includes('はい')) {
                addBotMessage(response.message);
                chatState.step = -1; // 会話終了
                return;
            } else {
                addBotMessage("承知いたしました。申込みを最初からやり直します。");
                openChat(false); // 通常チャットをリスタート
                return;
            }
    }

    chatState.step = response.nextStep;
    let nextMessage = normalChatResponses[chatState.step]?.message || '';

    if (chatState.step === 4) { // 確認ステップ
        nextMessage = nextMessage.replace('{name}', chatState.userInfo.name)
                                 .replace('{phone}', chatState.userInfo.phone)
                                 .replace('{address}', chatState.userInfo.address)
                                 .replace('{plan}', chatState.selectedPlan)
                                 .replace('{startDate}', chatState.userInfo.startDate);
    }
    
    if (nextMessage) {
        addBotMessage(nextMessage);
    }
}

// ライフスタイル診断フローを処理
function processLifestyleChat(input) {
    const currentStep = chatState.step;
    const response = lifestyleChatResponses[currentStep];

    switch (currentStep) {
        case 0:
            chatState.lifestyleAnswers.familySize = input;
            break;
        case 1:
            chatState.lifestyleAnswers.allElectric = input.toLowerCase();
            break;
        case 2:
            chatState.lifestyleAnswers.usageTime = input.toLowerCase();
            const recommendedPlan = recommendPlan(chatState.lifestyleAnswers);
            chatState.selectedPlan = recommendedPlan.name;
            
            const message = response.message.replace(/{plan}/g, recommendedPlan.name)
                                           .replace('{description}', recommendedPlan.description);
            addBotMessage(message);
            chatState.step = response.nextStep;
            return;
        case 3:
            if (input.toLowerCase().includes('はい')) {
                chatState.isLifestyleChat = false; // 通常フローに切り替え
                chatState.step = 0;
                addBotMessage(lifestyleChatResponses[4].message);
            } else {
                addBotMessage("承知いたしました。ご不明な点がございましたら、いつでもお声がけください。");
                closeChat();
            }
            return;
    }
    
    chatState.step = response.nextStep;
    if (lifestyleChatResponses[chatState.step]) {
        addBotMessage(lifestyleChatResponses[chatState.step].message);
    }
}

// ライフスタイル情報に基づいてプランを推薦
function recommendPlan(answers) {
    const familySize = parseInt(answers.familySize) || 1;
    const isAllElectric = answers.allElectric.includes('はい');
    const usageTime = answers.usageTime;

    if (isAllElectric) {
        return {
            name: '電化でナイト・セレクト',
            reason: `お客様は<b>オール電化住宅</b>にお住まいとのことですので、夜間電力がお得になるこちらのプランが最適です。`,
            description: '夜間の電気料金が昼間に比べて割安になり、給湯や暖房にかかる電気代を効率的に節約できます。さらに、特定の時間帯に電気の使用をシフトすることで、より大きなメリットを享受できます。'
        };
    }
    
    if (familySize >= 3) {
        return {
            name: 'スマートファミリープラン',
            reason: `<b>3人以上</b>のご家族で、特に<b>夜間</b>に電気を多く使われるご家庭に最適なプランです。2年契約でさらにお得になります。`,
            description: 'ご家族の生活サイクルに合わせやすい料金設定です。夜間のご使用量が多いほど、電気代の節約につながります。週末や休日の電気料金も考慮されています。'
        };
    }

    return {
        name: '従量電灯B',
        reason: `電気のご使用量が比較的少なく、<b>昼間</b>の活動が多いお客様に適した、シンプルで分かりやすいプランです。`,
        description: 'ご使用量に応じて料金が決まる、最も基本的なプランです。契約期間は1年で、ライフスタイルの変化に合わせて見直しやすいのが特徴です。'
    };
}

// 実績カードのタブ機能
function switchUsageTab(tabName) {
    // タブボタンのアクティブ状態を更新
    const tabBtns = document.querySelectorAll('.usage-card .tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });

    // タブコンテンツの表示を切り替え
    const tabContents = document.querySelectorAll('.usage-card .tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        }
    });
}

// 月間実績のスワイプ機能
function showMonth(monthIndex) {
    const monthlyData = document.querySelectorAll('.monthly-data');
    monthlyData.forEach((data, i) => {
        data.classList.remove('active');
        if (i === monthIndex) {
            data.classList.add('active');
        }
    });
}

// DOM読み込み完了時の初期化処理
document.addEventListener('DOMContentLoaded', function() {
    // 実績カードのタブ機能の初期化
    switchUsageTab('yearly');

    // 実績カードのタブ切り替えイベント
    const usageTabBtns = document.querySelectorAll('.usage-card .tab-btn');
    usageTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchUsageTab(targetTab);
        });
    });



    // 月間実績のナビゲーション
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');

    let currentMonthIndex = 0;

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            if (currentMonthIndex > 0) {
                currentMonthIndex--;
                showMonth(currentMonthIndex);
            }
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            const monthlyData = document.querySelectorAll('.monthly-data');
            if (currentMonthIndex < monthlyData.length - 1) {
                currentMonthIndex++;
                showMonth(currentMonthIndex);
            }
        });
    }

    // 年間実績のナビゲーション
    const prevYearBtn = document.querySelector('.prev-year');
    const nextYearBtn = document.querySelector('.next-year');
    const yearlyPeriodLabel = document.querySelector('.yearly-period-label');

    let currentYear = 2025;

    function updateYearDisplay() {
        if (yearlyPeriodLabel) {
            yearlyPeriodLabel.textContent = `${currentYear}年8月～${currentYear + 1}年7月`;
        }
        // 実際のデータ切り替え処理はここに追加可能
        console.log(`${currentYear}年のデータを表示`);
    }

    if (prevYearBtn) {
        prevYearBtn.addEventListener('click', function() {
            currentYear--;
            updateYearDisplay();
        });
    }

    if (nextYearBtn) {
        nextYearBtn.addEventListener('click', function() {
            currentYear++;
            updateYearDisplay();
        });
    }
});