// Dragon Adventure - JSON-based Chapter System with Summary Cards
(function() {
    'use strict';

    // Game State
    const state = {
        chapters: [],
        currentChapter: 0,
        log: [],
        items: [],
        chapterChoices: []  // Choices made in current chapter
    };

    // Chapter summaries (kid-friendly, 1 line each)
    const chapterSummaries = {
        1: "You explored the village and found a secret scroll!",
        2: "You bravely walked through the magical forest!",
        3: "You discovered the sparkling crystal caves!",
        4: "You climbed the huge dragon mountain!",
        5: "You woke up the ancient dragon and became friends!"
    };

    // Next chapter teasers with questions
    const nextChapterTeasers = {
        1: "A spooky forest awaits... Will you be brave?",
        2: "Shiny caves are ahead... What will you find?",
        3: "The dragon's mountain is near... Are you ready to climb?",
        4: "The dragon is sleeping... How will you wake it?"
    };

    // Item emoji mapping
    const itemEmojis = {
        "Ancient Scroll": "📜",
        "Forest Compass": "🧭",
        "Crystal Key": "🔑",
        "Dragon Scale Amulet": "🧿",
        "Dragon's Blessing": "🌟"
    };

    // DOM Elements
    const elements = {};

    // Initialize
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
        // Summary modal elements
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
            elements.startBtn.textContent = 'Error Loading Game';
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
        addLog('🐉 Adventure begins!', 'chapter');
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

        // Reset chapter choices
        state.chapterChoices = [];

        // Update header
        elements.chapterNumber.textContent = `Chapter ${chapter.id}`;
        elements.chapterTitle.textContent = chapter.title;

        // Update content
        elements.missionText.textContent = chapter.mission;
        elements.introText.textContent = chapter.intro;

        // Render choices
        renderChoices(chapter.choices);

        // Reset item button
        elements.getItemBtn.disabled = false;
        elements.getItemBtn.textContent = `🎁 Get Key Item: ${chapter.keyItem}`;
        elements.itemStatus.textContent = '';

        // Log chapter start
        if (state.currentChapter > 0) {
            addLog(`📖 Entered ${chapter.title}`, 'chapter');
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
        // Store choice for summary
        state.chapterChoices.push(choice);
        addLog(`➡️ You chose: "${choice}"`, 'choice');
    }

    function getKeyItem() {
        const chapter = state.chapters[state.currentChapter];
        const item = chapter.keyItem;

        state.items.push(item);
        addLog(`✨ Obtained: ${item}`, 'item');

        elements.getItemBtn.disabled = true;
        elements.getItemBtn.textContent = '✅ Item Obtained!';
        elements.itemStatus.textContent = `You got the ${item}!`;

        // Show summary card after short delay
        setTimeout(() => {
            showSummaryCard();
        }, 1000);
    }

    function showSummaryCard() {
        const chapter = state.chapters[state.currentChapter];
        const chapterId = chapter.id;
        const isLastChapter = state.currentChapter >= state.chapters.length - 1;

        // 1. Chapter summary (1 line)
        elements.summaryText.textContent = `📖 ${chapterSummaries[chapterId]}`;

        // 2. Top 2 choices (most recent)
        const recentChoices = state.chapterChoices.slice(-2);
        if (recentChoices.length > 0) {
            const choicesText = recentChoices.map((c, i) => `${i + 1}. ${c}`).join(' / ');
            elements.summaryChoices.textContent = `🎯 Your choices: ${choicesText}`;
        } else {
            elements.summaryChoices.textContent = '🎯 No choices made yet!';
        }

        // 3. Key item with emoji
        const emoji = itemEmojis[chapter.keyItem] || '🎁';
        elements.summaryItem.textContent = `${emoji} Got: ${chapter.keyItem}!`;

        // 4. Next chapter teaser or ending
        if (isLastChapter) {
            elements.summaryNext.textContent = '🎉 You completed the adventure!';
            elements.nextChapterBtn.textContent = 'See Ending 🌟';
        } else {
            elements.summaryNext.textContent = `🔮 ${nextChapterTeasers[chapterId]}`;
            elements.nextChapterBtn.textContent = 'Next Chapter ➡️';
        }

        // Show modal
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
        
        // Remove the item we just got
        if (state.items.length > 0) {
            state.items.pop();
        }

        // Clear chapter choices
        state.chapterChoices = [];

        // Add replay log
        addLog('🔄 Replaying chapter...', 'chapter');

        // Re-render current chapter
        renderChapter();
    }

    function endGame() {
        addLog('🎉 Adventure Complete!', 'chapter');
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