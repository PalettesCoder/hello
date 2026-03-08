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

// 4. Prevent Print/Screenshot via focus loss (Common trick)
window.addEventListener('blur', () => {
    document.title = "Screenshot Protected | Harsha Royal";
});

window.addEventListener('focus', () => {
    document.title = "Harsha Royal | UI Developer & Product Designer";
});

// 5. Prevent Desktop Install (PWA Install Prompt)
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later if needed (we won't)
    return false;
});

// 6. Block "Save As" context menu via a hidden layer if needed
// (Handled by contextmenu block already)
