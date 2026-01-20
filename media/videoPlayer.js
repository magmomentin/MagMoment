export class VideoPlayer {
  constructor(url) {
    this.video = document.createElement("video");

    this.video.crossOrigin = "anonymous";
    this.video.src = url;

    this.video.loop = true;
    this.video.muted = true;
    this.video.playsInline = true;

    // 🔑 HARD BLOCK
    this.video.autoplay = false;
    this.video.preload = "none";

    this.video.pause();
    this.video.currentTime = 0;
  }

  play() {
    if (this.video.paused) {
      this.video.play().catch(() => {});
    }
  }

  pause() {
    this.video.pause();
    this.video.currentTime = 0; // 🔑 reset so it never "continues"
  }
}
