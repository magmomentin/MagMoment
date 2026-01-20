import { startCamera } from "./camera.js";
import { resolveToken } from "./security/token.js";
import { FrameDetector } from "./detector/frameDetector.js";
import { PoseEstimator } from "./detector/poseEstimator.js";
import { VideoPlayer } from "./media/videoPlayer.js";
import { UIManager } from "./ui/uiManager.js";
import { GLRenderer } from "./renderer/glRenderer.js";

let arStarted = false;
let frameLocked = false;
let lastSeenTime = 0;
let hasEverDetected = false;
let videoAttached = false;
const LOCK_TIMEOUT = 800;

const cam = document.getElementById("camera");
const canvas = document.getElementById("glcanvas");
const ui = new UIManager();
const auth = await resolveToken();

await startCamera(cam);

const detector = new FrameDetector(auth.frameId);
const pose = new PoseEstimator();
let player, gl;

const toCorners = b => [
  [b.x, b.y],
  [b.x + b.width, b.y],
  [b.x, b.y + b.height],
  [b.x + b.width, b.y + b.height]
];

function loop() {
  if (!arStarted) {
    requestAnimationFrame(loop);
    return;
  }

  const r = detector.detect(cam);
  const now = Date.now();

  if (r) {
    hasEverDetected = true;
    frameLocked = true;
    lastSeenTime = now;

    if (!videoAttached) {
      document.body.appendChild(player.video);
      player.video.style.display = "none";
      videoAttached = true;
    }

    const b = pose.smoothBox(r);
    player.play();
    gl.draw(toCorners(b));
    ui.found();

  } else if (frameLocked && hasEverDetected && now - lastSeenTime < LOCK_TIMEOUT) {
    player.play();
    gl.draw(toCorners(pose.last));
    ui.found();

  } else {
    frameLocked = false;
    player.pause();
    gl.clear();
    ui.lost();
  }

  requestAnimationFrame(loop);
}

ui.waitForTap(() => {
  arStarted = true;

  detector.hits = 0;
  pose.last = null;
  frameLocked = false;
  lastSeenTime = 0;
  hasEverDetected = false;
  videoAttached = false;

  player = new VideoPlayer(auth.videoUrl);
  gl = new GLRenderer(canvas, player.video);

  requestAnimationFrame(loop);
});
