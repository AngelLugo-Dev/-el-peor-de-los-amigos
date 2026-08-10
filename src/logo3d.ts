import * as THREE from "three";

// ponytail: un módulo chico y reutilizable; sin OrbitControls ni postprocessing, la escena es un plano + chispas
export function mountLogo3D(container: HTMLElement, src: string) {
  const vw = () => container.clientWidth || 300;
  const vh = () => container.clientHeight || 112;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, vw() / vh(), 0.1, 100);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(vw(), vh());
  container.appendChild(renderer.domElement);

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false })
  );
  scene.add(mesh);

  const sparksGeo = new THREE.BufferGeometry();
  const N = 90;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 9;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
    pos[i * 3 + 2] = -Math.random() * 2.6 - 0.4;
  }
  sparksGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const sparks = new THREE.Points(
    sparksGeo,
    new THREE.PointsMaterial({
      color: 0xdda136,
      size: 0.055,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(sparks);

  new THREE.TextureLoader().load(src, (tex) => {
    const a = tex.image.width / tex.image.height;
    const visH = 2 * 3 * Math.tan(THREE.MathUtils.degToRad(45 / 2));
    const visW = visH * (vw() / vh());
    const s = Math.min(visH, visW / a) * 0.88;
    mesh.scale.set(s * a, s, 1);
    mesh.material.map = tex;
    mesh.material.needsUpdate = true;
  });

  let raf = 0;
  let t = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const frame = () => {
    if (!reduced) t += 0.01;
    mesh.rotation.y = Math.sin(t * 1.1) * 0.5;
    mesh.rotation.x = Math.cos(t * 0.7) * 0.14;
    mesh.rotation.z = Math.sin(t * 0.5) * 0.06;
    mesh.position.y = Math.sin(t * 1.4) * 0.07;
    sparks.rotation.y = t * 0.12;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  frame();

  const ro = new ResizeObserver(() => {
    renderer.setSize(vw(), vh());
    camera.aspect = vw() / vh();
    camera.updateProjectionMatrix();
  });
  ro.observe(container);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mesh.geometry.dispose();
      mesh.material.dispose();
      sparks.geometry.dispose();
      sparks.material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    },
  };
}