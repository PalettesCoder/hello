/**
 * PWA Install Button Logic
 * Creates a floating action button for installing the app locally.
 */

(function() {
    const installStyles = document.createElement('style');
    installStyles.innerHTML = `
        .pwa-install-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 99999;
            display: none;
            animation: slideUpIn 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }
        @keyframes slideUpIn {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .btn-pwa-install {
            background: #FF7518;
            color: #fff;
            border: 1px solid rgba(255,255,255,0.1);
            padding: 12px 24px;
            border-radius: 99px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 30px rgba(255,117,24,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-pwa-install:hover {
            transform: translateY(-5px) scale(1.05);
            background: #ff8a3d;
            box-shadow: 0 15px 40px rgba(255,117,24,0.4);
        }
        .btn-pwa-install:active {
            transform: scale(0.95);
        }
        .pwa-icon {
            width: 18px;
            height: 18px;
            fill: #fff;
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
            .pwa-install-container {
                bottom: 20px;
                right: 20px;
            }
            .btn-pwa-install {
                padding: 10px 18px;
                font-size: 13px;
            }
        }
    `;
    document.head.appendChild(installStyles);

    const container = document.createElement('div');
    container.className = 'pwa-install-container';
    container.innerHTML = `
        <button class="btn-pwa-install" id="pwaInstallBtn">
            <svg class="pwa-icon" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Install App
        </button>
    `;
    document.body.appendChild(container);

    const installBtn = document.getElementById('pwaInstallBtn');

    window.addEventListener('pwaInstallAvailable', () => {
        container.style.display = 'block';
    });

    // Also check if already available (if script loads later)
    if (window.deferredPrompt) {
        container.style.display = 'block';
    }

    installBtn.addEventListener('click', async () => {
        if (!window.deferredPrompt) return;
        
        // Hide the button
        container.style.display = 'none';
        
        // Show the install prompt
        window.deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await window.deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        
        // We've used the prompt, and can't use it again, throw it away
        window.deferredPrompt = null;
    });

    window.addEventListener('appinstalled', (evt) => {
        console.log('App successfully installed!');
        container.style.display = 'none';
    });
})();
