/**
 * Floating Contact Button
 * Replaces the old PWA Install button with a strategy session email link.
 */

(function() {
    const contactStyles = document.createElement('style');
    contactStyles.innerHTML = `
        .floating-contact-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 99999;
            /* Always visible */
            animation: slideUpIn 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }
        @keyframes slideUpIn {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .btn-floating-contact {
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
            text-decoration: none;
        }
        .btn-floating-contact:hover {
            transform: translateY(-5px) scale(1.05);
            background: #ff8a3d;
            box-shadow: 0 15px 40px rgba(255,117,24,0.4);
            color: #fff;
        }
        .btn-floating-contact:active {
            transform: scale(0.95);
        }
        .contact-icon {
            width: 18px;
            height: 18px;
            fill: #fff;
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
            .floating-contact-container {
                bottom: 20px;
                right: 20px;
            }
            .btn-floating-contact {
                padding: 10px 18px;
                font-size: 13px;
            }
        }
    `;
    document.head.appendChild(contactStyles);

    const container = document.createElement('div');
    container.className = 'floating-contact-container';
    container.innerHTML = `
        <a class="btn-floating-contact" href="mailto:palettescoder@gmail.com?subject=Strategy%20Session%20Request%20%E2%80%93%20from%20Portfolio&body=Hi%20Harsha%2C%0A%0AI'd%20like%20to%20book%20a%20strategy%20session%20with%20you.%20Let%20me%20know%20when%20you%20are%20available!%0A%0ABest%2C">
            <svg class="contact-icon" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            Book Strategy Session
        </a>
    `;
    document.body.appendChild(container);
})();
