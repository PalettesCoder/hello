document.addEventListener("DOMContentLoaded", () => {
    // Check if the canvas exists, otherwise inject it into .body-background
    let canvas = document.getElementById("env-canvas");
    if (!canvas) {
        const bodyBackground = document.querySelector(".body-background");
        if (bodyBackground) {
            canvas = document.createElement("canvas");
            canvas.id = "env-canvas";
            canvas.style.position = "absolute";
            canvas.style.inset = "0";
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = "1";
            bodyBackground.appendChild(canvas);
        } else {
            return; // No body background to attach to
        }
    }

    const ctx = canvas.getContext("2d");
    let animationId = null;
    let particles = [];
    let currentEnv = null;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initEnvironment(currentEnv);
    }
    window.addEventListener("resize", resize);
    resize();

    function clearAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = [];
    }

    function initEnvironment(env) {
        clearAnimation();
        currentEnv = env;
        if (!env) return;

        if (env === "env-orbs") {
            for (let i = 0; i < 30; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 80 + 20,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    hue: Math.random() * 60 + 200 // Blue/Purple/Pink pastels
                });
            }
            requestAnimationFrame(drawOrbs);
        } else if (env === "env-blossom") {
            for (let i = 0; i < 60; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 6 + 3,
                    vx: Math.random() * 1 + 0.5,
                    vy: Math.random() * 1.5 + 0.5,
                    angle: Math.random() * 360,
                    spin: (Math.random() - 0.5) * 5
                });
            }
            requestAnimationFrame(drawBlossoms);
        } else if (env === "env-glimmer") {
            for (let i = 0; i < 80; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: Math.random() * -1 - 0.2, // Float up
                    life: Math.random() * 100
                });
            }
            requestAnimationFrame(drawGlimmer);
        } else if (env === "env-breeze") {
            for (let i = 0; i < 100; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    length: Math.random() * 20 + 5,
                    vx: Math.random() * 3 + 1,
                    vy: Math.random() * 0.5 - 0.25,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
            requestAnimationFrame(drawBreeze);
        } else if (env === "env-waves") {
            requestAnimationFrame(drawWaves);
        }
    }

    function drawOrbs() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, 0.15)`);
            gradient.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -p.size) p.x = canvas.width + p.size;
            if (p.x > canvas.width + p.size) p.x = -p.size;
            if (p.y < -p.size) p.y = canvas.height + p.size;
            if (p.y > canvas.height + p.size) p.y = -p.size;
        });
        animationId = requestAnimationFrame(drawOrbs);
    }

    function drawBlossoms() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);
            
            ctx.fillStyle = "rgba(255, 180, 200, 0.7)";
            ctx.beginPath();
            // simple petal shape
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(p.size, -p.size/2, p.size, p.size);
            ctx.quadraticCurveTo(-p.size/2, p.size, 0, 0);
            ctx.fill();
            ctx.restore();
            
            p.x += p.vx;
            p.y += p.vy;
            p.angle += p.spin;
            
            if (p.y > canvas.height + p.size) {
                p.y = -p.size;
                p.x = Math.random() * canvas.width - canvas.width/4;
            }
        });
        animationId = requestAnimationFrame(drawBlossoms);
    }

    function drawGlimmer() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            const alpha = (Math.sin(p.life * 0.05) + 1) / 2 * 0.8;
            ctx.fillStyle = `rgba(255, 230, 150, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            p.x += p.vx;
            p.y += p.vy;
            p.life += 1;
            
            if (p.y < -10) {
                p.y = canvas.height + 10;
                p.x = Math.random() * canvas.width;
            }
        });
        animationId = requestAnimationFrame(drawGlimmer);
    }

    function drawBreeze() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 1.5;
        
        particles.forEach(p => {
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.length, p.y - p.vy * (p.length/p.vx));
            ctx.stroke();
            
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x > canvas.width + p.length) {
                p.x = -p.length;
                p.y = Math.random() * canvas.height;
            }
        });
        animationId = requestAnimationFrame(drawBreeze);
    }

    let waveOffset = 0;
    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        
        const colors = [
            "rgba(255, 180, 200, 0.4)", // soft pink
            "rgba(180, 220, 255, 0.4)", // soft blue
            "rgba(255, 230, 180, 0.4)", // soft yellow
            "rgba(180, 255, 220, 0.4)"  // soft mint
        ];

        for(let i = 0; i < 4; i++) {
            ctx.strokeStyle = colors[i];
            ctx.beginPath();
            for(let x = 0; x < canvas.width; x += 15) {
                let y = Math.sin((x + waveOffset + (i*150)) * 0.003) * 120 + (canvas.height / 2) + (i*40 - 60);
                if(x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        waveOffset += 1.5;
        animationId = requestAnimationFrame(drawWaves);
    }

    // Observe body class changes to detect theme switches
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "class") {
                const classList = document.body.classList;
                let newEnv = null;
                classList.forEach(cls => {
                    if (cls.startsWith("env-")) {
                        newEnv = cls;
                    }
                });
                if (newEnv !== currentEnv) {
                    initEnvironment(newEnv);
                }
            }
        });
    });

    observer.observe(document.body, { attributes: true });

    // Initial check
    let initialEnv = null;
    document.body.classList.forEach(cls => {
        if (cls.startsWith("env-")) initialEnv = cls;
    });
    if (initialEnv) initEnvironment(initialEnv);
});
