export class UIManager {
  constructor() {
    this.hint = document.getElementById("hint");
  }

  waitForTap(cb) {
    this.hint.innerText = "Tap to start AR";
    const fn = () => {
      this.hint.removeEventListener("click", fn);
      this.hint.innerText = "";
      cb();
    };
    this.hint.addEventListener("click", fn);
  }

  found() {
    this.hint.innerText = "Hold steady";
  }

  lost() {
    this.hint.innerText = "Point camera at the frame";
  }
}
