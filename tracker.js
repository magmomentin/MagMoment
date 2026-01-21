import { MindARImage } from "https://cdn.jsdelivr.net/npm/mind-ar@1.2.4/dist/mindar-image.esm.js";

const video = document.getElementById("arVideo");

const STATE = {
  ACTIVE: "active",
  LOCKED: "locked",
  LOST: "lost"
};

let currentState = STATE.LOST;
let lastSeen = 0;

function updateState(detected, confidence) {
  const now = performance.now();

  if (detected && confidence >= 0.85) {
    currentState = STATE.ACTIVE;
    lastSeen = now;
  } else if (detected && confidence >= 0.55) {
    currentState = STATE.LOCKED;
    lastSeen = now;
  } else if (now - lastSeen > 600) {
    currentState = STATE.LOST;
  }

  return currentState;
}

// ✅ CORRECT ESM CONSTRUCTOR
const mindar = new MindARImage({
  container: document.body,
  imageTargetSrc: "assets/target.mind"
});

await mindar.start();

// listen to image tracking
mindar.addEventListener("targetFound", () => {
  video.style.display = "block";
  video.style.opacity = "1";
  video.play();
});

mindar.addEventListener("targetLost", () => {
  video.style.opacity = "0";
});
