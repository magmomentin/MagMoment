export class VideoPlayer {
  constructor() {
    this.video = document.createElement("video");
    this.video.crossOrigin = "anonymous";
    this.video.loop = true;
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.autoplay = false;
    this.video.preload = "none";
  }

  load(url) {
    if (!this.video.src) {
      this.video.src = url;     // 🔑 SET ONLY AFTER DETECTION
      this.video.load();
    }
  }

  play() {
    if (this.video.paused) {
      this.video.play().catch(() => {});
    }
  }

  pause() {
    this.video.pause();
    this.video.currentTime = 0;
  }
}
