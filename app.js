const camera = document.getElementById("camera");
const arVideo = document.getElementById("arVideo");
const hint = document.getElementById("hint");

let placed = false;

navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" }
}).then(stream => {
  camera.srcObject = stream;
});

document.addEventListener("click", e => {
  if (placed) return;

  placed = true;
  hint.style.display = "none";

  const frameWidth = window.innerWidth * 0.6;
  const frameHeight = frameWidth * 4 / 3;

  arVideo.style.width = frameWidth + "px";
  arVideo.style.height = frameHeight + "px";
  arVideo.style.left = (e.clientX - frameWidth / 2) + "px";
  arVideo.style.top = (e.clientY - frameHeight / 2) + "px";

  arVideo.style.display = "block";
  arVideo.play();
});
