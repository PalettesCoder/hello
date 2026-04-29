/**
 * Interactive Case Study Components
 * Features: Before/After Slider, Clickable Process Steps, Micro-animations
 */

class InteractiveCaseStudy {
    constructor() {
        this.initSliders();
        this.initProcessSteps();
    }

    initSliders() {
        const sliders = document.querySelectorAll('.ba-slider');
        sliders.forEach(slider => {
            const handle = slider.querySelector('.ba-handle');
            const overlay = slider.querySelector('.ba-overlay');
            let isResizing = false;

            const updateSlider = (x) => {
                const rect = slider.getBoundingClientRect();
                let position = ((x - rect.left) / rect.width) * 100;
                position = Math.max(0, Math.min(100, position));
                
                overlay.style.width = `${position}%`;
                handle.style.left = `${position}%`;
            };

            handle.addEventListener('mousedown', () => isResizing = true);
            window.addEventListener('mouseup', () => isResizing = false);
            window.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                updateSlider(e.clientX);
            });

            // Touch support
            handle.addEventListener('touchstart', () => isResizing = true);
            window.addEventListener('touchend', () => isResizing = false);
            window.addEventListener('touchmove', (e) => {
                if (!isResizing) return;
                updateSlider(e.touches[0].clientX);
            });
        });
    }

    initProcessSteps() {
        const steps = document.querySelectorAll('.process-step-item');
        steps.forEach(step => {
            const trigger = step.querySelector('.process-trigger');
            trigger.addEventListener('click', () => {
                const isActive = step.classList.contains('active');
                
                // Close others
                document.querySelectorAll('.process-step-item').forEach(s => s.classList.remove('active'));
                
                if (!isActive) {
                    step.classList.add('active');
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InteractiveCaseStudy();
});
