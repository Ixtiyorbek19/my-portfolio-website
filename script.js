/* ================================================================
   NEXUS PORTFOLIO — ADVANCED JAVASCRIPT ENGINE
   ================================================================ */

'use strict';

/* ── GLOBALS ──────────────────────────────────────────────────── */
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let ringX = mouse.x, ringY = mouse.y;
let animFrame;

/* ================================================================
   1. LOADER
   ================================================================ */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPct = document.getElementById('loaderPct');
  const loaderText = document.getElementById('loaderText');
  const messages = ['INITIALIZING', 'LOADING ASSETS', 'CALIBRATING', 'SYNCING AI', 'LAUNCHING'];
  let pct = 0, msgIdx = 0;

  const tick = setInterval(() => {
    pct += Math.random() * 6 + 2;
    if (pct > 100) pct = 100;
    loaderBar.style.width = pct + '%';
    loaderPct.textContent = Math.floor(pct) + '%';

    const newIdx = Math.floor(pct / 25);
    if (newIdx !== msgIdx && newIdx < messages.length) {
      msgIdx = newIdx;
      loaderText.textContent = messages[msgIdx];
    }

    if (pct >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('hidden');
        startReveal();
      }, 500);
    }
  }, 60);
})();

/* ================================================================
   2. CURSOR
   ================================================================ */
document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';

  // Move ambient light
  const ambient = document.querySelector('.ambient-light');
  if (ambient) {
    ambient.style.left = e.clientX + 'px';
    ambient.style.top  = e.clientY + 'px';
  }
});

// Smooth ring follow
(function animateCursor() {
  const lerp = (a, b, t) => a + (b - a) * t;
  function loop() {
    ringX = lerp(ringX, mouse.x, 0.12);
    ringY = lerp(ringY, mouse.y, 0.12);
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(loop);
  }
  loop();
})();

// Hover effect
document.querySelectorAll('a, button, .magnetic, .skill-card, .project-card, .social-icon').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

/* ================================================================
   3. MAGNETIC BUTTONS
   ================================================================ */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ================================================================
   4. PARTICLES SYSTEM
   ================================================================ */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .3;
      this.vy = (Math.random() - .5) * .3 - .1;
      this.r  = Math.random() * 1.5 + .3;
      this.alpha = Math.random() * .5 + .1;
      this.hue = Math.random() < .7 ? 185 : Math.random() < .5 ? 260 : 220;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},100%,70%,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Connection lines between close particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,255,${(1 - dist/120) * .04})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ================================================================
   5. NOISE CANVAS
   ================================================================ */
(function initNoise() {
  const canvas = document.getElementById('noiseCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256; canvas.height = 256;

  function makeNoise() {
    const img = ctx.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i+1] = img.data[i+2] = v;
      img.data[i+3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    canvas.style.backgroundSize = '256px 256px';
  }

  setInterval(makeNoise, 100);
  makeNoise();
})();

/* ================================================================
   6. TYPING EFFECT
   ================================================================ */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const strings = [
    'Architecting AI-powered systems',
    'Crafting cinematic interfaces',
    'Engineering the impossible',
    'Building next-gen experiences',
    'Turning vision into reality'
  ];
  let si = 0, ci = 0, deleting = false;

  function type() {
    const current = strings[si];
    if (deleting) {
      ci--;
      el.textContent = current.slice(0, ci);
      if (ci === 0) { deleting = false; si = (si + 1) % strings.length; setTimeout(type, 500); return; }
      setTimeout(type, 40);
    } else {
      ci++;
      el.textContent = current.slice(0, ci);
      if (ci === current.length) { setTimeout(() => { deleting = true; type(); }, 2200); return; }
      setTimeout(type, 80);
    }
  }
  setTimeout(type, 2000);
})();

/* ================================================================
   7. SCROLL REVEAL
   ================================================================ */
function startReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });

  // Skill bars
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

  // Counters
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.about-stats').forEach(el => counterObserver.observe(el));
}

function animateCounter(el, target) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 20);
}

/* ================================================================
   8. NAV SCROLL
   ================================================================ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ================================================================
   9. MOUSE PARALLAX ON HERO
   ================================================================ */
document.addEventListener('mousemove', e => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  const orbs = document.querySelectorAll('.hero-orb');
  orbs[0] && (orbs[0].style.transform = `translate(${dx * -20}px, ${dy * -20}px)`);
  orbs[1] && (orbs[1].style.transform = `translate(${dx * 15}px, ${dy * 15}px)`);
  orbs[2] && (orbs[2].style.transform = `translate(${dx * 10}px, ${dy * -10}px)`);

  const nodes = document.querySelectorAll('.data-node');
  nodes[0] && (nodes[0].style.transform = `translateY(calc(-50% + ${dy * -8}px))`);
  nodes[1] && (nodes[1].style.transform = `translateY(calc(${dy * 6}px))`);
  nodes[2] && (nodes[2].style.transform = `translateY(calc(${dy * -10}px))`);
});

/* ================================================================
   10. SKILL CARD LIGHT REACTIVE
   ================================================================ */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ================================================================
   11. FEATURED PROJECT TILT
   ================================================================ */
(function initTilt() {
  const el = document.getElementById('featuredTilt');
  if (!el) return;
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * -12;
    const ry = ((e.clientX - cx) / rect.width) * 12;
    el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
})();

/* ================================================================
   12. MINI CHART (FEATURED PROJECT)
   ================================================================ */
(function initMiniChart() {
  const canvas = document.getElementById('miniChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const points = [20,35,25,50,40,60,45,75,55,80,70,85];
  const stepX = W / (points.length - 1);

  function draw() {
    ctx.clearRect(0,0,W,H);
    // Gradient fill
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0,'rgba(0,245,255,.2)');
    grad.addColorStop(1,'rgba(0,245,255,0)');
    ctx.beginPath();
    ctx.moveTo(0, H - (points[0]/100)*H);
    for (let i = 1; i < points.length; i++) {
      const px = i * stepX;
      const py = H - (points[i]/100)*H;
      const cpx = (i-.5)*stepX;
      ctx.quadraticCurveTo(cpx, H-(points[i-1]/100)*H, px, py);
    }
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    // Line
    ctx.beginPath();
    ctx.moveTo(0, H - (points[0]/100)*H);
    for (let i = 1; i < points.length; i++) {
      const cpx = (i-.5)*stepX;
      ctx.quadraticCurveTo(cpx, H-(points[i-1]/100)*H, i*stepX, H-(points[i]/100)*H);
    }
    ctx.strokeStyle = 'rgba(0,245,255,.8)';
    ctx.lineWidth = 1.5; ctx.stroke();
    // Dots
    points.forEach((p,i) => {
      ctx.beginPath();
      ctx.arc(i*stepX, H-(p/100)*H, 2, 0, Math.PI*2);
      ctx.fillStyle = 'var(--cyan,#00f5ff)'; ctx.fill();
    });
  }
  draw();

  // Animate last point
  let t = 0;
  setInterval(() => {
    t++;
    points.push(50 + Math.sin(t*.3)*30 + Math.random()*10);
    points.shift();
    draw();
  }, 1200);
})();

/* ================================================================
   13. NEURAL NET VISUALIZATION
   ================================================================ */
(function initNeuralNet() {
  const canvas = document.getElementById('neuralNet');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const layers = [[3,3],[4,4],[4,4],[3,3],[2,2]];
  const layerX = W / (layers.length + 1);

  function draw(time) {
    ctx.clearRect(0,0,W,H);
    const nodes = layers.map((l,li) => {
      const x = (li+1)*layerX;
      return l.map((_,ni) => ({
        x, y: (ni+1)*H/(l.length+1)
      }));
    });
    // Connections
    for (let li = 0; li < nodes.length-1; li++) {
      nodes[li].forEach(from => {
        nodes[li+1].forEach(to => {
          const alpha = .08 + .05*Math.sin(time*.002 + from.x + to.y);
          ctx.beginPath();
          ctx.moveTo(from.x,from.y); ctx.lineTo(to.x,to.y);
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`; ctx.lineWidth=.7; ctx.stroke();
        });
      });
    }
    // Nodes
    nodes.flat().forEach((n,i) => {
      const pulse = .5+.5*Math.sin(time*.003+i*.7);
      ctx.beginPath(); ctx.arc(n.x,n.y,2.5,0,Math.PI*2);
      ctx.fillStyle = `rgba(0,245,255,${.4+pulse*.5})`; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,5,0,Math.PI*2);
      ctx.fillStyle = `rgba(0,245,255,${.05+pulse*.08})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ================================================================
   14. PROFILE GLITCH EFFECT
   ================================================================ */
(function initGlitch() {
  const card = document.querySelector('.profile-card');
  if (!card) return;
  setInterval(() => {
    if (Math.random() > .85) {
      card.style.filter = 'hue-rotate(30deg) brightness(1.2)';
      setTimeout(() => { card.style.filter = ''; }, 80);
      setTimeout(() => {
        card.style.filter = 'hue-rotate(-20deg)';
        setTimeout(() => { card.style.filter = ''; }, 60);
      }, 120);
    }
  }, 3000);
})();

/* ================================================================
   15. AMBIENT LIGHT ELEMENT
   ================================================================ */
(function createAmbientLight() {
  const light = document.createElement('div');
  light.className = 'ambient-light';
  document.body.appendChild(light);
})();

/* ================================================================
   16. CONTACT FORM
   ================================================================ */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('submitBtn');
  const btnText = document.getElementById('submitText');
  if (!form) return;

  // Floating labels activation
  form.querySelectorAll('.form-input').forEach(input => {
    input.setAttribute('placeholder',' ');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    btnText.textContent = 'TRANSMITTING…';
    btn.style.opacity = '.7';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('show');
    }, 1800);
  });
})();

/* ================================================================
   17. FOOTER YEAR
   ================================================================ */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ================================================================
   18. SMOOTH SCROLL
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });
});

/* ================================================================
   19. HUD DATA LIVE UPDATE
   ================================================================ */
(function liveHud() {
  const cpuEl = document.querySelector('.hud-line[data-label="CPU"]');
  const memEl = document.querySelector('.hud-line[data-label="MEM"]');
  const latEl = document.querySelector('.hud-line[data-label="LAT"]');
  if (!cpuEl) return;
  setInterval(() => {
    cpuEl.textContent = (90 + Math.random()*9).toFixed(1) + '%';
    memEl.textContent = (10 + Math.random()*4).toFixed(1) + ' GB';
    latEl.textContent = (1 + Math.random()*4).toFixed(0) + 'ms';
  }, 2000);
})();

/* ================================================================
   20. SECTION PARALLAX ON SCROLL
   ================================================================ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const grid = document.querySelector('.hero-grid');
  if (grid) grid.style.transform = `translateY(${scrollY * .2}px)`;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) heroContent.style.transform = `translateY(${scrollY * .12}px)`;
}, { passive: true });

/* ================================================================
   21. PROJECT CARD SPOTLIGHT
   ================================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,245,255,.04) 0%, rgba(0,8,20,.8) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ================================================================
   22. HERO NAME GLITCH ON HOVER
   ================================================================ */
(function heroGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;
  const orig = 'B.I';
  const chars = '####';
  let glitching = false;

  name.addEventListener('mouseenter', () => {
    if (glitching) return;
    glitching = true;
    let count = 0;
    const interval = setInterval(() => {
      const nameSpan = document.getElementById('heroName');
      if (!nameSpan) { clearInterval(interval); return; }
      nameSpan.innerHTML = orig.split('').map((ch,i) => {
        if (ch === '.') return '<span class="name-accent">.</span>';
        if (Math.random() > .7 && count < 6) return `<span style="color:var(--purple)">${chars[Math.floor(Math.random()*chars.length)]}</span>`;
        return ch;
      }).join('');
      count++;
      if (count > 8) {
        clearInterval(interval);
        nameSpan.innerHTML = '<span class="name-accent">Ixtiyorbek</span>';
        glitching = false;
      }
    }, 60);
  });
})();

/* ================================================================
   23. PAGE VISIBILITY OPTIMIZATION
   ================================================================ */
document.addEventListener('visibilitychange', () => {
  const particlesCanvas = document.getElementById('particlesCanvas');
  if (document.hidden) {
    particlesCanvas.style.display = 'none';
  } else {
    particlesCanvas.style.display = '';
  }
});

/* ================================================================
   24. INIT
   ================================================================ */
window.addEventListener('load', () => {
  // Start in case loader already done
  document.body.style.opacity = '1';
});
