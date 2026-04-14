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

function getPlayerScores(email) {
    const data = JSON.parse(localStorage.getItem('roastRoyaleScores') || '{}');
    return data[email] || { highScore: 0, lastScore: 0, gamesPlayed: 0 };
}

function savePlayerScore(email, score) {
    const data = JSON.parse(localStorage.getItem('roastRoyaleScores') || '{}');
    const existing = data[email] || { highScore: 0, lastScore: 0, gamesPlayed: 0 };
    existing.lastScore = score;
    existing.gamesPlayed++;
    if (score > existing.highScore) existing.highScore = score;
    data[email] = existing;
    localStorage.setItem('roastRoyaleScores', JSON.stringify(data));
}

function updateLoginUI() {
    const googleBtnContainer = document.getElementById('googleBtnContainer');
    const userInfo = document.getElementById('userInfo');
    const scoreCards = document.getElementById('scoreCards');
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
        googleBtnContainer.style.display = 'block';
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
    }
    .topbar-btn:hover { border-color: #00e5ff; color: #00e5ff; }
    .topbar-btn.google { background: #fff; color: #333; border-color: #fff; }
    .topbar-btn.google:hover { background: #e0e0e0; }
    .topbar-btn.google img { width: 18px; height: 18px; }
    .user-info { display: none; align-items: center; gap: 10px; }
    .user-avatar { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #00e5ff; }
    .user-name { font-weight: 700; font-size: 0.85rem; color: #00e5ff; }
    .signout-btn { background: none; border: 1px solid rgba(255,255,255,0.3); color: #aaa; padding: 3px 10px; font-size: 0.7rem; cursor: pointer; border-radius: 4px; font-family: 'Rajdhani', sans-serif; }
    .signout-btn:hover { color: #ff4444; border-color: #ff4444; }
    .topbar-btn.highlight { background: #ff4444; border-color: #ff4444; }

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
        <div class="sidebar-item active"><span class="icon">🏠</span>Home</div>
        <div class="sidebar-item"><span class="icon">🛒</span>Shop</div>
        <div class="sidebar-item"><span class="icon">⚔️</span>Challenges</div>
        <div class="sidebar-item"><span class="icon">👥</span>Social</div>
        <div class="sidebar-item"><span class="icon">🏆</span>Events</div>
        <div class="sidebar-item"><span class="icon">🎮</span>Games</div>
        <div class="sidebar-item" style="margin-top:auto"><span class="icon">⚙️</span>Settings</div>
    </div>

    <!-- TOP BAR -->
    <div class="game-topbar">
        <div id="googleBtnContainer" style="pointer-events:auto;"></div>
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
    alarmOverlay.querySelector('.game-sidebar').style.display = 'none';
    alarmOverlay.querySelector('.game-topbar').style.display = 'none';
    alarmOverlay.querySelector('.alert-banner').style.display = 'none';
    document.getElementById('killFeed').style.display = 'none';
    document.getElementById('trapGameCanvas').style.display = 'block';
    document.getElementById('gameHud').style.display = 'block';
    document.getElementById('gameCrosshair').style.display = 'block';

    startCanvasGame();
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
        if (gameActive) {
            // Go back to lobby — restore ALL lobby elements
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

    // Background stars
    for (let i = 0; i < 100; i++) {
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 + 0.5, a: Math.random() });
    }

    const crosshair = document.getElementById('gameCrosshair');

    const onMouseMove = (e) => {
        player.angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
        crosshair.style.left = e.clientX + 'px';
        crosshair.style.top = e.clientY + 'px';
    };

    const onMouseDown = (e) => {
        if (!gameActive) return;
        bullets.push({
            x: player.x + Math.cos(player.angle) * 30,
            y: player.y + Math.sin(player.angle) * 30,
            vx: Math.cos(player.angle) * 18,
            vy: Math.sin(player.angle) * 18,
            life: 60
        });
    };

    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);

    // Enemy spawner
    window.enemySpawnInterval = setInterval(() => {
        if (!gameActive) return;
        let ex, ey;
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { ex = Math.random() * canvas.width; ey = -40; }
        else if (side === 1) { ex = canvas.width + 40; ey = Math.random() * canvas.height; }
        else if (side === 2) { ex = Math.random() * canvas.width; ey = canvas.height + 40; }
        else { ex = -40; ey = Math.random() * canvas.height; }

        const types = ['🤡', '👹', '💀', '👾', '🤖'];
        enemies.push({ x: ex, y: ey, radius: 22, speed: 1.5 + Math.random() * 2, type: types[Math.floor(Math.random() * types.length)] });
    }, 700);

    function gameLoop() {
        if (!gameActive) {
            window.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mousedown', onMouseDown);
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

        // Update & Draw Bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.x += b.vx; b.y += b.vy; b.life--;

            ctx.fillStyle = '#ffcc00';
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // Bullet trail
            ctx.strokeStyle = 'rgba(255,204,0,0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * 2, b.y - b.vy * 2); ctx.stroke();

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
                    killScore += 100;
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
                const livesLeft = 5 - playerHits;
                document.getElementById('gameLives').innerText = '❤️'.repeat(Math.max(0, livesLeft)) + '🖤'.repeat(playerHits);
                // Red flash
                ctx.fillStyle = 'rgba(255,0,0,0.35)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 5 hits = game over → save score & send back to portfolio
                if (playerHits >= 5) {
                    gameActive = false;
                    if (window.enemySpawnInterval) clearInterval(window.enemySpawnInterval);
                    // Save score if logged in
                    if (currentUser) {
                        savePlayerScore(currentUser.email, killScore);
                    }
                    closeOverlay();
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
            container.innerHTML = '';
            google.accounts.id.renderButton(container, {
                theme: 'filled_black',
                size: 'medium',
                text: 'signin_with',
                shape: 'rectangular'
            });
        }
    }
    updateLoginUI();
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
