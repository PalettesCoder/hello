/* 🛡️ Harsha Royal Portfolio - FPS Game Lobby Security Screen */

// Silent operation - no annoying sirens
const startSiren = () => {};
const stopSiren = () => {};

// ===== GOOGLE SIGN-IN =====
// Replace with your Google OAuth Client ID from https://console.cloud.google.com/
const GOOGLE_CLIENT_ID = '818346747129-b57boo9gr4ra5hs0jg5hcvlilb2ith6c.apps.googleusercontent.com';

let currentUser = JSON.parse(localStorage.getItem('roastRoyaleUser') || 'null');

// Load Google Identity Services
const gsiScript = document.createElement('script');
gsiScript.src = 'https://accounts.google.com/gsi/client';
gsiScript.async = true;
gsiScript.defer = true;
document.head.appendChild(gsiScript);

function handleGoogleSignIn(response) {
    // Decode JWT token
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    currentUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
    };
    localStorage.setItem('roastRoyaleUser', JSON.stringify(currentUser));
    updateLoginUI();
}

function signOut() {
    currentUser = null;
    localStorage.removeItem('roastRoyaleUser');
    updateLoginUI();
}

// ===== 10-LEVEL SYSTEM =====
const LEVELS = [
    {
        id: 1, name: 'Training Grounds', icon: '🎯', difficulty: 'EASY',
        description: 'Learn the ropes. Slow enemies, big targets.',
        color: '#4CAF50', enemySpeed: 1.0, enemyRadius: 28, spawnRate: 1200,
        lives: 7, scoreMultiplier: 1, enemyTypes: ['🤡', '👾'],
        unlockScore: 0, starThresholds: [200, 500, 1000]
    },
    {
        id: 2, name: 'Rookie Arena', icon: '⚔️', difficulty: 'EASY',
        description: 'Slightly faster enemies. Time to warm up.',
        color: '#66BB6A', enemySpeed: 1.3, enemyRadius: 26, spawnRate: 1000,
        lives: 6, scoreMultiplier: 1.2, enemyTypes: ['🤡', '👾', '👹'],
        unlockScore: 300, starThresholds: [400, 800, 1500]
    },
    {
        id: 3, name: 'Street Brawl', icon: '🥊', difficulty: 'MEDIUM',
        description: 'Enemies get aggressive. Watch your six.',
        color: '#FFC107', enemySpeed: 1.6, enemyRadius: 24, spawnRate: 850,
        lives: 6, scoreMultiplier: 1.5, enemyTypes: ['🤡', '👾', '👹', '💀'],
        unlockScore: 800, starThresholds: [600, 1200, 2000]
    },
    {
        id: 4, name: 'Cyber Alley', icon: '🌃', difficulty: 'MEDIUM',
        description: 'Neon-lit chaos. More enemies, faster pace.',
        color: '#FF9800', enemySpeed: 1.9, enemyRadius: 22, spawnRate: 700,
        lives: 5, scoreMultiplier: 1.8, enemyTypes: ['🤡', '👾', '👹', '💀', '🤖'],
        unlockScore: 1500, starThresholds: [800, 1600, 2800]
    },
    {
        id: 5, name: 'Flame Circuit', icon: '🔥', difficulty: 'MEDIUM',
        description: 'The heat is on. Smaller targets, faster spawns.',
        color: '#FF5722', enemySpeed: 2.2, enemyRadius: 20, spawnRate: 600,
        lives: 5, scoreMultiplier: 2.0, enemyTypes: ['👹', '💀', '🤖', '👾', '🧟'],
        unlockScore: 2500, starThresholds: [1000, 2000, 3500]
    },
    {
        id: 6, name: 'Skull Canyon', icon: '💀', difficulty: 'HARD',
        description: 'Relentless waves. Only skilled players survive.',
        color: '#E91E63', enemySpeed: 2.5, enemyRadius: 18, spawnRate: 500,
        lives: 4, scoreMultiplier: 2.5, enemyTypes: ['💀', '🤖', '👹', '🧟', '👿'],
        unlockScore: 4000, starThresholds: [1500, 3000, 5000]
    },
    {
        id: 7, name: 'Demon Gates', icon: '👿', difficulty: 'HARD',
        description: 'Portal opens. Enemies flood from all sides.',
        color: '#9C27B0', enemySpeed: 2.8, enemyRadius: 16, spawnRate: 420,
        lives: 4, scoreMultiplier: 3.0, enemyTypes: ['💀', '🤖', '👿', '🧟', '☠️'],
        unlockScore: 6000, starThresholds: [2000, 4000, 7000]
    },
    {
        id: 8, name: 'Inferno Pit', icon: '🌋', difficulty: 'EXTREME',
        description: 'Tiny targets, blazing speed. Pure chaos.',
        color: '#F44336', enemySpeed: 3.2, enemyRadius: 14, spawnRate: 350,
        lives: 3, scoreMultiplier: 4.0, enemyTypes: ['👿', '☠️', '🧟', '💀', '🔥'],
        unlockScore: 9000, starThresholds: [3000, 6000, 10000]
    },
    {
        id: 9, name: 'Void Abyss', icon: '🕳️', difficulty: 'EXTREME',
        description: 'Near-invisible enemies. Reflexes at max.',
        color: '#7B1FA2', enemySpeed: 3.6, enemyRadius: 12, spawnRate: 280,
        lives: 2, scoreMultiplier: 5.0, enemyTypes: ['☠️', '🧟', '👿', '🌑', '💀'],
        unlockScore: 13000, starThresholds: [4000, 8000, 15000]
    },
    {
        id: 10, name: 'ROAST GOD', icon: '👑', difficulty: 'NIGHTMARE',
        description: 'One life. Microscopic targets. Ultimate test.',
        color: '#FFD700', enemySpeed: 4.0, enemyRadius: 10, spawnRate: 220,
        lives: 1, scoreMultiplier: 10.0, enemyTypes: ['👑', '☠️', '👿', '🔥', '💀'],
        unlockScore: 20000, starThresholds: [5000, 12000, 25000]
    }
];

let currentLevel = null;

function getPlayerScores(email) {
    const data = JSON.parse(localStorage.getItem('roastRoyaleScores') || '{}');
    return data[email] || { highScore: 0, lastScore: 0, gamesPlayed: 0, levelScores: {} };
}

function savePlayerScore(email, score) {
    const data = JSON.parse(localStorage.getItem('roastRoyaleScores') || '{}');
    const existing = data[email] || { highScore: 0, lastScore: 0, gamesPlayed: 0, levelScores: {} };
    existing.lastScore = score;
    existing.gamesPlayed++;
    if (score > existing.highScore) existing.highScore = score;
    // Save per-level best score
    if (currentLevel) {
        const lvlKey = 'level_' + currentLevel.id;
        if (!existing.levelScores) existing.levelScores = {};
        if (!existing.levelScores[lvlKey] || score > existing.levelScores[lvlKey]) {
            existing.levelScores[lvlKey] = score;
        }
    }
    data[email] = existing;
    localStorage.setItem('roastRoyaleScores', JSON.stringify(data));
}

function getTotalBestScore() {
    if (!currentUser) return 0;
    const scores = getPlayerScores(currentUser.email);
    return scores.highScore || 0;
}

function getLevelBestScore(levelId) {
    if (!currentUser) return 0;
    const scores = getPlayerScores(currentUser.email);
    return (scores.levelScores && scores.levelScores['level_' + levelId]) || 0;
}

function getStarsForLevel(levelId) {
    const best = getLevelBestScore(levelId);
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return 0;
    let stars = 0;
    for (const threshold of level.starThresholds) {
        if (best >= threshold) stars++;
    }
    return stars;
}

function isLevelUnlocked(level) {
    if (level.id === 1) return true;
    return getTotalBestScore() >= level.unlockScore;
}

function updateLoginUI() {
    const googleBtnContainer = document.getElementById('googleBtnContainer');
    const userInfo = document.getElementById('userInfo');
    const scoreCards = document.getElementById('scoreCards');
    const fallbackBtn = document.getElementById('googleFallbackBtn');
    if (!googleBtnContainer) return;

    if (currentUser) {
        googleBtnContainer.style.display = 'none';
        userInfo.style.display = 'flex';
        userInfo.querySelector('.user-avatar').src = currentUser.picture || '';
        userInfo.querySelector('.user-name').textContent = currentUser.name || currentUser.email;
        // Load scores
        const scores = getPlayerScores(currentUser.email);
        if (scoreCards) {
            scoreCards.style.display = 'block';
            document.getElementById('highScoreVal').textContent = scores.highScore;
            document.getElementById('lastScoreVal').textContent = scores.lastScore;
            document.getElementById('gamesPlayedVal').textContent = scores.gamesPlayed;
        }
    } else {
        googleBtnContainer.style.display = 'flex';
        if (fallbackBtn) fallbackBtn.style.display = 'inline-flex';
        userInfo.style.display = 'none';
        if (scoreCards) scoreCards.style.display = 'none';
    }
}

// 1. Global Security Logic
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (event) => {
    const isBlocked = 
        (event.keyCode === 123) ||
        (event.ctrlKey && event.shiftKey && [73, 67, 74].includes(event.keyCode)) ||
        (event.ctrlKey && event.keyCode === 85) ||
        (event.key === 'PrintScreen' || event.keyCode === 44) ||
        (event.shiftKey && (event.metaKey || event.ctrlKey && event.keyCode === 83));

    if (isBlocked) {
        event.preventDefault();
        triggerAlarm();
        return false;
    }

    if (event.ctrlKey && (event.keyCode === 67 || event.keyCode === 88)) {
        event.preventDefault();
        triggerAlarm();
        return false;
    }
});

// 2. STYLES — KRUNKER-STYLE FPS GAME LOBBY
const securityStyles = document.createElement('style');
securityStyles.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Rajdhani:wght@500;700&family=Press+Start+2P&display=swap');
    
    .security-overlay {
        position: fixed; inset: 0; z-index: 10000000;
        display: none; background: #1a1a2e; color: white;
        font-family: 'Rajdhani', sans-serif; overflow: hidden;
        user-select: none;
    }
    .security-overlay.active { display: block; }

    /* ===== GAME SCENE BACKGROUND ===== */
    .game-scene {
        position: absolute; inset: 0; z-index: 0;
        background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
        overflow: hidden;
    }
    .game-scene::before {
        content: ''; position: absolute; inset: 0;
        background: 
            linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 80px);
    }
    .game-scene .floor {
        position: absolute; bottom: 0; left: 0; right: 0; height: 45%;
        background: linear-gradient(0deg, #8B6914 0%, #A0782C 30%, #C4944A 60%, #D4A45A 100%);
        transform: perspective(800px) rotateX(35deg); transform-origin: bottom;
    }
    .game-scene .wall-left {
        position: absolute; left: 0; top: 10%; width: 30%; height: 60%;
        background: linear-gradient(90deg, #6B4E12 0%, #8B6914 40%, transparent 100%);
        clip-path: polygon(0 0, 60% 10%, 60% 90%, 0 100%);
    }
    .game-scene .wall-right {
        position: absolute; right: 0; top: 10%; width: 30%; height: 60%;
        background: linear-gradient(-90deg, #6B4E12 0%, #8B6914 40%, transparent 100%);
        clip-path: polygon(40% 10%, 100% 0, 100% 100%, 40% 90%);
    }
    .game-scene .ceiling-light {
        position: absolute; top: 15%; width: 200px; height: 8px;
        background: #ffcc00; border-radius: 50%;
        box-shadow: 0 0 60px 30px rgba(255,204,0,0.4), 0 0 120px 60px rgba(255,204,0,0.15);
    }
    .game-scene .ceiling-light:nth-child(4) { left: 25%; }
    .game-scene .ceiling-light:nth-child(5) { left: 55%; }

    /* ===== SIDEBAR ===== */
    .game-sidebar {
        position: absolute; left: 0; top: 0; bottom: 0; width: 70px;
        background: rgba(0,0,0,0.92); z-index: 10; display: flex; flex-direction: column;
        align-items: center; padding-top: 15px; gap: 4px;
        border-right: 2px solid rgba(255,255,255,0.1);
    }
    .sidebar-item {
        width: 58px; padding: 10px 0; text-align: center; cursor: pointer;
        border-radius: 8px; transition: all 0.2s; font-size: 0.65rem; font-weight: 700;
        color: rgba(255,255,255,0.6); letter-spacing: 0.5px;
    }
    .sidebar-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .sidebar-item .icon { font-size: 1.4rem; margin-bottom: 3px; display: block; }
    .sidebar-item.active { color: #00e5ff; }

    /* ===== TOP BAR ===== */
    .game-topbar {
        position: absolute; top: 0; left: 70px; right: 0; height: 50px;
        background: rgba(0,0,0,0.85); z-index: 10; display: flex;
        align-items: center; padding: 0 20px; gap: 15px;
        border-bottom: 2px solid rgba(255,255,255,0.1);
    }
    .topbar-btn {
        padding: 6px 16px; border: 2px solid rgba(255,255,255,0.3); background: transparent;
        color: #fff; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.85rem;
        cursor: pointer; transition: all 0.2s; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px;
        pointer-events: auto;
    }
    .topbar-btn:hover { border-color: #00e5ff; color: #00e5ff; }
    .topbar-btn.google { background: #fff; color: #333; border-color: #fff; font-size: 0.8rem; }
    .topbar-btn.google:hover { background: #e0e0e0; }
    .topbar-btn.google img { width: 18px; height: 18px; }
    .topbar-btn.google svg { width: 18px; height: 18px; flex-shrink: 0; }
    .user-info { display: none; align-items: center; gap: 10px; pointer-events: auto; }
    .user-avatar { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #00e5ff; }
    .user-name { font-weight: 700; font-size: 0.85rem; color: #00e5ff; }
    .signout-btn { background: none; border: 1px solid rgba(255,255,255,0.3); color: #aaa; padding: 3px 10px; font-size: 0.7rem; cursor: pointer; border-radius: 4px; font-family: 'Rajdhani', sans-serif; pointer-events: auto; }
    .signout-btn:hover { color: #ff4444; border-color: #ff4444; }
    .topbar-btn.highlight { background: #ff4444; border-color: #ff4444; }
    #googleBtnContainer { pointer-events: auto; min-height: 36px; display: flex; align-items: center; }
    .google-fallback-btn {
        display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px;
        background: #fff; color: #3c4043; border: 1px solid #dadce0; border-radius: 4px;
        font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.85rem;
        cursor: pointer; transition: all 0.2s; pointer-events: auto;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .google-fallback-btn:hover { background: #f1f3f4; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
    .google-fallback-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

    .game-title {
        position: absolute; left: 50%; transform: translateX(-50%);
        font-family: 'Bungee', sans-serif; font-size: 1.6rem; letter-spacing: 4px;
        background: linear-gradient(180deg, #ff4444, #ff8800);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        text-shadow: none; filter: drop-shadow(0 2px 8px rgba(255,68,68,0.5));
    }

    /* ===== CENTER CLICK TO PLAY ===== */
    .click-to-play {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        z-index: 5; text-align: center; cursor: pointer; pointer-events: auto;
    }
    .click-to-play h1 {
        font-family: 'Press Start 2P', monospace; font-size: 3rem; color: #fff;
        text-shadow: 4px 4px 0 #000, 0 0 40px rgba(255,255,255,0.3);
        animation: pulse-glow 2s infinite; letter-spacing: 6px;
    }
    .click-to-play .subtitle {
        font-size: 1.1rem; color: rgba(255,255,255,0.5); margin-top: 12px;
        font-weight: 700; letter-spacing: 2px;
    }

    /* ===== BOTTOM MENU BAR ===== */
    .game-bottom {
        position: absolute; bottom: 0; left: 70px; right: 0; height: 100px;
        background: rgba(0,0,0,0.88); z-index: 10; display: flex;
        flex-direction: column; align-items: center; justify-content: center; gap: 10px;
        border-top: 2px solid rgba(255,255,255,0.1);
    }
    .bottom-info {
        font-size: 0.95rem; font-weight: 700; color: rgba(255,255,255,0.7);
        letter-spacing: 1px;
    }
    .bottom-info span { color: #ffcc00; }
    .bottom-buttons {
        display: flex; gap: 8px;
    }
    .game-btn {
        padding: 10px 22px; border: 2px solid rgba(255,255,255,0.4); background: rgba(0,0,0,0.6);
        color: #fff; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 1rem;
        cursor: pointer; transition: all 0.2s; letter-spacing: 1px;
    }
    .game-btn:hover { background: rgba(255,255,255,0.15); border-color: #fff; transform: translateY(-2px); }
    .game-btn.primary { background: #00e5ff; border-color: #00e5ff; color: #000; }
    .game-btn.primary:hover { background: #00b8d4; }
    .game-btn.danger { border-color: #ff4444; color: #ff4444; }
    .game-btn.danger:hover { background: #ff4444; color: #fff; }

    /* ===== RIGHT PANEL (Player Info) ===== */
    .player-panel {
        position: absolute; right: 15px; top: 65px; width: 240px; z-index: 10;
        display: flex; flex-direction: column; gap: 10px;
    }
    .player-card {
        background: rgba(0,0,0,0.85); border: 2px solid rgba(255,255,255,0.15);
        padding: 16px; border-radius: 8px;
    }
    .player-card .label { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; }
    .player-card .value { font-size: 1.3rem; font-weight: 700; color: #fff; }
    .player-card .value.red { color: #ff4444; }
    .player-card .value.cyan { color: #00e5ff; }

    .weapon-display {
        background: rgba(0,0,0,0.85); border: 2px solid #00e5ff; padding: 14px; border-radius: 8px;
        text-align: center;
    }
    .weapon-display .weapon-name { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 10px; }
    .weapon-display .weapon-btn {
        width: 100%; padding: 10px; border: 2px solid #00e5ff; background: transparent;
        color: #00e5ff; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 1rem;
        cursor: pointer; margin-top: 6px; transition: all 0.2s;
    }
    .weapon-display .weapon-btn:hover { background: #00e5ff; color: #000; }

    /* ===== ALERT BANNER (Screenshot Warning) ===== */
    .alert-banner {
        position: absolute; top: 55px; left: 50%; transform: translateX(-50%);
        z-index: 15; background: rgba(255,30,30,0.95); padding: 8px 30px;
        border-radius: 6px; font-weight: 700; font-size: 1rem; letter-spacing: 1px;
        box-shadow: 0 4px 30px rgba(255,0,0,0.5); animation: slide-down 0.4s forwards;
        white-space: nowrap; border: 2px solid #ff6666;
    }
    .alert-banner .ip { color: #ffcc00; font-family: 'Bungee', sans-serif; }

    /* ===== KILL FEED (Top Right) ===== */
    .kill-feed {
        position: absolute; top: 65px; left: 85px; z-index: 12;
        display: flex; flex-direction: column; gap: 6px; max-width: 400px;
    }
    .kill-item {
        background: rgba(0,0,0,0.75); padding: 8px 14px; font-size: 0.85rem;
        font-weight: 700; border-left: 4px solid #ff4444; color: rgba(255,255,255,0.9);
        opacity: 0; animation: feed-in 0.3s forwards; letter-spacing: 0.5px;
    }

    /* ===== GAME CANVAS ===== */
    #trapGameCanvas {
        position: absolute; inset: 0; z-index: 3; display: none; cursor: crosshair;
    }
    .game-hud {
        position: absolute; top: 55px; left: 50%; transform: translateX(-50%);
        z-index: 20; text-align: center; display: none;
    }
    .game-hud .score { font-family: 'Bungee', sans-serif; font-size: 3rem; color: #fff; text-shadow: 3px 3px 0 #000; }
    .game-hud .score span { color: #ffcc00; }
    .game-hud .hint { font-size: 0.9rem; color: rgba(255,255,255,0.5); }
    .game-hud .lives { font-size: 1.8rem; letter-spacing: 4px; margin: 6px 0; }

    /* Crosshair for game mode */
    .game-crosshair {
        position: fixed; z-index: 25; pointer-events: none; display: none;
    }
    .game-crosshair::before, .game-crosshair::after {
        content: ''; position: absolute; background: rgba(255,255,255,0.9);
    }
    .game-crosshair::before { width: 20px; height: 2px; top: 50%; left: 50%; transform: translate(-50%, -50%); }
    .game-crosshair::after { width: 2px; height: 20px; top: 50%; left: 50%; transform: translate(-50%, -50%); }

    /* ===== ANIMATIONS ===== */
    @keyframes pulse-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
    @keyframes slide-down { 0% { transform: translateX(-50%) translateY(-30px); opacity: 0; } 100% { transform: translateX(-50%) translateY(0); opacity: 1; } }
    @keyframes feed-in { 0% { transform: translateX(-40px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }

    /* ===== LEVELS SCREEN ===== */
    .levels-screen {
        position: absolute; inset: 50px 0 100px 70px; z-index: 15;
        background: rgba(8, 8, 25, 0.97); display: none;
        flex-direction: column; padding: 30px 40px; overflow-y: auto;
    }
    .levels-screen.active { display: flex; }
    .levels-screen::-webkit-scrollbar { width: 6px; }
    .levels-screen::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
    .levels-header {
        display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px;
    }
    .levels-title {
        font-family: 'Bungee', sans-serif; font-size: 2.5rem; color: #ffcc00;
        text-shadow: 0 0 20px rgba(255, 204, 0, 0.5);
    }
    .levels-subtitle {
        font-size: 1rem; color: rgba(255,255,255,0.5); font-weight: 700; letter-spacing: 1px;
    }
    .difficulty-legend {
        display: flex; gap: 15px; align-items: center;
    }
    .difficulty-tag {
        padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.7rem;
        letter-spacing: 1px; border: 1px solid;
    }
    .difficulty-tag.easy { color: #4CAF50; border-color: #4CAF50; }
    .difficulty-tag.medium { color: #FF9800; border-color: #FF9800; }
    .difficulty-tag.hard { color: #E91E63; border-color: #E91E63; }
    .difficulty-tag.extreme { color: #9C27B0; border-color: #9C27B0; }
    .difficulty-tag.nightmare { color: #FFD700; border-color: #FFD700; background: rgba(255,215,0,0.1); }
    .levels-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;
    }
    .level-card {
        background: rgba(255, 255, 255, 0.04); border: 2px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px; padding: 0; cursor: pointer; transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        display: flex; flex-direction: column; position: relative; overflow: hidden;
    }
    .level-card:hover:not(.locked) {
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
    }
    .level-card-top {
        padding: 20px 20px 15px; position: relative;
        background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 100%);
    }
    .level-number {
        position: absolute; top: 12px; right: 15px;
        font-family: 'Bungee', sans-serif; font-size: 2.8rem; color: rgba(255,255,255,0.06);
        line-height: 1;
    }
    .level-icon { font-size: 2.8rem; margin-bottom: 8px; display: block; }
    .level-card h3 {
        font-family: 'Bungee', sans-serif; font-size: 1.2rem; color: #fff; margin: 0 0 4px;
    }
    .level-difficulty {
        display: inline-block; padding: 2px 10px; border-radius: 12px;
        font-size: 0.65rem; font-weight: 700; letter-spacing: 1.5px;
        margin-bottom: 8px;
    }
    .level-card p {
        font-size: 0.9rem; color: rgba(255, 255, 255, 0.5); margin: 0; line-height: 1.4;
    }
    .level-card-bottom {
        padding: 12px 20px; display: flex; align-items: center; justify-content: space-between;
        background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.06);
    }
    .level-stars { font-size: 1.2rem; letter-spacing: 4px; }
    .level-stars .earned { filter: none; }
    .level-stars .empty { filter: grayscale(1) brightness(0.3); }
    .level-best-score {
        font-size: 0.8rem; color: rgba(255,255,255,0.4); font-weight: 700;
    }
    .level-best-score span { color: #ffcc00; }
    .level-card .level-play-btn {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) scale(0);
        background: rgba(0, 229, 255, 0.95); color: #000; border: none; padding: 10px 28px;
        font-family: 'Bungee', sans-serif; font-size: 1rem; border-radius: 8px;
        cursor: pointer; transition: all 0.3s; z-index: 5; pointer-events: none;
        box-shadow: 0 4px 20px rgba(0,229,255,0.4);
    }
    .level-card:hover:not(.locked) .level-play-btn {
        transform: translate(-50%,-50%) scale(1); pointer-events: auto;
    }
    .level-card.locked {
        opacity: 0.4; filter: grayscale(0.8); cursor: not-allowed;
    }
    .level-card.locked::after {
        content: ''; position: absolute; inset: 0;
        background: rgba(0,0,0,0.55); z-index: 4;
    }
    .level-lock-info {
        position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%);
        font-size: 0.75rem; color: rgba(255,255,255,0.6); white-space: nowrap;
        font-weight: 700; letter-spacing: 0.5px; z-index: 5;
    }
    .level-lock-icon {
        position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
        font-size: 3rem; z-index: 5; filter: drop-shadow(0 0 10px rgba(0,0,0,0.8));
    }
    /* Level card dynamic border glow on hover */
    .level-card::before {
        content: ''; position: absolute; inset: -2px; border-radius: 18px;
        background: linear-gradient(135deg, var(--card-color), transparent 60%);
        z-index: -1; opacity: 0; transition: opacity 0.35s;
    }
    .level-card:hover:not(.locked)::before { opacity: 1; }
    /* Game Over overlay */
    .game-over-overlay {
        position: fixed; inset: 0; z-index: 30; display: none;
        background: rgba(0,0,0,0.85); flex-direction: column;
        align-items: center; justify-content: center; gap: 20px;
    }
    .game-over-overlay.active { display: flex; }
    .game-over-title {
        font-family: 'Bungee', sans-serif; font-size: 4rem; color: #ff4444;
        text-shadow: 0 0 30px rgba(255,68,68,0.5);
    }
    .game-over-score {
        font-family: 'Bungee', sans-serif; font-size: 2rem; color: #ffcc00;
    }
    .game-over-stars { font-size: 3rem; letter-spacing: 8px; margin: 10px 0; }
    .game-over-level {
        font-size: 1.1rem; color: rgba(255,255,255,0.6); font-weight: 700;
    }
    .game-over-buttons { display: flex; gap: 15px; margin-top: 15px; }
    .game-over-btn {
        padding: 12px 30px; border: 2px solid rgba(255,255,255,0.3); background: transparent;
        color: #fff; font-family: 'Bungee', sans-serif; font-size: 1rem;
        cursor: pointer; transition: all 0.2s; border-radius: 6px;
    }
    .game-over-btn:hover { border-color: #00e5ff; color: #00e5ff; transform: translateY(-2px); }
    .game-over-btn.primary { background: #00e5ff; border-color: #00e5ff; color: #000; }
    .game-over-btn.primary:hover { background: #00b8d4; }
`;
document.head.appendChild(securityStyles);

// 3. OVERLAY HTML — FPS GAME LOBBY
const alarmOverlay = document.createElement('div');
alarmOverlay.className = 'security-overlay';
alarmOverlay.innerHTML = `
    <!-- GAME SCENE BACKGROUND -->
    <div class="game-scene">
        <div class="floor"></div>
        <div class="wall-left"></div>
        <div class="wall-right"></div>
        <div class="ceiling-light"></div>
        <div class="ceiling-light"></div>
    </div>

    <!-- SIDEBAR -->
    <div class="game-sidebar">
        <div class="sidebar-item active" id="navHome"><span class="icon">🏠</span>Home</div>
        <div class="sidebar-item" id="navShop"><span class="icon">🛒</span>Shop</div>
        <div class="sidebar-item" id="navChallenges"><span class="icon">⚔️</span>Challenges</div>
        <div class="sidebar-item" id="navSocial"><span class="icon">👥</span>Social</div>
        <div class="sidebar-item" id="navEvents"><span class="icon">🏆</span>Events</div>
        <div class="sidebar-item" id="navGames"><span class="icon">🎮</span>Games</div>
        <div class="sidebar-item" style="margin-top:auto" id="navSettings"><span class="icon">⚙️</span>Settings</div>
    </div>

    <!-- TOP BAR -->
    <div class="game-topbar">
        <div id="googleBtnContainer" style="pointer-events:auto;">
            <button class="google-fallback-btn" id="googleFallbackBtn" onclick="manualGoogleSignIn()">
                <svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Sign in with Google
            </button>
        </div>
        <div class="user-info" id="userInfo">
            <img class="user-avatar" src="" alt="avatar">
            <span class="user-name"></span>
            <button class="signout-btn" onclick="signOut()">Sign Out</button>
        </div>
        <button class="topbar-btn highlight">Get Roast Rewards</button>
        <div class="game-title">ROAST ROYALE</div>
    </div>

    <!-- SCREENSHOT ALERT BANNER -->
    <div class="alert-banner">
        ⚠️ SCREENSHOT ATTEMPT DETECTED — Player IP: <span class="ip alert-ip">loading...</span> sent to squad chat for roasting 🔥
    </div>

    <!-- KILL FEED -->
    <div class="kill-feed" id="killFeed"></div>

    <!-- CENTER: CLICK TO PLAY -->
    <div class="click-to-play" id="clickToPlay">
        <h1>CLICK TO PLAY</h1>
        <div class="subtitle">Now Playing: Roast Confirmed on Screenshot Map</div>
    </div>

    <!-- LEVELS SCREEN -->
    <div class="levels-screen" id="levelsScreen">
        <div class="levels-header">
            <div>
                <div class="levels-title">SELECT LEVEL</div>
                <div class="levels-subtitle">10 levels from easy to nightmare — earn stars, unlock more!</div>
            </div>
            <div class="difficulty-legend">
                <span class="difficulty-tag easy">EASY</span>
                <span class="difficulty-tag medium">MEDIUM</span>
                <span class="difficulty-tag hard">HARD</span>
                <span class="difficulty-tag extreme">EXTREME</span>
                <span class="difficulty-tag nightmare">NIGHTMARE</span>
            </div>
        </div>
        <div class="levels-grid" id="levelsGrid"></div>
    </div>

    <!-- GAME OVER OVERLAY -->
    <div class="game-over-overlay" id="gameOverOverlay">
        <div class="game-over-title">ELIMINATED</div>
        <div class="game-over-level" id="gameOverLevel"></div>
        <div class="game-over-score" id="gameOverScore"></div>
        <div class="game-over-stars" id="gameOverStars"></div>
        <div class="game-over-buttons">
            <button class="game-over-btn primary" id="retryLevelBtn">RETRY</button>
            <button class="game-over-btn" id="backToLevelsBtn">LEVELS</button>
            <button class="game-over-btn" id="backToLobbyBtn">LOBBY</button>
        </div>
    </div>

    <!-- RIGHT PLAYER PANEL -->
    <div class="player-panel" id="playerPanel">
        <div class="player-card">
            <div class="label">Detected Player</div>
            <div class="value red ip-text">loading...</div>
        </div>
        <div class="player-card">
            <div class="label">Server</div>
            <div class="value cyan">Roast Central</div>
        </div>
        <div id="scoreCards" style="display:none;">
            <div class="player-card">
                <div class="label">🏆 High Score</div>
                <div class="value" style="color:#ffcc00" id="highScoreVal">0</div>
            </div>
            <div class="player-card">
                <div class="label">📊 Last Score</div>
                <div class="value cyan" id="lastScoreVal">0</div>
            </div>
            <div class="player-card">
                <div class="label">🎮 Games Played</div>
                <div class="value" id="gamesPlayedVal">0</div>
            </div>
        </div>
        <div class="weapon-display">
            <div class="weapon-name">🔫 Assault Rifle</div>
            <button class="weapon-btn" id="loadoutBtn">Loadout 🔄</button>
            <button class="weapon-btn" id="customizeBtn">Customize ✏️</button>
        </div>
    </div>

    <!-- BOTTOM MENU -->
    <div class="game-bottom" id="gameBottom">
        <div class="bottom-info">Now Playing: <span>Roast Confirmed</span> on <span>Oasis</span> &nbsp;&nbsp; Server: <span>India</span></div>
        <div class="bottom-buttons">
            <button class="game-btn primary" id="quickMatchBtn">Quick Match</button>
            <button class="game-btn">Ranked</button>
            <button class="game-btn">Host Game</button>
            <button class="game-btn">Find Game</button>
            <button class="game-btn">Invite</button>
            <button class="game-btn danger" id="exitGameBtn">Exit</button>
        </div>
    </div>

    <!-- GAME CANVAS (hidden until play) -->
    <canvas id="trapGameCanvas"></canvas>
    <div class="game-hud" id="gameHud">
        <div class="score">SCORE: <span id="gameScore">0</span></div>
        <div class="lives" id="gameLives">❤️❤️❤️❤️❤️</div>
        <div class="hint">Click enemies to eliminate them • ESC to exit</div>
    </div>
    <div class="game-crosshair" id="gameCrosshair"></div>
`;
document.body.appendChild(alarmOverlay);

// Mac screenshot shortcuts
document.addEventListener('keydown', (e) => {
    if (e.metaKey && e.altKey && e.keyCode === 82) triggerAlarm();
    if (e.metaKey && e.shiftKey && e.keyCode === 53) triggerAlarm();
    if (e.metaKey && e.keyCode === 71) triggerAlarm();
});

// Sidebar Navigation
const sidebarItems = ['navHome', 'navShop', 'navChallenges', 'navSocial', 'navEvents', 'navGames', 'navSettings'];
sidebarItems.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
            el.classList.add('active');

            // Hide all screens
            document.getElementById('clickToPlay').style.display = 'none';
            document.getElementById('levelsScreen').classList.remove('active');
            
            // Show selected screen
            if (id === 'navHome') {
                document.getElementById('clickToPlay').style.display = 'block';
            } else if (id === 'navChallenges' || id === 'navGames') {
                renderLevelsGrid();
                document.getElementById('levelsScreen').classList.add('active');
            } else {
                // For others, just show placeholder or home for now
                document.getElementById('clickToPlay').style.display = 'block';
            }
        });
    }
});

// ===== RENDER LEVELS GRID =====
function renderLevelsGrid() {
    const grid = document.getElementById('levelsGrid');
    grid.innerHTML = '';
    
    LEVELS.forEach(level => {
        const unlocked = isLevelUnlocked(level);
        const stars = getStarsForLevel(level.id);
        const bestScore = getLevelBestScore(level.id);
        const diffClass = level.difficulty.toLowerCase();
        
        const card = document.createElement('div');
        card.className = `level-card ${unlocked ? '' : 'locked'}`;
        card.style.setProperty('--card-color', level.color);
        card.style.borderColor = unlocked ? level.color + '40' : 'rgba(255,255,255,0.05)';
        
        const starsHTML = [0,1,2].map(i => 
            `<span class="${i < stars ? 'earned' : 'empty'}">⭐</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="level-card-top">
                <span class="level-number">${String(level.id).padStart(2, '0')}</span>
                <span class="level-icon">${level.icon}</span>
                <span class="level-difficulty difficulty-tag ${diffClass}">${level.difficulty}</span>
                <h3>${level.name}</h3>
                <p>${level.description}</p>
            </div>
            <div class="level-card-bottom">
                <div class="level-stars">${starsHTML}</div>
                <div class="level-best-score">${bestScore > 0 ? 'BEST: <span>' + bestScore + '</span>' : 'NOT PLAYED'}</div>
            </div>
            ${unlocked ? `<button class="level-play-btn">PLAY ▶</button>` : ''}
            ${!unlocked ? `<div class="level-lock-icon">🔒</div><div class="level-lock-info">Unlock at ${level.unlockScore} pts</div>` : ''}
        `;
        
        if (unlocked) {
            card.addEventListener('click', () => startLevel(level));
        }
        
        grid.appendChild(card);
    });
}

function startLevel(level) {
    currentLevel = level;
    window.gameMode = 'level';
    document.getElementById('clickToPlay').click();
}

// ===== GAME OVER OVERLAY =====
document.getElementById('retryLevelBtn').addEventListener('click', () => {
    document.getElementById('gameOverOverlay').classList.remove('active');
    if (currentLevel) {
        startLevel(currentLevel);
    }
});

document.getElementById('backToLevelsBtn').addEventListener('click', () => {
    document.getElementById('gameOverOverlay').classList.remove('active');
    // Show lobby + levels screen
    returnToLobby();
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    document.getElementById('navChallenges').classList.add('active');
    document.getElementById('clickToPlay').style.display = 'none';
    renderLevelsGrid();
    document.getElementById('levelsScreen').classList.add('active');
});

document.getElementById('backToLobbyBtn').addEventListener('click', () => {
    document.getElementById('gameOverOverlay').classList.remove('active');
    returnToLobby();
});

function returnToLobby() {
    gameActive = false;
    if (window.gameLoopId) cancelAnimationFrame(window.gameLoopId);
    if (window.enemySpawnInterval) clearInterval(window.enemySpawnInterval);
    document.getElementById('clickToPlay').style.display = 'block';
    document.getElementById('playerPanel').style.display = 'flex';
    document.getElementById('gameBottom').style.display = 'flex';
    alarmOverlay.querySelector('.game-sidebar').style.display = 'flex';
    alarmOverlay.querySelector('.game-topbar').style.display = 'flex';
    alarmOverlay.querySelector('.alert-banner').style.display = 'block';
    document.getElementById('killFeed').style.display = 'flex';
    document.getElementById('trapGameCanvas').style.display = 'none';
    document.getElementById('gameHud').style.display = 'none';
    document.getElementById('gameCrosshair').style.display = 'none';
}

// ===== SHOW GAME OVER =====
function showGameOver(score) {
    const overlay = document.getElementById('gameOverOverlay');
    const lvl = currentLevel;
    
    // Update game over display
    document.getElementById('gameOverScore').textContent = `SCORE: ${score}`;
    
    if (lvl) {
        document.getElementById('gameOverLevel').textContent = `Level ${lvl.id}: ${lvl.name} — ${lvl.difficulty}`;
        // Calculate stars earned this round
        let starsEarned = 0;
        for (const threshold of lvl.starThresholds) {
            if (score >= threshold) starsEarned++;
        }
        const starsHTML = [0,1,2].map(i => 
            i < starsEarned ? '⭐' : '✩'
        ).join(' ');
        document.getElementById('gameOverStars').textContent = starsHTML;
    } else {
        document.getElementById('gameOverLevel').textContent = 'Quick Match';
        document.getElementById('gameOverStars').textContent = '';
    }
    
    overlay.classList.add('active');
}

// 4. IP & WEBHOOK
let visitorIP = "Capturing...";
const WEBHOOK_URL = ""; 

async function fetchIP() {
    const apis = ['https://api.ipify.org?format=json', 'https://ipapi.co/json/', 'https://api.db-ip.com/v2/free/self'];
    for (const url of apis) {
        try {
            const response = await fetch(url, { timeout: 3000 });
            const data = await response.json();
            visitorIP = data.ip || data.ipAddress || "Hidden";
            if (visitorIP !== "Capturing...") break;
        } catch (e) { continue; }
    }
    if (visitorIP === "Capturing...") visitorIP = "Unknown";
}

async function logVisit(type = "Regular Visit") {
    if (visitorIP === "Capturing...") await fetchIP();
    if (WEBHOOK_URL) {
        try {
            fetch(WEBHOOK_URL, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: `🚨 **${type} Detected**\n**IP:** ${visitorIP}\n**Page:** ${window.location.pathname}\n**Device:** ${navigator.userAgent}\n**Time:** ${new Date().toLocaleString()}` })
            });
        } catch (err) {}
    }
}

fetchIP().then(() => logVisit());

// 5. GAME STATE
let particleInterval = null;
let killScore = 0;
let gameActive = false;

// 6. TRIGGER ALARM — SHOW LOBBY
async function triggerAlarm(violationType = "Security Violation") {
    if (alarmOverlay.classList.contains('active')) return;
    
    if (visitorIP === "Capturing..." || visitorIP === "Unknown") await fetchIP();

    // Fill IP into all relevant spots
    alarmOverlay.querySelectorAll('.ip-text').forEach(el => el.textContent = visitorIP);
    alarmOverlay.querySelectorAll('.alert-ip').forEach(el => el.textContent = visitorIP);

    alarmOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    gameActive = false;

    // Show lobby elements, hide game elements
    document.getElementById('clickToPlay').style.display = 'block';
    document.getElementById('playerPanel').style.display = 'flex';
    document.getElementById('gameBottom').style.display = 'flex';
    document.getElementById('trapGameCanvas').style.display = 'none';
    document.getElementById('gameHud').style.display = 'none';
    document.getElementById('gameCrosshair').style.display = 'none';

    // Refresh login state and scores
    updateLoginUI();
    tryInitGoogle();

    // Populate Kill Feed
    const feed = document.getElementById('killFeed');
    feed.innerHTML = '';
    const kills = [
        `⚠️ [Squad] is cooking ${visitorIP}...`,
        `💀 Bro got eliminated for screenshotting 😂`,
        `🔥 Roast session starting in 3...2...1...`,
        `☠️ xX_Sniper_Xx eliminated Player_${visitorIP}`
    ];
    kills.forEach((text, i) => {
        setTimeout(() => {
            const item = document.createElement('div');
            item.className = 'kill-item';
            item.textContent = text;
            feed.appendChild(item);
            setTimeout(() => { if(item.parentNode) item.remove(); }, 10000);
        }, 300 + (i * 800));
    });

    logVisit(violationType);
}

// 7. CLICK TO PLAY → START REAL GAME
document.getElementById('clickToPlay').addEventListener('click', () => {
    gameActive = true;
    killScore = 0;
    document.getElementById('gameScore').innerText = '0';

    // Hide ALL lobby UI, show game canvas
    document.getElementById('clickToPlay').style.display = 'none';
    document.getElementById('playerPanel').style.display = 'none';
    document.getElementById('gameBottom').style.display = 'none';
    document.getElementById('levelsScreen').classList.remove('active');
    alarmOverlay.querySelector('.game-sidebar').style.display = 'none';
    alarmOverlay.querySelector('.game-topbar').style.display = 'none';
    alarmOverlay.querySelector('.alert-banner').style.display = 'none';
    document.getElementById('killFeed').style.display = 'none';
    document.getElementById('trapGameCanvas').style.display = 'block';
    document.getElementById('gameHud').style.display = 'block';
    document.getElementById('gameCrosshair').style.display = 'block';

    startCanvasGame();
});

// QUICK MATCH → RESET MODE & PLAY
document.getElementById('quickMatchBtn').addEventListener('click', () => {
    window.gameMode = 'standard';
    document.getElementById('clickToPlay').click();
});

// EXIT GAME → CLOSE OVERLAY
document.getElementById('exitGameBtn').addEventListener('click', closeOverlay);

function closeOverlay() {
    alarmOverlay.classList.remove('active');
    document.body.style.overflow = '';
    gameActive = false;

    if (window.gameLoopId) cancelAnimationFrame(window.gameLoopId);
    if (window.enemySpawnInterval) clearInterval(window.enemySpawnInterval);

    const canvas = document.getElementById('trapGameCanvas');
    if (canvas) { canvas.style.display = 'none'; const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); }
}

// ESC key to exit game mode back to lobby (or close)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && alarmOverlay.classList.contains('active')) {
        // Dismiss game over overlay first
        const gameOverEl = document.getElementById('gameOverOverlay');
        if (gameOverEl.classList.contains('active')) {
            gameOverEl.classList.remove('active');
            returnToLobby();
            return;
        }
        if (gameActive) {
            // Go back to lobby
            returnToLobby();
        } else {
            closeOverlay();
        }
    }
});

// 8. THE REAL CANVAS 2D SHOOTER GAME
function startCanvasGame() {
    const canvas = document.getElementById('trapGameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const player = { x: canvas.width / 2, y: canvas.height / 2, angle: 0 };
    const bullets = [];
    const enemies = [];
    const explosions = [];
    const stars = [];
    let playerHits = 0;
    
    // Use level config if playing a level, otherwise default
    const lvl = currentLevel;
    const maxHits = lvl ? lvl.lives : 5;
    const enemySpeedBase = lvl ? lvl.enemySpeed : 1.5;
    const enemyRadiusBase = lvl ? lvl.enemyRadius : 22;
    const spawnRateMs = lvl ? lvl.spawnRate : 700;
    const scoreMultiplier = lvl ? lvl.scoreMultiplier : 1;
    const enemyTypes = lvl ? lvl.enemyTypes : ['🤡', '👹', '💀', '👾', '🤖'];
    
    // Reset lives display
    document.getElementById('gameLives').innerText = '❤️'.repeat(maxHits);
    
    // Show level info in HUD
    const hintEl = document.querySelector('.game-hud .hint');
    if (lvl && hintEl) {
        hintEl.textContent = `Level ${lvl.id}: ${lvl.name} — ${lvl.difficulty} • x${scoreMultiplier} Score • ESC to exit`;
    }

    // Background stars
    for (let i = 0; i < 100; i++) {
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 + 0.5, a: Math.random() });
    }

    const crosshair = document.getElementById('gameCrosshair');
    const BULLET_SPEED = 35;       // Much faster bullets
    const FIRE_RATE = 50;          // Fire every 50ms (20 shots/sec)
    const SPREAD_COUNT = 3;        // 3 bullets per burst
    const SPREAD_ANGLE = 0.08;     // Spread angle in radians (~4.5°)
    let mouseHeld = false;
    let fireInterval = null;

    function fireBullets() {
        if (!gameActive) return;
        for (let s = 0; s < SPREAD_COUNT; s++) {
            const offset = (s - (SPREAD_COUNT - 1) / 2) * SPREAD_ANGLE;
            const angle = player.angle + offset + (Math.random() - 0.5) * 0.04;
            bullets.push({
                x: player.x + Math.cos(angle) * 30,
                y: player.y + Math.sin(angle) * 30,
                vx: Math.cos(angle) * BULLET_SPEED,
                vy: Math.sin(angle) * BULLET_SPEED,
                life: 50
            });
        }
    }

    const onMouseMove = (e) => {
        player.angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
        crosshair.style.left = e.clientX + 'px';
        crosshair.style.top = e.clientY + 'px';
    };

    const onMouseDown = (e) => {
        if (!gameActive) return;
        mouseHeld = true;
        fireBullets(); // Immediate first burst
        if (fireInterval) clearInterval(fireInterval);
        fireInterval = setInterval(fireBullets, FIRE_RATE);
    };

    const onMouseUp = () => {
        mouseHeld = false;
        if (fireInterval) { clearInterval(fireInterval); fireInterval = null; }
    };

    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Enemy spawner — uses level config
    window.enemySpawnInterval = setInterval(() => {
        if (!gameActive) return;
        let ex, ey;
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { ex = Math.random() * canvas.width; ey = -40; }
        else if (side === 1) { ex = canvas.width + 40; ey = Math.random() * canvas.height; }
        else if (side === 2) { ex = Math.random() * canvas.width; ey = canvas.height + 40; }
        else { ex = -40; ey = Math.random() * canvas.height; }

        let radius = enemyRadiusBase + Math.random() * 4 - 2;
        let speed = enemySpeedBase + Math.random() * (enemySpeedBase * 0.5);

        enemies.push({ x: ex, y: ey, radius: radius, speed: speed, type: enemyTypes[Math.floor(Math.random() * enemyTypes.length)] });
    }, spawnRateMs);

    function gameLoop() {
        if (!gameActive) {
            window.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            if (fireInterval) { clearInterval(fireInterval); fireInterval = null; }
            return;
        }

        // Clear
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Stars
        stars.forEach(s => {
            ctx.fillStyle = `rgba(255,255,255,${s.a * 0.5})`;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        });

        // Draw Grid
        ctx.strokeStyle = 'rgba(0,229,255,0.06)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
        for (let y = 0; y < canvas.height; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

        // Muzzle flash when firing
        if (mouseHeld) {
            ctx.save();
            ctx.translate(player.x + Math.cos(player.angle) * 32, player.y + Math.sin(player.angle) * 32);
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 30;
            ctx.fillStyle = `rgba(255,204,0,${0.4 + Math.random() * 0.4})`;
            ctx.beginPath(); ctx.arc(0, 0, 8 + Math.random() * 6, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            ctx.shadowBlur = 0;
        }

        // Draw Player Ship
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(player.angle);

        // Glow
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 25;

        // Ship body
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.lineTo(-18, 18);
        ctx.lineTo(-10, 0);
        ctx.lineTo(-18, -18);
        ctx.closePath();
        ctx.fill();

        // Engine glow
        ctx.fillStyle = '#ff6600';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(-10, 0); ctx.lineTo(-22, 8); ctx.lineTo(-18 - Math.random() * 10, 0); ctx.lineTo(-22, -8);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
        ctx.shadowBlur = 0;

        // Update & Draw Bullets — fast glowing projectiles with long trails
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.x += b.vx; b.y += b.vy; b.life--;

            // Bright bullet core
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 18;
            ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill();
            
            // Outer glow ring
            ctx.fillStyle = 'rgba(255,204,0,0.6)';
            ctx.beginPath(); ctx.arc(b.x, b.y, 5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // Long glowing bullet trail
            const trailLen = 3;
            for (let t = 1; t <= trailLen; t++) {
                const alpha = 0.3 - (t * 0.08);
                const width = 3 - (t * 0.6);
                ctx.strokeStyle = `rgba(255,180,0,${Math.max(alpha, 0.05)})`;
                ctx.lineWidth = Math.max(width, 0.5);
                ctx.beginPath();
                ctx.moveTo(b.x - b.vx * (t - 1) * 0.6, b.y - b.vy * (t - 1) * 0.6);
                ctx.lineTo(b.x - b.vx * t * 0.6, b.y - b.vy * t * 0.6);
                ctx.stroke();
            }

            if (b.life <= 0 || b.x < -10 || b.x > canvas.width + 10 || b.y < -10 || b.y > canvas.height + 10) {
                bullets.splice(i, 1);
            }
        }

        // Update & Draw Enemies
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            const angle = Math.atan2(player.y - e.y, player.x - e.x);
            e.x += Math.cos(angle) * e.speed;
            e.y += Math.sin(angle) * e.speed;

            // Enemy glow ring
            ctx.strokeStyle = 'rgba(255,68,68,0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(e.x, e.y, e.radius + 5, 0, Math.PI * 2); ctx.stroke();

            ctx.fillText(e.type, e.x, e.y);

            // Collision with bullets
            for (let j = bullets.length - 1; j >= 0; j--) {
                const b = bullets[j];
                if (Math.hypot(b.x - e.x, b.y - e.y) < e.radius + 8) {
                    // Spawn explosion
                    for (let p = 0; p < 15; p++) {
                        explosions.push({
                            x: e.x, y: e.y,
                            vx: (Math.random() - 0.5) * 14,
                            vy: (Math.random() - 0.5) * 14,
                            life: 25 + Math.random() * 10,
                            color: ['#ff4444', '#ffcc00', '#ff8800', '#ffffff'][Math.floor(Math.random() * 4)]
                        });
                    }
                    enemies.splice(i, 1);
                    bullets.splice(j, 1);
                    killScore += Math.round(100 * scoreMultiplier);
                    document.getElementById('gameScore').innerText = killScore;
                    break;
                }
            }

            // Collision with player (lives system)
            if (Math.hypot(player.x - e.x, player.y - e.y) < 30) {
                enemies.splice(i, 1);
                playerHits++;
                killScore = Math.max(0, killScore - 50);
                document.getElementById('gameScore').innerText = killScore;
                // Update lives display
                const livesLeft = maxHits - playerHits;
                document.getElementById('gameLives').innerText = '❤️'.repeat(Math.max(0, livesLeft)) + '🖤'.repeat(playerHits);
                // Red flash
                ctx.fillStyle = 'rgba(255,0,0,0.35)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Hits = game over → show game over screen
                if (playerHits >= maxHits) {
                    gameActive = false;
                    if (window.enemySpawnInterval) clearInterval(window.enemySpawnInterval);
                    // Save score if logged in
                    if (currentUser) {
                        savePlayerScore(currentUser.email, killScore);
                    }
                    showGameOver(killScore);
                    return;
                }
            }
        }

        // Update & Draw Explosions
        for (let i = explosions.length - 1; i >= 0; i--) {
            const p = explosions[i];
            p.x += p.vx; p.y += p.vy; p.life--; p.vx *= 0.96; p.vy *= 0.96;
            const size = p.life / 4;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 35;
            ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
            ctx.globalAlpha = 1;
            if (p.life <= 0) explosions.splice(i, 1);
        }

        window.gameLoopId = requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

// 9. GOOGLE SIGN-IN INITIALIZATION
function initGoogleSignIn() {
    if (typeof google === 'undefined' || !google.accounts) return;

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: true
    });

    // Only render button if NOT already signed in
    if (!currentUser) {
        const container = document.getElementById('googleBtnContainer');
        if (container) {
            // Hide fallback, render real Google button
            const fallback = document.getElementById('googleFallbackBtn');
            if (fallback) fallback.style.display = 'none';
            
            // Create a sub-container for the SDK button
            let sdkDiv = container.querySelector('.gsi-btn-wrapper');
            if (!sdkDiv) {
                sdkDiv = document.createElement('div');
                sdkDiv.className = 'gsi-btn-wrapper';
                container.appendChild(sdkDiv);
            }
            sdkDiv.innerHTML = '';
            google.accounts.id.renderButton(sdkDiv, {
                theme: 'filled_black',
                size: 'medium',
                text: 'signin_with',
                shape: 'rectangular'
            });
        }
    }
    updateLoginUI();
}

// Manual Google Sign-In (fallback button click)
function manualGoogleSignIn() {
    // Check if running on local file system
    if (window.location.protocol === 'file:') {
        alert('Google Sign-In requires a web server and does not work on file:// addresses. Please host the site or use a local server.');
        console.warn('Google Sign-In blocked: Cannot run from file protocol.');
        return;
    }

    if (typeof google !== 'undefined' && google.accounts) {
        try {
            google.accounts.id.prompt(); // Show One Tap prompt
        } catch (err) {
            console.error('Google Prompt Error:', err);
            initGoogleSignIn(); // Re-init and try again
        }
    } else {
        // SDK not loaded yet — try loading again
        const fallback = document.getElementById('googleFallbackBtn');
        if (fallback) fallback.textContent = 'Loading SDK...';
        
        console.log('Attempting to reload Google SDK...');
        const retryScript = document.createElement('script');
        retryScript.src = 'https://accounts.google.com/gsi/client';
        retryScript.async = true;
        retryScript.defer = true;
        retryScript.onload = () => {
            console.log('Google SDK loaded successfully.');
            if (fallback) fallback.textContent = 'Sign in with Google';
            initGoogleSignIn();
            setTimeout(() => {
                if (google && google.accounts) google.accounts.id.prompt();
            }, 100);
        };
        retryScript.onerror = (e) => {
            console.error('Google SDK failed to load:', e);
            if (fallback) fallback.textContent = 'Sign in with Google';
            alert('Google Sign-In SDK could not be loaded. This is often caused by ad-blockers or firewall settings.');
        };
        document.head.appendChild(retryScript);
    }
}

// Auto-init Google Sign-In when script loads
gsiScript.onload = () => {
    initGoogleSignIn();
};

// Also try to init when overlay opens (in case script loaded late)
function tryInitGoogle() {
    if (typeof google !== 'undefined' && google.accounts) {
        initGoogleSignIn();
    }
}

// 10. MISC SECURITY
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
});

window.deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    window.dispatchEvent(new CustomEvent('pwaInstallAvailable'));
});
