document.addEventListener("DOMContentLoaded", () => {
  if (!AFRAME.systems["mindar-image"]) {
    console.error("MindAR system not found! Check script imports.");
    return;
  }

  // Custom component to control video playback
  AFRAME.registerComponent("play-on-target", {
    init: function () {
      const videoEl = document.querySelector("#promo");
      const target = this.el;

      target.addEventListener("targetFound", () => {
        console.log("🎯 Target found — playing video");
        videoEl.play();
        target.setAttribute("visible", "true");
      });

      target.addEventListener("targetLost", () => {
        console.log("🚫 Target lost — pausing video");
        videoEl.pause();
        target.setAttribute("visible", "false");
      });
    },
  });
});
