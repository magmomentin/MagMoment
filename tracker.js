const camera = document.getElementById("camera");
const arLayer = document.getElementById("ar-layer");

// CAMERA INIT
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" },
  audio: false
}).then(stream => {
  camera.srcObject = stream;
}).catch(err => {
  alert("Camera access failed");
  console.error(err);
});

// ---- FRAME LOCK ENGINE (SINGLE FRAME) ----

// Simulated frame anchor (center of screen)
// This is intentional for v1 stability
let target = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  scale: 1,
  rotateX: 0,
  rotateY: 0
};

// MAIN LOOP
function updateAR() {

  // Small perspective reaction (feels AR, but stable)
  const tiltX = (window.innerHeight / 2 - target.y) * 0.001;
  const tiltY = (window.innerWidth / 2 - target.x) * -0.001;

  arLayer.style.transform =
    `translate(-50%, -50%)
     scale(${target.scale})
     rotateX(${tiltX}deg)
     rotateY(${tiltY}deg)`;

  requestAnimationFrame(updateAR);
}

// START LOOP
updateAR();
