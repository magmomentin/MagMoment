const tap = document.getElementById("tap");
const video = document.getElementById("arVideo");

tap.addEventListener("click", async () => {
  tap.innerText = "Starting…";

  try {
    // 1️⃣ Camera permission
    await navigator.mediaDevices.getUserMedia({ video: true });

    // 2️⃣ UNLOCK VIDEO PLAYBACK (CRITICAL)
    await video.play(); // must happen while video is visible

    // 3️⃣ Init MindAR
    const mindar = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "assets/target.mind"
    });

    const { renderer, scene, camera } = mindar;

    // Anchor
    const anchor = mindar.addAnchor(0);

    // Video texture
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Frame size (adjust later)
    const geometry = new THREE.PlaneGeometry(1, 1.4);
    const material = new THREE.MeshBasicMaterial({
      map: texture
    });

    const plane = new THREE.Mesh(geometry, material);
    anchor.group.add(plane);

    await mindar.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    anchor.onTargetLost = () => {
      video.pause();
    };

    anchor.onTargetFound = () => {
      video.play();
    };

    tap.remove();

  } catch (e) {
    console.error(e);
    tap.innerText = "Permission denied";
  }
}, { once: true });
