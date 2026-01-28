// 용 모험 - 한국어 10살용 요약 카드 시스템
(function() {
    'use strict';

    // 게임 상태
    const state = {
        chapters: [],
        currentChapter: 0,
        log: [],
        items: [],
        chapterChoices: []
    };

    // 이번 장 요약 (10살용 쉽고 짧은 한국어)
    const chapterSummaries = {
        1: "마을에서 단서를 찾았어!",
        2: "신비한 숲을 용감하게 통과했어!",
        3: "반짝이는 수정 동굴을 탐험했어!",
        4: "높은 용의 산을 올랐어!",
        5: "용을 깨우고 친구가 되었어!"
    };

    // 다음 장 예고 + 질문 (10살용)
    const nextChapterTeasers = {
        1: "속삭이는 숲으로 가볼까?",
        2: "반짝이는 동굴에 뭐가 있을까?",
        3: "높은 산을 올라갈 수 있을까?",
        4: "자고 있는 용을 어떻게 깨울까?"
    };

    // 아이템 한국어 이름 + 이모지
    const itemsKorean = {
        "Ancient Scroll": { name: "고대의 두루마리", emoji: "📜" },
        "Forest Compass": { name: "숲의 나침반", emoji: "🧭" },
        "Crystal Key": { name: "수정 열쇠", emoji: "🔑" },
        "Dragon Scale Amulet": { name: "용의 비늘 목걸이", emoji: "🧿" },
        "Dragon's Blessing": { name: "용의 축복", emoji: "🌟" }
    };

    // 선택지 한국어 변환
    const choicesKorean = {
        "Talk to the village elder": "마을 장로에게 물어봤어",
        "Visit the old library": "오래된 도서관에 갔어",
        "Explore the marketplace": "시장을 둘러봤어",
        "Wander into the forest edge": "숲 근처를 걸어봤어",
        "Follow the glowing mushrooms": "반짝이는 버섯을 따라갔어",
        "Listen to where the wind blows strongest": "바람 소리를 들었어",
        "Ask a friendly forest spirit for guidance": "숲의 요정에게 길을 물어봤어",
        "Climb a tall tree to see above the canopy": "높은 나무에 올라갔어",
        "Follow the warmest air current": "따뜻한 바람을 따라갔어",
        "Examine the crystal patterns on the walls": "벽의 수정 무늬를 살펴봤어",
        "Search for ancient markings or symbols": "오래된 표시를 찾아봤어",
        "Listen for echoes from deeper within": "동굴 속 메아리를 들었어",
        "Take the main stone stairway": "돌 계단으로 올라갔어",
        "Find an alternative climbing route": "다른 길을 찾아봤어",
        "Search for a hidden tunnel entrance": "숨겨진 터널을 찾았어",
        "Call out to announce your peaceful intentions": "큰 소리로 인사했어",
        "Approach slowly and bow respectfully": "천천히 다가가서 절했어",
        "Sing an ancient dragon lullaby in reverse": "용의 자장가를 거꾸로 불렀어",
        "Place the amulet near the dragon's heart": "목걸이를 용의 심장 근처에 놓았어",
        "Speak words of friendship and peace": "친구가 되자고 말했어"
    };

    // DOM 요소
    const elements = {};

    // 초기화
    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        cacheElements();
        await loadChapters();
        bindEvents();
    }

    function cacheElements() {
        elements.startScreen = document.getElementById('startScreen');
        elements.gameScreen = document.getElementById('gameScreen');
        elements.endScreen = document.getElementById('endScreen');
        elements.startBtn = document.getElementById('startBtn');
        elements.restartBtn = document.getElementById('restartBtn');
        elements.chapterNumber = document.getElementById('chapterNumber');
        elements.chapterTitle = document.getElementById('chapterTitle');
        elements.missionText = document.getElementById('missionText');
        elements.introText = document.getElementById('introText');
        elements.choicesContainer = document.getElementById('choicesContainer');
        elements.getItemBtn = document.getElementById('getItemBtn');
        elements.itemStatus = document.getElementById('itemStatus');
        elements.logContainer = document.getElementById('logContainer');
        // 요약 카드 요소
        elements.summaryModal = document.getElementById('summaryModal');
        elements.summaryText = document.getElementById('summaryText');
        elements.summaryChoices = document.getElementById('summaryChoices');
        elements.summaryItem = document.getElementById('summaryItem');
        elements.summaryNext = document.getElementById('summaryNext');
        elements.nextChapterBtn = document.getElementById('nextChapterBtn');
        elements.replayChapterBtn = document.getElementById('replayChapterBtn');
    }

    async function loadChapters() {
        try {
            const response = await fetch('../../data/chapters.json');
            if (!response.ok) throw new Error('Failed to load chapters');
            const data = await response.json();
            state.chapters = data.chapters;
            console.log('Chapters loaded:', state.chapters.length);
        } catch (error) {
            console.error('Error loading chapters:', error);
            elements.startBtn.textContent = '로딩 실패';
            elements.startBtn.disabled = true;
        }
    }

    function bindEvents() {
        elements.startBtn.addEventListener('click', startGame);
        elements.restartBtn.addEventListener('click', restartGame);
        elements.getItemBtn.addEventListener('click', getKeyItem);
        elements.nextChapterBtn.addEventListener('click', goToNextChapter);
        elements.replayChapterBtn.addEventListener('click', replayChapter);
    }

    function startGame() {
        state.currentChapter = 0;
        state.log = [];
        state.items = [];
        state.chapterChoices = [];
        showScreen('game');
        addLog('🐉 모험이 시작됐어!', 'chapter');
        renderChapter();
    }

    function restartGame() {
        startGame();
    }

    function showScreen(screen) {
        elements.startScreen.classList.add('hidden');
        elements.gameScreen.classList.add('hidden');
        elements.endScreen.classList.add('hidden');

        if (screen === 'start') elements.startScreen.classList.remove('hidden');
        if (screen === 'game') elements.gameScreen.classList.remove('hidden');
        if (screen === 'end') elements.endScreen.classList.remove('hidden');
    }

    function renderChapter() {
        const chapter = state.chapters[state.currentChapter];
        if (!chapter) return;

        // 선택 초기화
        state.chapterChoices = [];

        // 헤더
        elements.chapterNumber.textContent = `제${chapter.id}장`;
        elements.chapterTitle.textContent = chapter.title;

        // 내용
        elements.missionText.textContent = chapter.mission;
        elements.introText.textContent = chapter.intro;

        // 선택지
        renderChoices(chapter.choices);

        // 아이템 버튼
        const itemInfo = itemsKorean[chapter.keyItem] || { name: chapter.keyItem, emoji: '🎁' };
        elements.getItemBtn.disabled = false;
        elements.getItemBtn.textContent = `🎁 아이템 얻기: ${itemInfo.name}`;
        elements.itemStatus.textContent = '';

        // 로그
        if (state.currentChapter > 0) {
            addLog(`📖 ${chapter.title}에 도착!`, 'chapter');
        }
    }

    function renderChoices(choices) {
        elements.choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-choice';
            btn.textContent = `${index + 1}. ${choice}`;
            btn.addEventListener('click', () => makeChoice(choice));
            elements.choicesContainer.appendChild(btn);
        });
    }

    function makeChoice(choice) {
        state.chapterChoices.push(choice);
        const koreanChoice = choicesKorean[choice] || choice;
        addLog(`➡️ ${koreanChoice}`, 'choice');
    }

    function getKeyItem() {
        const chapter = state.chapters[state.currentChapter];
        const item = chapter.keyItem;
        const itemInfo = itemsKorean[item] || { name: item, emoji: '🎁' };

        state.items.push(item);
        addLog(`✨ ${itemInfo.emoji} ${itemInfo.name} 획득!`, 'item');

        elements.getItemBtn.disabled = true;
        elements.getItemBtn.textContent = '✅ 아이템 획득!';
        elements.itemStatus.textContent = `${itemInfo.name}을(를) 얻었어!`;

        setTimeout(() => {
            showSummaryCard();
        }, 1000);
    }

    function showSummaryCard() {
        const chapter = state.chapters[state.currentChapter];
        const chapterId = chapter.id;
        const isLastChapter = state.currentChapter >= state.chapters.length - 1;
        const itemInfo = itemsKorean[chapter.keyItem] || { name: chapter.keyItem, emoji: '🎁' };

        // 1. 이번 장 요약
        elements.summaryText.textContent = chapterSummaries[chapterId];

        // 2. 내가 한 선택 TOP 2
        const recentChoices = state.chapterChoices.slice(-2);
        if (recentChoices.length > 0) {
            const choicesList = recentChoices
                .map(c => `- ${choicesKorean[c] || c}`)
                .join('\n');
            elements.summaryChoices.innerHTML = choicesList.replace(/\n/g, '<br>');
        } else {
            elements.summaryChoices.textContent = '아직 선택을 안 했어!';
        }

        // 3. 얻은 아이템
        elements.summaryItem.textContent = `${itemInfo.emoji} ${itemInfo.name}`;

        // 4. 다음 장 예고
        if (isLastChapter) {
            elements.summaryNext.textContent = '모험이 끝났어! 정말 대단해!';
            elements.nextChapterBtn.textContent = '엔딩 보기 🌟';
        } else {
            elements.summaryNext.textContent = nextChapterTeasers[chapterId];
            elements.nextChapterBtn.textContent = '다음 장으로 ➡️';
        }

        elements.summaryModal.classList.remove('hidden');
    }

    function hideSummaryCard() {
        elements.summaryModal.classList.add('hidden');
    }

    function goToNextChapter() {
        hideSummaryCard();
        state.currentChapter++;

        if (state.currentChapter >= state.chapters.length) {
            endGame();
        } else {
            renderChapter();
        }
    }

    function replayChapter() {
        hideSummaryCard();
        
        if (state.items.length > 0) {
            state.items.pop();
        }
        state.chapterChoices = [];
        addLog('🔄 다시 해보기!', 'chapter');
        renderChapter();
    }

    function endGame() {
        addLog('🎉 모험 완료!', 'chapter');
        showScreen('end');
    }

    function addLog(message, type = '') {
        state.log.push({ message, type, time: new Date() });
        renderLog();
    }

    function renderLog() {
        elements.logContainer.innerHTML = state.log
            .slice()
            .reverse()
            .map(entry => `<div class="log-entry ${entry.type}">${entry.message}</div>`)
            .join('');
    }
})();