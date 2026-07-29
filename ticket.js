/* ===== Inject Dancing Script if needed ===== */
(function() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap';
  document.head.appendChild(link);
})();

/* ══════════════════════════════════════════
   1. CANVAS SPARK PARTICLES
══════════════════════════════════════════ */
const canvas = document.getElementById('sparks');
const ctx = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#C8102E', '#FFB800', '#FFFFFF', '#FF4455'];
const particles = [];

class Spark {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = H + 10;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = -(Math.random() * 2.5 + 0.8);
    this.alpha = Math.random() * 0.6 + 0.2;
    this.size  = Math.random() * 2.5 + 0.5;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life  = 0;
    this.maxLife = 120 + Math.random() * 80;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    this.alpha = (1 - this.life / this.maxLife) * 0.7;
    if (this.life >= this.maxLife || this.y < -10) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 80; i++) {
  const s = new Spark();
  s.life = Math.random() * s.maxLife; // stagger starts
  particles.push(s);
}

function animateSparks() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateSparks);
}
animateSparks();

/* ══════════════════════════════════════════
   2. TICKET 3D TILT ON MOUSE MOVE (desktop only)
══════════════════════════════════════════ */
const ticket = document.getElementById('ticket');
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

if (!isTouch) {
  document.addEventListener('mousemove', (e) => {
    const rect = ticket.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const maxTilt = 8;
    ticket.style.transform =
      `perspective(1200px) rotateY(${dx * maxTilt}deg) rotateX(${-dy * maxTilt}deg) scale(1.02)`;
    ticket.style.transition = 'transform 0.05s ease';
  });

  document.addEventListener('mouseleave', () => {
    ticket.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) scale(1)';
    ticket.style.transition = 'transform 0.6s cubic-bezier(0.2,0.8,0.2,1)';
  });
}


/* ══════════════════════════════════════════
   3. CONFETTI BURST ON LOAD
══════════════════════════════════════════ */
const confettiContainer = document.getElementById('confetti');

function launchConfetti(count = 80) {
  const shapes = ['■', '●', '▲', '◆'];
  const confColors = ['#C8102E', '#FFB800', '#3A8DFF', '#00C853', '#FFFFFF', '#FF4D9E'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.classList.add('confetti-piece');
    const size = Math.random() * 10 + 6;
    el.style.left = Math.random() * 100 + 'vw';
    el.style.width  = size + 'px';
    el.style.height = size + 'px';
    el.style.background = confColors[Math.floor(Math.random() * confColors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.opacity = Math.random() * 0.8 + 0.2;
    const duration = Math.random() * 3 + 2.5;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay   = Math.random() * 2 + 's';
    confettiContainer.appendChild(el);
    setTimeout(() => el.remove(), (duration + 2) * 1000);
  }
}

// Trigger confetti after ticket animates in
setTimeout(() => launchConfetti(100), 1000);

/* ══════════════════════════════════════════
   4. COUNTDOWN TIMER (optional live clock)
══════════════════════════════════════════ */
// Party: 30 July 2026, 20:00 WIB (UTC+7 = UTC 13:00)
const partyTime = new Date('2026-07-30T13:00:00Z');

function updateCountdown() {
  const now  = new Date();
  const diff = partyTime - now;
  if (diff <= 0) return; // party is live!

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs  = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  let cdEl = document.getElementById('countdown-display');
  if (!cdEl) {
    // Inject a countdown below the seat bar
    cdEl = document.createElement('div');
    cdEl.id = 'countdown-display';
    cdEl.style.cssText = `
      background: #0D0D0D;
      color: #fff;
      padding: 10px 24px;
      display: flex;
      gap: 24px;
      align-items: center;
      justify-content: center;
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 2px;
    `;
    const seatBar = document.querySelector('.ticket__seat-bar');
    seatBar.parentNode.insertBefore(cdEl, seatBar.nextSibling);
  }

  cdEl.innerHTML = `
    <span style="font-size:.55rem;font-family:'Source Code Pro',monospace;color:#888;letter-spacing:2px;align-self:center;">COUNTDOWN TO PARTY</span>
    ${[
      ['DAYS',  days],
      ['HRS',   hrs],
      ['MIN',   mins],
      ['SEC',   secs],
    ].map(([label, val]) => `
      <div style="text-align:center;">
        <div style="font-size:1.8rem;color:#C8102E;line-height:1;">${String(val).padStart(2,'0')}</div>
        <div style="font-size:.45rem;font-family:'Source Code Pro',monospace;color:#555;letter-spacing:2px;">${label}</div>
      </div>
    `).join('<span style="color:#333;font-size:1.4rem;margin-bottom:12px;">:</span>')}
  `;
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ══════════════════════════════════════════
   5. MAP MODAL — open / close / copy
══════════════════════════════════════════ */
const ROBLOX_LINK = 'https://www.roblox.com/share?code=fcb9920d89070e498d787b3b580f342f&type=Server';

function openMapModal() {
  const modal = document.getElementById('mapModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent background scroll

  // Mini confetti burst when modal opens
  launchConfetti(30);
}

function closeMapModal(event) {
  // If called from overlay click, only close when clicking the backdrop itself
  if (event && event.target !== document.getElementById('mapModal')) return;
  const modal = document.getElementById('mapModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('mapModal');
    if (modal.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

function copyLink() {
  navigator.clipboard.writeText(ROBLOX_LINK).then(() => {
    const hint = document.getElementById('copyHint');
    const original = hint.innerHTML;
    hint.innerHTML = '✅ Link berhasil disalin!';
    hint.style.color = '#00A550';
    setTimeout(() => {
      hint.innerHTML = original;
      hint.style.color = '';
    }, 2500);
  }).catch(() => {
    // Fallback for browsers that block clipboard
    prompt('Salin link berikut:', ROBLOX_LINK);
  });
}

