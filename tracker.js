const tap = document.getElementById("tap");
const status = document.getElementById("status");

tap.addEventListener("click", async () => {
  tap.innerText = "Starting camera…";

  try {
    await navigator.mediaDevices.getUserMedia({ video: true });

    status.innerText = "STATUS: Camera OK";

    const mindar = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "assets/target.mind"
    });

    const { renderer, scene, camera } = mindar;

    // Anchor for target index 0
    const anchor = mindar.addAnchor(0);

    // 🔹 BIG GREEN DEBUG PLANE
    const geometry = new THREE.PlaneGeometry(1, 1.4);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.6
    });
    const plane = new THREE.Mesh(geometry, material);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      console.log("TARGET FOUND");
      status.innerText = "STATUS: TARGET FOUND";
    };

    anchor.onTargetLost = () => {
      console.log("TARGET LOST");
      status.innerText = "STATUS: TARGET LOST";
    };

    await mindar.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    tap.remove();
  } catch (e) {
    console.error(e);
    tap.innerText = "Camera permission denied";
  }
}, { once: true });
