const video = document.getElementById("arVideo");

const mindar = new window.MINDAR.IMAGE.MindARController({
  container: document.body,
  imageTargetSrc: "assets/target.mind"
});

async function startAR() {
  await mindar.start();

  mindar.on("update", (data) => {
    const detected = data.hasTarget;
    const confidence = data.confidence || 0;

    const state = updateState(detected, confidence);

    if (state === AR_STATE.ACTIVE) {
      video.style.display = "block";
      video.style.opacity = "1";
      video.style.transform = data.cssTransform || "none";
      video.play();
    }

    if (state === AR_STATE.LOCKED) {
      video.style.opacity = "1";
    }

    if (state === AR_STATE.LOST) {
      video.style.opacity = "0";
    }
  });
}

startAR();
