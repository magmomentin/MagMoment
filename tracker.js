const startBtn = document.getElementById("start-btn");
const overlay = document.getElementById("ui-overlay");
const guide = document.getElementById("scanning-guide");
const video = document.getElementById("video");

startBtn.onclick = async () => {
  overlay.style.opacity = "0";
  setTimeout(() => overlay.remove(), 500);
  guide.style.display = "block";

  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "assets/target.mind",
    // Filter out jitter for a smoother video experience
    filterMinCF: 0.0001,
    filterBeta: 0.001
  });

  const { renderer, scene, camera } = mindarThree;

  // Set up Video Texture
  const texture = new THREE.VideoTexture(video);
  texture.encoding = THREE.sRGBEncoding; // Better color accuracy

  // Match target image aspect ratio (Width/Height)
  // If target is 2:3, Width = 0.66, Height = 1
  const geometry = new THREE.PlaneGeometry(0.66, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);

  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(plane);

  // Logic to play/pause only when visible
  anchor.onTargetFound = () => {
    guide.style.display = "none";
    video.play();
  };

  anchor.onTargetLost = () => {
    guide.style.display = "block";
    video.pause();
  };

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    // Note: VideoTexture doesn't always need manual 'needsUpdate' 
    // in newer Three.js versions, but it's safe to keep if using older builds.
    renderer.render(scene, camera);
  });
};
