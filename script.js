let tapCount = 0;
let largeHeartShown = false;

document.body.addEventListener("click", (e) => {
  // handleInteraction(e.clientX, e.clientY);
});

// Also support touch for iPhones
document.body.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  // handleInteraction(touch.clientX, touch.clientY);
});

function handleInteraction(x, y) {
  createFloatingHeart(x, y);
  tapCount++;

  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic && bgMusic.paused) {
    bgMusic.volume = 0;
    bgMusic.play().then(() => {
      gsap.to(bgMusic, { volume: 0.5, duration: 3 });
    }).catch(e => console.warn("Blocked:", e));
  }

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
    onComplete: () => heart.remove()
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
    clearInterval(emojiInterval); // ✅ stops emoji confetti
    document.querySelector(".tear-overlay")?.remove(); // ✅ removes existing emojis
    showStorybook();
  });
}
function showStorybook() {
  document.getElementById("container").classList.add("hidden");
  document.getElementById("storybook").classList.add("show");

  const album = document.getElementById("album");
  album.innerHTML = "";

  const pages = [
    "<div class='tear-overlay'></div>",

    "🎉 On July 19, 1997... someone special was born.",
    "👶 Baby steps... <br><img src='images/baby.jpg' alt='Baby' />",
    "🎓 She came to Sydney for her dreams.",
    "✈️ He came from Tehran chasing a new life.",
    "🌟 1st Dec 2022 – Fate said <em>hello</em>.",
    "💘 And every page since... has been us.",
    "🌈 Happy Birthday, My Love",
    "💌 With all my love, Pouya",
    "<div class='page love-letter'>Dear love,<br><br>Every day with you feels like a new page of magic, hope, and joy. You light up my life in ways words can't capture. Thank you for being born, for existing, and for loving me back.<br><br>Forever yours,<br>❤️ Pouya</div>",
    "<div class='page gift'><h2>🎁 Surprise Coming Soon!</h2><p>Turn the page to see what's next...</p></div>"

  ];

  const pageElements = [];

  for (const text of pages) {
    const page = document.createElement("div");
    page.className = "page";
    page.innerHTML = text;
    pageElements.push(page);
  }

  // Delay init by a frame to make sure album is visible
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


    // Mute Toggle
    const muteButton = document.getElementById("muteToggle");
    muteButton.classList.remove("hidden");
    muteButton.addEventListener("click", () => {
      if (bgMusic.muted) {
        bgMusic.muted = false;
        muteButton.textContent = "🔇";
      } else {
        bgMusic.muted = true;
        muteButton.textContent = "🔊";
      }
    });

  });
}

function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  document.body.appendChild(canvas);

  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = 100;
  canvas.style.pointerEvents = "none";

  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
  myConfetti({
    particleCount: 150,
    spread: 120,
    origin: { y: 0.6 }
  });
}
