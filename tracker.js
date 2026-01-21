const tap = document.getElementById("tap");
const video = document.getElementById("arVideo");

tap.addEventListener("click", async () => {
  tap.innerText = "Starting camera…";

  try {
    // 🔒 Force camera permission (mobile requirement)
    await navigator.mediaDevices.getUserMedia({ video: true });

    tap.innerText = "Loading AR…";

    // Init MindAR
    const mindar = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "assets/target.mind"
    });

    const { renderer, scene, camera } = mindar;

    // Anchor for image target index 0
    const anchor = mindar.addAnchor(0);

    // Video texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    // 🔧 FRAME SIZE (MATCH YOUR PRINT RATIO)
    const FRAME_WIDTH = 1;
    const FRAME_HEIGHT = 1.4; // portrait example

    const geometry = new THREE.PlaneGeometry(FRAME_WIDTH, FRAME_HEIGHT);
    const material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      transparent: true
    });

    const plane = new THREE.Mesh(geometry, material);
    anchor.group.add(plane);

    await mindar.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // When frame appears
    anchor.onTargetFound = () => {
      video.play().catch(() => {
        document.body.addEventListener(
          "click",
          () => video.play(),
          { once: true }
        );
      });
    };

    // When frame disappears
    anchor.onTargetLost = () => {
      video.pause();
    };

    tap.remove(); // remove overlay
  } catch (err) {
    console.error(err);
    tap.innerText = "Camera permission denied";
  }
}, { once: true });
