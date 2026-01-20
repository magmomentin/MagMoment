export class UIManager{
constructor(){
this.hint=document.getElementById("hint");
}
waitForTap(cb) {
  this.hint.innerText = "Tap to start AR";
  this.hint.style.pointerEvents = "auto";

  const fn = () => {
    this.hint.removeEventListener("click", fn);
    this.hint.style.pointerEvents = "none"; // 🔑 disable after tap
    this.hint.innerText = "";               // optional: hide text
    cb();
  };

  this.hint.addEventListener("click", fn);
}

found(){this.hint.innerText="Hold steady";}
lost(){this.hint.innerText="Point camera at the frame";}
}
