export function setupRenderer(canvas, video){
 const ctx = canvas.getContext("2d");
 function resize(){ if(!video.videoWidth) return;
  canvas.width=video.videoWidth; canvas.height=video.videoHeight;}
 video.addEventListener("loadedmetadata",resize); window.addEventListener("resize",resize);
 return ctx;
}