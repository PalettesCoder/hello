/* Global Security Script - Harsha Royal Portfolio */
// 1. Disable Right Click
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Ctrl+U)
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
});

// 3. Prevent Image Dragging
document.addEventListener('dragstart', (event) => {
    if (event.target.tagName === 'IMG') {
        event.preventDefault();
    }
});
