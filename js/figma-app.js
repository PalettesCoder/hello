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

    // Handle section layer clicks if they exist in the sidebar
    const layerLinks = document.querySelectorAll('.layers-list .layer-item a.scroll-link');
    layerLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.layer-item').forEach(p => p.classList.remove('active'));
            link.closest('.layer-item').classList.add('active');
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
