const video = document.getElementById("arVideo");
const container = document.getElementById("ar-container");

/* --------------------
   STATE
-------------------- */
let confirmed = false;
let detectStartTime = null;

const CONFIRM_TIME = 500; // ms target must stay visible

/* --------------------
   MINDAR INIT
-------------------- */
const mindar = new window.MINDAR.IMAGE.MindARImage({
  container: container,
  imageTargetSrc: "assets/target.mind",
  maxTrack: 1
});

const { renderer, scene, camera } = mindar;
const anchor = mindar.addAnchor(0);

/* --------------------
   FORCE SAFE START
-------------------- */
video.pause();
video.currentTime = 0;
video.style.display = "none";

/* --------------------
   TARGET FOUND
-------------------- */
anchor.onTargetFound = () => {
  if (!detectStartTime) {
    detectStartTime = Date.now();
    return;
  }

  // confirm stable detection
  if (!confirmed && Date.now() - detectStartTime > CONFIRM_TIME) {
    confirmed = true;
    video.style.display = "block";
    video.play();
  }
};

/* --------------------
   TARGET LOST
-------------------- */
anchor.onTargetLost = () => {
  detectStartTime = null;
  confirmed = false;
  video.pause();
  video.style.display = "none";
};

/* --------------------
   START
-------------------- */
(async () => {
  await mindar.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
})();
