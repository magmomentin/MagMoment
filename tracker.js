const video = document.getElementById("arVideo");
const engine = window.AR_ENGINE;

const mindar = new window.MINDAR.IMAGE.MindARController({
  container: document.body,
  imageTargetSrc: "assets/target.mind"
});

async function startAR() {
  await mindar.start();

  mindar.on("update", (data) => {
    const detected = data.hasTarget;
    const confidence = data.confidence || 0;

    const state = engine.updateState(detected, confidence);

    render(state, data);
  });
}

function render(state, data) {

  if (state === engine.STATE.ACTIVE) {
    video.style.display = "block";
    video.style.opacity = "1";
    video.style.transform = data.cssTransform || "none";
    video.play();
  }

  if (state === engine.STATE.LOCKED) {
    video.style.display = "block";
    video.style.opacity = "1";
  }

  if (state === engine.STATE.LOST) {
    video.style.opacity = "0";
  }
}

startAR();
