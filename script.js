import { MindARThree } from "https://unpkg.com/mind-ar/dist/mindar-image-three.esm.js";

document.addEventListener("DOMContentLoaded", async () => {
  const mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc: "./targets.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  // anchor for target index 0
  const anchor = mindarThree.addAnchor(0);

  // --- Floating Text ---
  const textCanvas = document.createElement("canvas");
  textCanvas.width = 1024;
  textCanvas.height = 256;
  const ctx = textCanvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.font = "80px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Crafting Magnetic Memories", 512, 150);

  const textTexture = new THREE.CanvasTexture(textCanvas);
  const textMaterial = new THREE.MeshBasicMaterial({
    map: textTexture,
    transparent: true
  });

  const textPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.4),
    textMaterial
  );
  textPlane.position.set(0, 0.8, 0);
  anchor.group.add(textPlane);

  // --- Sparkle Sprite ---
  const sparkleTex = new THREE.TextureLoader().load("./assets/sparkle.png");
  const sparkleMaterial = new THREE.SpriteMaterial({
    map: sparkleTex,
    transparent: true,
    opacity: 0.9
  });

  const sparkle = new THREE.Sprite(sparkleMaterial);
  sparkle.scale.set(0.5, 0.5, 1);
  sparkle.position.set(0, 0.2, 0);
  anchor.group.add(sparkle);

  // Animation loop
  let t = 0;
  renderer.setAnimationLoop(() => {
    t += 0.02;

    sparkle.position.y = 0.2 + Math.sin(t) * 0.1;
    sparkle.material.opacity = 0.6 + Math.sin(t * 2) * 0.3;

    textPlane.position.y = 0.8 + Math.sin(t * 0.5) * 0.04;

    renderer.render(scene, camera);
  });

  await mindarThree.start();
});
