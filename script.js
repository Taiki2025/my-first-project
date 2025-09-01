// サポートチャットの状態管理
let supportChatState = {
    currentTopic: null,
    userInfo: {},
    step: 0
};

// ライフスタイル診断の状態管理
let lifestyleChatState = {
    step: 0,
    lifestyleAnswers: {}
};

// チャット応答データ（JSONファイルから読み込み）
let normalChatResponses = {};
let lifestyleChatResponses = {};
let supportResponses = {};
let generalResponses = {};

// 年間実績の年次管理
let yearlyData = {
    currentYear: 2025,
    startYear: 2020,
    endYear: 2030
};

// 月間実績の月次管理
let monthlyData = {
    currentMonth: 8,
    currentYear: 2025,
    startMonth: 1,
    endMonth: 12
};

// コンビニ支払いの状態管理
let conveniencePaymentState = {
    isOpen: false,
    selectedConvenience: null
};

// データを初期化する関数
function initializeChatData() {
    if (window.appData && window.appData.chatResponses) {
        normalChatResponses = window.appData.chatResponses.normalChatResponses;
        lifestyleChatResponses = window.appData.chatResponses.lifestyleChatResponses;
        supportResponses = window.appData.chatResponses.supportResponses;
        generalResponses = window.appData.chatResponses.generalResponses;
    }
}

// 実績タブ切り替え機能
function switchTab(tabName) {
    // 実績カードのタブ切り替え
    const tabButtons = document.querySelectorAll('.tab-navigation .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // すべてのタブボタンからactiveクラスを削除
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // すべてのタブコンテンツからactiveクラスを削除
    tabContents.forEach(content => content.classList.remove('active'));
    
    // 選択されたタブボタンにactiveクラスを追加
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    // 選択されたタブコンテンツにactiveクラスを追加
    const targetContent = document.getElementById(`${tabName}-tab`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// 前年に移動
function goToPreviousYear() {
    if (yearlyData.currentYear > yearlyData.startYear) {
        yearlyData.currentYear--;
        updateYearlyPeriodLabel();
        updateYearlyChartDataWithRandomValues(); // 年次変更時はランダム値を生成
    }
}

// 翌年に移動
function goToNextYear() {
    if (yearlyData.currentYear < yearlyData.endYear) {
        yearlyData.currentYear++;
        updateYearlyPeriodLabel();
        updateYearlyChartDataWithRandomValues(); // 年次変更時はランダム値を生成
    }
}

// 年次変更時のランダムデータ生成
function updateYearlyChartDataWithRandomValues() {
    const bars = document.querySelectorAll('.yearly-chart-container .bar');
    const maxValue = 50; // 縦軸の最大値（kWh）を50kWhに変更
    
    bars.forEach(bar => {
        const randomValue = Math.floor(Math.random() * 30) + 5; // 5-35の範囲
        const height = (randomValue / maxValue) * 100; // 50kWhを100%として計算
        bar.style.height = `${height}%`;
        bar.setAttribute('data-value', randomValue);
        
        // データ値を表示するラベルを更新（もし存在する場合）
        const valueLabel = bar.querySelector('.bar-value');
        if (valueLabel) {
            valueLabel.textContent = `${randomValue}kWh`;
        }
    });
    
    // 前年・翌年ボタンの有効/無効状態を更新
    updateNavigationButtons();
}

// 年間期間ラベルを更新
function updateYearlyPeriodLabel() {
    const label = document.querySelector('.yearly-period-label');
    if (label) {
        const nextYear = yearlyData.currentYear + 1;
        label.textContent = `${yearlyData.currentYear}年8月～${nextYear}年7月`;
    }
}

// グラフの初期化とデータの整合性を確保
function initializeChartData() {
    const maxValue = 50; // 縦軸の最大値（kWh）を50kWhに変更
    const bars = document.querySelectorAll('.yearly-chart-container .bar');
    
    bars.forEach(bar => {
        const dataValue = parseInt(bar.getAttribute('data-value')) || 0;
        const height = (dataValue / maxValue) * 100; // 50kWhを100%として計算
        bar.style.height = `${height}%`;
    });
    
    // 月間チャートの初期化
    const monthlyBars = document.querySelectorAll('.monthly-data.active .bar');
    const maxMonthlyValue = 20; // 月間チャートの最大値（kWh）
    
    monthlyBars.forEach(bar => {
        const dataValue = parseFloat(bar.getAttribute('data-value')) || 0;
        const height = (dataValue / maxMonthlyValue) * 100; // 20kWhを100%として計算
        bar.style.height = `${height}%`;
    });
}

// 年間チャートデータを更新
function updateYearlyChartData() {
    // 実際のアプリケーションでは、ここでAPIからデータを取得してチャートを更新します
    // 今回はデモ用にランダムなデータを生成
    const bars = document.querySelectorAll('.yearly-chart-container .bar');
    const maxValue = 50; // 縦軸の最大値（kWh）を50kWhに変更
    
    bars.forEach(bar => {
        // HTMLの固定値を尊重し、data-valueに基づいて高さを計算
        const dataValue = parseInt(bar.getAttribute('data-value')) || 0;
        const height = (dataValue / maxValue) * 100; // 50kWhを100%として計算
        bar.style.height = `${height}%`;
        
        // データ値を表示するラベルを更新（もし存在する場合）
        const valueLabel = bar.querySelector('.bar-value');
        if (valueLabel) {
            valueLabel.textContent = `${dataValue}kWh`;
        }
    });
    
    // 前年・翌年ボタンの有効/無効状態を更新
    updateNavigationButtons();
}

// ナビゲーションボタンの状態を更新
function updateNavigationButtons() {
    const prevBtn = document.querySelector('.nav-btn.prev-year');
    const nextBtn = document.querySelector('.nav-btn.next-year');
    
    if (prevBtn) {
        prevBtn.disabled = yearlyData.currentYear <= yearlyData.startYear;
        prevBtn.style.opacity = yearlyData.currentYear <= yearlyData.startYear ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = yearlyData.currentYear >= yearlyData.endYear;
        nextBtn.style.opacity = yearlyData.currentYear >= yearlyData.endYear ? '0.5' : '1';
    }
}

// 前月に移動
function goToPreviousMonth() {
    if (monthlyData.currentMonth > monthlyData.startMonth) {
        monthlyData.currentMonth--;
    } else {
        monthlyData.currentMonth = monthlyData.endMonth;
        monthlyData.currentYear--;
    }
    updateMonthlyPeriodLabel();
    updateMonthlyChartData();
}

// 翌月に移動
function goToNextMonth() {
    if (monthlyData.currentMonth < monthlyData.endMonth) {
        monthlyData.currentMonth++;
    } else {
        monthlyData.currentMonth = monthlyData.startMonth;
        monthlyData.currentYear++;
    }
    updateMonthlyPeriodLabel();
    updateMonthlyChartData();
}

// 月間期間ラベルを更新
function updateMonthlyPeriodLabel() {
    const monthTitle = document.querySelector('.month-title');
    const monthPeriod = document.querySelector('.month-period');
    
    if (monthTitle) {
        monthTitle.textContent = `${monthlyData.currentYear}年${monthlyData.currentMonth}月分`;
    }
    
    if (monthPeriod) {
        // 簡易的な期間表示（実際のアプリケーションでは正確な期間を計算）
        const prevMonth = monthlyData.currentMonth === 1 ? 12 : monthlyData.currentMonth - 1;
        const prevYear = monthlyData.currentMonth === 1 ? monthlyData.currentYear - 1 : monthlyData.currentYear;
        monthPeriod.textContent = `${prevYear}年${prevMonth}月25日～${monthlyData.currentYear}年${monthlyData.currentMonth}月26日`;
    }
}

// 月間チャートデータを更新
function updateMonthlyChartData() {
    // 実際のアプリケーションでは、ここでAPIからデータを取得してチャートを更新します
    // 今回はデモ用にランダムなデータを生成
    const monthlyDataElements = document.querySelectorAll('.monthly-data');
    monthlyDataElements.forEach(element => {
        const month = parseInt(element.getAttribute('data-month'));
        if (month === monthlyData.currentMonth) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
    
    // 月間チャートの棒グラフの高さを調整
    const monthlyBars = document.querySelectorAll('.monthly-data.active .bar');
    const maxMonthlyValue = 20; // 月間チャートの最大値（kWh）
    
    monthlyBars.forEach(bar => {
        const dataValue = parseFloat(bar.getAttribute('data-value')) || 0;
        const height = (dataValue / maxMonthlyValue) * 100; // 20kWhを100%として計算
        bar.style.height = `${height}%`;
    });
    
    // 前月・翌月ボタンの有効/無効状態を更新
    updateMonthlyNavigationButtons();
}

// 月間ナビゲーションボタンの状態を更新
function updateMonthlyNavigationButtons() {
    const prevBtn = document.querySelector('.nav-btn.prev-month');
    const nextBtn = document.querySelector('.nav-btn.next-month');
    
    if (prevBtn) {
        const isFirstMonth = monthlyData.currentMonth === monthlyData.startMonth && monthlyData.currentYear === 2020;
        prevBtn.disabled = isFirstMonth;
        prevBtn.style.opacity = isFirstMonth ? '0.5' : '1';
    }
    
    if (nextBtn) {
        const isLastMonth = monthlyData.currentMonth === monthlyData.endMonth && monthlyData.currentYear === 2030;
        nextBtn.disabled = isLastMonth;
        nextBtn.style.opacity = isLastMonth ? '0.5' : '1';
    }
}

// チャートバーのアニメーション
function animateChartBars(tabName) {
    const chart = document.getElementById(`${tabName}-chart`);
    if (!chart) return;
    
    const bars = chart.querySelectorAll('.chart-bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.height = bar.getAttribute('data-height');
        }, index * 100);
    });
}

// サポートチャットを開く
function openChat() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // サポートチャットの状態を初期化
        supportChatState = {
            currentTopic: null,
            userInfo: {},
            step: 0
        };
        
        // ライフスタイル診断の状態をリセット
        lifestyleChatState = {
            step: -1,
            lifestyleAnswers: {}
        };
        
        const chatMessages = document.getElementById('chatMessages');
        const initialMessage = `こんにちは！My九電お客様サポートです。<br>
                               どのようなご用件でしょうか？<br><br>
                               下のボタンからお選びいただくか、<br>
                               直接ご用件をお聞かせください。`;
        
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-headset"></i>
                </div>
                <div class="message-content">${initialMessage}</div>
            </div>
        `;
        
        showInitialChoices();
    }
}

// おすすめ料金プランチャットを開く
function openPlanChat() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // ライフスタイル診断の状態を初期化
        lifestyleChatState = {
            step: 0,
            lifestyleAnswers: {}
        };
        
        const chatMessages = document.getElementById('chatMessages');
        const initialMessage = `こんにちは！おすすめ料金プラン診断です。<br>
                               お客様のライフスタイルに合わせた最適なプランをご提案いたします。<br><br>
                               まず、ご家族の人数を教えてください。`;
        
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-user-check"></i>
                </div>
                <div class="message-content">${initialMessage}</div>
            </div>
        `;
        
        setTimeout(() => {
            const choices = [
                {"text": "1人", "value": "1"},
                {"text": "2人", "value": "2"},
                {"text": "3人", "value": "3"},
                {"text": "4人", "value": "4"},
                {"text": "5人以上", "value": "5"}
            ];
            showChoiceButtons(choices);
        }, 1000);
    }
}

// チャットボットを閉じる
function closeChat() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// メッセージ送信
function sendMessage() {
    const input = document.getElementById('chatInput');
    if (input && input.value.trim()) {
        addUserMessage(input.value);
        processUserInput(input.value);
        input.value = '';
    }
}

// Enter キーでメッセージ送信
function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// ユーザーメッセージを追加
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// ボットメッセージを追加
function addBotMessage(message, choices = null) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-headset"></i>
        </div>
        <div class="message-content">${message}</div>
    `;
    chatMessages.appendChild(messageDiv);
    
    if (choices && choices.length > 0) {
        showChoiceButtons(choices);
    }
    
    scrollToBottom();
}

// 選択肢ボタンを表示
function showChoiceButtons(choices) {
    const chatMessages = document.getElementById('chatMessages');
    const choicesDiv = document.createElement('div');
    choicesDiv.className = 'message bot-message choices-container';
    choicesDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-headset"></i>
        </div>
        <div class="message-content">
            <div class="choice-buttons">
                ${choices.map(choice => `
                    <button class="choice-btn" onclick="selectChoice('${choice.value}')">
                        ${choice.icon ? `<i class="${choice.icon}"></i>` : ''}
                        ${choice.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    chatMessages.appendChild(choicesDiv);
    scrollToBottom();
}

// 初期選択肢を表示
function showInitialChoices() {
    const initialChoices = [
        {"text": "電力契約について", "value": "contract", "icon": "fas fa-file-contract"},
        {"text": "料金プランについて", "value": "plan", "icon": "fas fa-credit-card"},
        {"text": "ご利用料金について", "value": "billing", "icon": "fas fa-yen-sign"},
        {"text": "停電情報の確認", "value": "outage", "icon": "fas fa-exclamation-triangle"},
        {"text": "その他のお問い合わせ", "value": "other", "icon": "fas fa-question-circle"}
    ];
    showChoiceButtons(initialChoices);
}

// 選択肢を選択
function selectChoice(value) {
    const choiceBtns = document.querySelectorAll('.choice-btn');
    choiceBtns.forEach(btn => btn.disabled = true);
    
    const selectedBtn = event.target.closest('.choice-btn');
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
    const choiceText = selectedBtn ? selectedBtn.textContent.trim() : value;
    addUserMessage(choiceText);
    
    const choicesContainer = document.querySelector('.choices-container');
    if (choicesContainer) {
        choicesContainer.remove();
    }
    
    processUserInput(value);
}

// チャットエリアを最下部にスクロール
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ユーザー入力を処理
function processUserInput(input) {
    setTimeout(() => {
        // サポートチャットの処理を優先
        processSupportChat(input);
    }, 1000);
}

// サポートチャット処理
function processSupportChat(input) {
    const inputLower = input.toLowerCase();
    
    // ライフスタイル診断の処理（おすすめプラン診断からの場合のみ）
    if (lifestyleChatState && lifestyleChatState.step >= 0 && supportChatState.currentTopic !== 'outage') {
        processLifestyleChat(input);
        return;
    }
    
    // 申込み処理の確認
    if (supportChatState.currentTopic === 'application') {
        processApplicationChat(input);
        return;
    }
    
    // 初期選択肢からの処理
    if (input === 'contract' || input === 'plan' || input === 'billing' || input === 'outage' || input === 'other') {
        handleInitialChoice(input);
        return;
    }
    
    // 具体的な選択肢の処理
    handleStep1Choice(input);
}

// ステップ1の選択肢処理
function handleStep1Choice(input) {
    // 電力契約関連
    if (input === 'new_contract') {
        addBotMessage("新規契約についてお答えいたします。<br><br>新規契約のお手続きを承っております。<br><br>お客様のお名前を教えてください。");
        supportChatState.currentTopic = 'new_contract';
        supportChatState.step = 1;
        return;
    }
    
    if (input === 'change_contract') {
        addBotMessage("契約変更についてお答えいたします。<br><br>どのような変更をご希望でしょうか？", [
            {"text": "契約者名義の変更", "value": "change_name"},
            {"text": "使用量の変更", "value": "change_usage"},
            {"text": "その他", "value": "change_other"}
        ]);
        return;
    }
    
    if (input === 'cancel_contract') {
        addBotMessage("解約についてお答えいたします。<br><br>解約のお手続きを承っております。<br><br>解約理由をお教えください。", [
            {"text": "引っ越し", "value": "cancel_reason_move"},
            {"text": "他社への変更", "value": "cancel_reason_other_company"},
            {"text": "その他", "value": "cancel_reason_other"}
        ]);
        return;
    }
    
    if (input === 'check_contract') {
        addBotMessage("契約内容の確認についてお答えいたします。<br><br>現在の契約内容をご確認いたします。<br><br>お客様のお名前とご住所をお教えください。");
        supportChatState.currentTopic = 'check_contract';
        supportChatState.step = 1;
        return;
    }
    
    // 料金関連
    if (input === 'check_billing') {
        addBotMessage("料金の確認についてお答えいたします。<br><br>現在の料金状況をご確認いたします。<br><br>お客様のお名前とご住所をお教えください。");
        supportChatState.currentTopic = 'check_billing';
        supportChatState.step = 1;
        return;
    }
    
    if (input === 'high_billing') {
        addBotMessage("料金が高い場合についてお答えいたします。<br><br>料金を抑えるためのアドバイスをご案内いたします。<br><br>現在の月間使用量をお教えください。", [
            {"text": "200kWh以下", "value": "usage_low"},
            {"text": "200-400kWh", "value": "usage_medium"},
            {"text": "400kWh以上", "value": "usage_high"}
        ]);
        return;
    }
    
    if (input === 'change_payment') {
        addBotMessage("支払い方法の変更についてお答えいたします。<br><br>現在の支払い方法をお教えください。", [
            {"text": "口座振替", "value": "payment_bank"},
            {"text": "クレジットカード", "value": "payment_credit"},
            {"text": "コンビニ払い", "value": "payment_convenience"},
            {"text": "その他", "value": "payment_other"}
        ]);
        return;
    }
    
    if (input === 'reissue_bill') {
        addBotMessage("請求書の再発行についてお答えいたします。<br><br>請求書の再発行手続きを承っております。<br><br>再発行希望の請求書の年月をお教えください。");
        supportChatState.currentTopic = 'reissue_bill';
        supportChatState.step = 1;
        return;
    }
    
    // プラン関連
    if (input === 'change_plan') {
        addBotMessage("プラン変更についてお答えいたします。<br><br>現在のプランから変更可能なプランをご案内いたします。<br><br>お客様の現在のプランをお教えください。", [
            {"text": "従量電灯B", "value": "current_plan_b"},
            {"text": "電化でナイト・セレクト", "value": "current_plan_night"},
            {"text": "スマートファミリープラン", "value": "current_plan_family"},
            {"text": "その他", "value": "current_plan_other"}
        ]);
        return;
    }
    
    if (input === 'recommended_plan') {
        addBotMessage("おすすめプランについてお答えいたします。<br><br>お客様に最適なプランをご提案いたします。<br><br>ライフスタイル診断を開始いたしますか？", [
            {"text": "はい、診断を開始する", "value": "start_lifestyle"},
            {"text": "いいえ、直接相談したい", "value": "direct_consultation"}
        ]);
        return;
    }
    
    if (input === 'compare_plans') {
        addBotMessage("プランの比較についてお答えいたします。<br><br>主要なプランの特徴をご説明いたします。<br><br>どのプランについて詳しく知りたいですか？", [
            {"text": "従量電灯B", "value": "plan_detail_b"},
            {"text": "電化でナイト・セレクト", "value": "plan_detail_night"},
            {"text": "スマートファミリープラン", "value": "plan_detail_family"}
        ]);
        return;
    }
    
    if (input === 'plan_details') {
        addBotMessage("プランの詳細についてお答えいたします。<br><br>どのプランについて詳しく知りたいですか？", [
            {"text": "従量電灯B", "value": "plan_detail_b"},
            {"text": "電化でナイト・セレクト", "value": "plan_detail_night"},
            {"text": "スマートファミリープラン", "value": "plan_detail_family"}
        ]);
        return;
    }
    
    // その他
    if (input === 'construction') {
        addBotMessage("工事についてお答えいたします。<br><br>工事に関するご質問を承っております。<br><br>どのような工事についてお聞きでしょうか？", [
            {"text": "新設工事", "value": "construction_new"},
            {"text": "増設工事", "value": "construction_add"},
            {"text": "修理工事", "value": "construction_repair"}
        ]);
        return;
    }
    
    if (input === 'meter') {
        addBotMessage("メーターについてお答えいたします。<br><br>メーターに関するご質問を承っております。<br><br>どのようなことでしょうか？", [
            {"text": "メーターの確認", "value": "meter_check"},
            {"text": "メーターの交換", "value": "meter_exchange"},
            {"text": "メーターの故障", "value": "meter_trouble"}
        ]);
        return;
    }
    
    if (input === 'emergency') {
        addBotMessage("緊急時の連絡についてお答えいたします。<br><br>緊急時は以下の番号にお電話ください：<br><br><b>緊急時連絡先：0120-XXX-XXX</b><br><br>24時間対応いたします。<br><br>他にご質問はございますか？", [
            {"text": "はい、他にも質問がある", "value": "more_questions"},
            {"text": "いいえ、これで終了", "value": "end"}
        ]);
        return;
    }
    
    if (input === 'general') {
        addBotMessage("その他のお問い合わせについてお答えいたします。<br><br>どのようなご質問でしょうか？<br><br>具体的にお聞かせください。");
        return;
    }
    
    // ステップ2の選択肢処理
    handleStep2Choice(input);
}

// ステップ2の選択肢処理
function handleStep2Choice(input) {
    // プラン詳細
    if (input === 'plan_detail_b') {
        addBotMessage("従量電灯Bプランについてご説明いたします。<br><br><b>【プランの特徴】</b><br>・1年契約で基本料金が安い<br>・使用量に応じた従量料金<br>・標準的な料金体系<br><br><b>【対象者】</b><br>・使用量が少ないご家庭<br>・標準的な電気使用パターン<br><br>他にご質問はございますか？", [
            {"text": "はい、他にも質問がある", "value": "more_questions"},
            {"text": "いいえ、これで終了", "value": "end"}
        ]);
        return;
    }
    
    if (input === 'plan_detail_night') {
        addBotMessage("電化でナイト・セレクトプランについてご説明いたします。<br><br><b>【プランの特徴】</b><br>・夜間の電気料金が割安<br>・オール電化住宅に最適<br>・電気温水器や蓄熱式暖房機に有利<br><br><b>【対象者】</b><br>・オール電化住宅<br>・夜間の電気使用量が多いご家庭<br><br>他にご質問はございますか？", [
            {"text": "はい、他にも質問がある", "value": "more_questions"},
            {"text": "いいえ、これで終了", "value": "end"}
        ]);
        return;
    }
    
    if (input === 'plan_detail_family') {
        addBotMessage("スマートファミリープランについてご説明いたします。<br><br><b>【プランの特徴】</b><br>・2年契約でお得<br>・家族割引が適用<br>・ご家族が多いほどお得<br><br><b>【対象者】</b><br>・4人以上のご家族<br>・電気使用量が多いご家庭<br><br>他にご質問はございますか？", [
            {"text": "はい、他にも質問がある", "value": "more_questions"},
            {"text": "いいえ、これで終了", "value": "end"}
        ]);
        return;
    }
    
    // 使用量別アドバイス
    if (input === 'usage_low') {
        addBotMessage("200kWh以下の使用量についてアドバイスいたします。<br><br>現在の使用量は標準的です。<br><br>さらなる節約のためには：<br>・LED電球への交換<br>・エアコンの設定温度調整<br>・不要な電気機器の電源オフ<br><br>他にご質問はございますか？", [
            {"text": "はい、他にも質問がある", "value": "more_questions"},
            {"text": "いいえ、これで終了", "value": "end"}
        ]);
        return;
    }
    
    if (input === 'usage_medium') {
        addBotMessage("200-400kWhの使用量についてアドバイスいたします。<br><br>現在の使用量はやや多い傾向です。<br><br>節約のためには：<br>・プランの見直し<br>・使用時間帯の調整<br>・省エネ家電への交換<br><br>他にご質問はございますか？", [
            {"text": "はい、他にも質問がある", "value": "more_questions"},
            {"text": "いいえ、これで終了", "value": "end"}
        ]);
        return;
    }
    
    if (input === 'usage_high') {
        addBotMessage("400kWh以上の使用量についてアドバイスいたします。<br><br>現在の使用量は多い傾向です。<br><br>大幅な節約のためには：<br>・プランの変更を検討<br>・使用量の見直し<br>・省エネ診断の実施<br><br>他にご質問はございますか？", [
            {"text": "はい、他にも質問がある", "value": "more_questions"},
            {"text": "いいえ、これで終了", "value": "end"}
        ]);
        return;
    }
    
    // 支払い方法変更
    if (input === 'payment_bank') {
        addBotMessage("口座振替への変更についてお答えいたします。<br><br>口座振替への変更手続きを承っております。<br><br>お客様のお名前とご住所をお教えください。");
        supportChatState.currentTopic = 'change_payment_bank';
        supportChatState.step = 1;
        return;
    }
    
    if (input === 'payment_credit') {
        addBotMessage("クレジットカード払いへの変更についてお答えいたします。<br><br>クレジットカード払いへの変更手続きを承っております。<br><br>お客様のお名前とご住所をお教えください。");
        supportChatState.currentTopic = 'change_payment_credit';
        supportChatState.step = 1;
        return;
    }
    
    if (input === 'payment_convenience') {
        addBotMessage("コンビニ払いへの変更についてお答えいたします。<br><br>コンビニ払いへの変更手続きを承っております。<br><br>お客様のお名前とご住所をお教えください。");
        supportChatState.currentTopic = 'change_payment_convenience';
        supportChatState.step = 1;
        return;
    }
    
    // ライフスタイル診断
    if (input === 'start_lifestyle') {
        addBotMessage("ライフスタイル診断を開始いたします。<br><br>お客様に最適なプランをご提案いたします。<br><br>ご家族の人数をお教えください。");
        lifestyleChatState.step = 0;
        return;
    }
    
    if (input === 'direct_consultation') {
        addBotMessage("直接相談についてお答えいたします。<br><br>お客様のご要望をお聞かせください。<br><br>どのようなことについて相談されたいでしょうか？");
        return;
    }
    
    // 終了処理
    if (input === 'more_questions') {
        addBotMessage("他にどのようなご質問でしょうか？<br><br>以下のようなご質問にお答えできます：<br><br>・電力契約について<br>・料金プランについて<br>・ご利用料金について<br>・停電情報について<br><br>チャットボットでお手伝いいたします。");
        return;
    }
    
    if (input === 'end') {
        addBotMessage("ご利用ありがとうございました。<br><br>他にご質問がございましたら、いつでもお気軽にお聞きください。<br><br>チャットボットでお手伝いいたします。");
        return;
    }
    
    // キーワードに基づいてトピックを判定（フォールバック）
    if (inputLower.includes('契約') || inputLower.includes('申込') || inputLower.includes('新規') || inputLower.includes('解約')) {
        addBotMessage("電力契約についてお答えいたします。<br><br>どのようなご質問でしょうか？", [
            {"text": "新規契約について", "value": "new_contract"},
            {"text": "契約変更について", "value": "change_contract"},
            {"text": "解約について", "value": "cancel_contract"},
            {"text": "契約内容の確認", "value": "check_contract"}
        ]);
    } else if (inputLower.includes('料金') || inputLower.includes('請求') || inputLower.includes('支払') || inputLower.includes('高い')) {
        addBotMessage("ご利用料金についてお答えいたします。<br><br>どのようなご質問でしょうか？", [
            {"text": "料金の確認", "value": "check_billing"},
            {"text": "料金が高い", "value": "high_billing"},
            {"text": "支払い方法の変更", "value": "change_payment"},
            {"text": "請求書の再発行", "value": "reissue_bill"}
        ]);
    } else if (inputLower.includes('プラン') || inputLower.includes('変更') || inputLower.includes('おすすめ')) {
        addBotMessage("料金プランについてお答えいたします。<br><br>どのようなご質問でしょうか？", [
            {"text": "プランの変更", "value": "change_plan"},
            {"text": "おすすめプラン", "value": "recommended_plan"},
            {"text": "プランの比較", "value": "compare_plans"},
            {"text": "プランの詳細", "value": "plan_details"}
        ]);
    } else if (inputLower.includes('停電') || inputLower.includes('電気がつかない') || inputLower.includes('電気が使えない')) {
        addBotMessage("停電情報についてお答えいたします。<br><br>現在、お客様のご住所で停電は発生しておりません。<br><br>電気がつかない場合は、以下の点をご確認ください：<br><br>・ブレーカーが落ちていないか<br>・コンセントが抜けていないか<br>・電球が切れていないか<br><br>ご確認いただいても解決しない場合は、チャットボットでご相談ください。<br><br>他にご質問はございますか？", [
            {"text": "はい、他にも質問がある", "value": "more_questions"},
            {"text": "いいえ、これで終了", "value": "end"}
        ]);
    } else {
        // 一般的な応答
        addBotMessage('申し訳ございません。もう一度詳しく教えていただけますか？<br><br>以下のようなご質問にお答えできます：<br><br>・電力契約について<br>・料金プランについて<br>・ご利用料金について<br>・停電情報について<br><br>チャットボットでお手伝いいたします。');
    }
}

// 申込みチャット処理
function processApplicationChat(input) {
    const currentStep = supportChatState.step;
    
    switch(currentStep) {
        case 0: // 申込み確認
            if (input.toLowerCase().includes('はい') || input.toLowerCase().includes('yes') || input === 'はい') {
                addBotMessage("承知いたしました。申込み手続きを開始いたします。<br><br>お客様のお名前を教えてください。");
                supportChatState.step = 1;
            } else {
                addBotMessage("承知いたしました。他にご質問がございましたら、お気軽にお聞きください。", [
                    {"text": "はい、他にも質問がある", "value": "more_questions"},
                    {"text": "いいえ、これで終了", "value": "end"}
                ]);
                supportChatState.currentTopic = null;
                supportChatState.step = 0;
            }
            return;
        case 1: // お名前
            supportChatState.userInfo = { name: input };
            addBotMessage("ありがとうございます。お電話番号を教えてください。");
            supportChatState.step = 2;
            return;
        case 2: // 電話番号
            supportChatState.userInfo.phone = input;
            addBotMessage("ありがとうございます。ご住所を教えてください。");
            supportChatState.step = 3;
            return;
        case 3: // 住所
            supportChatState.userInfo.address = input;
            addBotMessage("ありがとうございます。契約開始希望日を教えてください。", [
                {"text": "来月から", "value": "next_month"},
                {"text": "来週から", "value": "next_week"},
                {"text": "今月から", "value": "this_month"},
                {"text": "その他", "value": "other"}
            ]);
            supportChatState.step = 4;
            return;
        case 4: // 契約開始日
            supportChatState.userInfo.startDate = input;
            
            // 申込み完了メッセージ
            const applicationNumber = Math.floor(Math.random() * 900000) + 100000;
            const completionMessage = `申込み手続きが完了いたしました！<br><br><b>【申込み内容】</b><br>・プラン：${supportChatState.selectedPlan}<br>・お名前：${supportChatState.userInfo.name}<br>・電話番号：${supportChatState.userInfo.phone}<br>・ご住所：${supportChatState.userInfo.address}<br>・契約開始日：${supportChatState.userInfo.startDate}<br><br><b>【申込み番号】</b><br>${applicationNumber}<br><br>申込み番号は大切に保管してください。<br>担当者より3営業日以内にご連絡いたします。<br><br>他にご質問はございますか？`;
            
            addBotMessage(completionMessage, [
                {"text": "はい、他にも質問がある", "value": "more_questions"},
                {"text": "いいえ、これで終了", "value": "end"}
            ]);
            
            supportChatState.currentTopic = null;
            supportChatState.step = 0;
            return;
    }
}

// ライフスタイル診断チャット処理
function processLifestyleChat(input) {
    const currentStep = lifestyleChatState.step;
    
    switch(currentStep) {
        case 0: // 家族人数
            lifestyleChatState.lifestyleAnswers.familySize = input;
            
            // 1人の場合は3歳未満のお子さまの質問をスキップしてオール電化の質問へ
            if (input === '1') {
                lifestyleChatState.lifestyleAnswers.hasYoungChild = 'いいえ';
                lifestyleChatState.step = 3;
                addBotMessage("ありがとうございます。お住まいはオール電化住宅ですか？", [
                    {"text": "はい", "value": "はい"},
                    {"text": "いいえ", "value": "いいえ"}
                ]);
                return;
            }
            
            // 2人以上の場合は次の質問へ
            lifestyleChatState.step = 1;
            addBotMessage("ありがとうございます。3歳未満のお子さまはいらっしゃいますか？", [
                {"text": "はい", "value": "はい"},
                {"text": "いいえ", "value": "いいえ"}
            ]);
            return;
            
                 case 1: // 3歳未満のお子さまの有無
             lifestyleChatState.lifestyleAnswers.hasYoungChild = input;
             
             if (input === 'はい') {
                 // すくすく赤ちゃんプランを提案
                 addBotMessage("診断ありがとうございます！<br><br>お客様のライフスタイルから、最適なプランとして「<b>すくすく赤ちゃんプラン</b>」をご提案します。<br><br><div class='recommendation-reason'><b>【ご提案理由】</b><br>3歳未満のお子さまがいるご家庭のため</div><div class='plan-details'><b>【プランの特徴】</b><br>毎年5月分の電気料金を10%割引いたします。子育て世帯を応援するプランです。</div><br>こちらのプランで申込み手続きを進めますか？", [
                     {"text": "はい", "value": "sukusuku_yes"},
                     {"text": "いいえ", "value": "sukusuku_no"}
                 ]);
                 lifestyleChatState.step = 2;
             } else {
                 // オール電化の質問へ遷移
                 lifestyleChatState.step = 3;
                 addBotMessage("ありがとうございます。お住まいはオール電化住宅ですか？", [
                     {"text": "はい", "value": "はい"},
                     {"text": "いいえ", "value": "いいえ"}
                 ]);
             }
             return;
            
                 case 2: // すくすく赤ちゃんプラン選択確認
             if (input === 'sukusuku_yes') {
                 addBotMessage("「すくすく赤ちゃんプラン」を選択していただき、ありがとうございます。<br><br>こちらのプランで申込み手続きを進めますか？", [
                     {"text": "はい、申込み手続きを進める", "value": "はい"},
                     {"text": "いいえ、他のプランも見たい", "value": "いいえ"}
                 ]);
                 lifestyleChatState.step = 4;
             } else {
                 // オール電化の質問へ遷移
                 lifestyleChatState.step = 3;
                 addBotMessage("ありがとうございます。お住まいはオール電化住宅ですか？", [
                     {"text": "はい", "value": "はい"},
                     {"text": "いいえ", "value": "いいえ"}
                 ]);
             }
             return;
            
        case 3: // オール電化
            lifestyleChatState.lifestyleAnswers.allElectric = input.toLowerCase();
            lifestyleChatState.step = 5;
            addBotMessage("ありがとうございます。電気の使用時間帯についてお聞かせください。どの時間帯に電気を多く使いますか？", [
                {"text": "夜間が多い", "value": "夜間"},
                {"text": "昼間が多い", "value": "昼間"},
                {"text": "朝晩が多い", "value": "朝晩"},
                {"text": "ほぼ均等", "value": "均等"}
            ]);
            return;
            
        case 4: // すくすく赤ちゃんプラン申込み確認
            if (input.toLowerCase().includes('はい') || input.toLowerCase().includes('yes') || input === 'はい') {
                addBotMessage("承知いたしました。申込み手続きを開始いたします。<br><br>お客様のお名前を教えてください。");
                // 申込みチャットに切り替え
                supportChatState.currentTopic = 'application';
                supportChatState.step = 0;
                supportChatState.selectedPlan = 'すくすく赤ちゃんプラン';
            } else {
                addBotMessage("承知いたしました。他にご質問がございましたら、お気軽にお聞きください。", [
                    {"text": "はい、他にも質問がある", "value": "more_questions"},
                    {"text": "いいえ、これで終了", "value": "end"}
                ]);
                lifestyleChatState.step = -1;
            }
            return;
            
        case 5: // 使用時間帯
            lifestyleChatState.lifestyleAnswers.usageTime = input.toLowerCase();
            
            // プラン推奨
            const recommendedPlan = recommendPlan(lifestyleChatState.lifestyleAnswers);
            
            const resultMessage = `診断ありがとうございます！<br><br>お客様のライフスタイルから、最適なプランとして「<b>${recommendedPlan.name}</b>」をご提案します。<br><br><div class='recommendation-reason'><b>【ご提案理由】</b><br>${recommendedPlan.reason}</div><div class='plan-details'><b>【プランの特徴】</b><br>${recommendedPlan.description}</div><br>こちらのプランで申込み手続きを進めますか？`;
            
            addBotMessage(resultMessage, [
                {"text": "はい、申込み手続きを進める", "value": "はい"},
                {"text": "いいえ、他のプランも見たい", "value": "いいえ"}
            ]);
            lifestyleChatState.step = 6;
            return;
            
                 case 6: // 申込み確認
             if (input.toLowerCase().includes('はい') || input.toLowerCase().includes('yes') || input === 'はい') {
                 addBotMessage("承知いたしました。申込み手続きを開始いたします。<br><br>お客様のお名前を教えてください。");
                 // 申込みチャットに切り替え
                 supportChatState.currentTopic = 'application';
                 supportChatState.step = 0;
                 supportChatState.selectedPlan = recommendPlan(lifestyleChatState.lifestyleAnswers).name;
             } else {
                 addBotMessage("承知いたしました。他にご質問がございましたら、お気軽にお聞きください。", [
                     {"text": "はい、他にも質問がある", "value": "more_questions"},
                     {"text": "いいえ、これで終了", "value": "end"}
                 ]);
                 lifestyleChatState.step = -1;
             }
             return;
             
                   case 7: // 通常プラン選択後の申込み確認
              if (input.toLowerCase().includes('はい') || input.toLowerCase().includes('yes') || input === 'はい') {
                  addBotMessage("承知いたしました。申込み手続きを開始いたします。<br><br>お客様のお名前を教えてください。");
                  // 申込みチャットに切り替え
                  supportChatState.currentTopic = 'application';
                  supportChatState.step = 0;
                  // 保存されたプラン名を使用
                  supportChatState.selectedPlan = lifestyleChatState.selectedPlan || '従量電灯B';
              } else {
                  addBotMessage("承知いたしました。他にご質問がございましたら、お気軽にお聞きください。", [
                      {"text": "はい、他にも質問がある", "value": "more_questions"},
                      {"text": "いいえ、これで終了", "value": "end"}
                  ]);
                  lifestyleChatState.step = -1;
              }
              return;
              
          case 8: // 通常プランを見る選択肢の処理
              if (input === 'normal_plans') {
                  addBotMessage("通常の料金プランをご紹介いたします。", [
                      {"text": "スマートファミリープラン", "value": "select_plan"},
                      {"text": "電化でナイト・セレクト", "value": "select_plan"},
                      {"text": "従量電灯B", "value": "select_plan"}
                  ]);
                  lifestyleChatState.step = 9;
                  return;
              }
              
              if (input === 'end') {
                  addBotMessage("診断を終了いたします。ご利用ありがとうございました。", [
                      {"text": "はい、他にも質問がある", "value": "more_questions"},
                      {"text": "いいえ、これで終了", "value": "end"}
                  ]);
                  lifestyleChatState.step = -1;
                  return;
              }
              return;
              
          case 9: // プラン選択の処理
              if (input === 'select_plan') {
                  // 選択されたプラン名を取得するため、グローバル変数に保存
                  const selectedBtn = event.target.closest('.choice-btn');
                  const planName = selectedBtn ? selectedBtn.textContent.trim() : '従量電灯B';
                  lifestyleChatState.selectedPlan = planName;
                  
                  addBotMessage(`「${planName}」を選択していただき、ありがとうございます。<br><br>こちらのプランで申込み手続きを進めますか？`, [
                      {"text": "はい、申込み手続きを進める", "value": "はい"},
                      {"text": "いいえ、他のプランも見たい", "value": "いいえ"}
                  ]);
                  lifestyleChatState.step = 7; // 申込み確認ステップ
                  return;
              }
              return;
     }
}

// プラン推奨ロジック
function recommendPlan(answers) {
    const familySize = parseInt(answers.familySize) || 1;
    const isAllElectric = answers.allElectric && answers.allElectric.includes('はい');
    const isNightUsage = answers.usageTime && answers.usageTime.includes('夜間');
    const hasYoungChild = answers.hasYoungChild === 'はい';
    
    // 3歳未満のお子さまがいる場合はすくすく赤ちゃんプランを優先
    if (hasYoungChild) {
        return {
            name: 'すくすく赤ちゃんプラン',
            reason: '3歳未満のお子さまがいるご家庭のため',
            description: '毎年5月分の電気料金を10%割引いたします。子育て世帯を応援するプランです。'
        };
    }
    
    if (isAllElectric && isNightUsage) {
        return {
            name: '電化でナイト・セレクト',
            reason: 'オール電化住宅で夜間の電気使用量が多いため',
            description: '夜間の電気料金が割安になり、オール電化住宅に最適なプランです。'
        };
    } else if (isNightUsage) {
        return {
            name: '電化でナイト・セレクト',
            reason: '夜間の電気使用量が多いため',
            description: '夜間の電気料金が割安になるプランです。'
        };
    } else if (familySize >= 4) {
        return {
            name: 'スマートファミリープラン',
            reason: '4人以上のご家族で電気使用量が多いため',
            description: '2年契約でお得になる、ご家庭向けのプランです。'
        };
    } else {
        return {
            name: '従量電灯B',
            reason: '一般的な電気使用パターンのため',
            description: '1年契約で、標準的な料金体系のプランです。'
        };
    }
}

// プラン選択処理
function selectPlan(planName) {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // 申込みチャットの状態を初期化
        supportChatState.currentTopic = 'application';
        supportChatState.step = 0;
        supportChatState.selectedPlan = planName;
        
        const chatMessages = document.getElementById('chatMessages');
        const planInfo = getPlanInfo(planName);
        
        const message = `「${planName}」を選択していただき、ありがとうございます。<br><br><div class='plan-details'><b>【プランの特徴】</b><br>${planInfo.description}</div><br>こちらのプランで申込み手続きを進めますか？`;
        
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-user-check"></i>
                </div>
                <div class="message-content">${message}</div>
            </div>
        `;
        
        setTimeout(() => {
            const choices = [
                {"text": "はい、申込み手続きを進める", "value": "はい"},
                {"text": "いいえ、他のプランも見たい", "value": "いいえ"}
            ];
            showChoiceButtons(choices);
        }, 1000);
    }
}

// プラン情報を取得
function getPlanInfo(planName) {
    const planInfo = {
        'スマートファミリープラン': {
            description: '2年契約でおトクになるご家庭のお客さま向けプランです。家族割引が適用され、ご家族が多いほどお得になります。'
        },
        '電化でナイト・セレクト': {
            description: 'オール電化等のお客さま向けプランです。夜間の電気料金が割安になり、電気温水器や蓄熱式暖房機の使用に最適です。'
        },
        '従量電灯B': {
            description: '1年契約で使用量が少ないご家庭のお客さま向けプランです。基本料金が安く、使用量に応じた従量料金が適用されます。'
        },
        'すくすく赤ちゃんプラン': {
            description: '3歳未満のお子さまがいるご家庭向けの特別プランです。毎年5月分の電気料金を10%割引いたします。子育て世帯を応援するプランです。'
        }
    };
    
    return planInfo[planName] || {
        description: 'お客様に最適なプランです。'
    };
}

// 初期選択肢の処理
function handleInitialChoice(choice) {
    switch(choice) {
        case 'contract':
            addBotMessage("電力契約についてお答えいたします。<br><br>どのようなご質問でしょうか？", [
                {"text": "新規契約について", "value": "new_contract"},
                {"text": "契約変更について", "value": "change_contract"},
                {"text": "解約について", "value": "cancel_contract"},
                {"text": "契約内容の確認", "value": "check_contract"}
            ]);
            break;
        case 'billing':
            addBotMessage("ご利用料金についてお答えいたします。<br><br>どのようなご質問でしょうか？", [
                {"text": "料金の確認", "value": "check_billing"},
                {"text": "料金が高い", "value": "high_billing"},
                {"text": "支払い方法の変更", "value": "change_payment"},
                {"text": "請求書の再発行", "value": "reissue_bill"}
            ]);
            break;
        case 'plan':
            addBotMessage("料金プランについてお答えいたします。<br><br>どのようなご質問でしょうか？", [
                {"text": "プランの変更", "value": "change_plan"},
                {"text": "おすすめプラン", "value": "recommended_plan"},
                {"text": "プランの比較", "value": "compare_plans"},
                {"text": "プランの詳細", "value": "plan_details"}
            ]);
            break;
        case 'outage':
            supportChatState.currentTopic = 'outage';
            addBotMessage("停電情報についてお答えいたします。<br><br>現在、お客様のご住所で停電は発生しておりません。<br><br>電気がつかない場合は、以下の点をご確認ください：<br><br>・ブレーカーが落ちていないか<br>・コンセントが抜けていないか<br>・電球が切れていないか<br><br>ご確認いただいても解決しない場合は、チャットボットでご相談ください。<br><br>他にご質問はございますか？", [
                {"text": "はい、他にも質問がある", "value": "more_questions"},
                {"text": "いいえ、これで終了", "value": "end"}
            ]);
            break;
        case 'other':
            addBotMessage("その他のお問い合わせについてお答えいたします。<br><br>どのようなご質問でしょうか？", [
                {"text": "工事について", "value": "construction"},
                {"text": "メーターについて", "value": "meter"},
                {"text": "緊急時の連絡", "value": "emergency"},
                {"text": "その他", "value": "general"}
            ]);
            break;
    }
}

// Qピコ履歴を開く
function openQpicoHistory() {
    const modal = document.getElementById('qpicoModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Qピコ履歴を閉じる
function closeQpicoHistory() {
    const modal = document.getElementById('qpicoModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// おすすめ賞品を表示
function showRecommendations() {
    alert('おすすめ賞品ページに移動します。\n\n【現在のポイントで交換可能】\n・電気料金割引券（100ピコ）\n・商品券500円分（150ピコ）\n・寄付（任意のポイント）\n\n【おすすめ】\n・電気料金割引券がお得です！\n・月額料金から100円割引されます。');
}

// さらに履歴を読み込む
function loadMoreHistory() {
    alert('さらに履歴を読み込みます。\n\n【追加履歴】\n・2025/07/20: 省エネチャレンジ +10ピコ\n・2025/07/18: アンケート回答 +3ピコ\n・2025/07/15: 月間目標達成 +5ピコ\n・2025/07/10: ログインポイント +2ピコ\n・2025/07/08: Web版検針票 +1ピコ');
}

// おトクなお知らせカードのクリック機能
function openNotificationDetail(notificationType) {
    switch(notificationType) {
        case 'campaign':
            alert('新規契約キャンペーンの詳細ページに移動します。\n\n【キャンペーン内容】\n・期間：2025年8月1日～8月31日\n・対象：新規契約のお客様\n・特典：初月料金50%OFF\n・条件：2年契約\n\nお申込みはWebから承っております。\nチャットボットでお手続きいただけます。');
            break;
        case 'eco':
            alert('省エネチャレンジの詳細ページに移動します。\n\n【省エネチャレンジとは】\n・月間の電気使用量を前年同月比で削減\n・削減率に応じてポイントを獲得\n・参加者全員に参加賞あり\n\n【今月の目標】\n・前年同月比5%削減で50ポイント\n・10%削減で100ポイント\n・15%削減で200ポイント\n\n現在の削減率：12%（目標達成済み！）');
            break;
        case 'game':
            alert('省エネゲームの詳細ページに移動します。\n\n【省エネゲームとは】\n・省エネに関する知識を楽しく学べるゲーム\n・クイズ形式で省エネのコツを学習\n・正解するとポイントを獲得\n\n【ゲーム内容】\n・省エネクイズ：5問のクイズに挑戦\n・制限時間：30秒/問\n・獲得ポイント：正解1問につき10ポイント\n\n【今すぐプレイ】\necoアプリのポイント確認ページからゲームを開始できます！');
            break;
        default:
            alert('詳細ページに移動します');
    }
}

// DOMContentLoadedイベントリスナー
document.addEventListener('DOMContentLoaded', function() {
    console.log('アプリケーションが初期化されました');
    initializeChatData();
    
    // 実績タブのイベントリスナーを設定
    const tabButtons = document.querySelectorAll('.tab-navigation .tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // 前年・翌年ナビゲーションのイベントリスナーを設定
    const prevYearBtn = document.querySelector('.nav-btn.prev-year');
    const nextYearBtn = document.querySelector('.nav-btn.next-year');
    
    if (prevYearBtn) {
        prevYearBtn.addEventListener('click', goToPreviousYear);
    }
    
    if (nextYearBtn) {
        nextYearBtn.addEventListener('click', goToNextYear);
    }
    
    // 前月・翌月ナビゲーションのイベントリスナーを設定
    const prevMonthBtn = document.querySelector('.nav-btn.prev-month');
    const nextMonthBtn = document.querySelector('.nav-btn.next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', goToPreviousMonth);
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', goToNextMonth);
    }
    
    // プラン変更ボタンのイベントリスナーを設定
    const planChangeLinks = document.querySelectorAll('.detail-link');
    planChangeLinks.forEach(link => {
        if (link.textContent.includes('プラン変更について確認')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                openPlanChat();
            });
        }
    });
    
    // 初期状態でナビゲーションボタンの状態を更新
    updateNavigationButtons();
    updateMonthlyNavigationButtons();
    
    // グラフの初期化
    initializeChartData();
});

// コンビニ支払い関連の関数

// コンビニ支払いモーダルを開く
function openConveniencePayment() {
    console.log('openConveniencePayment called');
    const modal = document.getElementById('conveniencePaymentModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        conveniencePaymentState.isOpen = true;
        console.log('Modal opened successfully');
    } else {
        console.error('Modal element not found');
    }
}

// コンビニ支払いモーダルを閉じる
function closeConveniencePayment() {
    const modal = document.getElementById('conveniencePaymentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        conveniencePaymentState.isOpen = false;
        conveniencePaymentState.selectedConvenience = null;
        
        // 選択状態をリセット
        const convenienceItems = document.querySelectorAll('.convenience-item');
        convenienceItems.forEach(item => {
            item.classList.remove('selected');
        });
        
        // バーコードセクションを非表示
        const barcodeSection = document.getElementById('barcodeSection');
        if (barcodeSection) {
            barcodeSection.style.display = 'none';
        }
    }
}

// コンビニを選択
function selectConvenience(convenienceType) {
    console.log('selectConvenience called with:', convenienceType);
    
    // 選択状態を更新
    const convenienceItems = document.querySelectorAll('.convenience-item');
    convenienceItems.forEach(item => {
        item.classList.remove('selected');
    });
    
    // 選択されたコンビニをハイライト
    const selectedItem = event.currentTarget;
    selectedItem.classList.add('selected');
    
    conveniencePaymentState.selectedConvenience = convenienceType;
    
    // バーコードセクションを表示
    const barcodeSection = document.getElementById('barcodeSection');
    if (barcodeSection) {
        barcodeSection.style.display = 'block';
        console.log('Barcode section displayed');
        
        // セクションタイトルを更新
        const sectionTitle = barcodeSection.querySelector('h3');
        if (sectionTitle) {
            const hasPaymentSlip = ['seven', 'familymart', 'lawson', 'ministop', 'yamazaki', 'seicomart'].includes(convenienceType);
            sectionTitle.textContent = hasPaymentSlip ? '振込票' : 'バーコード';
        }
        
        // バーコードセクションまでスクロール
        setTimeout(() => {
            barcodeSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    } else {
        console.error('Barcode section not found');
    }
    
    // ダミーAPI呼び出しのシミュレーション
    simulateApiCall(convenienceType);
}

// ダミーAPI呼び出しのシミュレーション
function simulateApiCall(convenienceType) {
    const barcodePlaceholder = document.getElementById('barcode-placeholder');
    const paymentSlip = document.getElementById('payment-slip');
    const paymentSlipImage = document.getElementById('payment-slip-image');
    
    // 初期状態で両方を非表示にする
    if (barcodePlaceholder) barcodePlaceholder.style.display = 'none';
    if (paymentSlip) paymentSlip.style.display = 'none';
    
    // ローディング表示を開始
    if (barcodePlaceholder) {
        barcodePlaceholder.style.display = 'flex';
        barcodePlaceholder.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <p>振込票生成中...</p>
            <small>API連携処理を実行中です</small>
        `;
    }
    
    // 振込票を表示するコンビニかチェック
    const hasPaymentSlip = ['seven', 'familymart', 'lawson', 'ministop', 'yamazaki', 'seicomart'].includes(convenienceType);
    
    // 2秒後に振込票またはバーコードを表示（実際のAPI呼び出しをシミュレート）
    setTimeout(() => {
        // ローディング表示を停止
        if (barcodePlaceholder) barcodePlaceholder.style.display = 'none';
        
        if (hasPaymentSlip) {
            // 振込票を表示
            if (paymentSlip) {
                const slipContent = generatePaymentSlipContent(convenienceType);
                paymentSlip.innerHTML = slipContent;
                paymentSlip.style.display = 'flex';
            }
        } else {
            // バーコードを表示
            if (barcodePlaceholder) {
                barcodePlaceholder.style.display = 'flex';
                barcodePlaceholder.innerHTML = `
                    <i class="fas fa-barcode"></i>
                    <p>バーコード生成完了</p>
                    <small>${getConvenienceName(convenienceType)}用のバーコードが生成されました</small>
                `;
            }
        }
        
        // 支払い番号を更新
        const paymentNumber = generatePaymentNumber();
        const barcodeInfo = document.querySelector('.barcode-info');
        if (barcodeInfo) {
            barcodeInfo.innerHTML = `
                <p><strong>支払い番号:</strong> ${paymentNumber}</p>
                <p><strong>有効期限:</strong> 2025年8月26日(火) 23:59</p>
            `;
        }
    }, 2000);
}

// 振込票コンテンツを生成
function generatePaymentSlipContent(convenienceType) {
    const paymentNumber = generatePaymentNumber();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;
    
    switch(convenienceType) {
        case 'seven':
            return `
                <div class="payment-slip-content seven-eleven">
                    <div class="slip-header">
                        <h3>セブンイレブン 振込票</h3>
                        <div class="slip-date">${formattedDate}</div>
                    </div>
                    <div class="slip-body">
                        <div class="slip-row">
                            <span class="label">お客様番号:</span>
                            <span class="value">12-3456-7890-1234-5678-90</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">支払い金額:</span>
                            <span class="value">9,707円</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">支払期限:</span>
                            <span class="value">2025年8月26日(火)</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">受付番号:</span>
                            <span class="value">${paymentNumber}</span>
                        </div>
                    </div>
                    <div class="slip-footer">
                        <p>※この番号をレジでお申し出ください</p>
                    </div>
                </div>
            `;
            
        case 'familymart':
            return `
                <div class="payment-slip-content familymart">
                    <div class="slip-header">
                        <h3>ファミリーマート 振込票</h3>
                        <div class="slip-date">${formattedDate}</div>
                    </div>
                    <div class="slip-body">
                        <div class="slip-row">
                            <span class="label">お客様番号:</span>
                            <span class="value">12-3456-7890-1234-5678-90</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">支払い金額:</span>
                            <span class="value">9,707円</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">支払期限:</span>
                            <span class="value">2025年8月26日(火)</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">受付番号:</span>
                            <span class="value">${paymentNumber}</span>
                        </div>
                    </div>
                    <div class="slip-footer">
                        <p>※この番号をレジでお申し出ください</p>
                    </div>
                </div>
            `;
            
        case 'lawson':
        case 'ministop':
            return `
                <div class="payment-slip-content lawson-ministop">
                    <div class="slip-header">
                        <h3>${getConvenienceName(convenienceType)} 振込票</h3>
                        <div class="slip-date">${formattedDate}</div>
                    </div>
                    <div class="slip-body">
                        <div class="slip-row">
                            <span class="label">お客様番号:</span>
                            <span class="value">12-3456-7890-1234-5678-90</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">支払い金額:</span>
                            <span class="value">9,707円</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">支払期限:</span>
                            <span class="value">2025年8月26日(火)</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">受付番号:</span>
                            <span class="value">${paymentNumber}</span>
                        </div>
                    </div>
                    <div class="slip-footer">
                        <p>※この番号をレジでお申し出ください</p>
                    </div>
                </div>
            `;
            
        case 'seicomart':
            return `
                <div class="payment-slip-content seicomart">
                    <div class="slip-header">
                        <h3>セイコーマート 振込票</h3>
                        <div class="slip-date">${formattedDate}</div>
                    </div>
                    <div class="slip-body">
                        <div class="slip-row">
                            <span class="label">お客様番号:</span>
                            <span class="value">12-3456-7890-1234-5678-90</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">支払い金額:</span>
                            <span class="value">9,707円</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">支払期限:</span>
                            <span class="value">2025年8月26日(火)</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">受付番号:</span>
                            <span class="value">${paymentNumber}</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">オンライン決済番号:</span>
                            <span class="value">OL${paymentNumber.slice(-8)}</span>
                        </div>
                    </div>
                    <div class="slip-footer">
                        <p>※この番号をレジでお申し出ください</p>
                    </div>
                </div>
            `;
            
        case 'yamazaki':
            return `
                <div class="payment-slip-content yamazaki">
                    <div class="slip-header">
                        <h3>ヤマザキデイリーストア 振込票</h3>
                        <div class="slip-date">${formattedDate}</div>
                    </div>
                    <div class="slip-body">
                        <div class="slip-row">
                            <span class="label">お客様番号:</span>
                            <span class="value">12-3456-7890-1234-5678-90</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">支払い金額:</span>
                            <span class="value">9,707円</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">支払期限:</span>
                            <span class="value">2025年8月26日(火)</span>
                        </div>
                        <div class="slip-row">
                            <span class="label">オンライン決済番号:</span>
                            <span class="value">OL${paymentNumber.slice(-8)}</span>
                        </div>
                    </div>
                    <div class="slip-footer">
                        <p>※この番号をレジでお申し出ください</p>
                    </div>
                </div>
            `;
            
        default:
            return '';
    }
}

// コンビニ名を取得
function getConvenienceName(type) {
    const names = {
        'seven': 'セブンイレブン',
        'lawson': 'ローソン',
        'familymart': 'ファミリーマート',
        'ministop': 'ミニストップ',
        'yamazaki': 'ヤマザキデイリーストア',
        'seicomart': 'セイコーマート'
    };
    return names[type] || 'コンビニ';
}

// 支払い番号を生成
function generatePaymentNumber() {
    // 16桁のランダムな数字を生成
    return Math.random().toString().slice(2, 18);
}

// 支払履歴を表示
function showPaymentHistory() {
    alert('支払履歴ページに移動します。\n\n【最近の支払履歴】\n・2025年6月分: 8,441円 (支払済み)\n・2025年5月分: 7,892円 (支払済み)\n・2025年4月分: 9,123円 (支払済み)\n・2025年3月分: 8,567円 (支払済み)\n\n【支払方法】\n・口座振替: 6月、5月\n・コンビニ支払い: 4月、3月\n\n2025年7月分は未払いとなっております。\nコンビニ支払いでお支払いください。');
}


