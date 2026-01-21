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

    // Fullscreen renderer
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // 4️⃣ Anchor for target index 0
    const anchor = mindar.addAnchor(0);

    // 5️⃣ Video texture
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // 🔑 IMPORTANT: MATCH VIDEO ASPECT (portrait 9:16)
    const VIDEO_ASPECT = 9 / 16; // width / height

    const PLANE_HEIGHT = 2.5;          // controls how big it appears
    const PLANE_WIDTH = PLANE_HEIGHT * VIDEO_ASPECT;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT),
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        depthTest: false
      })
    );

    plane.visible = false;
    plane.position.set(0, 0, 0.01); // slight forward push
    anchor.group.add(plane);

    // 6️⃣ Tracking callbacks
    anchor.onTargetFound = () => {
      status.innerText = "STATUS: TARGET FOUND – VIDEO PLAYING";
      plane.visible = true;
    };

    anchor.onTargetLost = () => {
      status.innerText = "STATUS: TARGET LOST";
      plane.visible = false;
    };

    // 7️⃣ Start AR
    await mindar.start();

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
