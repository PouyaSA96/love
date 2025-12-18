let tapCount = 0;
let largeHeartShown = false;

// Click + touch support (desktop + iPhone)
document.body.addEventListener("click", (e) => {
  handleInteraction(e.clientX, e.clientY);
});

document.body.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  handleInteraction(touch.clientX, touch.clientY);
});

function handleInteraction(x, y) {
  createFloatingHeart(x, y);
  tapCount++;

  // Start background music on first real user interaction (browser autoplay rules)
  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic && bgMusic.paused) {
    bgMusic.volume = 0;
    bgMusic
      .play()
      .then(() => {
        gsap.to(bgMusic, { volume: 0.5, duration: 3 });
      })
      .catch((e) => console.warn("Blocked:", e));
  }

  // After enough taps, show the big heart to "enter" the book
  if (tapCount >= 20 && !largeHeartShown) {
    largeHeartShown = true;
    showLargeHeart();
  }
}

function createFloatingHeart(x, y) {
  const heart = document.createElement("div");
  heart.classList.add("floating-heart");
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  document.body.appendChild(heart);

  const dx = (Math.random() - 0.5) * 200;
  const dy = -Math.random() * 200 - 50;
  const rotation = Math.random() * 360;

  gsap.set(heart, { opacity: 1, scale: 1 });
  gsap.to(heart, {
    duration: 3,
    x: `+=${dx}`,
    y: `+=${dy}`,
    rotation: rotation,
    opacity: 0,
    ease: "power1.out",
    onComplete: () => heart.remove(),
  });
}

function showLargeHeart() {
  document.getElementById("instruction").classList.add("hidden");
  const bigHeart = document.getElementById("bigHeart");
  bigHeart.classList.remove("hidden");

  gsap.fromTo(bigHeart, { scale: 0 }, { duration: 1, scale: 1, ease: "back.out(1.7)" });
  gsap.to(bigHeart, { duration: 0.8, scale: 1.1, yoyo: true, repeat: -1, ease: "power1.inOut" });

  bigHeart.addEventListener("click", () => {
    bigHeart.classList.add("hidden");

    // Stop the extra confetti emoji layer when entering the book (cleaner pages)
    try {
      clearInterval(emojiInterval);
    } catch (_) {}
    document.querySelector(".tear-overlay")?.remove();

    showStorybook();
  });
}

// ------------------------------
// 2025 Month-by-month scrapbook
// ------------------------------

const MONTHS_2025 = [
  { month: "January", img: "images/jan.jpg", text: "❤️ Remember our January adventure in Cairns? You were so cute. ❤️" },
  { month: "February", img: "images/feb.jpg", text: "❤️ Remember how we spent Valentine’s Day on Cockatoo Island? You were so cute. ❤️" },
  { month: "March", img: "images/march.jpg", text: "❤️ Remember March with your family? You were so cute in the park. ❤️" },
  { month: "April", img: "images/april.jpg", text: "❤️ Remember April with my family? You were so cute at the Easter Show. ❤️" },
  { month: "May", img: "images/may.jpg", text: "❤️ Remember May when you travelled? You were so cute at the airport. ❤️" },
  { month: "June", img: "images/june.jpg", text: "❤️ Remember June when we were apart? It was a sad time, but you were still so cute. ❤️" },
  { month: "July", img: "images/july.jpg", text: "❤️ Remember our birthdays together? You were so cute under the stars. ❤️" },
  { month: "August", img: "images/aug.jpg", text: "❤️ Remember August together? You were so cute at the restaurant. ❤️" },
  { month: "September", img: "images/sep.jpg", text: "❤️ Remember September together? You were so cute in the park near the bridge. ❤️" },
  { month: "October", img: "images/oct.jpg", text: "❤️ Remember our October trip to Orange? You were so cute—my cutest little flower. ❤️" },
  { month: "November", img: "images/nov.jpg", text: "❤️ Remember November together? You were so cute—the cutest in the whole world. ❤️" },
  { month: "December", img: "images/dec.jpg", text: "❤️ Remember December together? You were the cutest angel. ❤️" },
];


function fmtToday() {
  return new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderMonthPage({ month, img, text }) {
  return `
    <div class="month-title">${month} 2025</div>
    <div class="month-photo">
      <div class="photo-placeholder">Drop image here:<br><strong>${img}</strong></div>
      <img
        src="${img}"
        alt="${month} 2025"
        onload="this.previousElementSibling.style.display='none';"
        onerror="this.style.display='none'; this.previousElementSibling.innerHTML='Missing image:<br><strong>${img}</strong>';"
      />
    </div>
    <div class="month-text">${text}</div>
  `;
}

function showStorybook() {
  document.getElementById("container").classList.add("hidden");
  document.getElementById("storybook").classList.add("show");

  const album = document.getElementById("album");
  album.innerHTML = "";

  const today = fmtToday();

  const pages = [
    {
      className: "cover",
      html: `
        <h5>Happy Anniversary ❤️</h5>
        <div class="cover-sub">A little scrapbook of our LOVE in 2025</div>
        <div class="cover-date">${today}</div>
        <div class="cover-hint">(Swipe / drag to flip)</div>
      `,
    },
    {
      className: "intro",
      html: `
        <div class="intro-title">Twelve months. One us. One LOVE</div>
      `,
    },
    ...MONTHS_2025.map((m) => ({ className: "month-page", html: renderMonthPage(m) })),
    {
      className: "love-letter",
      html: `
        <div class="letter-title">One more thing…</div>
        <div class="letter-body">
          Thank you for being my favorite person in every season.
          <br><br>
          Here’s to more months, more memories, and more “how are you still this cute?” moments.
          <br><br>
          Forever yours,<br><br>❤️ Pouya
        </div>
      `,
    },
    {
      className: "gift",
      html: `<h5>🎁 Next chapter: loading…</h5><div class="gift-sub">(I’m not done loving you.)</div>`,
    },
  ];

  const pageElements = [];
  for (const p of pages) {
    const page = document.createElement("div");
    page.className = `page${p.className ? " " + p.className : ""}`;
    page.innerHTML = p.html;
    pageElements.push(page);
  }

  requestAnimationFrame(() => {
    const pageFlip = new St.PageFlip(album, {
      width: 300,
      height: 400,
      size: "fixed",
      maxShadowOpacity: 0.5,
      showCover: false,
      mobileScrollSupport: false,
      usePortrait: true,
      startPage: 0,
      useMouseEvents: true,
    });

    pageFlip.loadFromHTML(pageElements);
    launchConfetti();

    // Mute Toggle (fixes the old scope bug)
    const bgMusic = document.getElementById("bgMusic");
    const muteButton = document.getElementById("muteToggle");

    if (muteButton && bgMusic) {
      muteButton.classList.remove("hidden");
      muteButton.textContent = bgMusic.muted ? "🔇" : "🔊";

      muteButton.addEventListener("click", () => {
        bgMusic.muted = !bgMusic.muted;
        muteButton.textContent = bgMusic.muted ? "🔇" : "🔊";
      });
    }
  });
}

function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  document.body.appendChild(canvas);

  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = 100;
  canvas.style.pointerEvents = "none";

  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
  myConfetti({
    particleCount: 150,
    spread: 120,
    origin: { y: 0.6 },
  });
}
