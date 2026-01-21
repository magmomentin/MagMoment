const start = document.getElementById("start");
const video = document.getElementById("video");

start.onclick = async () => {
  start.remove();

  // Unlock video (NOT camera)
  await video.play();

  // MindAR controls the camera
  const mindar = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "assets/target.mind"
  });

  const { renderer, scene, camera } = mindar;

  const anchor = mindar.addAnchor(0);

  const texture = new THREE.VideoTexture(video);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1.5),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
  );

  plane.visible = false;
  anchor.group.add(plane);

  anchor.onTargetFound = () => {
    plane.visible = true;
  };

  anchor.onTargetLost = () => {
    plane.visible = false;
  };

  // 🔑 Camera opens HERE
  await mindar.start();

  renderer.setAnimationLoop(() => {
    texture.needsUpdate = true;
    renderer.render(scene, camera);
  });
};
