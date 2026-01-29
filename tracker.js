const startBtn = document.getElementById("start");
const loadingOverlay = document.getElementById("loading-overlay");
const scanOverlay = document.getElementById("scan-overlay");
const muteBtn = document.getElementById("mute-toggle");
const video = document.getElementById("video");

startBtn.onclick = async () => {
  // 1. Initial UI Transition
  startBtn.style.display = "none";
  loadingOverlay.style.display = "flex";

  try {
    // 2. Load Video and Metadata
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject("Video load failed");
      video.muted = true; // Required for initial autoplay
      video.play();
    });

    const videoAspect = video.videoWidth / video.videoHeight;

    // 3. Initialize MindAR
    const mindar = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "assets/targets.mind"
    });

    const { renderer, scene, camera } = mindar;
    scene.add(mindar.cameraGroup);

    const anchor = mindar.addAnchor(0);

    // 4. Setup 3D Plane with Dynamic Aspect Ratio
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const planeHeight = 1;
    const planeWidth = planeHeight * videoAspect;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(planeWidth, planeHeight),
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true
      })
    );

    plane.visible = false;
    anchor.group.add(plane);

    // 5. Audio Toggle Logic
    muteBtn.onclick = (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      muteBtn.innerText = video.muted ? "🔇" : "🔊";
    };

    // 6. Anchor Events
    anchor.onTargetFound = () => {
      plane.visible = true;
      scanOverlay.style.display = "none";
      muteBtn.style.display = "block";
    };

    anchor.onTargetLost = () => {
      plane.visible = false;
      scanOverlay.style.display = "flex";
      muteBtn.style.display = "none";
    };

    // 7. Start Engine
    await mindar.start();
    loadingOverlay.style.display = "none";
    scanOverlay.style.display = "flex";

    renderer.setAnimationLoop(() => {
      texture.needsUpdate = true;
      renderer.render(scene, camera);
    });

  } catch (err) {
    console.error(err);
    alert("AR Initialization Error: Ensure camera permissions are granted and assets exist.");
    loadingOverlay.style.display = "none";
  }
};