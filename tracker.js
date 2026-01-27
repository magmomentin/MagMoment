const container = document.getElementById("ar-container");
const videoSource = document.getElementById("videoSource");

(async () => {
  /* --------------------
     INIT MINDAR
  -------------------- */
  const mindar = new window.MINDAR.IMAGE.MindARImage({
    container: container,
    imageTargetSrc: "assets/target.mind",
    maxTrack: 1
  });

  const { renderer, scene, camera } = mindar;

  /* --------------------
     CREATE VIDEO TEXTURE
  -------------------- */
  const videoTexture = new THREE.VideoTexture(videoSource);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;

  /* --------------------
     VIDEO PLANE
     (1x1 matches image target)
  -------------------- */
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true
  });

  const videoPlane = new THREE.Mesh(geometry, material);
  videoPlane.rotation.x = -Math.PI / 2; // correct orientation

  /* --------------------
     ANCHOR
  -------------------- */
  const anchor = mindar.addAnchor(0);
  anchor.group.add(videoPlane);

  /* --------------------
     TARGET EVENTS
  -------------------- */
  anchor.onTargetFound = () => {
    if (videoSource.paused) {
      videoSource.play();
    }
  };

  anchor.onTargetLost = () => {
    videoSource.pause();
  };

  /* --------------------
     START
  -------------------- */
  await mindar.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
})();
