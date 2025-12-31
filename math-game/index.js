import { gameState, generateQuestion } from './data.js';

let currentQuestion = generateQuestion();

function checkAnswer(userAnswer) {
    if (parseInt(userAnswer) === currentQuestion.answer) {
        // 맞았을 때: 몬스터 공격
        gameState.monster.hp -= gameState.player.attack;
        alert("정답입니다! 공격!");
    } else {
        // 틀렸을 때: 주인공 에너지 감소
        gameState.player.hp -= 10;
        alert("틀렸어요! 에너지가 깎였습니다.");
    }
    updateUI();
    nextTurn();
}

function updateUI() {
    document.getElementById('player-hp').innerText = `HP: ${gameState.player.hp}`;
    document.getElementById('monster-hp').innerText = `HP: ${gameState.monster.hp}`;
    document.getElementById('question-box').innerText = currentQuestion.question;
}
