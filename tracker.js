const start = document.getElementById("start");
const video = document.getElementById("video");

start.addEventListener("click", async () => {
  try {
    /* 1️⃣ Unlock camera (mobile requirement) */
    await navigator.mediaDevices.getUserMedia({ video: true });

    /* 2️⃣ Unlock video playback ONCE */
    await video.play(); // never pause later

    /* 3️⃣ Init MindAR */
    const mindar = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "assets/target.mind"
    });

    const { renderer, scene, camera } = mindar;

    /* 4️⃣ Create anchor for target index 0 */
    const anchor = mindar.addAnchor(0);

    /* 5️⃣ Video texture */
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    /* 6️⃣ Plane locked inside the frame */
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

    /* 7️⃣ Target visibility logic */
    anchor.onTargetFound = () => {
      plane.visible = true;
    };

    anchor.onTargetLost = () => {
      plane.visible = false;
    };

    /* 8️⃣ Start AR */
    await mindar.start();

    renderer.setAnimationLoop(() => {
      texture.needsUpdate = true; // required for Safari
      renderer.render(scene, camera);
    });

    start.remove(); // remove UI
  } catch (err) {
    console.error(err);
    start.innerText = "Camera / video permission denied";
  }
}, { once: true });
