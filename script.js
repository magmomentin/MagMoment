document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const video = document.querySelector("#magVideo");

  scene.addEventListener("arReady", () => {
    document.getElementById("loading").style.display = "none";
    console.log("MindAR ready");
  });

  scene.addEventListener("arError", () => {
    console.error("MindAR failed to start");
  });

  scene.addEventListener("renderstart", () => {
    const mindarSystem = scene.systems["mindar-image-system"];
    if (!mindarSystem) {
      console.error("MindAR system not found!");
      return;
    }

    mindarSystem.addEventListener("targetFound", () => {
      video.play();
    });

    mindarSystem.addEventListener("targetLost", () => {
      video.pause();
    });
  });
});
