import "./style.css";
import * as THREE from "three";
import { vertexShader } from "./shaders/glow/vertex";
import { fragmentShader } from "./shaders/glow/fragment";
import { atmosphereVertexShader } from "./shaders/atmoshpere/vertex";
import { atmosphereFragmentShader } from "./shaders/atmoshpere/fragment";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { terrainVertexShader } from "./shaders/terrain/vertex";
import { terrainFragmentShader } from "./shaders/terrain/fragment";

const canvas = document.querySelector("canvas.webgl");

// function getImageData(image) {
//   var canvas = document.createElement("canvas");
//   canvas.width = image.width;
//   canvas.height = image.height;

//   var context = canvas.getContext("2d");
//   context.drawImage(image, 0, 0);

//   return context.getImageData(0, 0, image.width, image.height);
// }

// function getPixel(imagedata, x, y) {
//   var position = (x + imagedata.width * y) * 4,
//     data = imagedata.data;
//   return {
//     r: data[position],
//     g: data[position + 1],
//     b: data[position + 2],
//     a: data[position + 3],
//   };
// }

// Scene
const scene = new THREE.Scene();

const map = new THREE.TextureLoader().load("./blue-white-glow.png");
const imgMaterial = new THREE.SpriteMaterial({
  map: map,
  color: 0xffffff,
  opacity: 0.7,
});
const sprite = new THREE.Sprite(imgMaterial);
sprite.scale.set(5000, 1000.5, 1);
sprite.position.y = -775.5;
sprite.position.z = -1005;
scene.add(sprite);

const group = new THREE.Group();
// ---------------------DOTS-----------------------

//   const h = image.height;

//   data = getImageData(image);

const dotsGroup = new THREE.Group();

const dotsMaterial = new THREE.MeshBasicMaterial({
  color: 0x2277ee,
  transparent: true,
  opacity: 0.2,
});

const DOT_COUNT = 4000;

const vector = new THREE.Vector3();

for (let i = DOT_COUNT; i >= 0; i--) {
  const phi = Math.acos(-1 + (2 * i) / DOT_COUNT);
  const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;

  vector.setFromSphericalCoords(5, phi, theta);

  const x = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.004, 5, 5),
    dotsMaterial
  );

  vector.normalize();
  // let u = 0.5 + Math.atan2(vector.x, vector.z) / (2 * Math.PI);
  // let v = vector.y * 0.5 + 0.5;

  // const thisPixel = getPixel(data, Math.round(u * -w), Math.round(v * h));
  x.position.x = vector.x;
  x.position.y = vector.y;
  x.position.z = vector.z;
  // if (
  //   thisPixel?.r < 128 &&
  //   thisPixel?.b < 128 &&
  //   thisPixel?.g < 128 &&
  //   thisPixel?.a > 128
  // ) {
  dotsGroup.add(x);
  // }
}
dotsGroup.scale.set(0.5, 0.5, 0.5);

group.add(dotsGroup);
// });

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

// group.add(atmosphereMesh);

// ----------------------------------------------------------------

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

scene.add(stars);
// ----------------------TERRAIN---------------------------------

const terrain = (u, v, target) => {
  target.set(50 * u, Math.random() * 0.1, 15 * v);
};

const terrainGeometry = new THREE.ParametricGeometry(terrain, 150, 40);
// const terrainMaterial = new THREE.MeshBasicMaterial({
//   color: 0x195acc,
//   transparent: true,
//   opacity: 0.2,
//   wireframe: true,
//   side: THREE.DoubleSide,
// });
const terrainMaterial = new THREE.ShaderMaterial({
  transparent: true,
  wireframe: true,
  vertexShader: terrainVertexShader,
  fragmentShader: terrainFragmentShader,
});
terrainGeometry.rotateX(-0.3);

const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrainMesh.translateX(-16);
terrainMesh.translateZ(-2);
terrainMesh.translateY(-2);
scene.add(terrainMesh);

// ---------------------------------------------------------------
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
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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

  if (dotsGroup) {
    dotsGroup.rotation.x = 0.05 * elapsedTime;
    dotsGroup.rotation.y = 0.1 * elapsedTime;
  }

  if (dotsMaterial) {
    dotsMaterial.opacity = scale(
      Math.sin(new Date().getTime() * 0.0025),
      -1,
      1,
      0.2,
      0.5
    );
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
