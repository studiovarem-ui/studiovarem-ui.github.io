export const gameState = {
    player: { hp: 100, attack: 20 },
    monster: { name: "슬라임", hp: 50, image: "👾" },
    level: 1
};

// 저학년용 사칙연산 (덧셈, 뺄셈 위주)
export function generateQuestion() {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    return {
        question: `${num1} + ${num2} = ?`,
        answer: num1 + num2
    };
}
