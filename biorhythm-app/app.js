// DOM Elements
const birthDateInput = document.getElementById('birthDate');
const viewDateInput = document.getElementById('viewDate');
const zodiacInfoDiv = document.getElementById('zodiacInfo');
const tabsContainer = document.getElementById('tabsContainer');
const contentDiv = document.getElementById('content');

// Initialize
viewDateInput.value = new Date().toISOString().split('T')[0];

// Event Listeners
birthDateInput.addEventListener('change', updateApp);
viewDateInput.addEventListener('change', updateApp);

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderContent(tab.dataset.tab);
  });
});

// Utility Functions
function seededRandom(seed, offset = 0) {
  const x = Math.sin(seed + offset) * 10000;
  return x - Math.floor(x);
}

function getZodiacSign(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}

function calculateBiorhythm(birthDate, targetDate, period) {
  const birth = new Date(birthDate);
  const target = new Date(targetDate);
  const daysDiff = Math.floor((target - birth) / (1000 * 60 * 60 * 24));
  return Math.sin((2 * Math.PI * daysDiff) / period) * 100;
}

function getDaysSinceBirth(birthDate, viewDate) {
  const birth = new Date(birthDate);
  const target = new Date(viewDate);
  return Math.floor((target - birth) / (1000 * 60 * 60 * 24));
}

function generateFortune(viewDate, zodiacKey) {
  const date = new Date(viewDate);
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const zodiacIndex = Object.keys(zodiacSigns).indexOf(zodiacKey);
  const baseSeed = seed + zodiacIndex * 1000;
  
  const pick = (arr, offset) => arr[Math.floor(seededRandom(baseSeed, offset) * arr.length)];
  
  const generateMessage = (category, seedOffset) => {
    const parts = fortuneParts[category];
    const situation = pick(parts.situation, seedOffset);
    const flow = pick(parts.flow, seedOffset + 100);
    const advice = pick(parts.advice, seedOffset + 200);
    const score = Math.floor(seededRandom(baseSeed, seedOffset + 300) * 40) + 55;
    return { message: `${situation} ${flow} ${advice}`, score };
  };
  
  return {
    overall: generateMessage('overall', 1000),
    love: generateMessage('love', 2000),
    career: generateMessage('career', 3000),
    money: generateMessage('money', 4000),
    health: generateMessage('health', 5000),
    luckyItem: pick(luckyItems, 6000),
    luckyColor: pick(luckyColors, 7000),
    luckyNumber: pick(luckyNumbers, 8000),
    luckyTime: `${Math.floor(seededRandom(baseSeed, 9000) * 12) + 1}시 ~ ${Math.floor(seededRandom(baseSeed, 9100) * 12) + 13}시`
  };
}

function getPhaseInfo(value) {
  if (value > 80) return { phase: '절정기', emoji: '🔥', color: '#22c55e' };
  if (value > 50) return { phase: '상승기', emoji: '📈', color: '#84cc16' };
  if (value > 20) return { phase: '고조기', emoji: '✨', color: '#a3e635' };
  if (value > -20) return { phase: '전환기', emoji: '〰️', color: '#fbbf24' };
  if (value > -50) return { phase: '회복기', emoji: '🌱', color: '#fb923c' };
  if (value > -80) return { phase: '휴식기', emoji: '😴', color: '#f87171' };
  return { phase: '저조기', emoji: '💤', color: '#ef4444' };
}

function getAdvice(key, value, isCritical) {
  const cycle = cycles[key];
  if (isCritical) return cycle.criticalTip;
  if (value > 30) return cycle.highTip;
  return cycle.lowTip;
}

function isCriticalDay(value, prevValue) {
  return (prevValue > 0 && value <= 0) || (prevValue < 0 && value >= 0);
}

// Update App
function updateApp() {
  const birthDate = birthDateInput.value;
  const viewDate = viewDateInput.value;
  
  if (!birthDate) {
    zodiacInfoDiv.innerHTML = '';
    tabsContainer.style.display = 'none';
    contentDiv.innerHTML = `
      <div class="empty-state">
        <div class="icon">🌙⭐</div>
        <p>생년월일을 입력해주세요</p>
        <p class="hint">바이오리듬과 별자리 운세를 확인할 수 있습니다</p>
      </div>
    `;
    return;
  }
  
  const zodiacKey = getZodiacSign(birthDate);
  const zodiac = zodiacSigns[zodiacKey];
  const days = getDaysSinceBirth(birthDate, viewDate);
  
  // Zodiac Info
  zodiacInfoDiv.innerHTML = `
    <div class="zodiac-info" style="background: linear-gradient(135deg, ${zodiac.color}20, ${zodiac.color}05); border: 1px solid ${zodiac.color}30;">
      <div class="zodiac-main">
        <div class="zodiac-icon" style="background: linear-gradient(135deg, ${zodiac.color}, ${zodiac.color}80); box-shadow: 0 0 30px ${zodiac.color}40;">
          ${zodiac.icon}
        </div>
        <div>
          <div class="zodiac-name">${zodiac.symbol} ${zodiac.name}</div>
          <div class="zodiac-meta">${zodiac.dates} · ${zodiac.elementIcon} ${zodiac.element} · ${zodiac.ruling}</div>
        </div>
      </div>
      <div class="days-lived">
        <div class="days-number">${days.toLocaleString()}일</div>
        <div class="days-label">함께한 날</div>
      </div>
    </div>
  `;
  
  tabsContainer.style.display = 'block';
  const activeTab = document.querySelector('.tab.active').dataset.tab;
  renderContent(activeTab);
}

// Render Content
function renderContent(tab) {
  const birthDate = birthDateInput.value;
  const viewDate = viewDateInput.value;
  
  if (!birthDate) return;
  
  const zodiacKey = getZodiacSign(birthDate);
  const zodiac = zodiacSigns[zodiacKey];
  const fortune = generateFortune(viewDate, zodiacKey);
  
  // Calculate biorhythm values
  const physical = calculateBiorhythm(birthDate, viewDate, cycles.physical.period);
  const emotional = calculateBiorhythm(birthDate, viewDate, cycles.emotional.period);
  const intellectual = calculateBiorhythm(birthDate, viewDate, cycles.intellectual.period);
  const average = (physical + emotional + intellectual) / 3;
  
  // Previous day values for trend
  const prevDate = new Date(viewDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const prevDateStr = prevDate.toISOString().split('T')[0];
  const prevPhysical = calculateBiorhythm(birthDate, prevDateStr, cycles.physical.period);
  const prevEmotional = calculateBiorhythm(birthDate, prevDateStr, cycles.emotional.period);
  const prevIntellectual = calculateBiorhythm(birthDate, prevDateStr, cycles.intellectual.period);
  
  const bioValues = {
    physical: { value: physical, trend: physical > prevPhysical ? 'up' : 'down', critical: isCriticalDay(physical, prevPhysical) },
    emotional: { value: emotional, trend: emotional > prevEmotional ? 'up' : 'down', critical: isCriticalDay(emotional, prevEmotional) },
    intellectual: { value: intellectual, trend: intellectual > prevIntellectual ? 'up' : 'down', critical: isCriticalDay(intellectual, prevIntellectual) }
  };
  
  if (tab === 'dashboard') {
    renderDashboard(bioValues, average);
  } else if (tab === 'horoscope') {
    renderHoroscope(zodiac, fortune);
  } else if (tab === 'about') {
    renderAbout();
  }
}

function renderDashboard(bioValues, average) {
  const avgPhase = getPhaseInfo(average);
  const avgColor = average > 30 ? 'linear-gradient(135deg, #22c55e, #84cc16)' 
    : average > -30 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' 
    : 'linear-gradient(135deg, #f87171, #ef4444)';
  
  let bioCardsHtml = '';
  Object.entries(cycles).forEach(([key, cycle]) => {
    const bio = bioValues[key];
    const phase = getPhaseInfo(bio.value);
    const advice = getAdvice(key, bio.value, bio.critical);
    
    bioCardsHtml += `
      <div class="bio-card ${bio.critical ? 'critical' : ''}">
        ${bio.critical ? '<div class="critical-badge">⚠️ 크리티컬</div>' : ''}
        <div class="bio-header">
          <div class="bio-icon" style="background: ${cycle.gradient};">${cycle.icon}</div>
          <div>
            <div class="bio-title">${cycle.label} 리듬</div>
            <div class="bio-period">${cycle.period}일 주기</div>
          </div>
        </div>
        <div class="bio-value">
          <span class="bio-number" style="color: ${cycle.color};">${Math.round(bio.value)}</span>
          <span class="bio-percent">%</span>
          <span class="bio-trend ${bio.trend}">${bio.trend === 'up' ? '↑' : '↓'}</span>
        </div>
        <span class="phase-badge" style="background: ${phase.color}20; color: ${phase.color};">
          ${phase.emoji} ${phase.phase}
        </span>
        <div class="bio-bar">
          <div class="bio-bar-fill" style="width: ${(bio.value + 100) / 2}%; background: ${cycle.gradient};"></div>
        </div>
        <div class="bio-advice">💡 ${advice}</div>
      </div>
    `;
  });
  
  // Generate chart data
  const chartData = [];
  const centerDate = new Date(viewDateInput.value);
  for (let i = -15; i <= 15; i++) {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    chartData.push({
      physical: calculateBiorhythm(birthDateInput.value, dateStr, cycles.physical.period),
      emotional: calculateBiorhythm(birthDateInput.value, dateStr, cycles.emotional.period),
      intellectual: calculateBiorhythm(birthDateInput.value, dateStr, cycles.intellectual.period)
    });
  }
  
  const createPath = (data, key) => {
    return data.map((point, index) => {
      const x = 50 + (index / (data.length - 1)) * 600;
      const y = 140 - (point[key] / 100) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };
  
  contentDiv.innerHTML = `
    <div class="overall-score" style="background: linear-gradient(135deg, rgba(120,119,198,0.2), rgba(255,107,107,0.1)); border: 1px solid rgba(255,255,255,0.1);">
      <div class="score-label">오늘의 종합 컨디션</div>
      <div class="score-value" style="background: ${avgColor}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        ${Math.round(average)}%
      </div>
      <div style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255,255,255,0.1); border-radius: 100px; font-size: 14px;">
        ${avgPhase.emoji} <span>${avgPhase.phase}</span>
      </div>
    </div>
    
    <div class="bio-grid">${bioCardsHtml}</div>
    
    <div class="card chart-container">
      <h2 class="chart-title">📈 31일간 바이오리듬 추이</h2>
      <svg class="chart-svg" viewBox="0 0 700 280">
        <defs>
          <linearGradient id="physicalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FF6B6B" stop-opacity="1" />
            <stop offset="100%" stop-color="#FF6B6B" stop-opacity="0.4" />
          </linearGradient>
          <linearGradient id="emotionalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#4ECDC4" stop-opacity="1" />
            <stop offset="100%" stop-color="#4ECDC4" stop-opacity="0.4" />
          </linearGradient>
          <linearGradient id="intellectualGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFE66D" stop-opacity="1" />
            <stop offset="100%" stop-color="#FFE66D" stop-opacity="0.4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        
        ${[-100, -50, 0, 50, 100].map(val => {
          const y = 140 - (val / 100) * 100;
          return `
            <line x1="50" y1="${y}" x2="650" y2="${y}" stroke="${val === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}" stroke-width="${val === 0 ? 2 : 1}" />
            <text x="40" y="${y + 4}" fill="rgba(255,255,255,0.3)" font-size="10" text-anchor="end">${val}</text>
          `;
        }).join('')}
        
        <line x1="350" y1="30" x2="350" y2="250" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-dasharray="6,4" />
        <rect x="330" y="252" width="40" height="20" rx="4" fill="rgba(255,255,255,0.1)" />
        <text x="350" y="266" fill="rgba(255,255,255,0.8)" font-size="11" text-anchor="middle" font-weight="600">오늘</text>
        
        <path d="${createPath(chartData, 'physical')}" fill="none" stroke="url(#physicalGrad)" stroke-width="3" stroke-linecap="round" filter="url(#glow)" />
        <path d="${createPath(chartData, 'emotional')}" fill="none" stroke="url(#emotionalGrad)" stroke-width="3" stroke-linecap="round" filter="url(#glow)" />
        <path d="${createPath(chartData, 'intellectual')}" fill="none" stroke="url(#intellectualGrad)" stroke-width="3" stroke-linecap="round" filter="url(#glow)" />
        
        <circle cx="350" cy="${140 - (bioValues.physical.value / 100) * 100}" r="10" fill="#FF6B6B" filter="url(#glow)" />
        <circle cx="350" cy="${140 - (bioValues.emotional.value / 100) * 100}" r="10" fill="#4ECDC4" filter="url(#glow)" />
        <circle cx="350" cy="${140 - (bioValues.intellectual.value / 100) * 100}" r="10" fill="#FFE66D" filter="url(#glow)" />
        
        <circle cx="350" cy="${140 - (bioValues.physical.value / 100) * 100}" r="4" fill="#fff" />
        <circle cx="350" cy="${140 - (bioValues.emotional.value / 100) * 100}" r="4" fill="#fff" />
        <circle cx="350" cy="${140 - (bioValues.intellectual.value / 100) * 100}" r="4" fill="#fff" />
      </svg>
      
      <div class="chart-legend">
        ${Object.entries(cycles).map(([key, cycle]) => `
          <div class="legend-item">
            <div class="legend-dot" style="background: ${cycle.color}; box-shadow: 0 0 10px ${cycle.color}50;"></div>
            <span class="legend-label">${cycle.icon} ${cycle.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderHoroscope(zodiac, fortune) {
  const categories = [
    { key: 'love', label: '애정운', icon: '💕', gradient: 'linear-gradient(135deg, #FF6B9D, #C44569)' },
    { key: 'career', label: '직장운', icon: '💼', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { key: 'money', label: '금전운', icon: '💰', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { key: 'health', label: '건강운', icon: '💚', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' }
  ];
  
  contentDiv.innerHTML = `
    <div class="overall-score" style="background: linear-gradient(135deg, ${zodiac.color}30, ${zodiac.color}10); border: 1px solid ${zodiac.color}30;">
      <div class="bg-symbol">${zodiac.symbol}</div>
      <div class="score-label">오늘의 종합운세</div>
      <div class="score-value" style="background: linear-gradient(135deg, ${zodiac.color}, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        ${fortune.overall.score}점
      </div>
      <div class="score-message">${fortune.overall.message}</div>
    </div>
    
    <div class="lucky-grid">
      <div class="lucky-item">
        <div class="icon">🍀</div>
        <div class="label">행운의 아이템</div>
        <div class="value">${fortune.luckyItem}</div>
      </div>
      <div class="lucky-item">
        <div class="lucky-color" style="background: ${fortune.luckyColor.color}; box-shadow: 0 0 20px ${fortune.luckyColor.color}50;"></div>
        <div class="label">행운의 색</div>
        <div class="value">${fortune.luckyColor.name}</div>
      </div>
      <div class="lucky-item">
        <div class="icon">🔢</div>
        <div class="label">행운의 숫자</div>
        <div class="value">${fortune.luckyNumber}</div>
      </div>
      <div class="lucky-item">
        <div class="icon">⏰</div>
        <div class="label">행운의 시간</div>
        <div class="value">${fortune.luckyTime}</div>
      </div>
    </div>
    
    <div class="fortune-grid">
      ${categories.map(cat => {
        const f = fortune[cat.key];
        return `
          <div class="fortune-card">
            <div class="glow" style="background: ${cat.gradient};"></div>
            <div class="fortune-header">
              <div class="fortune-icon" style="background: ${cat.gradient};">${cat.icon}</div>
              <div>
                <div class="fortune-title">${cat.label}</div>
                <div class="fortune-score">${f.score}점</div>
              </div>
            </div>
            <div class="fortune-bar">
              <div class="fortune-bar-fill" style="width: ${f.score}%; background: ${cat.gradient};"></div>
            </div>
            <div class="fortune-message">${f.message}</div>
          </div>
        `;
      }).join('')}
    </div>
    
    <div class="card traits-section">
      <h3 class="traits-title">${zodiac.icon} ${zodiac.name} 특성</h3>
      <div class="traits-list">
        ${zodiac.traits.map(trait => `
          <span class="trait-tag" style="background: ${zodiac.color}20; border: 1px solid ${zodiac.color}30; color: ${zodiac.color};">${trait}</span>
        `).join('')}
      </div>
      <div class="compatibility-box">
        <div class="compatibility-label">💑 궁합이 좋은 별자리</div>
        <div class="compatibility-value">${zodiac.compatibility.join(' · ')}</div>
      </div>
    </div>
  `;
}

function renderAbout() {
  contentDiv.innerHTML = `
    <div class="card about-section">
      <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
        💡 바이오리듬 & 별자리 운세
      </h2>
      
      <section>
        <h3>🌙 바이오리듬</h3>
        <p>
          바이오리듬은 19세기 후반 독일의 빌헬름 플리스와 오스트리아의 헤르만 스보보다에 의해 제안된 이론입니다. 
          생년월일부터의 경과일수를 기반으로 신체(23일), 감성(28일), 지성(33일) 주기의 사인파를 계산합니다.
          <strong style="color: #fff;"> 성별에 따른 차이는 없으며</strong>, 순수하게 수학적 공식으로 계산됩니다.
        </p>
        <div class="formula-box">값 = sin(2π × 경과일수 / 주기) × 100</div>
      </section>
      
      <section>
        <h3>🌀 세 가지 주기</h3>
        ${Object.entries(cycles).map(([key, cycle]) => `
          <div class="cycle-info" style="background: ${cycle.color}10; border-color: ${cycle.color};">
            <div class="cycle-header">
              <span>${cycle.icon}</span>
              <span style="color: ${cycle.color};">${cycle.label} 리듬 (${cycle.period}일)</span>
            </div>
            <p class="cycle-desc">${cycle.description}</p>
          </div>
        `).join('')}
      </section>
      
      <section>
        <h3>⭐ 별자리 운세</h3>
        <p>
          서양 점성술에서는 태양이 황도 12궁 중 어느 별자리에 위치했는지에 따라 성격과 운세가 결정된다고 봅니다. 
          각 별자리는 불, 흙, 공기, 물의 4원소 중 하나에 속하며, 고유한 특성과 상성을 가집니다.
        </p>
      </section>
      
      <div class="warning-box">
        <h3>🔍 참고 사항</h3>
        <p>
          바이오리듬과 별자리 운세는 과학적으로 검증되지 않은 이론입니다. 
          재미있는 참고 자료로 활용하되, 중요한 결정의 근거로 삼지 않는 것을 권장합니다.
        </p>
      </div>
    </div>
  `;
}