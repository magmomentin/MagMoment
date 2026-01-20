document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const video = document.querySelector("#magVideo");

  scene.addEventListener("arReady", () => {
    console.log("MindAR is ready.");
  });

  scene.addEventListener("arError", () => {
    console.error("MindAR failed to start.");
  });

  scene.addEventListener("renderstart", () => {
    const mindarSystem = scene.systems["mindar-image-system"];

    mindarSystem.start(); // ensure system starts

    mindarSystem.addEventListener("targetFound", () => {
      console.log("Target found — playing video");
      video.play();
    });

    mindarSystem.addEventListener("targetLost", () => {
      console.log("Target lost — pausing video");
      video.pause();
    });
  });
});
