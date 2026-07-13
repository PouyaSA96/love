/* ==========================================================
   Ghazaal: The Birthday Series — S1E29
   The One Where Ghazaal Turns 29
   ========================================================== */

/* ---------- asset path normaliser ----------
   Files physically live under /public/assets/... on this static host,
   but the content pack sometimes points at /public/... and sometimes
   at /assets/... — normalise both to the real on-disk path. */
function publicUrl(path) {
  if (!path) return path;
  if (path.startsWith('/public/')) return path;
  if (path.startsWith('public/')) return '/' + path;
  if (path.startsWith('/assets/')) return '/public' + path;
  if (path.startsWith('assets/')) return '/public/' + path;
  return path;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

const PHOTO_BASE = '/public/assets/episode-29/photos';
const AUDIO_SFX_BASE = '/public/assets/episode-29/audio/sfx';
const AI_BASE = '/public/assets/episode-29/ai';

const AI_ASSETS = {
  heroPoster: `${AI_BASE}/posters/episode-29-hero-poster.png`,
  apartmentScene: `${AI_BASE}/episode-stills/episode-29-apartment-scene.png`,
  centralPerkScene: `${AI_BASE}/episode-stills/episode-29-central-perk-scene.png`,
  couchBirthdayScene: `${AI_BASE}/episode-stills/episode-29-couch-birthday-scene.png`,
  surpriseScene: `${AI_BASE}/episode-stills/episode-29-suprise.png`,
  teaser30Golden: `${AI_BASE}/teasers/episode-30-golden-teaser.png`,
};
function aiUrl(key) {
  return publicUrl(AI_ASSETS[key]);
}

const AI_VIDEO_BASE = `${AI_BASE}/generated-videos`;
const AI_VIDEOS = {
  introVideo: `${AI_VIDEO_BASE}/episode-29-intro-video.mp4`,
  birthdayTrailer: `${AI_VIDEO_BASE}/episode-29-birthday-trailer.mp4`,
  teaser30Video: `${AI_VIDEO_BASE}/episode-30-teaser-video.mp4`,
};
function aiVideoUrl(key) {
  return publicUrl(AI_VIDEOS[key]);
}

/* AI-generated video background: always muted (embedded audio is never used —
   the site's own soundtrack plays via the persistent <audio> element instead).
   Falls back to the poster image if the file is missing or fails to decode. */
function aiVideoBg({ id, src, poster, overlayClass = 'ai-video-overlay', replay = true }) {
  // src is set directly on <video> (not via a <source> child) — a missing/broken
  // file then fires a catchable `error` event straight on the video element itself.
  return `
    <div class="ai-video-frame">
      <video id="${id}" class="ai-video" muted autoplay loop playsinline preload="metadata" poster="${poster}" src="${src}"></video>
      <img class="ai-video-fallback hidden" src="${poster}" alt="" />
      ${overlayClass ? `<div class="${overlayClass}"></div>` : ''}
      ${replay ? `<button class="ai-video-replay" data-video-target="${id}" type="button" aria-label="Replay video">🔁</button>` : ''}
    </div>`;
}
function wireAiVideo(id) {
  const video = document.getElementById(id);
  if (!video) return;
  const frame = video.closest('.ai-video-frame');
  const fallbackImg = frame ? frame.querySelector('.ai-video-fallback') : null;
  const replayBtn = frame ? frame.querySelector('.ai-video-replay') : null;
  video.muted = true; // never play embedded audio — our own soundtrack handles sound
  video.addEventListener('error', () => {
    video.classList.add('hidden');
    if (fallbackImg) fallbackImg.classList.remove('hidden');
    if (replayBtn) replayBtn.classList.add('hidden'); // nothing to replay once we're on the still fallback
  }, { once: true });
  video.play().catch(() => {});
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  }
}

const PHOTOS = {
  ghazaalSolo: [
    '20240201_195907.jpg','20240203_161912.jpg','20240204_190920.jpg','20240204_190932.jpg',
    '20240414_202243.jpg','20240414_203425.jpg','20240414_203429.jpg','20240518_140946.jpg',
    '20240606_192009.jpg','20240606_192102.jpg','20240606_192143.jpg','20240606_193558.jpg',
    '20240606_193708.jpg','20240606_193855.jpg','PXL_20250105_064638941.jpg',
    'PXL_20250106_062331400.MP.jpg','PXL_20250107_010915856.MP.jpg',
    'PXL_20250107_010927617.PORTRAIT.jpg','PXL_20250220_093447716.jpg',
    'PXL_20250630_121922496.MP.jpg','PXL_20250630_141907028.jpg',
    'PXL_20250630_141908721.MP.jpg','PXL_20251005_020225012.MP.jpg',
    'PXL_20251219_094716850.jpg','PXL_20251219_094717869.jpg','PXL_20251219_094718279.jpg',
    'PXL_20251219_094719064.jpg','PXL_20251219_094719288.jpg','PXL_20251219_094720353.jpg',
    'PXL_20251219_094720552.jpg','PXL_20260102_100140508.jpg',
    'PXL_20260102_100152123.PORTRAIT.jpg','PXL_20260109_021130911.jpg',
    'PXL_20260205_085704313.MP.jpg','PXL_20260205_085723778.PORTRAIT.jpg',
    'PXL_20260205_085942451.PORTRAIT.jpg','PXL_20260214_064600539.jpg',
    'PXL_20260214_075525806.PORTRAIT.jpg',
  ],
  pouyaGhazaal: [
    '20240419_172751.jpg','20240606_192221.jpg','20240606_193930.jpg',
    'IMG-20230215-WA0003.jpg','PXL_20240718_094850323.jpg','PXL_20250106_062402855.MP.jpg',
    'PXL_20250107_010854477.jpg','PXL_20250109_020557845.jpg',
    'PXL_20251004_062617125.PORTRAIT.jpg','PXL_20251005_020254677.jpg',
    'PXL_20251102_075652971.PORTRAIT.jpg','PXL_20251219_045512486.TS-000.jpg',
    'PXL_20260530_025431409.TS-000.MP.jpg',
  ],
  memories: [
    '20240317_143451.jpg','20240319_210108.jpg','20240407_125426.jpg','20240414_203132.jpg',
    'IMG-20230101-WA0007.jpg','IMG-20230203-WA0006.jpg','IMG-20250106-WA0019.jpg',
    'IMG-20250112-WA0032.jpg','PXL_20251004_111131211.MP.jpg','PXL_20251219_035340435.jpg',
    'PXL_20260109_021151987.TS-000.jpg','PXL_20260214_064721118.TS-000.jpg',
    'original_28083df8-535d-4e31-9aa7-9c4b7a053f36_PXL_20251219_043010545.jpg',
  ],
};

const PHOTO_FOLDER_DIRS = {
  ghazaalSolo: 'ghazaal-solo',
  pouyaGhazaal: 'pouya-ghazaal',
  memories: 'memories',
};
function photoUrl(folder, filename) {
  return publicUrl(`${PHOTO_BASE}/${PHOTO_FOLDER_DIRS[folder] || folder}/${filename}`);
}
function pick(arr, i) {
  return arr[i % arr.length];
}

const SFX = {
  cardFlip: `${AUDIO_SFX_BASE}/sfx-card-flip.mp3`,
  cameraShutter: `${AUDIO_SFX_BASE}/sfx-camera-shutter.mp3`,
  tvStatic: `${AUDIO_SFX_BASE}/sfx-tv-static.mp3`,
  remoteClick: `${AUDIO_SFX_BASE}/sfx-remote-click.mp3`,
  doorCreak: `${AUDIO_SFX_BASE}/sfx-door-creak.mp3`,
  laugh: `${AUDIO_SFX_BASE}/sfx-laugh.mp3`,
  applause: `${AUDIO_SFX_BASE}/sfx-applause.mp3`,
  aww: `${AUDIO_SFX_BASE}/sfx-aww.mp3`,
  confetti: `${AUDIO_SFX_BASE}/sfx-confetti.mp3`,
};

const MEMORY_CAPTIONS = [
  'This one deserves its own episode.',
  'Main character energy.',
  'A classic Ghazaal moment.',
  'Still one of my favourite memories.',
  'No context. Still iconic.',
  'The writers really cooked with this scene.',
  'Very serious behaviour. Obviously.',
];

const WATCH_ORDER = ['reasons', 'memories', 'trailer', 'quiz', 'favouriteThings', 'birthdayWish', 'pouyaMessage', 'teaser30'];

const SECTION_META = {
  reasons: { title: 'The One With 29 Reasons' },
  memories: { title: 'The One With The Memories' },
  trailer: { title: 'The One With The Birthday Trailer' },
  quiz: { title: 'How Well Do You Know Ghazaal?' },
  favouriteThings: { title: 'The One With Her Favourite Things' },
  birthdayWish: { title: 'The One With The Birthday Wish' },
  pouyaMessage: { title: 'The One From Pouya' },
  teaser30: { title: 'Post-Credit: The One Where Ghazaal Turns 30' },
};

/* ---------- state ---------- */
const state = {
  content: null,
  musicOn: true,
  sfxOn: true,
  soundAsked: false,
  watchMode: false,
  completed: new Set(),
  reasonsFlipped: new Set(),
  quizIndex: 0,
  quizScore: 0,
};

/* ---------- audio controller ---------- */
const audioMusic = () => document.getElementById('audioMusic');
const audioSfx = () => document.getElementById('audioSfx');

function musicUrlFor(key) {
  const notes = state.content && state.content.audioNotes || {};
  const fallback = {
    theme: `${PHOTO_BASE.replace('/photos', '')}/audio/music/friends-theme.mp3`,
    apartment: `${PHOTO_BASE.replace('/photos', '')}/audio/music/apartment-loop.mp3`,
    piano: `${PHOTO_BASE.replace('/photos', '')}/audio/music/romantic-piano.mp3`,
    teaser: `${PHOTO_BASE.replace('/photos', '')}/audio/music/episode-30-teaser.mp3`,
  };
  const map = {
    theme: notes.introTheme || fallback.theme,
    apartment: notes.apartmentLoop || fallback.apartment,
    piano: notes.romanticPiano || fallback.piano,
    teaser: notes.episode30Teaser || fallback.teaser,
  };
  return publicUrl(map[key]);
}

const MUSIC_VOLUME = 0.55;
let musicFadeHandle = null;
function fadeAudio(el, toVolume, duration, onDone) {
  if (musicFadeHandle) cancelAnimationFrame(musicFadeHandle);
  const fromVolume = el.volume;
  const start = performance.now();
  function step(now) {
    const t = Math.max(0, Math.min(1, (now - start) / duration));
    el.volume = fromVolume + (toVolume - fromVolume) * t;
    if (t < 1) {
      musicFadeHandle = requestAnimationFrame(step);
    } else {
      musicFadeHandle = null;
      if (onDone) onDone();
    }
  }
  musicFadeHandle = requestAnimationFrame(step);
}
function playMusic(key) {
  const el = audioMusic();
  if (!state.musicOn) { el.pause(); return; }
  const url = musicUrlFor(key);
  const alreadyOnTrack = el.src && el.src.endsWith(url);
  if (alreadyOnTrack) {
    // same track continuing into the next section — leave it playing, uninterrupted
    if (el.paused) { el.volume = MUSIC_VOLUME; el.play().catch(() => {}); }
    return;
  }
  const swapTrack = () => {
    el.src = url;
    el.volume = 0;
    el.play().catch(() => {});
    fadeAudio(el, MUSIC_VOLUME, 320);
  };
  // fade the outgoing track out first so two tracks are never audible at once,
  // then swap and fade the new one in — a quick crossfade instead of a hard cut
  if (el.src && !el.paused) {
    fadeAudio(el, 0, 220, swapTrack);
  } else {
    swapTrack();
  }
}
function stopMusic() {
  const el = audioMusic();
  if (musicFadeHandle) { cancelAnimationFrame(musicFadeHandle); musicFadeHandle = null; }
  el.pause();
}
const SFX_MAX_DURATION = {
  tvStatic: 2, // full clip runs long and gets annoying on the TV/trailer scene
};
function playSfx(key) {
  if (!state.sfxOn) return;
  const el = audioSfx();
  const url = publicUrl(SFX[key]);
  if (!url) return;
  el.src = url;
  el.currentTime = 0;
  el.volume = 0.65;
  el.play().catch(() => {});
  const maxDuration = SFX_MAX_DURATION[key];
  if (maxDuration) {
    setTimeout(() => {
      if (el.src.endsWith(url) && !el.paused) el.pause();
    }, maxDuration * 1000);
  }
}
function refreshHudButtons() {
  const musicBtn = document.getElementById('btnMusicToggle');
  const sfxBtn = document.getElementById('btnSfxToggle');
  if (musicBtn) musicBtn.classList.toggle('is-off', !state.musicOn);
  if (sfxBtn) sfxBtn.classList.toggle('is-off', !state.sfxOn);
  if (!state.musicOn) stopMusic();
}

/* ---------- HUD / modal / menu wiring (persistent DOM) ---------- */
function initChrome() {
  document.getElementById('btnMusicToggle').addEventListener('click', () => {
    state.musicOn = !state.musicOn;
    refreshHudButtons();
    if (state.musicOn) playMusic(currentMusicKey());
  });
  document.getElementById('btnSfxToggle').addEventListener('click', () => {
    state.sfxOn = !state.sfxOn;
    refreshHudButtons();
  });
  document.getElementById('btnApartment').addEventListener('click', () => navigate('apartment'));
  document.getElementById('btnMenu').addEventListener('click', openEpisodeMenu);
  document.getElementById('btnCloseMenu').addEventListener('click', closeEpisodeMenu);
}

let lastMusicKey = 'apartment';
function currentMusicKey() { return lastMusicKey; }
function setMusicKey(key) { lastMusicKey = key; playMusic(key); }

function showHud(show) {
  document.getElementById('hud').classList.toggle('hidden', !show);
}

function showAudioConsent(onDone) {
  if (state.soundAsked) { onDone(); return; }
  const overlay = document.getElementById('audioConsent');
  overlay.classList.remove('hidden');
  const yes = document.getElementById('btnSoundYes');
  const no = document.getElementById('btnSoundNo');
  const finish = (musicOn, sfxOn) => {
    state.musicOn = musicOn;
    state.sfxOn = sfxOn;
    state.soundAsked = true;
    overlay.classList.add('hidden');
    refreshHudButtons();
    onDone();
  };
  yes.onclick = () => finish(true, true);
  no.onclick = () => finish(false, false);
}

function openEpisodeMenu() {
  const menu = document.getElementById('episodeMenu');
  const list = document.getElementById('menuList');
  const items = WATCH_ORDER.map((id) => {
    const meta = SECTION_META[id];
    const done = state.completed.has(id);
    return `<button class="menu-item ${done ? 'is-done' : ''}" data-nav="${id}">
      <span>${escapeHtml(meta.title)}${done ? ' ✓' : ''}</span>
    </button>`;
  }).join('');
  const locked = `
    <div class="menu-item is-locked"><span>The One With All The Friends<small>Coming in Season 2</small></span></div>
    <div class="menu-item is-locked"><span>The One With The Voice Notes<small>Coming in Season 2</small></span></div>
  `;
  list.innerHTML = items + locked;
  list.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeEpisodeMenu();
      navigate(btn.dataset.nav);
    });
  });
  menu.classList.remove('hidden');
}
function closeEpisodeMenu() {
  document.getElementById('episodeMenu').classList.add('hidden');
}

/* ---------- confetti ---------- */
function burstConfetti() {
  let canvas = document.getElementById('confettiCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confettiCanvas';
    document.body.appendChild(canvas);
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const colors = ['#f2b705', '#d97b3f', '#6b3fa0', '#ff6f9c', '#ffd873'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 200,
    r: 4 + Math.random() * 6,
    c: colors[Math.floor(Math.random() * colors.length)],
    vy: 2 + Math.random() * 3,
    vx: -2 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: -0.2 + Math.random() * 0.4,
  }));
  let frame = 0;
  const maxFrames = 130;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    });
    frame++;
    if (frame < maxFrames) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  tick();
}

/* ---------- router ---------- */
const appRoot = document.getElementById('app');
function setView(html) {
  appRoot.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'auto' });
}

const RENDERERS = {}; // filled in below, keyed by view id -> {render, bind, music}

function navigate(viewId) {
  const view = RENDERERS[viewId];
  if (!view) return;
  showHud(viewId !== 'coldOpen' && viewId !== 'credits');
  setView(view.render());
  if (view.bind) view.bind();
  if (view.music) setMusicKey(view.music);
  if (SECTION_META[viewId]) state.completed.add(viewId);
}

function goNextInWatch(fromId) {
  const idx = WATCH_ORDER.indexOf(fromId);
  const next = WATCH_ORDER[idx + 1];
  if (state.watchMode && next) navigate(next);
  else navigate('apartment');
}

/* ==========================================================
   COLD OPEN
   ========================================================== */
RENDERERS.coldOpen = {
  render() {
    const bg = photoUrl('ghazaalSolo', pick(PHOTOS.ghazaalSolo, 4));
    return `
      <div class="scene cold-open" style="background-image:linear-gradient(180deg, rgba(10,5,16,.55), rgba(10,5,16,.92)), url('${bg}'); background-size:cover; background-position:center;">
        <div class="tv-hum"></div>
        <p class="co-line co-series">Ghazaal: The Birthday Series</p>
        <p class="co-line co-season">Season 1 · Episode 29</p>
        <h1 class="co-line co-title">The One Where Ghazaal Turns 29</h1>
        <p class="co-line co-starring">Starring Ghazaal</p>
        <p class="co-line co-credit">Created with too much love by Pouya</p>
        <div class="co-actions co-line">
          <button class="btn btn-primary" id="btnStartEpisode" type="button">Start Episode</button>
          <button class="btn btn-ghost" id="btnEnterApartment" type="button">Enter Apartment</button>
        </div>
      </div>`;
  },
  bind() {
    document.getElementById('btnStartEpisode').addEventListener('click', () => {
      showAudioConsent(() => navigate('credits'));
    });
    document.getElementById('btnEnterApartment').addEventListener('click', () => {
      showAudioConsent(() => navigate('apartment'));
    });
  },
};

/* ==========================================================
   OPENING CREDITS
   ========================================================== */
const CREDIT_CARDS = [
  { label: 'Starring', name: 'Ghazaal' },
  { label: 'Special Appearance', name: 'Pouya, trying way too hard but somehow pulling it off' },
  { label: 'Episode 29', name: 'The One Where Ghazaal Turns 29' },
  { label: 'Created With', name: 'A suspicious amount of love' },
];
RENDERERS.credits = {
  music: 'theme',
  render() {
    return `
      <div class="scene credits">
        ${aiVideoBg({ id: 'introVideo', src: aiVideoUrl('introVideo'), poster: aiUrl('heroPoster'), replay: false })}
        <button class="btn btn-ghost btn-sm credits-skip" id="btnSkipIntro" type="button">Skip Intro ⏭</button>
        <div id="creditsStage"></div>
      </div>`;
  },
  bind() {
    wireAiVideo('introVideo');
    const stage = document.getElementById('creditsStage');
    let i = 0;
    function showCard() {
      if (!stage.isConnected) return; // scene changed before this timer fired
      if (i >= CREDIT_CARDS.length) { navigate('apartment'); return; }
      const c = CREDIT_CARDS[i];
      stage.innerHTML = `
        <div class="credits-card">
          <p class="credits-label">${escapeHtml(c.label)}</p>
          <h2 class="credits-name">${escapeHtml(c.name)}</h2>
        </div>`;
      i++;
      timer = setTimeout(showCard, 2200);
    }
    let timer = setTimeout(showCard, 200);
    document.getElementById('btnSkipIntro').addEventListener('click', () => {
      clearTimeout(timer);
      navigate('apartment');
    });
  },
};

/* ==========================================================
   APARTMENT HUB
   ========================================================== */
RENDERERS.apartment = {
  music: 'apartment',
  render() {
    return `
      <div class="scene apartment-scene">
        <div class="apartment-intro">
          <p class="eyebrow">Ghazaal: The Birthday Series · S1 · E29</p>
          <h1 class="scene-title">The One Where Ghazaal Turns 29</h1>
          <p class="scene-subtitle">Choose how you want to watch the episode, or just start tapping things.</p>
        </div>
        <div class="apartment-modes">
          <button class="btn btn-primary" id="btnWatchEpisode" type="button">▶ Watch Episode</button>
          <button class="btn btn-secondary" id="btnExplore" type="button">🖱 Explore Apartment</button>
        </div>
        <div class="apartment-room" id="apartmentRoom">
          <div class="room-wallpaper-strip"></div>
          <button class="apt-object obj-door" data-nav="teaser30" data-sfx="doorCreak" type="button">
            <span class="obj-door-frame"></span>
            <span class="apt-label">Purple Door</span>
          </button>
          <button class="apt-object obj-frame" data-nav="memories" data-sfx="cameraShutter" type="button">
            <span class="obj-frame-box"></span>
            <span class="apt-label">Photo Frame</span>
          </button>
          <button class="apt-object obj-tv" data-nav="trailer" data-sfx="remoteClick" type="button">
            <span class="obj-tv-box"></span>
            <span class="apt-label">TV</span>
          </button>
          <button class="apt-object obj-cake" data-nav="reasons" data-sfx="cardFlip" type="button">
            <span class="apt-icon">🎂</span>
            <span class="apt-label">Birthday Cake</span>
          </button>
          <button class="apt-object obj-table" data-nav="quiz" data-sfx="tvStatic" type="button">
            <span class="apt-icon">☕</span>
            <span class="apt-label">Coffee Table</span>
          </button>
          <button class="apt-object obj-fridge" data-nav="favouriteThings" type="button">
            <span class="obj-fridge-box"></span>
            <span class="apt-label">Fridge</span>
          </button>
          <button class="apt-object obj-window" data-nav="birthdayWish" type="button">
            <span class="obj-window-box"></span>
            <span class="apt-label">Window</span>
          </button>
          <button class="apt-object obj-couch" data-nav="pouyaMessage" type="button">
            <span class="apt-icon">🛋️</span>
            <span class="apt-label">Couch</span>
          </button>
          <button class="apt-object obj-notebook" id="btnNotebook" type="button">
            <span class="apt-icon">📓</span>
            <span class="apt-label">Episode Guide</span>
          </button>
        </div>
        <p class="apartment-hint">Tap an object to open that scene. The purple door has a faint golden glow — season 2 is already in production.</p>
      </div>`;
  },
  bind() {
    document.getElementById('btnWatchEpisode').addEventListener('click', () => {
      state.watchMode = true;
      navigate('reasons');
    });
    document.getElementById('btnExplore').addEventListener('click', () => {
      state.watchMode = false;
    });
    document.getElementById('btnNotebook').addEventListener('click', openEpisodeMenu);
    document.querySelectorAll('#apartmentRoom [data-nav]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.watchMode = false;
        if (btn.dataset.sfx) playSfx(btn.dataset.sfx);
        navigate(btn.dataset.nav);
      });
    });
  },
};

/* ==========================================================
   29 REASONS
   ========================================================== */
RENDERERS.reasons = {
  music: 'apartment',
  render() {
    const reasons = (state.content && state.content.reasons) || [];
    const cards = reasons.map((r) => `
      <div class="flip-card ${state.reasonsFlipped.has(String(r.number)) ? 'is-flipped' : ''}" data-index="${r.number}">
        <div class="flip-card-inner">
          <div class="flip-face flip-front">
            <span class="fc-hash">Reason</span>
            <span class="fc-num">#${r.number}</span>
          </div>
          <div class="flip-face flip-back">
            <p class="fc-title">${escapeHtml(r.title)}</p>
            <p class="fc-text">${escapeHtml(r.text)}</p>
          </div>
        </div>
      </div>`).join('');
    return `
      <div class="scene">
        <p class="eyebrow">Triggered by: The Birthday Cake</p>
        <h1 class="scene-title">The One With 29 Reasons</h1>
        <p class="scene-subtitle">Because one birthday message was not enough.</p>
        <p class="reasons-progress" id="reasonsProgress">0 / ${reasons.length} unlocked</p>
        <div class="scene-body">
          <div class="reasons-grid">${cards}</div>
          <div class="reasons-final hidden" id="reasonsFinal">
            <p>Some people get a birthday card.<br>You got a whole episode.</p>
            <p style="margin-top:10px; font-size:.8rem; color:var(--gold-bright);">Reason 30 is currently under production.</p>
          </div>
        </div>
        <div class="scene-footer">
          <button class="btn btn-ghost" id="btnBackApt">Back to Apartment</button>
          <button class="btn btn-primary hidden" id="btnContinue">Continue Episode →</button>
        </div>
      </div>`;
  },
  bind() {
    const total = (state.content && state.content.reasons || []).length;
    const progressEl = document.getElementById('reasonsProgress');
    const finalEl = document.getElementById('reasonsFinal');
    const continueBtn = document.getElementById('btnContinue');
    function updateProgress(celebrate) {
      const complete = state.reasonsFlipped.size >= total;
      progressEl.textContent = `${state.reasonsFlipped.size} / ${total} unlocked`;
      finalEl.classList.toggle('hidden', !complete);
      continueBtn.classList.toggle('hidden', !(state.watchMode && complete));
      if (complete && celebrate) {
        burstConfetti();
        playSfx('confetti');
      }
    }
    document.querySelectorAll('.flip-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = card.dataset.index;
        if (!card.classList.contains('is-flipped')) {
          card.classList.add('is-flipped');
          const wasNew = !state.reasonsFlipped.has(idx);
          state.reasonsFlipped.add(idx);
          playSfx('cardFlip');
          updateProgress(wasNew);
        } else {
          card.classList.remove('is-flipped');
        }
      });
    });
    document.getElementById('btnBackApt').addEventListener('click', () => navigate('apartment'));
    continueBtn.addEventListener('click', () => goNextInWatch('reasons'));
    updateProgress(false);
  },
};

/* ==========================================================
   MEMORIES
   ========================================================== */
RENDERERS.memories = {
  music: 'apartment',
  render() {
    const all = [
      ...PHOTOS.memories.map((f) => ({ folder: 'memories', f })),
      ...PHOTOS.pouyaGhazaal.slice(0, 6).map((f) => ({ folder: 'pouyaGhazaal', f })),
    ];
    const cards = all.map((item, i) => `
      <div class="memory-card" data-full="${photoUrl(item.folder, item.f)}">
        <img src="${photoUrl(item.folder, item.f)}" alt="Memory" loading="lazy" />
        <p class="memory-caption">${escapeHtml(pick(MEMORY_CAPTIONS, i))}</p>
      </div>`).join('');
    return `
      <div class="scene">
        <p class="eyebrow">Triggered by: The Photo Frame</p>
        <h1 class="scene-title">Previously on Ghazaal: The Birthday Series...</h1>
        <p class="scene-subtitle">The One With The Memories</p>
        <div class="scene-body">
          <div class="memories-carousel">${cards}</div>
          <div class="locked-card">
            <span class="lc-badge">Season 2</span>
            The One With All The Friends — Coming in Season 2.
          </div>
        </div>
        <div class="scene-footer">
          <button class="btn btn-ghost" id="btnBackApt">Back to Apartment</button>
          <button class="btn btn-primary" id="btnContinue">Continue Episode →</button>
        </div>
      </div>`;
  },
  bind() {
    document.querySelectorAll('.memory-card').forEach((card) => {
      card.addEventListener('click', () => {
        playSfx('cameraShutter');
        const box = document.createElement('div');
        box.className = 'memory-lightbox';
        box.innerHTML = `<button class="btn btn-ghost btn-sm memory-lightbox-close">✕ Close</button><img src="${card.dataset.full}" alt="Memory enlarged" />`;
        document.body.appendChild(box);
        box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('.memory-lightbox-close')) box.remove(); });
      });
    });
    document.getElementById('btnBackApt').addEventListener('click', () => navigate('apartment'));
    const continueBtn = document.getElementById('btnContinue');
    continueBtn.classList.toggle('hidden', !state.watchMode);
    continueBtn.addEventListener('click', () => goNextInWatch('memories'));
  },
};

/* ==========================================================
   BIRTHDAY TRAILER
   ========================================================== */
const TRAILER_STILLS = [
  { label: 'Apartment Scene', img: 'apartmentScene' },
  { label: 'Central Perk Scene', img: 'centralPerkScene' },
  { label: 'Couch Scene', img: 'couchBirthdayScene' },
  { label: 'Surprise Party Scene', img: 'surpriseScene' },
  { label: 'Episode 30 Teaser Still', img: 'teaser30Golden', teaser: true },
];
RENDERERS.trailer = {
  music: 'apartment',
  render() {
    const poster = aiUrl('heroPoster');
    const stills = TRAILER_STILLS.map((s) => {
      if (!s.img) {
        return `<div class="trailer-still">${escapeHtml(s.label)} — coming soon</div>`;
      }
      const url = aiUrl(s.img);
      return `
        <button class="trailer-still trailer-still-photo ${s.teaser ? 'trailer-still-teaser' : ''}" data-full="${url}" data-label="${escapeHtml(s.label)}" type="button">
          <img src="${url}" alt="${escapeHtml(s.label)}" loading="lazy" />
          <span class="trailer-still-caption">${escapeHtml(s.label)}${s.teaser ? ' · Season 2' : ''}</span>
        </button>`;
    }).join('');
    return `
      <div class="scene">
        <p class="eyebrow">Triggered by: The TV</p>
        <h1 class="scene-title">The One With The Birthday Trailer</h1>
        <p class="scene-subtitle">The full trailer is still being edited. Here's a first look at Episode 29.</p>
        <div class="scene-body">
          <div class="trailer-tv">
            <div class="trailer-screen">
              ${aiVideoBg({ id: 'birthdayTrailerVideo', src: aiVideoUrl('birthdayTrailer'), poster, overlayClass: 'ai-video-overlay-soft' })}
              <div class="trailer-static"></div>
              <div class="trailer-poster-label">
                <p class="tp-badge">Episode 29 Poster</p>
                <h3>The One Where Ghazaal Turns 29</h3>
              </div>
            </div>
          </div>
          <div class="trailer-stills">${stills}</div>
        </div>
        <div class="scene-footer">
          <button class="btn btn-ghost" id="btnBackApt">Back to Apartment</button>
          <button class="btn btn-primary" id="btnContinue">Continue Episode →</button>
        </div>
      </div>`;
  },
  bind() {
    playSfx('tvStatic');
    wireAiVideo('birthdayTrailerVideo');
    document.querySelectorAll('.trailer-still-photo').forEach((btn) => {
      btn.addEventListener('click', () => {
        playSfx('cameraShutter');
        const box = document.createElement('div');
        box.className = 'memory-lightbox';
        box.innerHTML = `<button class="btn btn-ghost btn-sm memory-lightbox-close">✕ Close</button><img src="${btn.dataset.full}" alt="${escapeHtml(btn.dataset.label)}" /><p class="lightbox-caption">${escapeHtml(btn.dataset.label)}</p>`;
        document.body.appendChild(box);
        box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('.memory-lightbox-close')) box.remove(); });
      });
    });
    document.getElementById('btnBackApt').addEventListener('click', () => navigate('apartment'));
    const continueBtn = document.getElementById('btnContinue');
    continueBtn.classList.toggle('hidden', !state.watchMode);
    continueBtn.addEventListener('click', () => goNextInWatch('trailer'));
  },
};

/* ==========================================================
   QUIZ
   ========================================================== */
RENDERERS.quiz = {
  music: 'apartment',
  render() {
    state.quizIndex = 0;
    state.quizScore = 0;
    return `<div class="scene"><div id="quizStage" class="scene-body"></div>
      <div class="scene-footer"><button class="btn btn-ghost" id="btnBackApt">Back to Apartment</button></div></div>`;
  },
  bind() {
    document.getElementById('btnBackApt').addEventListener('click', () => navigate('apartment'));
    renderQuizQuestion();
  },
};

function renderQuizQuestion() {
  const quiz = state.content && state.content.quiz;
  const stage = document.getElementById('quizStage');
  if (!stage) return; // user left the quiz before a pending feedback timer fired
  if (!quiz || !quiz.questions || !quiz.questions.length) {
    stage.innerHTML = '<p class="scene-subtitle">Quiz content did not load. If you are opening this file directly, please serve the site over http(s) instead.</p>';
    return;
  }
  if (state.quizIndex >= quiz.questions.length) {
    const result = quiz.results.find((r) => state.quizScore >= r.minScore)
      || quiz.results[quiz.results.length - 1]
      || { title: 'Thanks for playing!', description: '' };
    playSfx('applause');
    stage.innerHTML = `
      <div class="quiz-card quiz-result">
        <p class="eyebrow">${escapeHtml(quiz.sectionTitle)}</p>
        <h3>${escapeHtml(result.title)}</h3>
        <p class="qr-score">Score: ${state.quizScore} / ${quiz.questions.length}</p>
        <p>${escapeHtml(result.description)}</p>
        <div class="scene-footer">
          <button class="btn btn-primary" id="btnContinue">Continue Episode →</button>
        </div>
      </div>`;
    const continueBtn = document.getElementById('btnContinue');
    continueBtn.classList.toggle('hidden', !state.watchMode);
    if (!state.watchMode) continueBtn.textContent = 'Back to Apartment';
    continueBtn.addEventListener('click', () => {
      if (state.watchMode) goNextInWatch('quiz'); else navigate('apartment');
    });
    return;
  }
  const q = quiz.questions[state.quizIndex];
  stage.innerHTML = `
    <p class="eyebrow">${escapeHtml(quiz.sectionTitle)}</p>
    <h1 class="scene-title">${escapeHtml(quiz.sectionSubtitle)}</h1>
    <div class="quiz-card">
      <p class="quiz-progress">Question ${state.quizIndex + 1} / ${quiz.questions.length}</p>
      <p class="quiz-question">${escapeHtml(q.question)}</p>
      <div class="quiz-options">
        ${q.options.map((opt) => `<button class="quiz-option" data-opt="${escapeHtml(opt)}" type="button">${escapeHtml(opt)}</button>`).join('')}
      </div>
      <p class="quiz-feedback hidden" id="quizFeedback"></p>
    </div>`;
  document.querySelectorAll('.quiz-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      document.querySelectorAll('.quiz-option').forEach((b) => { b.disabled = true; });
      const correct = btn.dataset.opt === q.correctAnswer;
      btn.classList.add(correct ? 'is-correct' : 'is-wrong');
      if (correct) { state.quizScore++; playSfx('laugh'); }
      else {
        document.querySelectorAll('.quiz-option').forEach((b) => {
          if (b.dataset.opt === q.correctAnswer) b.classList.add('is-correct');
        });
      }
      const feedback = document.getElementById('quizFeedback');
      feedback.textContent = q.feedback;
      feedback.classList.remove('hidden');
      setTimeout(() => { state.quizIndex++; renderQuizQuestion(); }, 1600);
    });
  });
}

/* ==========================================================
   FAVOURITE THINGS
   ========================================================== */
RENDERERS.favouriteThings = {
  music: 'apartment',
  render() {
    const ft = state.content && state.content.favouriteThings;
    const items = (ft && ft.items) || [];
    const magnets = items.map((it) => {
      const isPlaceholder = /^add /i.test(String(it.value || '').trim());
      return `
      <div class="fridge-magnet ${isPlaceholder ? 'is-placeholder' : ''}">
        <p class="fm-label">${escapeHtml(it.label)}</p>
        <p class="fm-value">${escapeHtml(it.value)}</p>
        <p class="fm-note">${escapeHtml(it.note)}</p>
        ${isPlaceholder ? '<span class="fm-placeholder-tag">✏️ Pouya still needs to fill this in</span>' : ''}
      </div>`;
    }).join('');
    return `
      <div class="scene">
        <p class="eyebrow">Triggered by: The Fridge</p>
        <h1 class="scene-title">${escapeHtml((ft && ft.sectionTitle) || 'The One With Her Favourite Things')}</h1>
        <p class="scene-subtitle">${escapeHtml((ft && ft.sectionSubtitle) || '')}</p>
        <div class="scene-body"><div class="fridge-board">${magnets}</div></div>
        <div class="scene-footer">
          <button class="btn btn-ghost" id="btnBackApt">Back to Apartment</button>
          <button class="btn btn-primary" id="btnContinue">Continue Episode →</button>
        </div>
      </div>`;
  },
  bind() {
    document.getElementById('btnBackApt').addEventListener('click', () => navigate('apartment'));
    const continueBtn = document.getElementById('btnContinue');
    continueBtn.classList.toggle('hidden', !state.watchMode);
    continueBtn.addEventListener('click', () => goNextInWatch('favouriteThings'));
  },
};

/* ==========================================================
   BIRTHDAY WISH
   ========================================================== */
RENDERERS.birthdayWish = {
  music: 'apartment',
  render() {
    const stars = Array.from({ length: 18 }, (_, i) => {
      const left = Math.round((i * 37) % 90) + 5;
      const top = Math.round((i * 53) % 60) + 5;
      const delay = (i % 5) * 0.4;
      return `<span class="wish-star" style="left:${left}%; top:${top}%; animation-delay:${delay}s;">✦</span>`;
    }).join('');
    return `
      <div class="scene wish-scene">
        <p class="eyebrow">Triggered by: The Window</p>
        <h1 class="scene-title">Make a birthday wish.</h1>
        <div class="scene-body">
          <div class="wish-window" id="wishWindow">
            ${stars}
            <span class="wish-candle">🕯️</span>
          </div>
          <p class="wish-message" id="wishMessage">I hope this year gives you even a little bit of the happiness you give everyone else.</p>
        </div>
        <div class="scene-footer">
          <button class="btn btn-ghost" id="btnBackApt">Back to Apartment</button>
          <button class="btn btn-primary hidden" id="btnContinue">Continue Episode →</button>
        </div>
      </div>`;
  },
  bind() {
    const continueBtn = document.getElementById('btnContinue');
    document.getElementById('wishWindow').addEventListener('click', () => {
      document.getElementById('wishMessage').classList.add('is-visible');
      playSfx('aww');
      burstConfetti();
      if (state.watchMode) continueBtn.classList.remove('hidden');
    }, { once: true });
    document.getElementById('btnBackApt').addEventListener('click', () => navigate('apartment'));
    continueBtn.addEventListener('click', () => goNextInWatch('birthdayWish'));
  },
};

/* ==========================================================
   POUYA MESSAGE
   ========================================================== */
RENDERERS.pouyaMessage = {
  music: 'piano',
  render() {
    const photo = photoUrl('pouyaGhazaal', pick(PHOTOS.pouyaGhazaal, 3));
    return `
      <div class="scene pouya-scene">
        <p class="eyebrow">Triggered by: The Couch</p>
        <h1 class="scene-title">The One From Pouya</h1>
        <p class="pouya-lead">A normal birthday message felt too small. So I made you an episode. But the real reason is simple...</p>
        <div class="scene-body">
          <img class="pouya-photo" src="${photo}" alt="Pouya and Ghazaal" />
          <div class="pouya-letter" id="pouyaLetter"></div>
        </div>
        <div class="scene-footer pouya-footer" id="pouyaFooter">
          <button class="btn btn-gold" id="btnFinish">Finish Episode →</button>
        </div>
      </div>`;
  },
  bind() {
    const letter = document.getElementById('pouyaLetter');
    const footer = document.getElementById('pouyaFooter');
    const msg = (state.content && state.content.pouyaFinalMessage) || '';
    const paragraphs = msg.split(/\n\s*\n/).filter(Boolean);
    const BASE_DELAY = 300;
    const ANIM_DURATION = 1000;
    const STAGGER = Math.min(550, 4500 / Math.max(paragraphs.length, 1));
    letter.innerHTML = '';
    // Paragraphs are appended one at a time (instead of all being laid out up
    // front with only their opacity delayed) so the letter card grows with the
    // message instead of reserving one big empty box for text still to come.
    if (!paragraphs.length) {
      footer.classList.add('is-visible');
    } else {
      paragraphs.forEach((p, i) => {
        setTimeout(() => {
          if (!letter.isConnected) return; // user left this scene before the timer fired
          const line = document.createElement('p');
          line.className = 'pouya-line';
          line.innerHTML = escapeHtml(p).replace(/\n/g, '<br>');
          letter.appendChild(line);
          if (i === paragraphs.length - 1) {
            setTimeout(() => footer.classList.add('is-visible'), ANIM_DURATION);
          }
        }, BASE_DELAY + i * STAGGER);
      });
    }
    document.getElementById('btnFinish').addEventListener('click', () => goNextInWatch('pouyaMessage'));
  },
};

/* ==========================================================
   EPISODE 30 TEASER / POST-CREDIT
   ========================================================== */
RENDERERS.teaser30 = {
  music: 'teaser',
  render() {
    const bg = aiUrl('teaser30Golden');
    return `
      <div class="scene teaser-scene">
        ${aiVideoBg({ id: 'teaser30Video', src: aiVideoUrl('teaser30Video'), poster: bg })}
        <p class="teaser-wait">Wait... there's one more thing.</p>
        <div class="teaser-glow30">30</div>
        <div class="teaser-copy">
          <p class="eyebrow" style="margin-top:18px;">Season 2 · Episode 30</p>
          <h2 class="scene-title" style="margin-top:6px;">The One Where Ghazaal Turns 30</h2>
          <p style="margin-top:14px;">Season 1 complete.</p>
          <p style="margin-top:10px;"><strong>The One Where Ghazaal Turns 29</strong> was only the beginning. Next year, the story gets bigger, louder, funnier, sweeter, more dramatic, and even more unforgettable.</p>
          <p class="teaser-footnote">Coming July 19, 2027. The big one is coming.</p>
          <p class="teaser-footnote" style="opacity:.7;">Some birthday episodes need a whole year to prepare. "Why, God, why?" energy loading...</p>
        </div>
        <div class="scene-footer">
          <button class="btn btn-ghost" id="btnReplay">Replay Episode 29</button>
          <button class="btn btn-primary" id="btnBackApt">Back to Apartment</button>
        </div>
      </div>`;
  },
  bind() {
    playSfx('doorCreak');
    wireAiVideo('teaser30Video');
    document.getElementById('btnReplay').addEventListener('click', () => {
      state.watchMode = false;
      state.reasonsFlipped.clear();
      state.completed.clear();
      navigate('coldOpen');
    });
    document.getElementById('btnBackApt').addEventListener('click', () => navigate('apartment'));
  },
};

/* ==========================================================
   BOOTSTRAP
   ========================================================== */
async function loadContent() {
  try {
    const res = await fetch('/ghazaal-episode-29-content-pack.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('bad status');
    return await res.json();
  } catch (err) {
    console.warn('Could not load content pack — serve this site over http(s) for full content.', err);
    return { reasons: [], favouriteThings: { items: [] }, quiz: { questions: [], results: [] }, pouyaFinalMessage: '', audioNotes: {} };
  }
}

(async function init() {
  initChrome();
  state.content = await loadContent();
  navigate('coldOpen');
})();
