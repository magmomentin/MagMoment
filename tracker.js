const start  = document.getElementById("start");
const status = document.getElementById("status");
const video  = document.getElementById("video");

/* ---------- CONFIG (easy tuning) ---------- */
const FRAME_ASPECT = 2 / 3;    // A5 portrait
const FRAME_HEIGHT = 1.0;      // world units
const FADE_SPEED   = 0.08;     // fade smoothness
/* ------------------------------------------ */

start.addEventListener("click", async () => {
  try {
    status.textContent = "STATUS: Requesting camera";

    /* 1️⃣ Camera permission */
    await navigator.mediaDevices.getUserMedia({ video: true });

    /* 2️⃣ Unlock video playback ONCE */
    await video.play();
    status.textContent = "STATUS: Video unlocked";

    /* 3️⃣ Init MindAR */
    const mindar = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "assets/target.mind"
    });

    const { renderer, scene, camera } = mindar;

    /* Fullscreen resize */
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    /* 4️⃣ Anchor */
    const anchor = mindar.addAnchor(0);

    /* 5️⃣ Video texture */
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    /* --- COVER BEHAVIOR (no black bars) --- */
    const applyCover = () => {
      const videoAspect = video.videoWidth / video.videoHeight || (9 / 16);

      if (videoAspect > FRAME_ASPECT) {
        const scale = FRAME_ASPECT / videoAspect;
        texture.repeat.set(scale, 1);
        texture.offset.set((1 - scale) / 2, 0);
      } else {
        const scale = videoAspect / FRAME_ASPECT;
        texture.repeat.set(1, scale);
        texture.offset.set(0, (1 - scale) / 2);
      }
    };

    if (video.readyState >= 2) applyCover();
    else video.onloadedmetadata = applyCover;
    /* ------------------------------------- */

    /* 6️⃣ Plane (frame-locked) */
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(FRAME_HEIGHT * FRAME_ASPECT, FRAME_HEIGHT),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthTest: false
      })
    );

    plane.position.z = 0.01;
    anchor.group.add(plane);

    let targetVisible = false;

    anchor.onTargetFound = () => {
      status.textContent = "STATUS: TARGET FOUND";
      targetVisible = true;
    };

    anchor.onTargetLost = () => {
      status.textContent = "STATUS: TARGET LOST";
      targetVisible = false;
    };

    /* 7️⃣ Start AR */
    await mindar.start();

    renderer.setAnimationLoop(() => {
      texture.needsUpdate = true;

      /* Smooth fade logic */
      if (targetVisible) {
        plane.material.opacity = Math.min(1, plane.material.opacity + FADE_SPEED);
      } else {
        plane.material.opacity = Math.max(0, plane.material.opacity - FADE_SPEED);
      }

      renderer.render(scene, camera);
    });

    start.remove();
  } catch (err) {
    console.error(err);
    status.textContent = "STATUS: Permission denied";
  }
}, { once: true });
