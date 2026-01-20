export function setupRenderer(canvas, videoEl) {
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
  }

  videoEl.addEventListener("loadedmetadata", resize);
  window.addEventListener("resize", resize);

  return ctx;
}
