/* Ultra-Premium Feedback Form Logic with EmailJS Integration */
document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.feedback-trigger');
    const overlay = document.querySelector('.feedback-overlay');
    const modal = document.querySelector('.feedback-modal');
    const closeBtn = document.querySelector('.feedback-close');
    const form = document.querySelector('.feedback-form');
    const options = document.querySelectorAll('.feedback-opt');
    const typeInput = document.getElementById('feedback-type');
    const textarea = document.querySelector('.feedback-textarea');

    if (!triggers.length || !modal || !overlay) return;

    const openModal = () => {
        overlay.style.display = 'flex';
        
        requestAnimationFrame(() => {
            gsap.to(overlay, { 
                opacity: 1, 
                duration: 0.6,
                ease: "power2.out"
            });

            modal.classList.add('active');
            gsap.fromTo(modal, 
                { opacity: 0, y: 40, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "expo.out" }
            );
        });
        
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        gsap.to(modal, { 
            opacity: 0, 
            y: 30,
            scale: 0.99,
            duration: 0.4, 
            ease: "power2.in"
        });

        gsap.to(overlay, { 
            opacity: 0, 
            duration: 0.6, 
            ease: "power2.inOut",
            onComplete: () => {
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    };

    triggers.forEach(trigger => trigger.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Auto-resize textarea
    if (textarea) {
        const adjustHeight = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };
        textarea.addEventListener('input', adjustHeight);
    }

    // Option selection
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            typeInput.value = opt.dataset.type;
        });
    });

    // Form submission with EmailJS
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.feedback-submit');
            const name = form.querySelector('input[name="name"]').value;
            const message = form.querySelector('textarea[name="message"]').value;
            const type = typeInput.value;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Delivering...';

            const templateParams = {
                from_name: name,
                to_name: "Harsha Royal",
                feedback_type: type,
                message: `[${type.toUpperCase()}] ${message}`,
                reply_to: "no-reply@portfolio.com" // Standard placeholder
            };

            // service_kfsqpcg is the user's Service ID
            // template_yog32e8 is the user's Template ID
            emailjs.send("service_kfsqpcg", "template_yog32e8", templateParams)
                .then(() => {
                    submitBtn.textContent = 'Feedback Received! ✨';
                    submitBtn.style.background = '#0ACF83';
                    submitBtn.style.boxShadow = '0 15px 30px rgba(10, 207, 131, 0.3)';
                    
                    setTimeout(() => {
                        closeModal();
                        setTimeout(() => {
                            form.reset();
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Send Feedback';
                            submitBtn.style.background = '';
                            submitBtn.style.boxShadow = '';
                            options.forEach(o => o.classList.remove('active'));
                            options[1].classList.add('active');
                            if (textarea) textarea.style.height = 'auto';
                        }, 500);
                    }, 1500);
                })
                .catch((error) => {
                    console.error("EmailJS Error:", error);
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Failed to Send';
                    submitBtn.style.background = '#FF2B2B';
                    
                    setTimeout(() => {
                        submitBtn.textContent = 'Send Feedback';
                        submitBtn.style.background = '';
                    }, 3000);
                });
        });
    }
});
