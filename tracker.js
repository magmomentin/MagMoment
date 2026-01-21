const start = document.getElementById("start");
const status = document.getElementById("status");
const video = document.getElementById("video");


start.addEventListener("click", async () => {
  try {
    status.innerText = "STATUS: Requesting camera";

    // 1️⃣ Camera permission
    await navigator.mediaDevices.getUserMedia({ video: true });

    // 2️⃣ Unlock video playback ONCE
    await video.play();
    status.innerText = "STATUS: Video unlocked";

    // 3️⃣ Init MindAR
    const mindar = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "assets/target.mind"
    });

    const { renderer, scene, camera } = mindar;

    // Ensure renderer fills screen
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 4️⃣ Anchor
    const anchor = mindar.addAnchor(0);

    // 5️⃣ Video texture
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // 6️⃣ Plane locked to frame
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1.4), // adjust to your frame ratio
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        depthTest: false
      })
    );

    plane.visible = false;
    anchor.group.add(plane);

    // 7️⃣ Tracking callbacks
    anchor.onTargetFound = () => {
      status.innerText = "STATUS: TARGET FOUND – VIDEO PLAYING";
      plane.visible = true;
    };

    anchor.onTargetLost = () => {
      status.innerText = "STATUS: TARGET LOST";
      plane.visible = false;
    };

    // 8️⃣ Start AR
    await mindar.start();

    const resize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

resize();
window.addEventListener("resize", resize);


    renderer.setAnimationLoop(() => {
      texture.needsUpdate = true; // REQUIRED for mobile
      renderer.render(scene, camera);
    });

    start.remove();
  } catch (err) {
    console.error(err);
    status.innerText = "STATUS: Permission denied";
  }
}, { once: true });
