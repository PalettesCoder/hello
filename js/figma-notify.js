/**
 * Figma-style Notification System
 * Replaces standard browser alerts with a premium Figma UI toast.
 */
window.figmaNotify = function(message) {
    let notify = document.querySelector('.figma-notification');
    if (!notify) {
        notify = document.createElement('div');
        notify.className = 'figma-notification';
        document.body.appendChild(notify);
    }
    notify.textContent = message;
    notify.classList.add('show');
    setTimeout(() => {
        notify.classList.remove('show');
    }, 3000);
};
