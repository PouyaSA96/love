/* ==========================================================
   Minimal Valentine
   - Background hearts always
   - YES => remove page, show fireworks + hearts only + top banner text
   - Tap/click after YES => firework burst at finger (NO SOUND)
   ========================================================== */

const CONFIG = {
  theirName: "Pishiiii",
  heartsIdleSpawnMs: 120,
  heartsPartySpawnMs: 45,
  backgroundRocketChancePerFrame: 0.06,
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const page = document.getElementById("page");
const loveBanner = document.getElementById("loveBanner");
const theirNameEl = document.getElementById("theirName");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const msg = document.getElementById("msg");

const heartsCanvas = document.getElementById("heartsCanvas");
const hctx = heartsCanvas.getContext("2d", { alpha: true });

const fireworksCanvas = document.getElementById("fireworksCanvas");
const fctx = fireworksCanvas.getContext("2d", { alpha: true });

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const rand = (a, b) => a + Math.random() * (b - a);

let celebrating = false;

// Hearts
let hearts = [];
let lastHeartSpawn = 0;

// Fireworks
let rockets = [];
let sparks = [];

// ---------- Canvas resize ----------
function resizeCanvas(c, ctx) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  c.width = Math.floor(window.innerWidth * dpr);
  c.height = Math.floor(window.innerHeight * dpr);
  c.style.width = window.innerWidth + "px";
  c.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function onResize() {
  resizeCanvas(heartsCanvas, hctx);
  resizeCanvas(fireworksCanvas, fctx);
}
window.addEventListener("resize", onResize);

// ---------- Hearts ----------
function spawnHeart() {
  const size = rand(6, 16);
  hearts.push({
    x: rand(0, window.innerWidth),
    y: window.innerHeight + 25,
    vx: rand(-0.7, 0.7),
    vy: rand(0.7, 2.0),
    size,
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.03, 0.03),
    alpha: rand(0.32, 0.78),
    hue: rand(330, 360),
  });
}

function drawHeart(x, y, size, rot, alpha, hue) {
  hctx.save();
  hctx.translate(x, y);
  hctx.rotate(rot);
  hctx.globalAlpha = alpha;

  hctx.beginPath();
  const s = size;
  hctx.moveTo(0, s * 0.35);
  hctx.bezierCurveTo(0, -s * 0.15, -s * 0.55, -s * 0.1, -s * 0.55, s * 0.25);
  hctx.bezierCurveTo(-s * 0.55, s * 0.65, -s * 0.1, s * 0.85, 0, s);
  hctx.bezierCurveTo(s * 0.1, s * 0.85, s * 0.55, s * 0.65, s * 0.55, s * 0.25);
  hctx.bezierCurveTo(s * 0.55, -s * 0.1, 0, -s * 0.15, 0, s * 0.35);
  hctx.closePath();

  hctx.fillStyle = `hsla(${hue}, 90%, 60%, 1)`;
  hctx.shadowBlur = celebrating ? 16 : 12;
  hctx.shadowColor = `hsla(${hue}, 90%, 60%, .55)`;
  hctx.fill();

  hctx.restore();
}

function tickHearts(ts) {
  hctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (!prefersReducedMotion) {
    const spawnEvery = celebrating ? CONFIG.heartsPartySpawnMs : CONFIG.heartsIdleSpawnMs;
    if (ts - lastHeartSpawn > spawnEvery) {
      spawnHeart();
      if (celebrating && Math.random() < 0.8) spawnHeart();
      lastHeartSpawn = ts;
    }
  }

  hearts.forEach(h => {
    h.y -= h.vy;
    h.x += h.vx;
    h.rot += h.vr;
    drawHeart(h.x, h.y, h.size, h.rot, h.alpha, h.hue);
  });

  hearts = hearts.filter(h => h.y > -80 && h.x > -120 && h.x < window.innerWidth + 120);
  requestAnimationFrame(tickHearts);
}

// ---------- Fireworks ----------
function addRocket(x) {
  rockets.push({
    x,
    y: window.innerHeight + 10,
    vx: rand(-1.2, 1.2),
    vy: rand(-10.0, -14.0),
    life: 0,
    ttl: rand(38, 64),
    hue: rand(0, 360),
  });
}

function explode(x, y, hue) {
  const count = rand(55, 95);
  for (let i = 0; i < count; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(2.0, 7.0);
    sparks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      g: 0.12,
      life: 0,
      ttl: rand(32, 78),
      hue: (hue + rand(-22, 22) + 360) % 360,
      size: rand(1.1, 2.6),
      alpha: 1,
      twinkle: Math.random() < 0.22,
    });
  }
  if (sparks.length > 2200) sparks.splice(0, sparks.length - 2200);
}

function tickFireworks() {
  fctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (!celebrating || prefersReducedMotion) {
    requestAnimationFrame(tickFireworks);
    return;
  }

  fctx.fillStyle = "rgba(0,0,0,0.12)";
  fctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  if (Math.random() < CONFIG.backgroundRocketChancePerFrame) {
    addRocket(rand(80, window.innerWidth - 80));
  }

  rockets.forEach(r => {
    r.life++;
    r.x += r.vx;
    r.y += r.vy;
    r.vy += 0.20;

    fctx.save();
    fctx.globalAlpha = 0.9;
    fctx.fillStyle = `hsla(${r.hue}, 95%, 70%, 1)`;
    fctx.beginPath();
    fctx.arc(r.x, r.y, 2.1, 0, Math.PI * 2);
    fctx.fill();
    fctx.restore();

    if (r.life >= r.ttl || r.vy > -2) {
      explode(r.x, r.y, r.hue);
      r.dead = true;
    }
  });
  rockets = rockets.filter(r => !r.dead);

  sparks.forEach(p => {
    p.life++;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;

    const t = p.life / p.ttl;
    p.alpha = 1 - t;
    const flicker = p.twinkle ? (0.6 + Math.random() * 0.4) : 1;

    fctx.save();
    fctx.globalAlpha = p.alpha * flicker;
    fctx.fillStyle = `hsla(${p.hue}, 95%, 70%, 1)`;
    fctx.shadowBlur = 14;
    fctx.shadowColor = `hsla(${p.hue}, 95%, 70%, 0.70)`;
    fctx.beginPath();
    fctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fctx.fill();
    fctx.restore();

    if (p.life >= p.ttl) p.dead = true;
  });
  sparks = sparks.filter(p => !p.dead);

  requestAnimationFrame(tickFireworks);
}

// ---------- Celebrate ----------
function celebrate() {
  celebrating = true;
  document.body.classList.add("celebrating");
  loveBanner.setAttribute("aria-hidden", "false");

  // remove the entire page (no UI)
  if (page) page.remove();

  // start with a few rockets (no center explosion)
  for (let i = 0; i < 4; i++) addRocket(rand(80, window.innerWidth - 80));
}

// ---------- Tap bursts ----------
function tapBurst(x, y) {
  if (!celebrating) return;
  explode(x, y, rand(0, 360));
}

// ---------- “No” button optional dodge ----------
function dodgeNo() {
  const rect = document.querySelector(".card").getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const maxX = rect.width - btnRect.width - 18;
  const maxY = rect.height - btnRect.height - 18;

  const x = clamp(rand(14, maxX), 14, maxX);
  const y = clamp(rand(14, maxY), 14, maxY);

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  msg.textContent = "That button is… not cooperating 😌";
}

// ---------- Init ----------
function init() {
  theirNameEl.textContent = CONFIG.theirName;
  onResize();

  requestAnimationFrame(tickHearts);
  requestAnimationFrame(tickFireworks);

  yesBtn.addEventListener("click", celebrate);

  // optional: no button dodges (remove these if you want normal)
  noBtn.addEventListener("mouseenter", dodgeNo);
  noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); dodgeNo(); }, { passive: false });

  // taps/clicks after YES
  window.addEventListener("pointerdown", (e) => {
    tapBurst(e.clientX, e.clientY);
  }, { passive: true });
}

init();
