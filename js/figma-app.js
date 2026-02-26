/* Figma App Shared Logic - Page Transitions and Loaders */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create and Inject Loader Bar
    const loader = document.createElement('div');
    loader.className = 'figma-loader-bar';
    document.body.appendChild(loader);

    // Initial load "arrival" animation - mimicks Figma loading a file
    loader.style.width = '30%'; 
    requestAnimationFrame(() => {
        loader.style.width = '100%';
        setTimeout(() => {
            loader.classList.add('complete');
        }, 1000);
    });

    // 2. Intercept Page Switching Links (Sidebar Pages + Top Bar Tabs)
    const navigationLinks = document.querySelectorAll('.sidebar-list .list-item a, .figma-tab');
    navigationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // If it's a relative link within the same directory
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                
                // Don't reload same page
                if (href !== currentPath) {
                e.preventDefault();
                
                // Show loading state
                loader.classList.remove('complete');
                loader.style.width = '0%';
                
                requestAnimationFrame(() => {
                    loader.classList.add('loading'); // Moves to 70% per CSS
                    
                    // Optional: add active state to clicked item immediately
                    const parent = link.closest('.page-item');
                    if (parent) {
                        document.querySelectorAll('.page-item').forEach(p => p.classList.remove('active'));
                        parent.classList.add('active');
                    }

                    // Navigate after showing the loader for 3 seconds
                    setTimeout(() => {
                        window.location.href = href;
                    }, 3000); 
                });
            }
            }
        });
    });

    // 3. Figma-specific UI Tweaks - Tooltips
    document.querySelectorAll('.page-item').forEach(item => {
        if (!item.title) {
            item.title = item.textContent.trim();
        }
    });

    // 4. Smooth Scroll for all navigation links (sidebar, mobile, layers)
    const allScrollLinks = document.querySelectorAll('a.scroll-link, .go-top.scroll-link');
    allScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const targetEl = document.querySelector(href);
            if (!targetEl) return;

            e.preventDefault();

            // Calculate offset (account for any fixed headers)
            const offset = 20;
            const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;

            // Smooth scroll with visible animation
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update active state for layer items
            const layerParent = link.closest('.layer-item');
            if (layerParent) {
                document.querySelectorAll('.layer-item').forEach(p => p.classList.remove('active'));
                layerParent.classList.add('active');
            }

            // Close mobile menu if open
            const mobileNav = document.querySelector('.nav-mobile-list');
            const overlayPop = document.querySelector('.overlay-pop');
            const btnMobile = document.querySelector('.btn-mobile-menu');
            if (mobileNav && mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
                if (overlayPop) overlayPop.classList.remove('open');
                if (btnMobile) btnMobile.classList.remove('close');
                document.body.classList.remove('overflow-hidden');
            }
        });
    });
});

// Helper for notifications (like Figma's bottom snackbars)
function figmaNotify(message, type = 'info') {
    const existing = document.querySelector('.figma-notification');
    if (existing) existing.remove();

    const note = document.createElement('div');
    note.className = `figma-notification ${type}`;
    note.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(note);

    setTimeout(() => note.classList.add('show'), 100);
    setTimeout(() => {
        note.classList.remove('show');
        setTimeout(() => note.remove(), 300);
    }, 3000);
}
