const start   = document.getElementById("start");
const status  = document.getElementById("status");
const video   = document.getElementById("video");

const fbWrap  = document.getElementById("fallback");
const fbVideo = document.getElementById("fallbackVideo");

/* ---------- CONFIG ---------- */
const FRAME_ASPECT = 2 / 3;
const FRAME_HEIGHT = 1.0;
const FADE_SPEED   = 0.08;
const FAIL_TIMEOUT = 2000;
/* ---------------------------- */

let stage3OK = false;
let targetVisible = false;
let mindar = null;
let renderer, scene, camera;

start.addEventListener("click", async () => {
  try {
    start.style.display = "none";
    status.textContent = "STATUS: Requesting camera";

    // 1️⃣ Explicit user gesture → camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(t => t.stop()); // release immediately

    // 2️⃣ Unlock video playback
    await video.play();

    // Prepare fallback video
    fbVideo.src = video.currentSrc || video.src;
    fbVideo.play().catch(()=>{});

    status.textContent = "STATUS: Starting AR";

    // 3️⃣ NOW create MindAR (after permission)
    mindar = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "assets/target.mind"
    });

    ({ renderer, scene, camera } = mindar);

    // Fullscreen resize
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // Anchor
    const anchor = mindar.addAnchor(0);

    // Video texture
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Cover logic
    const applyCover = () => {
      const vAspect = video.videoWidth / video.videoHeight || (9 / 16);
      if (vAspect > FRAME_ASPECT) {
        const s = FRAME_ASPECT / vAspect;
        texture.repeat.set(s, 1);
        texture.offset.set((1 - s) / 2, 0);
      } else {
        const s = vAspect / FRAME_ASPECT;
        texture.repeat.set(1, s);
        texture.offset.set(0, (1 - s) / 2);
      }
    };
    if (video.readyState >= 2) applyCover();
    else video.onloadedmetadata = applyCover;

    // Plane
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

    anchor.onTargetFound = () => {
      status.textContent = "STATUS: TARGET FOUND";
      targetVisible = true;
    };
    anchor.onTargetLost = () => {
      status.textContent = "STATUS: TARGET LOST";
      targetVisible = false;
    };

    // 4️⃣ Start MindAR AFTER everything is ready
    await mindar.start();
    status.textContent = "STATUS: SCANNING";

    // Stage-3 health check
    const t0 = video.currentTime;
    setTimeout(() => {
      if (video.currentTime > t0 + 0.05) {
        stage3OK = true;
        status.textContent = "STATUS: STAGE-3 ACTIVE";
      } else {
        activateFallback();
      }
    }, FAIL_TIMEOUT);

    function activateFallback() {
      if (stage3OK) return;
      status.textContent = "STATUS: FALLBACK MODE";
      fbWrap.style.display = "flex";
      fbVideo.style.opacity = 1;
    }

    renderer.setAnimationLoop(() => {
      texture.needsUpdate = true;

      if (stage3OK) {
        const targetOpacity = targetVisible ? 1 : 0;
        plane.material.opacity +=
          (targetOpacity - plane.material.opacity) * FADE_SPEED;
      } else {
        fbVideo.style.opacity = targetVisible ? 1 : 0;
      }

      renderer.render(scene, camera);
    });

  } catch (err) {
    console.error(err);
    status.textContent = "STATUS: Permission denied";
    start.style.display = "flex";
  }
}, { once: true });
