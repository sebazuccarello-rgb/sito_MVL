/* ── MVL 3D Viewer — Three.js (ES module, loaded via importmap) ── */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader }     from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';

window.init3DViewer = function (container, src) {
  const w = container.clientWidth  || 800;
  const h = container.clientHeight || 500;

  /* scene */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0d0d);
  scene.fog = new THREE.FogExp2(0x0d0d0d, 0.002);

  /* camera */
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100000);
  camera.position.set(0, 50, 150);

  /* renderer */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  /* lights */
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.position.set(100, 200, 100);
  sun.castShadow = true;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x88ccff, 0.8);
  fill.position.set(-100, 50, -100);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xff4444, 0.3);
  rim.position.set(0, -50, -200);
  scene.add(rim);

  /* controls */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor  = 0.07;
  controls.minDistance    = 1;
  controls.maxDistance    = 100000;
  controls.target.set(0, 0, 0);

  /* loading overlay */
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
    font-family:var(--font,monospace);font-size:11px;letter-spacing:.3em;
    color:var(--teal,#00b4c8);pointer-events:none;
  `;
  overlay.textContent = '// LOADING 3D MODEL...';
  container.style.position = 'relative';
  container.appendChild(overlay);

  /* load model */
  const ext = src.split('.').pop().toLowerCase();

  function onLoaded(object) {
    /* center + auto-scale */
    const box    = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale  = 100 / maxDim;

    object.scale.setScalar(scale);
    object.position.sub(center.multiplyScalar(scale));
    object.position.y -= (size.y * scale) / 2;

    object.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(object);

    const dist = maxDim * scale * 1.4;
    camera.position.set(dist * 0.6, dist * 0.4, dist);
    controls.update();
    overlay.remove();
  }

  if (ext === 'fbx') {
    new FBXLoader().load(src, onLoaded, undefined, () => { overlay.textContent = '// LOAD ERROR'; });
  } else {
    new GLTFLoader().load(src, gltf => onLoaded(gltf.scene), undefined, () => { overlay.textContent = '// LOAD ERROR'; });
  }

  /* resize */
  const ro = new ResizeObserver(() => {
    const nw = container.clientWidth;
    const nh = container.clientHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
  ro.observe(container);

  /* animate */
  let animId;
  (function loop() { animId = requestAnimationFrame(loop); controls.update(); renderer.render(scene, camera); })();

  /* cleanup */
  return () => {
    cancelAnimationFrame(animId);
    ro.disconnect();
    renderer.dispose();
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };
};
