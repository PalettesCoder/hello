'use strict';

const snowflakeCursor = (element) => {
  let canvas;
  let particles = [];
  let canvImages = [];  
  let animationFrame;
  const possibleEmoji = [' స్వాగతం' , 'WELCOME', ' स्वागत हे', ' வரவேற்கிறோம்'  ,  '欢迎', 'ようこそ', '환영합니다', 'Добро пожаловать', 'ברוך הבא', 'مرحبا بك'];
  let prefersReducedMotion;

  if (typeof window === 'undefined') return;

  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const canvasEl = document.createElement('canvas');
  const context = canvasEl.getContext('2d');
  if (!context) return;

  const targetElement = element || document.body;

  canvasEl.style.position = element ? 'absolute' : 'fixed';
  canvasEl.style.top = '0';
  canvasEl.style.left = '0';
  canvasEl.style.pointerEvents = 'none';
  canvasEl.style.zIndex = '99999';

  targetElement.appendChild(canvasEl);
  canvas = canvasEl;

  const setCanvasSize = () => {
    canvas.width = element ? targetElement.clientWidth : window.innerWidth;
    canvas.height = element ? targetElement.clientHeight : window.innerHeight;
  };

  const createEmojiImages = () => {
    context.font = '12px serif';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    possibleEmoji.forEach((emoji) => {
      const measurements = context.measureText(emoji);
      const bgCanvas = document.createElement('canvas');
      const bgContext = bgCanvas.getContext('2d');
      if (!bgContext) return;
      bgCanvas.width = measurements.width;
      bgCanvas.height = measurements.actualBoundingBoxAscent * 2;
      bgContext.textAlign = 'center';
      bgContext.font = '12px serif';
      bgContext.textBaseline = 'middle';
      bgContext.fillText(
        emoji,
        bgCanvas.width / 2,
        measurements.actualBoundingBoxAscent
      );
      canvImages.push(bgCanvas);
    });
  };

  const addParticle = (x, y) => {
    const randomImage =
      canvImages[Math.floor(Math.random() * canvImages.length)];
    particles.push(new Particle(x, y, randomImage));
  };

  const onMouseMove = (e) => {
    const x = element
      ? e.clientX - targetElement.getBoundingClientRect().left
      : e.clientX;
    const y = element
      ? e.clientY - targetElement.getBoundingClientRect().top
      : e.clientY;
    addParticle(x, y);
  };

  const updateParticles = () => {
    if (!context || !canvas) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
      particle.update(context);
      if (particle.lifeSpan < 0) {
        particles.splice(index, 1);
      }
    });
  };

  const animationLoop = () => {
    updateParticles();
    animationFrame = requestAnimationFrame(animationLoop);
  };

  const init = () => {
    if (prefersReducedMotion?.matches) return;
    setCanvasSize();
    createEmojiImages();
    targetElement.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', setCanvasSize);
    animationLoop();
  };

  const destroy = () => {
    if (canvas) {
      canvas.remove();
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    targetElement.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', setCanvasSize);
  };

  if (prefersReducedMotion) {
    prefersReducedMotion.onchange = () => {
        if (prefersReducedMotion?.matches) {
            destroy();
        } else {
            init();
        }
    };
  }
  
  init();

  return destroy;
};

class Particle {
  position;
  velocity;
  lifeSpan;
  initialLifeSpan;
  canv;

  constructor(x, y, canvasItem) {
    this.position = { x, y };
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
      y: 1 + Math.random(),
    };
    this.lifeSpan = Math.floor(Math.random() * 60 + 80);
    this.initialLifeSpan = this.lifeSpan;
    this.canv = canvasItem;
  }

  update(context) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.lifeSpan--;
    this.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75;
    this.velocity.y -= Math.random() / 300;
    const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0);
    context.save();
    context.translate(this.position.x, this.position.y);
    context.scale(scale, scale);
    context.drawImage(this.canv, -this.canv.width / 2, -this.canv.height / 2);
    context.restore();
  }
}

// Initialize the cursor effect
// Keeping it simple for now -> turning off words emit
snowflakeCursor();
