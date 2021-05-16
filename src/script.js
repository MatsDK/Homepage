import "./style.css";
import * as THREE from "three";
import { vertexShader } from "./shaders/glow/vertex";
import { fragmentShader } from "./shaders/glow/fragment";
import { atmosphereVertexShader } from "./shaders/atmoshpere/vertex";
import { atmosphereFragmentShader } from "./shaders/atmoshpere/fragment";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const map = new THREE.TextureLoader().load("./blue-white-glow.png");
const imgMaterial = new THREE.SpriteMaterial({
  map: map,
  color: 0xffffff,
  opacity: 0.7,
});
const sprite = new THREE.Sprite(imgMaterial);
sprite.scale.set(6, 1.5, 1);
sprite.position.y = -1.5;
scene.add(sprite);

const group = new THREE.Group();
// ---------------------DOTS-----------------------
const dotsGroup = new THREE.Group();

const dotsMaterial = new THREE.MeshBasicMaterial({
  color: 0x2277ee,
  transparent: true,
  opacity: 0.2,
});

const DOT_COUNT = 2000;

const vector = new THREE.Vector3();

for (let i = DOT_COUNT; i >= 0; i--) {
  const phi = Math.acos(-1 + (2 * i) / DOT_COUNT);
  const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;

  vector.setFromSphericalCoords(0.5, phi, theta);

  const x = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.004, 5, 5),
    dotsMaterial
  );

  x.position.x = vector.x;
  x.position.y = vector.y;
  x.position.z = vector.z;

  dotsGroup.add(x);
}

group.add(dotsGroup);

// ---------------------------INNER_SPHERE-----------------------------

const sphereGeometry = new THREE.SphereBufferGeometry(0.49, 40, 40);
const sphereMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

group.add(sphereMesh);

// ---------------------------ATMOSPHERE---------------------------

const atmosphereGeometry = new THREE.SphereBufferGeometry(0.49, 400, 400);
const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  transparent: true,
});
const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

atmosphereMesh.scale.set(2, 2, 2);
atmosphereMesh.position.z = -1.3;

group.add(atmosphereMesh);

group.position.x = 0.5;
group.position.y = 0.3;
group.rotation.x = 0.15;
group.rotation.y = -0.23;

scene.add(group);
// ---------------------------STARS------------------------------

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.5,
});

const starVertices = [];
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 3000;
  const y = (Math.random() - 0.5) * 2000;
  let z = -Math.random() * 2000;

  z -= 100;
  starVertices.push(x, y, z);
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);

console.log(stars);
scene.add(stars);
// ------------------------------------------------------------
const pointLight = new THREE.PointLight(0x0000ff, 1000, 2, 2);
pointLight.position.x = 1;
pointLight.position.y = 1;
pointLight.position.z = 1;
scene.add(pointLight);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  10000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x111111, 1);

/**
 * Animate
 */

const clock = new THREE.Clock();

const scale = (number, inMin, inMax, outMin, outMax) => {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  dotsGroup.rotation.y = 0.1 * elapsedTime;
  dotsGroup.rotation.x = 0.1 * elapsedTime;

  dotsMaterial.opacity = scale(
    Math.sin(new Date().getTime() * 0.0025),
    -1,
    1,
    0.2,
    0.5
  );

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();