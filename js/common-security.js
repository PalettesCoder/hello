/* Global Security Script - Harsha Royal Portfolio */

// 1. Disable Right Click
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Ctrl+U, PrintScreen)
document.addEventListener('keydown', (event) => {
    // F12
    if (event.keyCode === 123) {
        event.preventDefault();
        return false;
    }
    // Ctrl+Shift+I (Inspect)
    if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
        event.preventDefault();
        return false;
    }
    // Ctrl+Shift+C (Inspect Element)
    if (event.ctrlKey && event.shiftKey && event.keyCode === 67) {
        event.preventDefault();
        return false;
    }
    // Ctrl+Shift+J (Console)
    if (event.ctrlKey && event.shiftKey && event.keyCode === 74) {
        event.preventDefault();
        return false;
    }
    // Ctrl+U (View Source)
    if (event.ctrlKey && event.keyCode === 85) {
        event.preventDefault();
        return false;
    }
    // PrintScreen (Key code 44)
    if (event.keyCode === 44) {
        event.preventDefault();
        alert('Screenshots are disabled for privacy.');
        return false;
    }
    // Ctrl + P (Print)
    if (event.ctrlKey && event.keyCode === 80) {
        event.preventDefault();
        return false;
    }
    // Ctrl + S (Save)
    if (event.ctrlKey && event.keyCode === 83) {
        event.preventDefault();
        return false;
    }
});

// 3. Prevent Image Dragging
document.addEventListener('dragstart', (event) => {
    if (event.target.tagName === 'IMG') {
        event.preventDefault();
    }
});

// 4. Enhanced PC Screenshot Protection (Blur & Overlay)
const style = document.createElement('style');
style.innerHTML = `
    .privacy-shield {
        position: fixed;
        inset: 0;
        background: #000;
        z-index: 999999;
        display: none;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-family: 'Inter', sans-serif;
        text-align: center;
        padding: 40px;
    }
    body.is-blurred .privacy-shield {
        display: flex;
    }
    body.is-blurred > *:not(.privacy-shield) {
        filter: blur(20px);
        pointer-events: none;
    }
`;
document.head.appendChild(style);

const shield = document.createElement('div');
shield.className = 'privacy-shield';
shield.innerHTML = `
    <div>
        <h2 style="font-size: 24px; margin-bottom: 16px;">Privacy Protection Active</h2>
        <p style="opacity: 0.7;">Content is hidden while window is inactive to prevent unauthorized captures.</p>
    </div>
`;
document.body.appendChild(shield);

window.addEventListener('blur', () => {
    document.body.classList.add('is-blurred');
    document.title = "Screenshot Protected | Harsha Royal";
});

window.addEventListener('focus', () => {
    document.body.classList.remove('is-blurred');
    document.title = "Harsha Royal | UI Developer & Product Designer";
});

// 5. Additional Key Blocking for PC Screenshot Tools
document.addEventListener('keyup', (e) => {
    // Windows + Shift + S or PrintScreen check
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
        navigator.clipboard.writeText(""); // Clear clipboard
        alert('Screenshots are disabled on this portfolio.');
    }
});

// 6. Prevent Desktop Install (PWA Install Prompt)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    return false;
});
