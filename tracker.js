const video = document.getElementById("arVideo");

/* Init MindAR (GLOBAL API exists here) */
const mindar = new window.MINDAR.IMAGE.MindARThree({
  container: document.body,
  imageTargetSrc: "assets/target.mind"
});

const { renderer, scene, camera } = mindar;

(async () => {
  await mindar.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });

  mindar.addEventListener("targetFound", () => {
    video.style.opacity = "1";
    video.play().catch(() => {
      document.body.addEventListener("click", () => video.play(), { once: true });
    });
  });

  mindar.addEventListener("targetLost", () => {
    video.style.opacity = "0";
    video.pause();
  });
})();
