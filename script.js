document.addEventListener("DOMContentLoaded", async () => {

  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc: "./targets.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  const anchor = mindarThree.addAnchor(0);

  // example cube to test (replace with your video later)
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(geometry, material);
  anchor.group.add(cube);

  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    cube.rotation.y += 0.02;
    renderer.render(scene, camera);
  });
});
