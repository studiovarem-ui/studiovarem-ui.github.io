// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const area = document.getElementById('gameArea');
  canvas.width = area.clientWidth;
  canvas.height = area.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Pixel Art Sprites (all characters in consistent dot style)
const SPRITES = {
  // Birds
  sparrow: [
    '....BBBB....',
    '...BYYYBB...',
    '..BYYYYYWB..',
    '..BYFFYYWB..',
    '.BYYYYYYYYB.',
    '.BOYYYYYYY..',
    '..BYYYYYYY..',
    '...BYYYYB...',
    '....BYYB....',
    '....B..B....'
  ],
  pigeon: [
    '....GGGG....',
    '...GGGGGG...',
    '..GGFFGGWB..',
    '..GGFFGGWB..',
    '.GPPPPPPPG..',
    '.GOGGGGGG...',
    '..GGGGGGGG..',
    '...GGGGGG...',
    '....RRRR....',
    '....R..R....'
  ],
  crow: [
    '....KKKK....',
    '...KKKKKK...',
    '..KKFFKKWB..',
    '..KKFFKKWB..',
    '.KKKKKKKKKK.',
    '.KOKKKKKK...',
    '..KKKKKKKK..',
    '...KKKKKK...',
    '....KKKK....',
    '....K..K....'
  ],
  eagle: [
    '...DDDDDD...',
    '..DDDDDDDD..',
    '.DDFFDDDDWB.',
    '.DDFFDDDDWB.',
    'DDDDDDDDDDDD',
    'DODDDDDDDD..',
    '.DDDDDDDDDD.',
    '..DDDDDDDD..',
    '...OYYYOO...',
    '...O....O...'
  ],
  archaeopteryx: [
    '..TTTTTTTT..',
    '.TTTTTTTTTT.',
    '.TTFFTTTWWB.',
    '.TTFFTTTTTB.',
    'TTTTTTTTTTTT',
    'TOTTTTTTT...',
    '.TTTTTTTTTT.',
    '..TTGGGGTT..',
    '...GGGGGG...',
    '...G....G...'
  ],
  phoenix: [
    '..RROORROO..',
    '.RROOOOOOORR',
    '.OOFFOOOWWB.',
    '.OOFFOOOYYB.',
    'OOOOOOOOOOOO',
    'YOYYYYYYYY..',
    '.YYYYYYYYYY.',
    '..YYYYYYYY..',
    '...RRRRRR...',
    '...R....R...'
  ],
  // Humans (pastel, cute style)
  human_normal: [
    '...PPPP...',
    '..PPPPPP..',
    '..P.PP.P..',
    '..PPPPPP..',
    '...PPPP...',
    '..LLLLLL..',
    '.LLLLLLLL.',
    '..LLLLLL..',
    '...L..L...',
    '...B..B...'
  ],
  human_child: [
    '...YYYY...',
    '..YYYYYY..',
    '..Y.YY.Y..',
    '..YYYYYY..',
    '...YYYY...',
    '..CCCCCC..',
    '..CCCCCC..',
    '...CCCC...',
    '...C..C...',
    '...B..B...'
  ],
  human_fast: [
    '...GGGG...',
    '..GGGGGG..',
    '..G.GG.G..',
    '..GGGGGG..',
    '...GGGG...',
    '..MMMMMM..',
    '.MMMMMMMM.',
    '..MMMMMM..',
    '..M....M..',
    '..B....B..'
  ],
  // Boss
  boss_cleaner: [
    '....BBBB....',
    '...BBBBBB...',
    '..BB.BB.BB..',
    '..BBBBBBBB..',
    '...BBBBBB...',
    '..OOOOOOOO..',
    '.OOOOOOOOOO.',
    '.OOOOOOOOOO.',
    '..OO....OO..',
    '..BB....BB..',
    '....LLLL....',
    '....LLLL....'
  ],
  // Poop
  poop: [
    '..CC..',
    '.CCCC.',
    '.CBCC.',
    'CCCCCC',
    'CCCCCC',
    '.CCCC.'
  ],
  // Projectile
  projectile: [
    '.RR.',
    'RRRR',
    'RRRR',
    '.RR.'
  ]
};

const COLORS = {
  'B': '#5D4E37', // Brown
  'Y': '#FFE66D', // Yellow
  'W': '#FFFFFF', // White
  'F': '#2D2D2D', // Black (eyes)
  'O': '#FF8C42', // Orange
  'G': '#95A5A6', // Gray
  'P': '#DDA0DD', // Pink/Purple (pigeon)
  'R': '#FF6B6B', // Red
  'K': '#2D3436', // Dark (crow)
  'D': '#8B4513', // Dark brown (eagle)
  'T': '#20B2AA', // Teal (archaeopteryx)
  'L': '#87CEEB', // Light blue
  'C': '#C9A86C', // Poop color
  'M': '#98D4BB', // Mint
  '.': null
};

const spriteCache = {};

function createSprite(data, scale = 3) {
  const key = data.join('') + scale;
  if (spriteCache[key]) return spriteCache[key];
  
  const h = data.length, w = data[0].length;
  const c = document.createElement('canvas');
  c.width = w * scale;
  c.height = h * scale;
  const x = c.getContext('2d');
  
  for (let y = 0; y < h; y++) {
    for (let i = 0; i < w; i++) {
      const ch = data[y][i];
      if (COLORS[ch]) {
        x.fillStyle = COLORS[ch];
        x.fillRect(i * scale, y * scale, scale, scale);
      }
    }
  }
  spriteCache[key] = c;
  return c;
}

// Game Data
const BIRDS = {
  sparrow: { name: '참새', sprite: 'sparrow', speed: 5, damage: 1, poopSpeed: 6, poopSize: 1, price: 0, level: 1 },
  pigeon: { name: '비둘기', sprite: 'pigeon', speed: 5.5, damage: 1.5, poopSpeed: 7, poopSize: 1.1, price: 5, level: 2 },
  crow: { name: '까마귀', sprite: 'crow', speed: 6, damage: 2, poopSpeed: 8, poopSize: 1.2, price: 10, level: 3 },
  eagle: { name: '독수리', sprite: 'eagle', speed: 7, damage: 3, poopSpeed: 9, poopSize: 1.3, price: 20, level: 4 },
  archaeopteryx: { name: '시조새', sprite: 'archaeopteryx', speed: 8, damage: 4, poopSpeed: 10, poopSize: 1.5, price: 35, level: 5 },
  phoenix: { name: '피닉스', sprite: 'phoenix', speed: 10, damage: 6, poopSpeed: 12, poopSize: 2, price: 50, level: 6 }
};

const ITEMS = {
  bread: { name: '빵', icon: '🍞', price: 30, desc: 'HP +1', effect: 'heal' },
  chili: { name: '고추', icon: '🌶️', price: 50, desc: '무한똥', effect: 'unlimited' },
  shield: { name: '방패', icon: '🛡️', price: 60, desc: '보호', effect: 'shield' }
};

const UPGRADES = {
  energy: { name: '에너지', icon: '⚡', price: 50, desc: '+20%', maxLevel: 5, stat: 'maxEnergy', bonus: 20 },
  speed: { name: '스피드', icon: '💨', price: 60, desc: '+10%', maxLevel: 5, stat: 'speedBonus', bonus: 0.1 },
  poopSpeed: { name: '똥스피드', icon: '💩', price: 70, desc: '+15%', maxLevel: 5, stat: 'poopSpeedBonus', bonus: 0.15 },
  poopDamage: { name: '똥데미지', icon: '💥', price: 80, desc: '+20%', maxLevel: 5, stat: 'damageBonus', bonus: 0.2 },
  poopSize: { name: '똥크기', icon: '🟤', price: 90, desc: '+15%', maxLevel: 5, stat: 'sizeBonus', bonus: 0.15 }
};

const STAGES = [
  { id: 1, name: '공원', icon: '🌳', targetScore: 100, duration: 45, spawnRate: 2500 },
  { id: 2, name: '도시', icon: '🏙️', targetScore: 200, duration: 50, spawnRate: 2200 },
  { id: 3, name: '해변', icon: '🏖️', targetScore: 300, duration: 55, spawnRate: 2000 },
  { id: 4, name: '운동장', icon: '🏟️', targetScore: 400, duration: 60, spawnRate: 1800, boss: true },
  { id: 5, name: '성', icon: '🏰', targetScore: 500, duration: 65, spawnRate: 1600 },
  { id: 6, name: '화산', icon: '🌋', targetScore: 600, duration: 70, spawnRate: 1400, boss: true }
];

// Game State
let gameState = {
  screen: 'menu',
  currentStage: 1,
  score: 0,
  feathers: 100,
  gold: 10,
  stones: 3,
  health: 3,
  maxHealth: 3,
  energy: 100,
  maxEnergy: 100,
  combo: 0,
  maxCombo: 0,
  hits: 0,
  shots: 0,
  stageFeathers: 0,
  stageGold: 0,
  
  inventory: { bread: 3, chili: 1, shield: 1 },
  quickSlots: ['bread', 'chili', 'shield'],
  
  effects: { unlimited: 0, shield: false, invincible: 0 },
  
  upgrades: { energy: 0, speed: 0, poopSpeed: 0, poopDamage: 0, poopSize: 0 },
  
  currentBird: 'sparrow',
  unlockedBirds: ['sparrow'],
  
  stageStars: {},
  bossSpawned: false,
  bossDefeated: false
};

let bird = { x: 0, y: 0, width: 36, height: 30 };
let poops = [], humans = [], projectiles = [], particles = [];
let boss = null;
let lastPoopTime = 0, lastSpawnTime = 0, gameStartTime = 0;
let animationId = null, previousScreen = 'menu';

// Joystick
let joystick = { active: false, startX: 0, startY: 0, moveX: 0, moveY: 0 };
let poopPressed = false;

// Input handlers
const joystickArea = document.getElementById('joystickArea');
const joystickKnob = document.getElementById('joystickKnob');

function handleJoystickStart(e) {
  e.preventDefault();
  const touch = e.touches ? e.touches[0] : e;
  const rect = joystickArea.getBoundingClientRect();
  joystick.active = true;
  joystick.startX = rect.left + rect.width / 2;
  joystick.startY = rect.top + rect.height / 2;
}

function handleJoystickMove(e) {
  if (!joystick.active) return;
  e.preventDefault();
  const touch = e.touches ? e.touches[0] : e;
  const dx = touch.clientX - joystick.startX;
  const dy = touch.clientY - joystick.startY;
  const maxDist = 40;
  const dist = Math.min(Math.sqrt(dx*dx + dy*dy), maxDist);
  const angle = Math.atan2(dy, dx);
  
  joystick.moveX = (dist / maxDist) * Math.cos(angle);
  joystick.moveY = (dist / maxDist) * Math.sin(angle);
  
  const knobX = joystick.moveX * maxDist;
  const knobY = joystick.moveY * maxDist;
  joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
}

function handleJoystickEnd() {
  joystick.active = false;
  joystick.moveX = 0;
  joystick.moveY = 0;
  joystickKnob.style.transform = 'translate(-50%, -50%)';
}

joystickArea.addEventListener('touchstart', handleJoystickStart, { passive: false });
joystickArea.addEventListener('touchmove', handleJoystickMove, { passive: false });
joystickArea.addEventListener('touchend', handleJoystickEnd);
joystickArea.addEventListener('touchcancel', handleJoystickEnd);

const poopButton = document.getElementById('poopButton');
poopButton.addEventListener('touchstart', e => { e.preventDefault(); poopPressed = true; }, { passive: false });
poopButton.addEventListener('touchend', () => poopPressed = false);
poopButton.addEventListener('touchcancel', () => poopPressed = false);

document.querySelectorAll('.item-btn').forEach(btn => {
  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    useQuickSlot(parseInt(btn.dataset.slot));
  }, { passive: false });
});

// UI Functions
function updateUI() {
  document.getElementById('energyFill').style.width = (gameState.energy / gameState.maxEnergy * 100) + '%';
  document.getElementById('poopGaugeFill').style.height = (gameState.energy / gameState.maxEnergy * 100) + '%';
  document.getElementById('featherCount').textContent = gameState.feathers + gameState.stageFeathers;
  document.getElementById('goldCount').textContent = gameState.gold + gameState.stageGold;
  document.getElementById('stoneCount').textContent = gameState.stones;
  document.getElementById('levelText').textContent = 'Lv.' + BIRDS[gameState.currentBird].level;
  
  // Combo display
  const comboEl = document.getElementById('comboDisplay');
  if (gameState.combo > 1) {
    comboEl.style.display = 'block';
    comboEl.textContent = gameState.combo + ' COMBO';
  } else {
    comboEl.style.display = 'none';
  }
  
  updateItemButtons();
}

function updateItemButtons() {
  document.querySelectorAll('.item-btn').forEach((btn, i) => {
    const k = gameState.quickSlots[i];
    if (k && ITEMS[k]) {
      btn.querySelector('.icon').textContent = ITEMS[k].icon;
      btn.querySelector('.count').textContent = gameState.inventory[k] || 0;
    }
  });
}

function showNotification(text) {
  const n = document.getElementById('notification');
  n.textContent = text;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 2000);
}

// Screen management
function hideAllOverlays() {
  ['mainMenu', 'stageSelect', 'shopOverlay', 'pauseOverlay', 'clearOverlay', 'gameoverOverlay'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
}

function showMainMenu() {
  gameState.screen = 'menu';
  hideAllOverlays();
  document.getElementById('mainMenu').classList.add('active');
  if (animationId) cancelAnimationFrame(animationId);
  drawMenuBird();
}

function showStageSelect() {
  gameState.screen = 'stageSelect';
  hideAllOverlays();
  document.getElementById('stageSelect').classList.add('active');
  renderStageGrid();
}

function renderStageGrid() {
  const grid = document.getElementById('stageGrid');
  grid.innerHTML = '';
  
  STAGES.forEach((stage, i) => {
    const unlocked = i === 0 || gameState.stageStars[i] > 0;
    const stars = gameState.stageStars[stage.id] || 0;
    
    const btn = document.createElement('div');
    btn.className = 'stage-btn' + (unlocked ? '' : ' locked');
    btn.innerHTML = `
      <div class="stage-btn-icon">${stage.icon}</div>
      <div class="stage-btn-name">${stage.name}</div>
      <div class="stage-btn-stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
      ${!unlocked ? '<div style="font-size:20px">🔒</div>' : ''}
    `;
    if (unlocked) {
      btn.onclick = () => startStage(stage.id);
    }
    grid.appendChild(btn);
  });
}

function continueGame() {
  showStageSelect();
}

function togglePause() {
  if (gameState.screen === 'playing') pauseGame();
  else if (gameState.screen === 'paused') resumeGame();
}

function pauseGame() {
  gameState.screen = 'paused';
  document.getElementById('pauseOverlay').classList.add('active');
}

function resumeGame() {
  gameState.screen = 'playing';
  document.getElementById('pauseOverlay').classList.remove('active');
  gameLoop();
}

function quitToMenu() {
  if (animationId) cancelAnimationFrame(animationId);
  hideAllOverlays();
  showStageSelect();
}

// Shop
function openShop() {
  previousScreen = gameState.screen;
  gameState.screen = 'shop';
  hideAllOverlays();
  document.getElementById('shopOverlay').classList.add('active');
  updateShopDisplay();
  switchShopTab(document.querySelector('.shop-tab'), 'items');
}

function openShopFromPause() {
  previousScreen = 'paused';
  document.getElementById('pauseOverlay').classList.remove('active');
  openShop();
}

function closeShop() {
  document.getElementById('shopOverlay').classList.remove('active');
  if (previousScreen === 'paused') {
    gameState.screen = 'paused';
    document.getElementById('pauseOverlay').classList.add('active');
  } else {
    showStageSelect();
  }
}

function updateShopDisplay() {
  document.getElementById('shopFeathers').textContent = gameState.feathers;
  document.getElementById('shopGold').textContent = gameState.gold;
  document.getElementById('shopStones').textContent = gameState.stones;
}

function switchShopTab(el, tab) {
  document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  
  const container = document.getElementById('shopItems');
  container.innerHTML = '';
  
  if (tab === 'items') {
    Object.entries(ITEMS).forEach(([k, item]) => {
      const owned = gameState.inventory[k] || 0;
      const div = document.createElement('div');
      div.className = 'shop-item';
      div.innerHTML = `
        <div class="shop-item-icon">${item.icon}</div>
        <div class="shop-item-name">${item.name}</div>
        <div class="shop-item-price">🪶${item.price}</div>
        <div style="font-size:8px;color:#666">보유:${owned}</div>
      `;
      div.onclick = () => buyItem(k);
      container.appendChild(div);
    });
  } else if (tab === 'upgrades') {
    Object.entries(UPGRADES).forEach(([k, up]) => {
      const lv = gameState.upgrades[k];
      const maxed = lv >= up.maxLevel;
      const div = document.createElement('div');
      div.className = 'shop-item' + (maxed ? ' owned' : '');
      div.innerHTML = `
        <div class="shop-item-icon">${up.icon}</div>
        <div class="shop-item-name">${up.name}</div>
        <div class="shop-item-price">${maxed ? 'MAX' : '✨' + up.price}</div>
        <div style="font-size:8px;color:#666">Lv.${lv}/${up.maxLevel}</div>
      `;
      if (!maxed) div.onclick = () => buyUpgrade(k);
      container.appendChild(div);
    });
  } else if (tab === 'evolution') {
    Object.entries(BIRDS).forEach(([k, b]) => {
      const owned = gameState.unlockedBirds.includes(k);
      const selected = gameState.currentBird === k;
      const div = document.createElement('div');
      div.className = 'shop-item' + (selected ? ' selected' : '') + (owned && !selected ? '' : '');
      div.innerHTML = `
        <canvas class="bird-canvas" width="36" height="30" data-bird="${k}"></canvas>
        <div class="shop-item-name">${b.name}</div>
        <div class="shop-item-price">${owned ? (selected ? '✔' : '선택') : '💎' + b.price}</div>
      `;
      div.onclick = () => {
        if (owned) {
          gameState.currentBird = k;
          switchShopTab(el, 'evolution');
          showNotification(b.name + ' 선택!');
        } else {
          buyBird(k);
        }
      };
      container.appendChild(div);
      
      // Draw bird sprite
      setTimeout(() => {
        const canv = div.querySelector('.bird-canvas');
        if (canv) {
          const sprite = createSprite(SPRITES[b.sprite], 3);
          canv.getContext('2d').drawImage(sprite, 0, 0, 36, 30);
        }
      }, 0);
    });
  }
}

function buyItem(k) {
  const item = ITEMS[k];
  if (gameState.feathers >= item.price) {
    gameState.feathers -= item.price;
    gameState.inventory[k] = (gameState.inventory[k] || 0) + 1;
    updateShopDisplay();
    switchShopTab(document.querySelector('.shop-tab.active'), 'items');
    showNotification(item.name + ' 구매!');
  } else {
    showNotification('깃털 부족!');
  }
}

function buyUpgrade(k) {
  const up = UPGRADES[k];
  if (gameState.gold >= up.price && gameState.upgrades[k] < up.maxLevel) {
    gameState.gold -= up.price;
    gameState.upgrades[k]++;
    if (k === 'energy') gameState.maxEnergy = 100 + gameState.upgrades[k] * up.bonus;
    updateShopDisplay();
    switchShopTab(document.querySelector('.shop-tab.active'), 'upgrades');
    showNotification(up.name + ' UP!');
  } else {
    showNotification('보석 부족!');
  }
}

function buyBird(k) {
  const b = BIRDS[k];
  if (gameState.stones >= b.price) {
    gameState.stones -= b.price;
    gameState.unlockedBirds.push(k);
    gameState.currentBird = k;
    updateShopDisplay();
    switchShopTab(document.querySelector('.shop-tab.active'), 'evolution');
    showNotification(b.name + ' 해금!');
  } else {
    showNotification('진화석 부족!');
  }
}

function useQuickSlot(i) {
  const k = gameState.quickSlots[i];
  if (!k || !gameState.inventory[k]) return;
  
  gameState.inventory[k]--;
  updateItemButtons();
  
  switch (ITEMS[k].effect) {
    case 'heal':
      gameState.health = Math.min(gameState.health + 1, gameState.maxHealth);
      showNotification('HP +1!');
      createParticles(bird.x, bird.y, '#FF6B6B', 10);
      break;
    case 'unlimited':
      gameState.effects.unlimited = Date.now() + 8000;
      showNotification('무한 똥!');
      break;
    case 'shield':
      gameState.effects.shield = true;
      showNotification('보호막!');
      break;
  }
}

// Game Logic
function startStage(num) {
  const stage = STAGES.find(s => s.id === num);
  if (!stage) return;
  
  gameState.currentStage = num;
  gameState.screen = 'playing';
  gameState.score = 0;
  gameState.health = gameState.maxHealth;
  gameState.energy = gameState.maxEnergy;
  gameState.combo = 0;
  gameState.maxCombo = 0;
  gameState.hits = 0;
  gameState.shots = 0;
  gameState.stageFeathers = 0;
  gameState.stageGold = 0;
  gameState.bossSpawned = false;
  gameState.bossDefeated = false;
  gameState.effects = { unlimited: 0, shield: false, invincible: 0 };
  
  bird.x = canvas.width / 2;
  bird.y = canvas.height * 0.15;
  poops = [];
  humans = [];
  projectiles = [];
  particles = [];
  boss = null;
  
  gameStartTime = Date.now();
  lastSpawnTime = 0;
  
  hideAllOverlays();
  updateUI();
  gameLoop();
}

function retryStage() {
  startStage(gameState.currentStage);
}

function spawnHuman() {
  const types = ['normal', 'child', 'fast'];
  const type = types[Math.floor(Math.random() * types.length)];
  const side = Math.random() < 0.5 ? 'left' : 'right';
  
  const stats = {
    normal: { speed: 1.5, score: 10, sprite: 'human_normal' },
    child: { speed: 2.5, score: 20, sprite: 'human_child' },
    fast: { speed: 3, score: 15, sprite: 'human_fast' }
  };
  
  const s = stats[type];
  humans.push({
    x: side === 'left' ? -30 : canvas.width + 30,
    y: canvas.height * 0.7 + Math.random() * (canvas.height * 0.2),
    width: 30,
    height: 40,
    type,
    speed: s.speed,
    score: s.score,
    sprite: s.sprite,
    direction: side === 'left' ? 1 : -1,
    hit: false
  });
}

function spawnBoss() {
  boss = {
    x: canvas.width / 2,
    y: canvas.height * 0.75,
    width: 50,
    height: 60,
    health: 10,
    maxHealth: 10,
    score: 200,
    direction: 1,
    attackTimer: 0,
    defeated: false
  };
  showNotification('⚠️ BOSS!');
}

function shootPoop() {
  gameState.shots++;
  const birdData = BIRDS[gameState.currentBird];
  const sizeBonus = 1 + gameState.upgrades.poopSize * 0.15;
  const size = 18 * birdData.poopSize * sizeBonus;
  
  poops.push({
    x: bird.x,
    y: bird.y + 20,
    width: size,
    height: size,
    speed: (birdData.poopSpeed + gameState.upgrades.poopSpeed * 1.5) * (1 + gameState.upgrades.poopSpeed * 0.15),
    damage: birdData.damage * (1 + gameState.upgrades.poopDamage * 0.2),
    rotation: 0
  });
}

function bossAttack() {
  if (!boss || boss.defeated) return;
  
  // Boss throws projectiles that can reach bird's height
  const targetY = bird.y + 50; // Slightly below bird so it can hit
  const dx = bird.x - boss.x;
  const dy = targetY - boss.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const speed = 5;
  
  projectiles.push({
    x: boss.x,
    y: boss.y - 20,
    vx: (dx / dist) * speed + (Math.random() - 0.5) * 2,
    vy: (dy / dist) * speed,
    width: 12,
    height: 12
  });
}

function update() {
  if (gameState.screen !== 'playing') return;
  
  const birdData = BIRDS[gameState.currentBird];
  const speedBonus = 1 + gameState.upgrades.speed * 0.1;
  const speed = birdData.speed * speedBonus;
  
  // Bird movement
  if (joystick.active) {
    bird.x += joystick.moveX * speed;
    bird.y += joystick.moveY * speed;
  }
  
  bird.x = Math.max(30, Math.min(canvas.width - 30, bird.x));
  bird.y = Math.max(30, Math.min(canvas.height * 0.35, bird.y));
  
  const now = Date.now();
  const isUnlimited = gameState.effects.unlimited > now;
  
  // Shooting
  if (poopPressed && (now - lastPoopTime > 250 || isUnlimited)) {
    if (gameState.energy >= 10 || isUnlimited) {
      shootPoop();
      lastPoopTime = now;
      if (!isUnlimited) gameState.energy -= 10;
    }
  }
  
  // Energy regen
  gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 0.5);
  
  if (gameState.effects.invincible > 0) gameState.effects.invincible--;
  
  const stage = STAGES.find(s => s.id === gameState.currentStage);
  const elapsed = (now - gameStartTime) / 1000;
  
  // Spawn humans
  if (now - lastSpawnTime > stage.spawnRate && !boss) {
    spawnHuman();
    lastSpawnTime = now;
  }
  
  // Boss spawn
  if (stage.boss && elapsed >= stage.duration * 0.7 && !gameState.bossSpawned) {
    gameState.bossSpawned = true;
    spawnBoss();
  }
  
  // Update poops
  poops.forEach(p => {
    p.y += p.speed;
    p.rotation += 0.1;
  });
  poops = poops.filter(p => p.y < canvas.height);
  
  // Update humans
  humans.forEach(h => {
    if (!h.hit) h.x += h.speed * h.direction;
  });
  humans = humans.filter(h => h.x > -50 && h.x < canvas.width + 50 && !h.hit);
  
  // Update boss
  if (boss && !boss.defeated) {
    boss.x += 2 * boss.direction;
    if (boss.x < 80 || boss.x > canvas.width - 80) boss.direction *= -1;
    
    boss.attackTimer++;
    if (boss.attackTimer > 80) {
      bossAttack();
      boss.attackTimer = 0;
    }
    
    if (boss.health <= 0) {
      boss.defeated = true;
      gameState.bossDefeated = true;
      gameState.score += boss.score;
      gameState.stageGold += 5;
      createParticles(boss.x, boss.y, '#FFD93D', 30);
      showNotification('BOSS 처치!');
      setTimeout(() => stageClear(), 1500);
    }
  }
  
  // Update projectiles
  projectiles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
  });
  projectiles = projectiles.filter(p => p.y > 0 && p.y < canvas.height && p.x > 0 && p.x < canvas.width);
  
  // Update particles
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.life--;
  });
  particles = particles.filter(p => p.life > 0);
  
  // Collision: poop vs humans
  poops.forEach(poop => {
    humans.forEach(h => {
      if (!h.hit && collision(poop, h)) {
        h.hit = true;
        poop.hit = true;
        gameState.score += h.score * (1 + gameState.combo * 0.1);
        gameState.hits++;
        gameState.combo++;
        if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;
        gameState.stageFeathers += 1 + Math.floor(gameState.combo / 5);
        if (Math.random() < 0.1) gameState.stageGold++;
        createParticles(h.x, h.y, '#C9A86C', 8);
      }
    });
    
    if (boss && !boss.defeated && collision(poop, boss)) {
      boss.health -= poop.damage;
      poop.hit = true;
      gameState.hits++;
      createParticles(boss.x, boss.y, '#FF6B6B', 10);
    }
  });
  poops = poops.filter(p => !p.hit);
  
  // Collision: projectiles vs bird
  projectiles.forEach(p => {
    if (collision(p, bird)) {
      p.hit = true;
      if (gameState.effects.shield) {
        gameState.effects.shield = false;
        showNotification('보호막 파괴!');
        createParticles(bird.x, bird.y, '#87CEEB', 15);
      } else if (gameState.effects.invincible <= 0) {
        gameState.health--;
        gameState.effects.invincible = 60;
        gameState.combo = 0;
        createParticles(bird.x, bird.y, '#FF6B6B', 10);
        if (gameState.health <= 0) gameOver();
      }
    }
  });
  projectiles = projectiles.filter(p => !p.hit);
  
  // Check time/score for clear
  if (!stage.boss && (elapsed >= stage.duration || gameState.score >= stage.targetScore * 1.5)) {
    stageClear();
  }
  
  updateUI();
}

function collision(a, b) {
  return a.x - a.width/2 < b.x + b.width/2 &&
         a.x + a.width/2 > b.x - b.width/2 &&
         a.y - a.height/2 < b.y + b.height/2 &&
         a.y + a.height/2 > b.y - b.height/2;
}

function createParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      color,
      size: Math.random() * 6 + 3,
      life: 30 + Math.random() * 20
    });
  }
}

function render() {
  // Clear with gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(0.5, '#E0F4FF');
  gradient.addColorStop(1, '#98D4BB');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw clouds
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (let i = 0; i < 5; i++) {
    const x = ((Date.now() / 50 + i * 150) % (canvas.width + 100)) - 50;
    const y = 30 + i * 20;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y - 5, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw ground
  ctx.fillStyle = '#7CB342';
  ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);
  
  // Draw path
  ctx.fillStyle = '#D7CCC8';
  ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.1);
  
  // Draw humans
  humans.forEach(h => {
    if (!h.hit) {
      const sprite = createSprite(SPRITES[h.sprite], 3);
      ctx.save();
      if (h.direction < 0) {
        ctx.scale(-1, 1);
        ctx.drawImage(sprite, -h.x - h.width/2, h.y - h.height/2);
      } else {
        ctx.drawImage(sprite, h.x - h.width/2, h.y - h.height/2);
      }
      ctx.restore();
    }
  });
  
  // Draw boss
  if (boss && !boss.defeated) {
    const sprite = createSprite(SPRITES.boss_cleaner, 4);
    ctx.drawImage(sprite, boss.x - boss.width/2, boss.y - boss.height/2);
    
    // Health bar
    ctx.fillStyle = '#2D5A3D';
    ctx.fillRect(boss.x - 40, boss.y - boss.height/2 - 15, 80, 10);
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(boss.x - 38, boss.y - boss.height/2 - 13, 76 * (boss.health / boss.maxHealth), 6);
  }
  
  // Draw poops
  const poopSprite = createSprite(SPRITES.poop, 3);
  poops.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.drawImage(poopSprite, -p.width/2, -p.height/2, p.width, p.height);
    ctx.restore();
  });
  
  // Draw projectiles
  const projSprite = createSprite(SPRITES.projectile, 3);
  projectiles.forEach(p => {
    ctx.drawImage(projSprite, p.x - p.width/2, p.y - p.height/2);
  });
  
  // Draw bird
  const birdData = BIRDS[gameState.currentBird];
  const birdSprite = createSprite(SPRITES[birdData.sprite], 3);
  
  if (gameState.effects.invincible <= 0 || Math.floor(gameState.effects.invincible / 5) % 2 === 0) {
    ctx.drawImage(birdSprite, bird.x - bird.width/2, bird.y - bird.height/2);
  }
  
  // Shield effect
  if (gameState.effects.shield) {
    ctx.strokeStyle = '#87CEEB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, 25, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Draw particles
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
  });
  
  // Draw HP hearts
  for (let i = 0; i < gameState.maxHealth; i++) {
    ctx.font = '20px Arial';
    ctx.fillText(i < gameState.health ? '❤️' : '🩶', 10 + i * 25, 30);
  }
}

function stageClear() {
  gameState.screen = 'stageClear';
  if (animationId) cancelAnimationFrame(animationId);
  
  const stage = STAGES.find(s => s.id === gameState.currentStage);
  let stars = 1;
  if (gameState.score >= stage.targetScore) stars = 2;
  if (gameState.score >= stage.targetScore && gameState.health === gameState.maxHealth) stars = 3;
  
  gameState.stageStars[gameState.currentStage] = Math.max(gameState.stageStars[gameState.currentStage] || 0, stars);
  
  if (stars === 3) gameState.stageGold += 3;
  if (Math.random() < 0.2 * stars) gameState.stones++;
  
  gameState.feathers += gameState.stageFeathers;
  gameState.gold += gameState.stageGold;
  
  hideAllOverlays();
  document.getElementById('clearOverlay').classList.add('active');
  document.getElementById('clearStars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  document.getElementById('clearScore').textContent = Math.floor(gameState.score);
  document.getElementById('clearAccuracy').textContent = gameState.shots > 0 ? Math.round(gameState.hits / gameState.shots * 100) + '%' : '0%';
  document.getElementById('clearFeathers').textContent = '🪶 ' + gameState.stageFeathers;
  document.getElementById('clearGold').textContent = '✨ ' + gameState.stageGold;
}

function gameOver() {
  gameState.screen = 'gameover';
  if (animationId) cancelAnimationFrame(animationId);
  
  gameState.feathers += Math.floor(gameState.stageFeathers * 0.3);
  
  hideAllOverlays();
  document.getElementById('gameoverOverlay').classList.add('active');
  document.getElementById('goScore').textContent = Math.floor(gameState.score);
  document.getElementById('goFeathers').textContent = '🪶 ' + Math.floor(gameState.stageFeathers * 0.3);
}

function gameLoop() {
  if (gameState.screen === 'playing') {
    update();
    render();
    animationId = requestAnimationFrame(gameLoop);
  }
}

function drawMenuBird() {
  const menuCanvas = document.getElementById('menuBird');
  const mctx = menuCanvas.getContext('2d');
  mctx.clearRect(0, 0, 80, 80);
  
  const sprite = createSprite(SPRITES.sparrow, 5);
  mctx.drawImage(sprite, 10, 10);
}

function drawBirdIcon() {
  const iconCanvas = document.getElementById('birdIcon');
  const ictx = iconCanvas.getContext('2d');
  ictx.clearRect(0, 0, 32, 32);
  
  const birdData = BIRDS[gameState.currentBird];
  const sprite = createSprite(SPRITES[birdData.sprite], 2);
  ictx.drawImage(sprite, 4, 4);
}

// Initialize
function init() {
  resizeCanvas();
  drawMenuBird();
  drawBirdIcon();
  updateUI();
}

init();