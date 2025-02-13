let tapCount = 0;
let largeHeartShown = false;
let touchStartTime = 0;

/**
 * Creates a floating heart at (x, y) with a scaling factor.
 * The scale factor makes the heart bigger based on touch duration.
 */
function createFloatingHeart(x, y, scaleFactor = 1) {
  const heart = document.createElement("div");
  heart.classList.add("floating-heart");
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  document.body.appendChild(heart);

  // Randomize movement properties
  const dx = (Math.random() - 0.5) * 200;  // horizontal drift
  const dy = -Math.random() * 200 - 50;    // upward movement
  const rotation = Math.random() * 360;
  const duration = Math.random() * 2 + 2;  // 2 to 4 seconds
  
  // Determine a random base scale, then multiply by our scaleFactor.
  const baseScale = Math.random() * 0.8 + 0.3;
  const finalScale = baseScale * scaleFactor;
  
  gsap.set(heart, { opacity: 1, scale: finalScale });
  gsap.to(heart, {
    duration: duration,
    x: `+=${dx}`,
    y: `+=${dy}`,
    rotation: rotation,
    opacity: 0,
    ease: "power1.out",
    onComplete: () => heart.remove()
  });
}

/**
 * Global interaction handler.
 * For clicks, touchDuration defaults to 0 (scale factor 1).
 * For touch events, a nonzero duration will increase the scale.
 */
function handleInteraction(e, touchDuration = 0) {
  let x, y;
  if (e.touches && e.touches.length > 0) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }
  
  // Calculate scale factor based on touch duration (clamped; 0ms → 1, 2000ms → 3)
  let scaleFactor = 1;
  if (touchDuration > 0) {
    scaleFactor = 1 + Math.min(touchDuration, 2000) / 1000; // e.g., 1000ms = 2x, 2000ms = 3x
  }
  
  // Spawn a floating heart at the interaction point
  createFloatingHeart(x, y, scaleFactor);
  
  // Increment tap count; when reaching 20, show the large heart (only once)
  tapCount++;
  if (tapCount >= 20 && !largeHeartShown) {
    showLargeHeart();
    largeHeartShown = true;
  }
}

/* --- TOUCH EVENTS --- */
// For touch devices, measure touch duration.
document.addEventListener("touchstart", (e) => {
  touchStartTime = Date.now();
});
document.addEventListener("touchend", (e) => {
  const duration = Date.now() - touchStartTime;
  handleInteraction(e, duration);
});

/* For mouse clicks */
document.addEventListener("click", (e) => {
  // For mouse clicks, we use the default scale factor = 1.
  handleInteraction(e, 0);
});

/**
 * Displays the large, pulsing heart at the center.
 */
function showLargeHeart() {
  // Hide the instruction
  document.getElementById("instruction").classList.add("hidden");
  const bigHeart = document.getElementById("bigHeart");
  bigHeart.classList.remove("hidden");
  
  // Animate its appearance
  gsap.fromTo(bigHeart, { scale: 0 }, { duration: 1, scale: 1, ease: "back.out(1.7)" });
  
  // Add a continuous pulsing effect
  gsap.to(bigHeart, { duration: 0.8, scale: 1.1, yoyo: true, repeat: -1, ease: "power1.inOut" });
  
  // Add click/touch listener to the large heart
  bigHeart.addEventListener("click", bigHeartClicked);
  bigHeart.addEventListener("touchstart", bigHeartClicked);
}

/**
 * When the large heart is pressed, hide it and show the Valentine question.
 */
function bigHeartClicked() {
  gsap.killTweensOf("#bigHeart");
  document.getElementById("bigHeart").classList.add("hidden");
  showQuestion();
}

/**
 * Displays the Valentine question container.
 */
function showQuestion() {
  const question = document.getElementById("question");
  question.classList.remove("hidden");
  gsap.from(question, { duration: 1, opacity: 0, y: 50, ease: "power2.out" });
  
  // Attach event listeners for Yes/No buttons
  document.getElementById("yesBtn").addEventListener("click", handleYes);
  document.getElementById("noBtn").addEventListener("click", handleNo);
}

/**
 * Handle the "Yes" response: spawn a burst of hearts and show the romantic message.
 */
function handleYes() {
  // Determine the center of the container
  const containerRect = document.getElementById("container").getBoundingClientRect();
  const centerX = containerRect.left + containerRect.width / 2;
  const centerY = containerRect.top + containerRect.height / 2;
  
  // Spawn a burst of hearts (100 hearts)
  for (let i = 0; i < 100; i++) {
    createFloatingHeart(centerX, centerY);
  }
  // Hide the question and show the romantic message
  document.getElementById("question").classList.add("hidden");
  showMessage();
}

/**
 * Handle the "No" response (playful behavior).
 */
function handleNo() {
  alert("Oh no! Please reconsider!");
}

/**
 * Displays the romantic message with letter-by-letter text animation.
 */
function showMessage() {
  const message = document.getElementById("message");
  message.classList.remove("hidden");
  gsap.from(message, { duration: 1, opacity: 0, scale: 0.8, ease: "elastic.out(1, 0.5)" });
  animateText("#message h1");
  animateText("#message p");
}

/**
 * Splits text into individual spans and animates them.
 */
function animateText(selector) {
  const element = document.querySelector(selector);
  const text = element.textContent;
  element.innerHTML = "";
  text.split("").forEach(letter => {
    const span = document.createElement("span");
    span.textContent = letter;
    element.appendChild(span);
  });
  gsap.fromTo(selector + " span", 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.05, stagger: 0.03, ease: "power2.out" }
  );
}
