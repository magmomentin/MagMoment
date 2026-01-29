const startBtn = document.getElementById("start-btn");
const scanningOverlay = document.getElementById("scanning-overlay");
const video = document.getElementById("ar-video");

let isDetected = false;

startBtn.onclick = async () => {
  startBtn.classList.add("hidden");
  scanningOverlay.classList.remove("hidden");

  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "assets/targets.mind",
    filterMinCF: 0.0001, // High stability
    filterBeta: 0.001
  });

  const { renderer, scene, camera } = mindarThree;

  // Modern texture setup
  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace; 

  // Plane setup: MindAR default width is 1. Adjust 1.5 to your video's height ratio.
  const geometry = new THREE.PlaneGeometry(1, 1.5); 
  const material = new THREE.MeshBasicMaterial({ 
    map: texture, 
    transparent: true, 
    opacity: 0 
  });
  const plane = new THREE.Mesh(geometry, material);

  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(plane);

  anchor.onTargetFound = () => {
    isDetected = true;
    video.play();
    scanningOverlay.classList.add("hidden");
  };

  anchor.onTargetLost = () => {
    isDetected = false;
    video.pause();
    scanningOverlay.classList.remove("hidden");
  };

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    // Smooth opacity transition
    const targetOpacity = isDetected ? 1 : 0;
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.1);
    
    renderer.render(scene, camera);
  });
};