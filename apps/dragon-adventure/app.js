// Dragon Adventure - Chapter 1
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const storyContent = document.getElementById('storyContent');

    const chapter1Text = `
        <h2>Chapter 1: The Awakening</h2>
        <p>In a land shrouded by ancient mists, where mountains pierce the clouds and rivers run with starlight, a young dragon stirs from a thousand-year slumber.</p>
        <p>You are that dragon. Your scales shimmer with colors yet unnamed, and your eyes hold the wisdom of ages past.</p>
        <p>The world has changed while you slept. New kingdoms have risen, old alliances have crumbled, and a darkness creeps across the land.</p>
        <p><em>Your adventure begins now...</em></p>
    `;

    startBtn.addEventListener('click', function() {
        storyContent.innerHTML = chapter1Text;
        storyContent.classList.add('visible');
        startBtn.textContent = 'Chapter 1 Started!';
        startBtn.disabled = true;
        startBtn.style.opacity = '0.7';
    });
});