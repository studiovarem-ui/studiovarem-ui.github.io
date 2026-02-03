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

// ============ PIXEL ART SPRITES ============
const SPRITES = {
  sparrow: ['....yyyy....','...yYYYYy...','..yYYYYYYy..','..yYFFYYyw..','.yYYYYYYYYy.','.yOYYYYYYy..','..yYYYYYYy..','...yYYYYy...','....oBBo....','....o..o....'],
  pigeon: ['....gggg....','...gGGGGg...','..gGGGGGGg..','..gGFFGGgw..','.gPPPPPPPPg.','.gOGGGGGGg..','..gGGGGGGg..','...gGGGGg...','....rrrr....','....r..r....'],
  crow: ['....kkkk....','...kKKKKk...','..kKKKKKKk..','..kKFFKKkw..','.kKKKKKKKKk.','.kOKKKKKKk..','..kKKKKKKk..','...kKKKKk...','....kkkk....','....k..k....'],
  eagle: ['...dddddd...','..dDDDDDDd..','.dDDFFDDDdw.','.dDDFFDDDDd.','dDDDDDDDDDDd','dODDDDDDDd..','.dDDDDDDDDd.','..dDDDDDDd..','...oYYYoo...','...o....o...'],
  archaeopteryx: ['..tttttttt..','.tTTTTTTTTt.','.tTFFTTTwwt.','.tTFFTTTTTt.','tTTTTTTTTTTt','tOTTTTTTTt..','.tTTTTTTTTt.','..tTggggTt..','...gggggg...','...g....g...'],
  phoenix: ['..rrOOrrOO..','.rROOOOOORr.','.rOFFOOOwwR.','.rOFFOOOYYr.','rOOOOOOOOOOr','YOYYYYYYYY..','.YYYYYYYYYY.','..YYYYYYYY..','...rrrrrr...','...r....r...'],
  human_normal: ['...pppp...','..pPPPPp..','..p.pp.p..','..pPPPPp..','...pppp...','..bbbbbb..','.bBBBBBBb.','..bBBBBb..','...b..b...','...s..s...'],
  human_child: ['...yyyy...','..yYYYYy..','..y.yy.y..','..yYYYYy..','...yyyy...','..cccccc..','..cMMMc...','...cMc....','...c..c...','...s..s...'],
  human_runner: ['...gggg...','..gGGGGg..','..g.gg.g..','..gGGGGg..','...gggg...','..mmmmmm..','.mMMMMMMm.','..mMMMMm..','..m....m..','..s....s..'],
  human_oldman: ['...wwww...','..wWWWWw..','..w.ww.w..','..wWWWWw..','...wwww...','..bbbbbb..','.bBBBBBBb.','..bBBBBb..','...b..b...','...s..s...'],
  human_lady: ['...rrrr...','..rRRRRr..','..r.rr.r..','..rRRRRr..','...rrrr...','..pppppp..','.pPPPPPPp.','..pPPPPp..','...p..p...','...s..s...'],
  human_athlete: ['...oooo...','..oOOOOo..','..o.oo.o..','..oOOOOo..','...oooo...','..wwwwww..','.wWWWWWWw.','..wWWWWw..','..w....w..','..s....s..'],
  human_student: ['...kkkk...','..kKKKKk..','..k.kk.k..','..kKKKKk..','...kkkk...','..wwwwww..','.wWWWWWWw.','..wWWWWw..','...w..w...','...s..s...'],
  human_tourist: ['...yyyy...','..yYYYYy..','..y.yy.y..','..yYYYYy..','...yyyy...','..rrrrrr..','.rRRRRRRr.','..rRRRRr..','...r..r...','...s..s...'],
  boss_cleaner: ['....bbbb....','...bBBBBb...','..bB.BB.Bb..','..bBBBBBBb..','...bBBBBb...','..gggggggg..','.gGGGGGGGGg.','.gGGGGGGGGg.','..gG....Gg..','..ss....ss..'],
  boss_dog: ['..oo....oo..','.oOOo..oOOo.','.oOOOooOOOo.','..oOOFFOOo..','..oOOFFOOo..','.oOOOOOOOOo.','.oOkOOOOkOo.','..oOOOOOOo..','...oooooo...','..o......o..'],
  boss_cat: ['.oo......oo.','oGGo....oGGo','oGGGooooGGGo','.oGGFFFFGGo.','.oGGFFFFGGo.','.oGGGGGGGGo.','.oGkGGGGkGo.','..oGGGGGGo..','..oGGooGGo..','...oo..oo...'],
  boss_security: ['....kkkk....','...kKKKKk...','..kK.KK.Kk..','..kKKKKKKk..','...kKKKKk...','..kkkkkkkk..','.kKKKKKKKKk.','.kKKKKKKKKk.','..kK....Kk..','..ss....ss..'],
  boss_witch: ['....pppp....','...pPPPPp...','..pPPPPPPp..','..pP.PP.Pp..','..pPPPPPPp..','...pPPPPp...','..kkkkkkkk..','.kKKKKKKKKk.','..kKKKKKKk..','...kk..kk...'],
  boss_dragon: ['..rr....rr..','.rRRr..rRRr.','.rRRRrrRRRr.','..rRRFFRRr..','..rROFFORr..','.rRRRRRRRRr.','.rRYRRRRYRr.','..rRRRRRRr..','...rrrrrr...','..rr....rr..'],
  poop: ['..cc..','.cCCc.','.cBCc.','cCCCCc','cCCCCc','.cCCc.'],
  projectile: ['.rr.','rRRr','rRRr','.rr.']
};

const COLORS = {'y':'#D4A574','Y':'#FFE4B5','g':'#228B22','G':'#90EE90','b':'#4A4A4A','B':'#8B4513','p':'#DDA0DD','P':'#FFB6C1','r':'#DC143C','R':'#FF6B6B','o':'#FF8C00','O':'#FFA500','k':'#2F2F2F','K':'#4A4A4A','w':'#C0C0C0','W':'#FFFFFF','c':'#8B7355','C':'#C9A86C','m':'#20B2AA','M':'#98D4BB','t':'#008B8B','T':'#20B2AA','s':'#2F2F2F','d':'#8B4513','D':'#CD853F','F':'#1a1a1a','.':null};

const spriteCache = {};
function createSprite(data, scale = 3) {
  if (!data) return null;
  const key = data.join('') + scale;
  if (spriteCache[key]) return spriteCache[key];
  const h = data.length, w = data[0].length;
  const c = document.createElement('canvas');
  c.width = w * scale; c.height = h * scale;
  const x = c.getContext('2d');
  for (let y = 0; y < h; y++) {
    for (let i = 0; i < w; i++) {
      const ch = data[y][i];
      if (COLORS[ch]) { x.fillStyle = COLORS[ch]; x.fillRect(i * scale, y * scale, scale, scale); }
    }
  }
  spriteCache[key] = c;
  return c;
}

// ============ STAGE DATA ============
const STAGES = [
  { id: 1, name: '공원', icon: '🌳', duration: 90, spawnRate: 2200, bgColors: ['#87CEEB', '#B0E0E6', '#98FB98'], groundColor: '#7CB342', pathColor: '#D7CCC8', humanTypes: ['normal', 'child', 'oldman'], boss: 'cleaner', bossName: '환경미화원' },
  { id: 2, name: '도시', icon: '🏙️', duration: 100, spawnRate: 2000, bgColors: ['#B0C4DE', '#87CEEB', '#C0C0C0'], groundColor: '#808080', pathColor: '#A9A9A9', humanTypes: ['normal', 'runner', 'lady', 'student'], boss: 'dog', bossName: '맹견' },
  { id: 3, name: '해변', icon: '🏖️', duration: 100, spawnRate: 1900, bgColors: ['#00BFFF', '#87CEEB', '#F0E68C'], groundColor: '#F4A460', pathColor: '#FFECD2', humanTypes: ['normal', 'child', 'tourist', 'athlete'], boss: 'cat', bossName: '도둑고양이' },
  { id: 4, name: '운동장', icon: '🏟️', duration: 110, spawnRate: 1800, bgColors: ['#87CEEB', '#98FB98', '#90EE90'], groundColor: '#228B22', pathColor: '#CD853F', humanTypes: ['runner', 'athlete', 'student', 'normal'], boss: 'security', bossName: '경비원' },
  { id: 5, name: '성', icon: '🏰', duration: 120, spawnRate: 1700, bgColors: ['#9370DB', '#DDA0DD', '#E6E6FA'], groundColor: '#696969', pathColor: '#A9A9A9', humanTypes: ['lady', 'oldman', 'normal', 'tourist'], boss: 'witch', bossName: '마녀' },
  { id: 6, name: '화산', icon: '🌋', duration: 130, spawnRate: 1500, bgColors: ['#FF6347', '#FF4500', '#8B0000'], groundColor: '#2F2F2F', pathColor: '#8B0000', humanTypes: ['runner', 'athlete', 'tourist', 'normal', 'lady'], boss: 'dragon', bossName: '드래곤' }
];

const BIRDS = {
  sparrow: { name: '참새', sprite: 'sparrow', speed: 5, damage: 1, poopSpeed: 7, price: 0, level: 1 },
  pigeon: { name: '비둘기', sprite: 'pigeon', speed: 5.5, damage: 1.5, poopSpeed: 8, price: 5, level: 2 },
  crow: { name: '까마귀', sprite: 'crow', speed: 6, damage: 2, poopSpeed: 9, price: 10, level: 3 },
  eagle: { name: '독수리', sprite: 'eagle', speed: 7, damage: 3, poopSpeed: 10, price: 20, level: 4 },
  archaeopteryx: { name: '시조새', sprite: 'archaeopteryx', speed: 8, damage: 4, poopSpeed: 11, price: 35, level: 5 },
  phoenix: { name: '피닉스', sprite: 'phoenix', speed: 10, damage: 6, poopSpeed: 13, price: 50, level: 6 }
};

const BOSSES = {
  cleaner: { sprite: 'boss_cleaner', health: 8, speed: 1.5, attackRate: 100 },
  dog: { sprite: 'boss_dog', health: 12, speed: 2, attackRate: 80 },
  cat: { sprite: 'boss_cat', health: 15, speed: 2.5, attackRate: 70 },
  security: { sprite: 'boss_security', health: 18, speed: 2, attackRate: 60 },
  witch: { sprite: 'boss_witch', health: 22, speed: 2.5, attackRate: 50 },
  dragon: { sprite: 'boss_dragon', health: 30, speed: 3, attackRate: 40 }
};

const HUMAN_TYPES = {
  normal: { sprite: 'human_normal', speed: 1.5, score: 10 },
  child: { sprite: 'human_child', speed: 2.5, score: 20 },
  runner: { sprite: 'human_runner', speed: 3.5, score: 25 },
  oldman: { sprite: 'human_oldman', speed: 1, score: 15 },
  lady: { sprite: 'human_lady', speed: 2, score: 15 },
  athlete: { sprite: 'human_athlete', speed: 4, score: 30 },
  student: { sprite: 'human_student', speed: 2.5, score: 20 },
  tourist: { sprite: 'human_tourist', speed: 1.5, score: 15 }
};

const ITEMS = {
  bread: { name: '빵', icon: '🍞', price: 30, effect: 'heal' },
  chili: { name: '고추', icon: '🌶️', price: 50, effect: 'unlimited' },
  shield: { name: '방패', icon: '🛡️', price: 60, effect: 'shield' }
};

const UPGRADES = {
  energy: { name: '에너지', icon: '⚡', price: 50, maxLevel: 5, bonus: 20 },
  speed: { name: '스피드', icon: '💨', price: 60, maxLevel: 5, bonus: 0.1 },
  poopSpeed: { name: '똥스피드', icon: '💩', price: 70, maxLevel: 5, bonus: 0.15 },
  damage: { name: '데미지', icon: '💥', price: 80, maxLevel: 5, bonus: 0.2 },
  luck: { name: '행운', icon: '🍀', price: 100, maxLevel: 5, bonus: 0.05 }
};

// ============ GAME STATE ============
let gameState = {
  screen: 'menu', difficulty: 'normal', currentStage: 1,
  score: 0, feathers: 150, gold: 15, stones: 5,
  health: 3, maxHealth: 3, energy: 100, maxEnergy: 100,
  combo: 0, maxCombo: 0, hits: 0, shots: 0,
  stageFeathers: 0, stageGold: 0,
  inventory: { bread: 3, chili: 2, shield: 2 },
  quickSlots: ['bread', 'chili', 'shield'],
  effects: { unlimited: 0, shield: false, invincible: 0 },
  upgrades: { energy: 0, speed: 0, poopSpeed: 0, damage: 0, luck: 0 },
  currentBird: 'sparrow', unlockedBirds: ['sparrow'], stageStars: {},
  bossSpawned: false, bossDefeated: false, bossWarningShown: false
};

// Load saved data
function loadGame() {
  try {
    const saved = localStorage.getItem('birdDropSave');
    if (saved) {
      const data = JSON.parse(saved);
      gameState.feathers = data.feathers ?? 150;
      gameState.gold = data.gold ?? 15;
      gameState.stones = data.stones ?? 5;
      gameState.inventory = data.inventory || { bread: 3, chili: 2, shield: 2 };
      gameState.upgrades = data.upgrades || { energy: 0, speed: 0, poopSpeed: 0, damage: 0, luck: 0 };
      gameState.currentBird = data.currentBird || 'sparrow';
      gameState.unlockedBirds = data.unlockedBirds || ['sparrow'];
      gameState.stageStars = data.stageStars || {};
      if (gameState.upgrades.energy) gameState.maxEnergy = 100 + gameState.upgrades.energy * 20;
    }
  } catch(e) { console.log('Load failed'); }
}

function saveGame() {
  try {
    localStorage.setItem('birdDropSave', JSON.stringify({
      feathers: gameState.feathers, gold: gameState.gold, stones: gameState.stones,
      inventory: gameState.inventory, upgrades: gameState.upgrades,
      currentBird: gameState.currentBird, unlockedBirds: gameState.unlockedBirds,
      stageStars: gameState.stageStars
    }));
  } catch(e) { console.log('Save failed'); }
}

let bird = { x: 0, y: 0, width: 36, height: 30 };
let poops = [], humans = [], projectiles = [], particles = [];
let boss = null;
let lastPoopTime = 0, lastSpawnTime = 0, gameStartTime = 0;
let animationId = null, previousScreen = 'menu';
let joystick = { active: false, startX: 0, startY: 0, moveX: 0, moveY: 0 };
let poopPressed = false;
let keys = {};

// ============ INPUT ============
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
  const maxDist = 35;
  const dist = Math.min(Math.sqrt(dx*dx + dy*dy), maxDist);
  const angle = Math.atan2(dy, dx);
  joystick.moveX = (dist / maxDist) * Math.cos(angle);
  joystick.moveY = (dist / maxDist) * Math.sin(angle);
  joystickKnob.style.transform = `translate(calc(-50% + ${joystick.moveX * maxDist}px), calc(-50% + ${joystick.moveY * maxDist}px))`;
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
joystickArea.addEventListener('mousedown', handleJoystickStart);
document.addEventListener('mousemove', handleJoystickMove);
document.addEventListener('mouseup', handleJoystickEnd);

const poopButton = document.getElementById('poopButton');
poopButton.addEventListener('touchstart', e => { e.preventDefault(); poopPressed = true; }, { passive: false });
poopButton.addEventListener('touchend', () => poopPressed = false);
poopButton.addEventListener('touchcancel', () => poopPressed = false);
poopButton.addEventListener('mousedown', () => poopPressed = true);
poopButton.addEventListener('mouseup', () => poopPressed = false);
poopButton.addEventListener('mouseleave', () => poopPressed = false);

// Keyboard support
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space') { e.preventDefault(); poopPressed = true; }
  if (e.code === 'Digit1') useQuickSlot(0);
  if (e.code === 'Digit2') useQuickSlot(1);
  if (e.code === 'Digit3') useQuickSlot(2);
  if (e.code === 'Escape' && gameState.screen === 'playing') togglePause();
});
document.addEventListener('keyup', e => {
  keys[e.code] = false;
  if (e.code === 'Space') poopPressed = false;
});

document.querySelectorAll('.item-btn').forEach(btn => {
  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    useQuickSlot(parseInt(btn.dataset.slot));
  }, { passive: false });
  btn.addEventListener('click', () => useQuickSlot(parseInt(btn.dataset.slot)));
});

// ============ UI ============
function updateUI() {
  document.getElementById('energyFill').style.width = (gameState.energy / gameState.maxEnergy * 100) + '%';
  document.getElementById('poopGaugeFill').style.height = (gameState.energy / gameState.maxEnergy * 100) + '%';
  document.getElementById('featherCount').textContent = gameState.feathers + gameState.stageFeathers;
  document.getElementById('goldCount').textContent = gameState.gold + gameState.stageGold;
  document.getElementById('stoneCount').textContent = gameState.stones;
  document.getElementById('levelText').textContent = 'Lv.' + BIRDS[gameState.currentBird].level;
  
  const badge = document.getElementById('diffBadge');
  badge.textContent = gameState.difficulty === 'hell' ? 'HELL' : 'NORMAL';
  badge.className = 'difficulty-badge ' + gameState.difficulty;
  
  const comboEl = document.getElementById('comboDisplay');
  if (gameState.combo > 1) {
    comboEl.style.display = 'block';
    comboEl.textContent = gameState.combo + ' COMBO!';
  } else {
    comboEl.style.display = 'none';
  }
  
  updateProgressMap();
  updateItemButtons();
}

function updateProgressMap() {
  const map = document.getElementById('progressMap');
  map.innerHTML = '';
  const stage = STAGES.find(s => s.id === gameState.currentStage);
  if (!stage || gameState.screen !== 'playing') return;
  const elapsed = (Date.now() - gameStartTime) / 1000;
  const progress = Math.min(10, Math.floor((elapsed / stage.duration) * 10));
  for (let i = 0; i < 10; i++) {
    if (i > 0) {
      const line = document.createElement('div');
      line.className = 'progress-line' + (i <= progress ? ' passed' : '');
      map.appendChild(line);
    }
    const dot = document.createElement('div');
    if (i === 8) dot.className = 'progress-dot boss';
    else if (i === progress) dot.className = 'progress-dot current';
    else if (i < progress) dot.className = 'progress-dot passed';
    else dot.className = 'progress-dot';
    map.appendChild(dot);
  }
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

// ============ SCREENS ============
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
  drawMenuBackground();
}

function showStageSelect() {
  gameState.screen = 'stageSelect';
  hideAllOverlays();
  document.getElementById('stageSelect').classList.add('active');
  renderStageGrid();
  updateDifficultyButtons();
}

function setDifficulty(diff) {
  gameState.difficulty = diff;
  updateDifficultyButtons();
  showNotification(diff === 'hell' ? '🔥 HELL MODE!' : '🌿 NORMAL MODE');
}

function updateDifficultyButtons() {
  document.getElementById('normalBtn').style.opacity = gameState.difficulty === 'normal' ? '1' : '0.5';
  document.getElementById('hellBtn').style.opacity = gameState.difficulty === 'hell' ? '1' : '0.5';
}

function renderStageGrid() {
  const grid = document.getElementById('stageGrid');
  grid.innerHTML = '';
  STAGES.forEach((stage, i) => {
    const prevStageId = i > 0 ? STAGES[i-1].id : 0;
    const prevStars = i === 0 ? 1 : (gameState.stageStars[prevStageId] || 0);
    const unlocked = i === 0 || prevStars > 0;
    const stars = gameState.stageStars[stage.id] || 0;
    const btn = document.createElement('div');
    btn.className = 'stage-btn' + (unlocked ? '' : ' locked');
    btn.innerHTML = `
      <div class="stage-btn-icon">${stage.icon}</div>
      <div class="stage-btn-name">${stage.name}</div>
      <div class="stage-btn-stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
      ${!unlocked ? '<div style="font-size:16px">🔒</div>' : ''}
    `;
    if (unlocked) btn.onclick = () => startStage(stage.id);
    grid.appendChild(btn);
  });
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

// ============ SHOP ============
// FIX: Save previousScreen BEFORE changing gameState.screen
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
  gameState.screen = 'shop';
  hideAllOverlays();
  document.getElementById('shopOverlay').classList.add('active');
  updateShopDisplay();
  switchShopTab(document.querySelector('.shop-tab'), 'items');
}

// FIX: closeShop now correctly returns to the screen you came from
function closeShop() {
  document.getElementById('shopOverlay').classList.remove('active');
  if (previousScreen === 'paused') {
    gameState.screen = 'paused';
    document.getElementById('pauseOverlay').classList.add('active');
  } else if (previousScreen === 'menu') {
    showMainMenu();
  } else if (previousScreen === 'stageSelect') {
    showStageSelect();
  } else {
    // Default fallback: go to stage select
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
        <div style="font-size:7px;color:#666">${owned}개</div>
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
        <div style="font-size:7px;color:#666">Lv.${lv}</div>
      `;
      if (!maxed) div.onclick = () => buyUpgrade(k);
      container.appendChild(div);
    });
  } else if (tab === 'evolution') {
    Object.entries(BIRDS).forEach(([k, b]) => {
      const owned = gameState.unlockedBirds.includes(k);
      const selected = gameState.currentBird === k;
      const div = document.createElement('div');
      div.className = 'shop-item' + (selected ? ' selected' : '');
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
          drawBirdIcon();
          saveGame();
        } else {
          buyBird(k);
        }
      };
      container.appendChild(div);
      setTimeout(() => {
        const canv = div.querySelector('.bird-canvas');
        if (canv && SPRITES[b.sprite]) {
          const sprite = createSprite(SPRITES[b.sprite], 3);
          if (sprite) canv.getContext('2d').drawImage(sprite, 0, 0);
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
    saveGame();
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
    saveGame();
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
    drawBirdIcon();
    saveGame();
  } else {
    showNotification('진화석 부족!');
  }
}

function useQuickSlot(i) {
  if (gameState.screen !== 'playing') return;
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

// ============ GAME LOGIC ============
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
  gameState.bossWarningShown = false;
  gameState.effects = { unlimited: 0, shield: false, invincible: 0 };
  bird.x = canvas.width / 2;
  bird.y = canvas.height * 0.15;
  poops = []; humans = []; projectiles = []; particles = [];
  boss = null;
  gameStartTime = Date.now();
  lastSpawnTime = 0;
  hideAllOverlays();
  document.getElementById('bossWarning').style.display = 'none';
  updateUI();
  gameLoop();
}

function retryStage() { startStage(gameState.currentStage); }

function nextStage() {
  const next = gameState.currentStage + 1;
  if (next <= STAGES.length) startStage(next);
  else showStageSelect();
}

function spawnHuman() {
  const stage = STAGES.find(s => s.id === gameState.currentStage);
  const types = stage.humanTypes;
  const type = types[Math.floor(Math.random() * types.length)];
  const side = Math.random() < 0.5 ? 'left' : 'right';
  const humanData = HUMAN_TYPES[type];
  const speedMult = gameState.difficulty === 'hell' ? 1.5 : 1;
  humans.push({
    x: side === 'left' ? -30 : canvas.width + 30,
    y: canvas.height * 0.65 + Math.random() * (canvas.height * 0.2),
    width: 30, height: 40,
    type, speed: humanData.speed * speedMult, score: humanData.score,
    sprite: humanData.sprite, direction: side === 'left' ? 1 : -1, hit: false
  });
}

function spawnBoss() {
  const stage = STAGES.find(s => s.id === gameState.currentStage);
  const bossData = BOSSES[stage.boss];
  const healthMult = gameState.difficulty === 'hell' ? 1.8 : 1;
  boss = {
    x: canvas.width / 2, y: canvas.height * 0.7,
    width: 60, height: 70,
    health: Math.floor(bossData.health * healthMult),
    maxHealth: Math.floor(bossData.health * healthMult),
    speed: bossData.speed, attackRate: bossData.attackRate,
    sprite: bossData.sprite, score: 200 + stage.id * 50,
    direction: 1, attackTimer: 0, defeated: false
  };
}

function shootPoop() {
  gameState.shots++;
  const birdData = BIRDS[gameState.currentBird];
  const speedBonus = 1 + gameState.upgrades.poopSpeed * 0.15;
  poops.push({
    x: bird.x, y: bird.y + 20,
    width: 18, height: 18,
    speed: birdData.poopSpeed * speedBonus,
    damage: birdData.damage * (1 + gameState.upgrades.damage * 0.2),
    rotation: 0
  });
}

function bossAttack() {
  if (!boss || boss.defeated) return;
  const dx = bird.x - boss.x;
  const dy = bird.y - boss.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const speed = gameState.difficulty === 'hell' ? 6 : 4;
  projectiles.push({
    x: boss.x, y: boss.y - 20,
    vx: (dx / dist) * speed + (Math.random() - 0.5) * 2,
    vy: (dy / dist) * speed,
    width: 12, height: 12
  });
  if (gameState.difficulty === 'hell') {
    setTimeout(() => {
      if (boss && !boss.defeated) {
        projectiles.push({
          x: boss.x + (Math.random() - 0.5) * 40, y: boss.y - 20,
          vx: (dx / dist) * speed + (Math.random() - 0.5) * 3,
          vy: (dy / dist) * speed, width: 12, height: 12
        });
      }
    }, 200);
  }
}

function update() {
  if (gameState.screen !== 'playing') return;
  const birdData = BIRDS[gameState.currentBird];
  const speedBonus = 1 + gameState.upgrades.speed * 0.1;
  const speed = birdData.speed * speedBonus;
  
  if (keys['ArrowLeft'] || keys['KeyA']) bird.x -= speed;
  if (keys['ArrowRight'] || keys['KeyD']) bird.x += speed;
  if (keys['ArrowUp'] || keys['KeyW']) bird.y -= speed;
  if (keys['ArrowDown'] || keys['KeyS']) bird.y += speed;
  
  if (joystick.active) {
    bird.x += joystick.moveX * speed;
    bird.y += joystick.moveY * speed;
  }
  
  bird.x = Math.max(30, Math.min(canvas.width - 30, bird.x));
  bird.y = Math.max(30, Math.min(canvas.height * 0.35, bird.y));
  
  const now = Date.now();
  const isUnlimited = gameState.effects.unlimited > now;
  
  if (poopPressed && (now - lastPoopTime > 180 || isUnlimited)) {
    if (gameState.energy >= 8 || isUnlimited) {
      shootPoop();
      lastPoopTime = now;
      if (!isUnlimited) gameState.energy -= 8;
    }
  }
  
  gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 0.6);
  if (gameState.effects.invincible > 0) gameState.effects.invincible--;
  
  const stage = STAGES.find(s => s.id === gameState.currentStage);
  const elapsed = (now - gameStartTime) / 1000;
  const progress = elapsed / stage.duration;
  
  const spawnMult = gameState.difficulty === 'hell' ? 0.7 : 1;
  if (now - lastSpawnTime > stage.spawnRate * spawnMult && !boss) {
    spawnHuman();
    lastSpawnTime = now;
  }
  
  if (progress >= 0.7 && !gameState.bossWarningShown) {
    gameState.bossWarningShown = true;
    document.getElementById('bossWarning').style.display = 'block';
    setTimeout(() => document.getElementById('bossWarning').style.display = 'none', 2000);
  }
  
  if (progress >= 0.8 && !gameState.bossSpawned) {
    gameState.bossSpawned = true;
    humans = [];
    spawnBoss();
    showNotification('⚠️ ' + stage.bossName + ' 등장!');
  }
  
  poops.forEach(p => { p.y += p.speed; p.rotation += 0.15; });
  poops = poops.filter(p => p.y < canvas.height);
  
  humans.forEach(h => { if (!h.hit) h.x += h.speed * h.direction; });
  humans = humans.filter(h => h.x > -50 && h.x < canvas.width + 50 && !h.hit);
  
  if (boss && !boss.defeated) {
    boss.x += boss.speed * boss.direction;
    if (boss.x < 60 || boss.x > canvas.width - 60) boss.direction *= -1;
    boss.attackTimer++;
    if (boss.attackTimer > boss.attackRate) {
      bossAttack();
      boss.attackTimer = 0;
    }
    if (boss.health <= 0) {
      boss.defeated = true;
      gameState.bossDefeated = true;
      gameState.score += boss.score;
      gameState.stageGold += 5 + gameState.currentStage;
      if (Math.random() < 0.3 + gameState.upgrades.luck * 0.05) gameState.stones++;
      createParticles(boss.x, boss.y, '#FFD700', 40);
      showNotification('★ ' + stage.bossName + ' 처치! ★');
      setTimeout(() => stageClear(), 1500);
    }
  }
  
  projectiles.forEach(p => { p.x += p.vx; p.y += p.vy; });
  projectiles = projectiles.filter(p => p.y > 0 && p.y < canvas.height && p.x > 0 && p.x < canvas.width);
  
  particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--; });
  particles = particles.filter(p => p.life > 0);
  
  poops.forEach(poop => {
    humans.forEach(h => {
      if (!h.hit && collision(poop, h)) {
        h.hit = true; poop.hit = true;
        gameState.score += Math.floor(h.score * (1 + gameState.combo * 0.1));
        gameState.hits++; gameState.combo++;
        if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;
        gameState.stageFeathers += 1 + Math.floor(gameState.combo / 5);
        if (Math.random() < 0.08 + gameState.upgrades.luck * 0.02) gameState.stageGold++;
        createParticles(h.x, h.y, '#C9A86C', 8);
      }
    });
    if (boss && !boss.defeated && collision(poop, boss)) {
      boss.health -= poop.damage;
      poop.hit = true;
      gameState.hits++;
      createParticles(boss.x, boss.y, '#FF6B6B', 12);
    }
  });
  poops = poops.filter(p => !p.hit);
  
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
        createParticles(bird.x, bird.y, '#FF6B6B', 12);
        if (gameState.health <= 0) gameOver();
      }
    }
  });
  projectiles = projectiles.filter(p => !p.hit);
  
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
      x, y, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10 - 3,
      color, size: Math.random() * 8 + 4, life: 35 + Math.random() * 25
    });
  }
}

// ============ RENDER ============
function render() {
  const stage = STAGES.find(s => s.id === gameState.currentStage);
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, stage.bgColors[0]);
  gradient.addColorStop(0.5, stage.bgColors[1]);
  gradient.addColorStop(1, stage.bgColors[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (let i = 0; i < 4; i++) {
    const x = ((Date.now() / 40 + i * 120) % (canvas.width + 80)) - 40;
    const y = 20 + i * 25;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 20, y - 5, 18, 0, Math.PI * 2);
    ctx.arc(x + 40, y, 15, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.fillStyle = stage.groundColor;
  ctx.fillRect(0, canvas.height * 0.82, canvas.width, canvas.height * 0.18);
  ctx.fillStyle = stage.pathColor;
  ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.12);
  
  humans.forEach(h => {
    if (!h.hit) {
      const sprite = createSprite(SPRITES[h.sprite], 3);
      if (sprite) {
        ctx.save();
        if (h.direction < 0) {
          ctx.scale(-1, 1);
          ctx.drawImage(sprite, -h.x - h.width/2, h.y - h.height/2);
        } else {
          ctx.drawImage(sprite, h.x - h.width/2, h.y - h.height/2);
        }
        ctx.restore();
      }
    }
  });
  
  if (boss && !boss.defeated) {
    const sprite = createSprite(SPRITES[boss.sprite], 4);
    if (sprite) ctx.drawImage(sprite, boss.x - boss.width/2, boss.y - boss.height/2);
    const barWidth = 80;
    ctx.fillStyle = '#333';
    ctx.fillRect(boss.x - barWidth/2 - 2, boss.y - boss.height/2 - 18, barWidth + 4, 12);
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(boss.x - barWidth/2, boss.y - boss.height/2 - 16, barWidth * (boss.health / boss.maxHealth), 8);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(boss.x - barWidth/2 - 2, boss.y - boss.height/2 - 18, barWidth + 4, 12);
  }
  
  const poopSprite = createSprite(SPRITES.poop, 3);
  poops.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (poopSprite) ctx.drawImage(poopSprite, -p.width/2, -p.height/2);
    ctx.restore();
  });
  
  const projSprite = createSprite(SPRITES.projectile, 3);
  projectiles.forEach(p => {
    if (projSprite) ctx.drawImage(projSprite, p.x - p.width/2, p.y - p.height/2);
  });
  
  const birdData = BIRDS[gameState.currentBird];
  const birdSprite = createSprite(SPRITES[birdData.sprite], 3);
  if (gameState.effects.invincible <= 0 || Math.floor(gameState.effects.invincible / 5) % 2 === 0) {
    if (birdSprite) ctx.drawImage(birdSprite, bird.x - bird.width/2, bird.y - bird.height/2);
  }
  
  if (gameState.effects.shield) {
    ctx.strokeStyle = 'rgba(135, 206, 250, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, 28, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
  });
  
  for (let i = 0; i < gameState.maxHealth; i++) {
    ctx.font = '18px Arial';
    ctx.fillText(i < gameState.health ? '❤️' : '🩶', 8 + i * 22, 25);
  }
}

function stageClear() {
  gameState.screen = 'stageClear';
  if (animationId) cancelAnimationFrame(animationId);
  const stage = STAGES.find(s => s.id === gameState.currentStage);
  let stars = 1;
  if (gameState.score >= 100 * stage.id) stars = 2;
  if (gameState.score >= 100 * stage.id && gameState.health === gameState.maxHealth) stars = 3;
  gameState.stageStars[gameState.currentStage] = Math.max(gameState.stageStars[gameState.currentStage] || 0, stars);
  if (stars === 3) gameState.stageGold += 3;
  if (Math.random() < 0.2 * stars) gameState.stones++;
  gameState.feathers += gameState.stageFeathers;
  gameState.gold += gameState.stageGold;
  saveGame();
  hideAllOverlays();
  document.getElementById('clearOverlay').classList.add('active');
  document.getElementById('clearStars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  document.getElementById('clearScore').textContent = Math.floor(gameState.score);
  document.getElementById('clearAccuracy').textContent = gameState.shots > 0 ? Math.round(gameState.hits / gameState.shots * 100) + '%' : '0%';
  document.getElementById('clearCombo').textContent = gameState.maxCombo;
  document.getElementById('clearFeathers').textContent = gameState.stageFeathers;
  document.getElementById('clearGold').textContent = gameState.stageGold;
}

function gameOver() {
  gameState.screen = 'gameover';
  if (animationId) cancelAnimationFrame(animationId);
  gameState.feathers += Math.floor(gameState.stageFeathers * 0.3);
  saveGame();
  hideAllOverlays();
  document.getElementById('gameoverOverlay').classList.add('active');
  document.getElementById('goScore').textContent = Math.floor(gameState.score);
  document.getElementById('goFeathers').textContent = Math.floor(gameState.stageFeathers * 0.3);
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
  if (sprite) mctx.drawImage(sprite, 10, 10);
}

function drawBirdIcon() {
  const iconCanvas = document.getElementById('birdIcon');
  const ictx = iconCanvas.getContext('2d');
  ictx.clearRect(0, 0, 28, 24);
  const birdData = BIRDS[gameState.currentBird];
  const sprite = createSprite(SPRITES[birdData.sprite], 2);
  if (sprite) ictx.drawImage(sprite, 2, 2);
}

function drawMenuBackground() {
  const bgCanvas = document.getElementById('menuBg');
  if (!bgCanvas) return;
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  const bgCtx = bgCanvas.getContext('2d');
  const gradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(0.5, '#B0E0E6');
  gradient.addColorStop(1, '#98FB98');
  bgCtx.fillStyle = gradient;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
}

function init() {
  loadGame();
  resizeCanvas();
  drawMenuBird();
  drawBirdIcon();
  drawMenuBackground();
  updateUI();
}

init();