import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import * as dat from "lil-gui";
import * as CANNON from "cannon-es";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 2);
// scene.add(ambientLight);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

const rectAreaLight = new THREE.RectAreaLight(0xffffff, 1, 5, 5);
rectAreaLight.position.set(-1, 1, 1.5);
rectAreaLight.lookAt(0, 0, 0);
scene.add(rectAreaLight);

const lowerRectAreaLight = new THREE.RectAreaLight(0x0000ff, 5, 5, 2);
lowerRectAreaLight.position.set(1, -4, 0);
lowerRectAreaLight.lookAt(0, 0, 0);
scene.add(lowerRectAreaLight);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
const lowerRectAreaLightHelper = new RectAreaLightHelper(lowerRectAreaLight);
scene.add(rectAreaLightHelper);
scene.add(lowerRectAreaLightHelper);
gui.add(rectAreaLight, "intensity").min(0).max(5).step(0.02);

// Physics
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

const objectsToUpdate = [];

const hitEffects = (collision) => {
  console.log("hit");
};

// GLTF Loader
const gltfLoader = new GLTFLoader();

let brickModel = null;
function addBrick() {
  gltfLoader.load("/static/brick.glb", (gltf) => {
    brickModel = gltf.scene;
    brickModel.name = "brick";
    brickModel.rotation.x = -3;
    brickModel.scale.set(0.2, 0.2, 0.2);
    brickModel.position.x = (Math.random() - 0.5) * 8;
    brickModel.position.y = 2.2;
    scene.add(brickModel);

    const halfExtents = new CANNON.Vec3(brickModel.position);

    const shape = new CANNON.Box(halfExtents);
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: shape,
      material: defaultMaterial,
    });
    body.addEventListener("collide", hitEffects);
    world.addBody(body);

    let brickId = brickModel.uuid;

    objectsToUpdate.push({ brickId, body });
  });
}

let footModel = null;
let footObject = null;
gltfLoader.load("/static/foot.glb", (gltf) => {
  footModel = gltf.scene;
  footModel.scale.set(0.2, 0.2, 0.2);
  footModel.rotation.y = 1.4;
  footModel.position.y = -1.6;
  scene.add(footModel);

  const halfExtents = new CANNON.Vec3(footModel.position);

  const shape = new CANNON.Box(halfExtents);
  const body = new CANNON.Body({
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
  });
  body.addEventListener("collide", hitEffects);
  world.addBody(body);

  let footId = footModel.uuid;

  footObject = { footId, body };
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    footModel.position.x -= 0.2;
    footObject.body.position.x -= 0.2;
  } else if (event.key === "ArrowRight") {
    footModel.position.x += 0.2;
    footObject.body.position.x += 0.2;
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
}, 700);

const manageBlocks = () => {
  scene.traverse((child) => {
    if (child.name === "brick") {
      child.position.y += -0.02;
      for (let i = 0; i < objectsToUpdate.length; i++) {
        if (objectsToUpdate[i].brickId === child.uuid) {
          objectsToUpdate[i].body.position.y += -0.02;
        }
      }
    }
  });
  deleteBlock();
};

const deleteBlock = () => {
  let sceneArray = scene.children;
  for (let i = 0; i < sceneArray.length; i++) {
    if (sceneArray[i].name === "brick" && sceneArray[i].position.y <= -1.7) {
      for (let j = 0; j < objectsToUpdate.length; j++) {
        if (objectsToUpdate[j].brickId === sceneArray[i].uuid) {
          objectsToUpdate[j].body.removeEventListener("collide", hitEffects);
          world.removeBody(objectsToUpdate[j].body);
          objectsToUpdate.splice(j, 1);
        }
      }
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
