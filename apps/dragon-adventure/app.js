// Dragon Adventure - JSON-based Chapter System
(function() {
    'use strict';

    // Game State
    const state = {
        chapters: [],
        currentChapter: 0,
        log: [],
        items: []
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
    }

    function startGame() {
        state.currentChapter = 0;
        state.log = [];
        state.items = [];
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

        // Auto advance after short delay
        setTimeout(() => {
            advanceChapter();
        }, 1500);
    }

    function advanceChapter() {
        state.currentChapter++;

        if (state.currentChapter >= state.chapters.length) {
            endGame();
        } else {
            renderChapter();
        }
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