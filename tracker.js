const video = document.getElementById("arVideo");

/* --- Hybrid State --- */
const STATE = {
  ACTIVE: "active",
  LOST: "lost"
};

let currentState = STATE.LOST;

/* --- Init MindAR --- */
const mindar = new window.MINDAR.IMAGE.MindARController({
  container: document.body,
  imageTargetSrc: "assets/target.mind"
});

(async () => {
  await mindar.start();

  /* When frame is found */
  mindar.on("targetFound", () => {
    if (currentState === STATE.ACTIVE) return;
    currentState = STATE.ACTIVE;

    // Force playback (mobile safe)
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        document.body.addEventListener(
          "click",
          () => video.play(),
          { once: true }
        );
      });
    }

    video.classList.add("playing");
  });

  /* When frame is lost */
  mindar.on("targetLost", () => {
    currentState = STATE.LOST;

    video.classList.remove("playing");
    video.pause();
  });
})();
