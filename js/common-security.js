/* 🛡️ Harsha Royal Portfolio - HIGH-FIDELITY Security Suite */

// 1. Audio Siren Engine (Synthesized)
let audioCtx;
let sirenInterval;

const startSiren = () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (sirenInterval) return;

    const playTone = (freq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
    };

    let high = true;
    sirenInterval = setInterval(() => {
        playTone(high ? 960 : 640);
        high = !high;
    }, 500);
};

const stopSiren = () => {
    clearInterval(sirenInterval);
    sirenInterval = null;
};

// 2. Global Security Logic
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (event) => {
    const isBlocked = 
        (event.keyCode === 123) || // F12
        (event.ctrlKey && event.shiftKey && [73, 67, 74].includes(event.keyCode)) || // I, C, J
        (event.ctrlKey && event.keyCode === 85) || // Ctrl+U
        (event.key === 'PrintScreen' || event.keyCode === 44) || // PrntScrn
        (event.shiftKey && (event.metaKey || event.ctrlKey && event.keyCode === 83)); // Win+Shift+S

    if (isBlocked) {
        event.preventDefault();
        triggerAlarm();
        return false;
    }

    if (event.ctrlKey && (event.keyCode === 67 || event.keyCode === 88)) { // Copy/Cut
        event.preventDefault();
        triggerAlarm();
        return false;
    }
});

// 3. UI - The High-Fidelity Security Card & Full Screen Lights
const securityStyles = document.createElement('style');
securityStyles.innerHTML = `
    .security-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000000;
        display: none;
        align-items: center;
        justify-content: center;
        background: #000;
        overflow: hidden;
        pointer-events: auto;
        cursor: pointer;
    }
    .security-overlay.active {
        display: flex;
    }
    
    /* Full Screen Siren Beams */
    .siren-beams {
        position: absolute;
        width: 300%;
        height: 300%;
        background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(255, 0, 0, 0.4) 15deg,
            transparent 30deg,
            transparent 180deg,
            rgba(0, 0, 255, 0.4) 195deg,
            transparent 210deg,
            transparent 360deg
        );
        animation: rotateSiren 2s linear infinite;
        z-index: 1;
    }
    @keyframes rotateSiren {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* Security Card Styling */
    .security-card {
        position: relative;
        z-index: 10;
        background: #0e111d;
        width: 380px;
        padding: 48px 32px;
        border-radius: 40px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        box-shadow: 0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05);
        animation: cardAppear 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        backdrop-filter: blur(20px);
    }
    @keyframes cardAppear {
        0% { transform: scale(0.8) translateY(20px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
    }

    /* Protection Icon (PC Display) */
    .pc-icon-container {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto 40px;
        background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .pc-display {
        position: relative;
        width: 70px;
        height: 48px;
        border: 3px solid #38bdf8;
        border-radius: 6px;
        background: rgba(56, 189, 248, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .pc-display::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 8px;
        background: #38bdf8;
    }
    .pc-display::before {
        content: '';
        position: absolute;
        bottom: -13px;
        left: 50%;
        transform: translateX(-50%);
        width: 32px;
        height: 3px;
        background: #38bdf8;
        border-radius: 2px;
    }
    .block-sign {
        width: 24px;
        height: 24px;
        border: 2.5px solid #fff;
        border-radius: 50%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
    }
    .block-sign::after {
        content: '';
        width: 14px;
        height: 2.5px;
        background: #fff;
        transform: rotate(0deg);
    }
    
    .scan-line {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 2px;
        background: #38bdf8;
        box-shadow: 0 0 15px #38bdf8;
        animation: scanMove 2.5s ease-in-out infinite;
        z-index: 5;
    }
    @keyframes scanMove {
        0%, 100% { top: 0%; }
        50% { top: 100%; }
    }

    .security-card h2 {
        font-family: 'Inter', sans-serif;
        font-size: 24px;
        line-height: 1.3;
        font-weight: 800;
        color: #fff;
        margin: 0 0 16px 0;
        letter-spacing: -0.02em;
    }
    .security-card p {
        font-family: 'Inter', sans-serif;
        font-size: 15px;
        color: rgba(255, 255, 255, 0.5);
        line-height: 1.6;
        margin: 0;
        padding: 0 20px;
    }
    
    .reset-hint {
        position: absolute;
        bottom: 40px;
        color: rgba(255,255,255,0.4);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 600;
        z-index: 10;
    }

    /* Anti-Recording Visual Noise */
    .recording-guard {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999998;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="transparent"/><circle cx="50" cy="50" r="1" fill="white" opacity="0.05"/></svg>');
        background-size: 4px 4px;
        opacity: 0.1;
        animation: shimmerNoise 0.05s infinite;
    }
    @keyframes shimmerNoise {
        0% { transform: translate(0,0); }
        50% { transform: translate(-1px, 1px); }
        100% { transform: translate(1px, -1px); }
    }
`;
document.head.appendChild(securityStyles);

// Inject Recording Guard (Visual Noise to ruin compression)
const noiseLayer = document.createElement('div');
noiseLayer.className = 'recording-guard';
document.body.appendChild(noiseLayer);

const alarmOverlay = document.createElement('div');
alarmOverlay.className = 'security-overlay';
alarmOverlay.innerHTML = `
    <div class="siren-beams"></div>
    <div class="security-card">
        <div class="pc-icon-container">
            <div class="pc-display">
                <div class="scan-line"></div>
                <div class="block-sign"></div>
            </div>
        </div>
        <h2>My pixels just filed for a restraining order against Print Screen.</h2>
        <p>Violate again and I'll send your IP to my group chat for roasting.</p>
    </div>
    <div class="reset-hint">Click to drop charges... for now 😘</div>
`;
document.body.appendChild(alarmOverlay);

// Detect Recording Shortcuts
document.addEventListener('keydown', (e) => {
    // Win + Alt + R (Windows Recording)
    if (e.metaKey && e.altKey && e.keyCode === 82) {
        triggerAlarm();
    }
    // Command + Shift + 5 (Mac Recording)
    if (e.metaKey && e.shiftKey && e.keyCode === 53) {
        triggerAlarm();
    }
    // Windows + G (Game Bar / Recording)
    if (e.metaKey && e.keyCode === 71) {
        triggerAlarm();
    }
});

// 4. IP Tracking & Logging Logic
let visitorIP = "Unknown";
const WEBHOOK_URL = ""; // PASTE YOUR DISCORD WEBHOOK URL HERE

async function logVisit(type = "Regular Visit") {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        visitorIP = data.ip;

        if (WEBHOOK_URL) {
            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `🚨 **${type} Detected**\n**IP:** ${visitorIP}\n**Page:** ${window.location.pathname}\n**Device:** ${navigator.userAgent}\n**Time:** ${new Date().toLocaleString()}`
                })
            });
        }
    } catch (err) {
        console.error("Identity Verification Failed");
    }
}

// Initial log on page load
logVisit();

function triggerAlarm(violationType = "Security Violation") {
    if (alarmOverlay.classList.contains('active')) return;
    
    // Log the specific violation to your "group chat"
    logVisit(violationType);

    // Update UI text with real IP
    const msgPara = alarmOverlay.querySelector('.security-card p');
    msgPara.innerHTML = `Violate again and I'll send your IP (<b>${visitorIP}</b>) to my group chat for roasting.`;

    alarmOverlay.classList.add('active');
    startSiren();
    document.body.style.overflow = 'hidden';
}

alarmOverlay.addEventListener('click', () => {
    alarmOverlay.classList.remove('active');
    stopSiren();
    document.body.style.overflow = '';
});

// Focus/Blur Protection
window.addEventListener('blur', () => {
    if (!alarmOverlay.classList.contains('active')) {
        document.body.style.filter = 'blur(60px) brightness(0.1)';
        document.title = "⚠️ CONTENT PROTECTED";
    }
});
window.addEventListener('focus', () => {
    document.body.style.filter = '';
    document.title = "Harsha Royal | UI Developer & Product Designer";
});

// PWA & Image block
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
});

// PWA Install Logic - Storing the prompt instead of blocking it
window.deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    // Notify custom install button that it can be shown
    window.dispatchEvent(new CustomEvent('pwaInstallAvailable'));
});
