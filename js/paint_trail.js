// js/paint_trail.js
'use strict';

const paintTrailCursor = () => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0'; // At the back
    document.body.appendChild(canvas);

    let width, height;
    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    // Create follower points
    const trailLength = 25;
    const points = [];
    for (let i = 0; i < trailLength; i++) {
        points.push({ x: mouse.x, y: mouse.y });
    }

    const onMouseMove = (e) => {
        // No offset - connect exactly to the cursor
        mouse.x = e.clientX; 
        mouse.y = e.clientY; 
    };

    document.addEventListener('mousemove', onMouseMove);

    const draw = () => {
        ctx.clearRect(0, 0, width, height);

        let leadX = mouse.x;
        let leadY = mouse.y;

        // Force the head of the paint immediately onto the cursor to remove the gap
        points[0].x = leadX;
        points[0].y = leadY;

        // Spring physics to make each point smoothly follow the previous
        for (let i = 1; i < trailLength; i++) {
            const p = points[i];
            
            // Tighter follow
            p.x += (leadX - p.x) * 0.7;
            p.y += (leadY - p.y) * 0.7;
            
            leadX = p.x;
            leadY = p.y;
        }

        // Draw the path
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < trailLength; i++) {
            ctx.beginPath();
            ctx.moveTo(points[i-1].x, points[i-1].y);
            ctx.lineTo(points[i].x, points[i].y);
            
            // Calculate opacity and thickness based on position in trail
            let ratio = 1 - (i / trailLength);
            let opacity = Math.max(0, ratio);
            let thickness = Math.max(1, 15 * ratio); // Start at 15px max thickness
            
            ctx.lineWidth = thickness;
            ctx.strokeStyle = `rgba(199, 17, 17, ${opacity})`;
            ctx.stroke();
        }

        requestAnimationFrame(draw);
    };

    draw();

    return () => {
        document.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', resize);
        canvas.remove();
    };
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paintTrailCursor);
} else {
    paintTrailCursor();
}
