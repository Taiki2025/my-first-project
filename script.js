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

// サポート応答パターン
const supportResponses = {
    contract: {
        0: { message: "電力契約についてご案内いたします。<br><br>新規契約をご希望でしょうか？それとも契約変更でしょうか？<br><br>1. 新規契約<br>2. 契約変更<br>3. 解約手続き<br><br>番号でお答えください。", nextStep: 1 },
        1: { message: "承知いたしました。詳しいお手続きについて、担当者よりご連絡させていただきます。<br><br>お電話番号を教えていただけますか？", nextStep: 2 },
        2: { message: "ありがとうございます。2営業日以内に担当者よりご連絡いたします。<br><br>他にご質問はございますか？", nextStep: -1 }
    },
    billing: {
        0: { message: "ご利用料金についてお答えいたします。<br><br>1. 今月の料金確認<br>2. 過去の料金履歴<br>3. 料金が高い理由<br>4. 支払い方法の変更<br><br>どちらについてお知りになりたいですか？", nextStep: 1 },
        1: { message: "詳細な情報は、My九電アプリの「ご利用料金」画面でご確認いただけます。<br><br>さらに詳しい内容については、お電話でのご相談も承っております。<br><br>フリーダイヤル: 0120-986-302<br>（平日9:00-18:00）", nextStep: -1 }
    },
    plan: {
        0: { message: "料金プランについてご案内いたします。<br><br>現在ご利用中のプランから変更をご検討でしょうか？<br><br>1. プラン変更の相談<br>2. プランの詳細説明<br>3. おすすめプランの提案<br><br>番号でお選びください。", nextStep: 1 },
        1: { message: "お客様のライフスタイルに最適なプランをご提案いたします。<br><br>詳しい診断とお手続きについては、専門スタッフがご対応いたします。<br><br>お電話でのご相談をご希望の場合は、フリーダイヤルまでお電話ください。<br><br>0120-986-302（平日9:00-18:00）", nextStep: -1 }
    }
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
        
        // 初期メッセージを設定
        const chatMessages = document.getElementById('chatMessages');
        const initialMessage = `こんにちは！My九電お客様サポートです。<br>
                               どのようなご用件でしょうか？<br><br>
                               【対応可能な内容】<br>
                               ・電力契約のお手続き<br>
                               ・料金プランのご相談<br>
                               ・ご利用料金に関するお問い合わせ<br>
                               ・停電情報の確認<br>
                               ・その他各種お手続き<br><br>
                               ご用件をお聞かせください。`;
        
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-headset"></i>
                </div>
                <div class="message-content">${initialMessage}</div>
            </div>
        `;
    }
}

// チャットボットを閉じる
function closeChat() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ライフスタイル診断チャット開始
function startLifestyleChat() {
    openChat();
    
    // ライフスタイル診断の状態を初期化
    lifestyleChatState = {
        step: 0,
        lifestyleAnswers: {}
    };
    
    // 診断開始メッセージ
    setTimeout(() => {
        addBotMessage(lifestyleChatResponses[0].message);
    }, 1000);
}

// プラン選択（申込みチャット開始）
function selectPlan(planName) {
    openChat();
    
    // 申込みチャットの状態を初期化
    supportChatState = {
        currentTopic: 'application',
        userInfo: {},
        step: 0,
        selectedPlan: planName
    };
    
    // プラン選択の確認メッセージ
    setTimeout(() => {
        addBotMessage(`「<b>${planName}</b>」プランのお申込みですね。<br><br>それでは、申込み手続きを開始いたします。<br><br>${normalChatResponses[0].message}`);
    }, 1000);
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
function addBotMessage(message) {
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
    scrollToBottom();
}

// チャットエリアを最下部にスクロール
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ユーザー入力を処理（サポート用）
function processUserInput(input) {
    setTimeout(() => {
        processSupportChat(input);
    }, 1000);
}

// サポートチャット処理
function processSupportChat(input) {
    const inputLower = input.toLowerCase();
    
    // 申込みチャットの処理
    if (supportChatState.currentTopic === 'application') {
        processApplicationChat(input);
        return;
    }
    
    // ライフスタイル診断の処理
    if (lifestyleChatState.step >= 0) {
        processLifestyleChat(input);
        return;
    }
    
    // キーワードに基づいてトピックを判定
    if (inputLower.includes('契約') || inputLower.includes('申込') || inputLower.includes('新規') || inputLower.includes('解約')) {
        supportChatState.currentTopic = 'contract';
        supportChatState.step = 0;
        addBotMessage(supportResponses.contract[0].message);
    } else if (inputLower.includes('料金') || inputLower.includes('請求') || inputLower.includes('支払') || inputLower.includes('高い')) {
        supportChatState.currentTopic = 'billing';
        supportChatState.step = 0;
        addBotMessage(supportResponses.billing[0].message);
    } else if (inputLower.includes('プラン') || inputLower.includes('変更') || inputLower.includes('おすすめ')) {
        supportChatState.currentTopic = 'plan';
        supportChatState.step = 0;
        addBotMessage(supportResponses.plan[0].message);
    } else if (inputLower.includes('停電') || inputLower.includes('電気がつかない') || inputLower.includes('電気が使えない')) {
        addBotMessage('停電情報についてお答えいたします。<br><br>現在、お客様の地域での停電は報告されておりません。<br><br>もし電気がご使用になれない場合は、以下をご確認ください：<br>・ブレーカーが落ちていないか<br>・電気料金のお支払い状況<br><br>それでも解決しない場合は、緊急連絡先までお電話ください。<br><br>緊急時連絡先: 0120-986-777（24時間対応）');
    } else if (supportChatState.currentTopic && supportChatState.step >= 0) {
        // 既存のトピック内での応答処理
        const topic = supportChatState.currentTopic;
        const currentStep = supportChatState.step;
        
        if (supportResponses[topic] && supportResponses[topic][currentStep + 1]) {
            supportChatState.step++;
            addBotMessage(supportResponses[topic][supportChatState.step].message);
        } else {
            // 会話終了
            addBotMessage('他にご質問やご不明な点がございましたら、お気軽にお聞かせください。<br><br>詳しいご相談については、お電話でも承っております。<br><br>フリーダイヤル: 0120-986-302（平日9:00-18:00）');
        }
    } else {
        // 一般的な応答
        addBotMessage('申し訳ございません。もう一度詳しく教えていただけますか？<br><br>以下のようなご質問にお答えできます：<br><br>・電力契約について<br>・料金プランについて<br>・ご利用料金について<br>・停電情報について<br><br>または、お電話でのご相談も承っております。<br>フリーダイヤル: 0120-986-302（平日9:00-18:00）');
    }
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
    
    // 月のタイトルと期間を更新
    updateMonthDisplay(monthIndex);
}

// 月のタイトル表示を更新する関数
function updateMonthDisplay(monthIndex) {
    const monthTitleElement = document.querySelector('.month-title');
    const monthPeriodElement = document.querySelector('.month-period');
    
    // 月のデータ（index 0が8月、1が7月、2が6月）
    const monthsData = [
        { title: '2025年8月分', period: '7月25日～8月26日' },
        { title: '2025年7月分', period: '6月24日～7月24日' },
        { title: '2025年6月分', period: '5月25日～6月23日' }
    ];
    
    if (monthIndex >= 0 && monthIndex < monthsData.length) {
        if (monthTitleElement) {
            monthTitleElement.textContent = monthsData[monthIndex].title;
        }
        if (monthPeriodElement) {
            monthPeriodElement.textContent = monthsData[monthIndex].period;
        }
    }
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

    let currentMonthIndex = 0; // 0が8月分（最新）

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            // 前月ボタン：より古い月へ（index が増える）
            const monthlyData = document.querySelectorAll('.monthly-data');
            if (currentMonthIndex < monthlyData.length - 1) {
                currentMonthIndex++;
                showMonth(currentMonthIndex);
            }
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            // 翌月ボタン：より新しい月へ（index が減る）
            if (currentMonthIndex > 0) {
                currentMonthIndex--;
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

    // 詳細リンクのクリックイベント（ecoアプリでポイント確認、プラン変更について確認）
    const detailLinks = document.querySelectorAll('.detail-link');
    detailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // リンクのアニメーション
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // リンクテキストに応じて異なる処理を実行
            const linkText = this.textContent.trim();
            
            if (linkText === 'ecoアプリでポイント確認') {
                // ecoアプリのポイント確認画面に遷移
                window.location.href = 'eco-points.html';
            } else if (linkText === 'プラン変更について確認') {
                // プラン変更の詳細画面に遷移
                alert('プラン変更の詳細画面に移動します。\n\n夜間の電気使用量が多いお客様には「夜トクプラン」がおすすめです。\n\n現在の料金プランから月額約1,200円の節約が可能です。');
            } else {
                // その他の詳細リンク
                alert('詳細ページに移動します');
            }
        });
    });
});

// 申込みチャット処理
function processApplicationChat(input) {
    const currentStep = supportChatState.step;
    const response = normalChatResponses[currentStep];
    
    switch(currentStep) {
        case 0: // 名前入力
            supportChatState.userInfo.name = input;
            break;
        case 1: // 電話番号入力
            supportChatState.userInfo.phone = input;
            break;
        case 2: // 住所入力
            supportChatState.userInfo.address = input;
            break;
        case 3: // 契約開始日入力
            supportChatState.userInfo.startDate = input;
            break;
        case 4: // 確認
            if (input.toLowerCase().includes('はい') || input.toLowerCase().includes('yes')) {
                addBotMessage(normalChatResponses[5].message);
                supportChatState.step = -1; // 会話終了
                return;
            } else {
                addBotMessage("承知いたしました。何か変更したい項目はございますか？");
                return;
            }
    }
    
    // 次のステップに進む
    supportChatState.step = response.nextStep;
    let nextMessage = normalChatResponses[supportChatState.step]?.message || '';
    
    if (supportChatState.step === 4) { // 確認ステップ
        nextMessage = nextMessage.replace('{name}', supportChatState.userInfo.name)
                                 .replace('{phone}', supportChatState.userInfo.phone)
                                 .replace('{address}', supportChatState.userInfo.address)
                                 .replace('{plan}', supportChatState.selectedPlan)
                                 .replace('{startDate}', supportChatState.userInfo.startDate);
    }
    
    if (nextMessage) {
        addBotMessage(nextMessage);
    }
}

// ライフスタイル診断チャット処理
function processLifestyleChat(input) {
    const currentStep = lifestyleChatState.step;
    const response = lifestyleChatResponses[currentStep];
    
    switch(currentStep) {
        case 0: // 家族人数
            lifestyleChatState.lifestyleAnswers.familySize = input;
            break;
        case 1: // オール電化
            lifestyleChatState.lifestyleAnswers.allElectric = input.toLowerCase();
            break;
        case 2: // 使用時間帯
            lifestyleChatState.lifestyleAnswers.usageTime = input.toLowerCase();
            const recommendedPlan = recommendPlan(lifestyleChatState.lifestyleAnswers);
            
            // 診断結果メッセージを作成
            let resultMessage = response.message.replace('{plan}', recommendedPlan.name)
                                               .replace('{reason}', recommendedPlan.reason)
                                               .replace('{description}', recommendedPlan.description);
            addBotMessage(resultMessage);
            lifestyleChatState.step = response.nextStep;
            return;
        case 3: // 申込み確認
            if (input.toLowerCase().includes('はい') || input.toLowerCase().includes('yes')) {
                // 申込みチャットに切り替え
                supportChatState.currentTopic = 'application';
                supportChatState.step = 0;
                supportChatState.selectedPlan = recommendPlan(lifestyleChatState.lifestyleAnswers).name;
                addBotMessage(lifestyleChatResponses[4].message);
                return;
            } else {
                addBotMessage("承知いたしました。他にご質問がございましたら、お気軽にお聞きください。");
                lifestyleChatState.step = -1; // 診断終了
                return;
            }
    }
    
    // 次のステップに進む
    lifestyleChatState.step = response.nextStep;
    if (lifestyleChatResponses[lifestyleChatState.step]) {
        addBotMessage(lifestyleChatResponses[lifestyleChatState.step].message);
    }
}

// プラン推奨ロジック
function recommendPlan(answers) {
    const familySize = parseInt(answers.familySize) || 1;
    const isAllElectric = answers.allElectric.includes('はい');
    const isNightUsage = answers.usageTime.includes('夜間');
    
    if (isAllElectric && isNightUsage) {
        return {
            name: '電化でナイト・セレクト',
            reason: 'オール電化住宅で夜間の電気使用量が多いため',
            description: '夜間の電気料金が割安になり、オール電化住宅に最適なプランです。'
        };
    } else if (familySize >= 4) {
        return {
            name: 'スマートファミリープラン',
            reason: '4人以上のご家族で電気使用量が多いため',
            description: '2年契約でお得になる、ご家庭向けのプランです。'
        };
    } else if (isNightUsage) {
        return {
            name: '電化でナイト・セレクト',
            reason: '夜間の電気使用量が多いため',
            description: '夜間の電気料金が割安になるプランです。'
        };
    } else {
        return {
            name: '従量電灯B',
            reason: '一般的な電気使用パターンのため',
            description: '1年契約で、標準的な料金体系のプランです。'
        };
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
            alert('新規契約キャンペーンの詳細ページに移動します。\n\n【キャンペーン内容】\n・期間：2025年8月1日～8月31日\n・対象：新規契約のお客様\n・特典：初月料金50%OFF\n・条件：2年契約\n\nお申込みはお電話またはWebから承っております。\nフリーダイヤル: 0120-986-302');
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

