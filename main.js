import { startCamera } from "./camera.js";
import { setupRenderer } from "./renderer.js";

const cameraVideo = document.getElementById("camera");
const canvas = document.getElementById("overlay");

await startCamera(cameraVideo);
const ctx = setupRenderer(canvas, cameraVideo);

// TEMP: draw test rectangle (simulating frame detection)
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "lime";
  ctx.lineWidth = 4;
  ctx.strokeRect(
    canvas.width * 0.25,
    canvas.height * 0.25,
    canvas.width * 0.5,
    canvas.height * 0.5
  );

  requestAnimationFrame(loop);
}

loop();
