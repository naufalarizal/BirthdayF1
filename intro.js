/* ─────────────────────────────────────────
   intro.js  –  F1 Start Lights Sequence
   Timeline (ms from page load):
     0      → gantry + stripes appear
     400    → lights drop in one by one
     600    → light 1 ON
     900    → light 2 ON
     1200   → light 3 ON
     1500   → light 4 ON
     1800   → light 5 ON  (all red)
     2500   → all lights OFF  → green flash
     2600   → "LIGHTS OUT!" text
     2800   → "AND AWAY WE GO" text
     3100   → event title teaser
     3800   → speed lines
     3900   → overlay EXIT (slides up)
     4600   → ticket scene revealed
───────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Helpers ── */
  const $ = id => document.getElementById(id);
  const qs = sel => document.querySelector(sel);
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const addClass = (el, cls) => el && el.classList.add(cls);
  const rmClass  = (el, cls) => el && el.classList.remove(cls);

  /* ── Vibrate (mobile feedback) ── */
  const vib = ms => navigator.vibrate && navigator.vibrate(ms);

  /* ── Screen shake ── */
  function shake(duration = 120) {
    const overlay = $('intro-overlay');
    if (!overlay) return;
    overlay.style.animation = `none`;
    overlay.offsetHeight; // reflow
    overlay.style.animation =
      `introShake ${duration}ms ease`;
    setTimeout(() => { overlay.style.animation = ''; }, duration);
  }

  /* ── Inject keyframe for screen shake once ── */
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes introShake {
      0%,100% { transform: translate(0,0); }
      20%      { transform: translate(-4px, 2px); }
      40%      { transform: translate(4px, -2px); }
      60%      { transform: translate(-3px, 3px); }
      80%      { transform: translate(3px, -1px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  /* ── Main async sequence ── */
  async function runIntro() {

    /* Grab elements */
    const overlay    = $('intro-overlay');
    const stripeT    = qs('.intro-stripe--top');
    const stripeB    = qs('.intro-stripe--bottom');
    const checkL     = qs('.intro-check--left');
    const checkR     = qs('.intro-check--right');
    const pods       = [1,2,3,4,5].map(n => $('l' + n));
    const goText     = $('introGo');
    const subText    = $('introSub');
    const tease      = $('introTease');
    const greenFlash = $('greenFlash');
    const speedLines = $('speedLines');
    const scene      = qs('.scene');

    /* ── PHASE 0: Stripes + side panels slide in ── */
    await delay(200);

    // Animate stripes
    [stripeT, stripeB].forEach(el => {
      el.style.transition = 'opacity 0.2s, transform 0.5s cubic-bezier(0.2,0.8,0.2,1)';
      el.style.opacity    = '1';
      el.style.transform  = 'scaleX(1)';
    });

    // Animate checkered panels
    [checkL, checkR].forEach(el => {
      el.style.transition = 'opacity 0.3s, transform 0.5s cubic-bezier(0.2,0.8,0.2,1) 0.1s';
      el.style.opacity    = '1';
      el.style.transform  = 'translateX(0)';
    });

    /* ── PHASE 1: Light pods drop into view ── */
    await delay(400);
    pods.forEach((pod, i) => {
      setTimeout(() => {
        pod.style.transition = `opacity 0.3s ease, transform 0.4s cubic-bezier(0.2,0.8,0.2,1)`;
        pod.style.opacity    = '1';
        pod.style.transform  = 'translateY(0)';
      }, i * 80);
    });

    /* ── PHASE 2: Red lights turn on ONE BY ONE ── */
    await delay(700);
    for (let i = 0; i < pods.length; i++) {
      await delay(300);
      addClass(pods[i], 'on');
      shake(80);
      vib(40);
    }

    // All 5 lights are ON — dramatic pause
    await delay(700);

    /* ── PHASE 3: LIGHTS OUT — all go off at once ── */
    pods.forEach(p => rmClass(p, 'on'));
    shake(200);
    vib([60, 30, 60]);

    // Green flash
    addClass(greenFlash, 'flash');

    /* ── PHASE 4: GO text ── */
    await delay(120);
    addClass(goText, 'show');
    vib(100);

    /* ── PHASE 5: Sub text ── */
    await delay(220);
    addClass(subText, 'show');

    /* ── PHASE 6: Title teaser ── */
    await delay(350);
    addClass(tease, 'show');

    /* ── PHASE 7: Speed lines + exit ── */
    await delay(700);
    addClass(speedLines, 'go');

    await delay(300);

    /* EXIT: overlay slides up */
    addClass(overlay, 'exit');

    /* Reveal scene */
    await delay(500);
    addClass(scene, 'intro-done');

    /* Fully remove overlay from DOM */
    await delay(300);
    overlay.style.display = 'none';
  }

  /* ── Run on page ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntro);
  } else {
    runIntro();
  }

})();
