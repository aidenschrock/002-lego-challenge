import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// GLTF Loader
const gltfLoader = new GLTFLoader();

let brickModel = null;
function addBrick() {
  gltfLoader.load("/static/brick.glb", (gltf) => {
    brickModel = gltf.scene;
    brickModel.name = "brick";
    brickModel.scale.set(0.5, 0.5, 0.5);
    brickModel.position.x = (Math.random() - 0.5) * 6;
    brickModel.position.y = 2.2;
    scene.add(brickModel);
  });
}

let footModel = null;
gltfLoader.load("/static/foot.glb", (gltf) => {
  footModel = gltf.scene;
  footModel.scale.set(0.4, 0.4, 0.4);
  footModel.rotation.y = 1.4;
  footModel.position.y = -1.6;
  scene.add(footModel);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    footModel.position.x -= 0.2;
  } else if (event.key === "ArrowRight") {
    footModel.position.x += 0.2;
  }
});

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

window.setInterval(() => {
  addBrick();
}, 1000);

const manageBlocks = () => {
  scene.traverse((child) => {
    if (child.name === "brick") {
      child.position.y += -0.02;
    }
  });
  deleteBlock();
};

const deleteBlock = () => {
  let sceneArray = scene.children;
  for (let i = 0; i < sceneArray.length; i++) {
    if (sceneArray[i].name === "brick" && sceneArray[i].position.y <= -1.7) {
      scene.remove(sceneArray[i]);
    }
  }
};

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  manageBlocks();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
