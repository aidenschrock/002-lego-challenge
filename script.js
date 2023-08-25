import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import * as dat from "lil-gui";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { SRGBColorSpace } from "three";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

let worldParamaters = {
  color: new THREE.Color(0xe49bb6),
};
// Scene
const scene = new THREE.Scene();
scene.background = worldParamaters.color;

// gui.addColor(worldParamaters, "color").onChange(() => {
//   scene.background = worldParamaters.color;
// });

// Background Text
const textureLoader = new THREE.TextureLoader();
const fontLoader = new FontLoader();
const material = new THREE.MeshMatcapMaterial();
const matcapTexture = textureLoader.load("/static/matcaps/4.png");
material.matcap = matcapTexture;

fontLoader.load("/static/fonts/brix.typeface.json", (font) => {
  const textConfig = {
    font: font,
    size: 0.5,
    height: 0.2,
    // curveSegments: 10,
    // bevelEnabled: true,
    // bevelThickness: 0.03,
    // bevelSize: 0.02,
    // bevelOffset: 0,
    // bevelSegments: 3,
  };

  const playTextGeometry = new TextGeometry("P L A Y", textConfig);
  const pTextGeometry = new TextGeometry("P", textConfig);
  const lTextGeometry = new TextGeometry("L", textConfig);
  const aTextGeometry = new TextGeometry("A", textConfig);
  const yTextGeometry = new TextGeometry("Y", textConfig);

  const textMaterial = new THREE.MeshStandardMaterial({
    color: 0xde95f9,
  });

  const playText = new THREE.Mesh(playTextGeometry, textMaterial);
  const pText = new THREE.Mesh(pTextGeometry, material);
  const lText = new THREE.Mesh(lTextGeometry, material);
  const aText = new THREE.Mesh(aTextGeometry, material);
  const yText = new THREE.Mesh(yTextGeometry, material);

  playText.position.x = -1.5;
  playText.position.z = -0.5;

  pText.position.set(-1.2, -0.2, -0.5);
  lText.position.set(-0.5, 0, -0.5);
  aText.position.set(0.2, 0.2, -0.5);
  yText.position.set(1, -0.1, -0.5);

  pText.name = "playTextUp";
  lText.name = "playTextUp";
  aText.name = "playTextUp";
  yText.name = "playTextUp";

  // scene.add(playText);
  scene.add(pText);
  scene.add(lText);
  scene.add(aText);
  scene.add(yText);
});
console.log(scene);
// Lights
const rectAreaLight = new THREE.RectAreaLight(0xffffff, 1, 5, 5);
rectAreaLight.position.set(-1, 1, 1.5);
rectAreaLight.lookAt(0, 0, 0);
scene.add(rectAreaLight);

const lowerRectAreaLight = new THREE.RectAreaLight(0xd9759a, 5, 5, 2);
lowerRectAreaLight.position.set(1, -4, 0);
lowerRectAreaLight.lookAt(0, 0, 0);
scene.add(lowerRectAreaLight);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
const lowerRectAreaLightHelper = new RectAreaLightHelper(lowerRectAreaLight);
// scene.add(rectAreaLightHelper);
// scene.add(lowerRectAreaLightHelper);
// gui.add(rectAreaLight, "intensity").min(0).max(5).step(0.02);

// Physics
const world = new CANNON.World();
world.gravity.set(0, -1, 0);
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

// Initialize array for brick models
let objectsToUpdate = [];

// Function to run on collision of foot with brick
let collidingBrick = null;
const hitSound = new Audio("/static/sounds/oof.mp3");
let health = 3;
let collidedBricks = [];
const hitEffects = (collision) => {
  console.log("hit");
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  // if (impactStrength > 1.5) {
  //   hitSound.volume = Math.random();
  //   hitSound.currentTime = 0;

  // }

  const muteCheckbox = document.getElementById("mute");

  let sceneArray = scene.children;

  for (const object of objectsToUpdate) {
    if (collision.body.id === object.brickId) {
      collidingBrick = object;
    }
  }

  if (health > 1 && !collidedBricks.includes(collidingBrick.brickId)) {
    let healthIcon = document.getElementById("heart" + health);
    healthIcon.src = "/static/images/empty-heart.png";
    health -= 1;
    if (!muteCheckbox.checked) {
      hitSound.play();
    }

    collidedBricks.push(collidingBrick.brickId);
  } else if (health === 1 && !collidedBricks.includes(collidingBrick.brickId)) {
    let healthIcon = document.getElementById("heart" + health);
    healthIcon.src = "/static/images/empty-heart.png";
    health -= 1;
    if (!muteCheckbox.checked) {
      hitSound.play();
    }

    collidedBricks.push(collidingBrick.brickId);
    endGame();
  }

  for (let i = 0; i < sceneArray.length; i++) {
    if (sceneArray[i].uuid === collidingBrick.brickId) {
      collidingBrick.body.removeEventListener("collide", hitEffects);
      // world.removeBody(collidingBrick.body);
      // objectsToUpdate.splice(collision.body.id, 1);
      scene.remove(sceneArray[i]);
    }
  }
};

const endScreen = document.getElementById("end-game");
// End Game
function endGame() {
  endScreen.style.visibility = "visible";
  footModel.position.y = -5;
  footObject.body.position.y = -5;
}

let restartButton = document.getElementById("restart");
restartButton.addEventListener("click", restart);
// Restart
function restart() {
  endScreen.style.visibility = "hidden";
  /**
   * clear bricks & brick arrays (collidedBricks, objectsToUpdate)
   * return foot model to original position
   * return health to full
   */
  footModel.position.y = -1.6;
  footObject.body.y = -1.6;
  health = 3;
  let heartCollection = document.getElementsByClassName("heart-icon");
  let heartArray = [...heartCollection];

  heartArray.map((icon) => {
    icon.src = "/static/images/heart.png";
  });
  collidedBricks = [];

  let sceneArray = scene.children;
  for (let i = 0; i < sceneArray.length; i++) {
    if (sceneArray[i].name === "brick") {
      scene.remove(sceneArray[i]);
    }
  }
  for (let j = 0; j < objectsToUpdate.length; j++) {
    objectsToUpdate[j].body.removeEventListener("collide", hitEffects);
    world.removeBody(objectsToUpdate[j].body);
  }
  objectsToUpdate = [];
}

// GLTF Loader
const gltfLoader = new GLTFLoader();

let brickModel = null;
let brickColorArray = ["#fab4d1", "#b4f4fa", "#fafab4", "#b4fabd"];
let brickColorArrayIndex = 0;
function addBrick() {
  gltfLoader.load("/static/models/brick.glb", (gltf) => {
    brickModel = gltf.scene;
    brickModel.name = "brick";
    brickModel.rotation.x = -3;
    brickModel.scale.set(0.2, 0.2, 0.2);
    brickModel.position.x = (Math.random() - 0.5) * 8;
    brickModel.position.y = 2.2 + Math.random() * (3 - 2.2);
    brickModel.children[0].material.color.set(
      brickColorArray[brickColorArrayIndex]
    );
    if (brickColorArrayIndex < 3) {
      brickColorArrayIndex += 1;
    } else {
      brickColorArrayIndex = 0;
    }
    scene.add(brickModel);

    const shape = new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1));
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(
        brickModel.position.x,
        brickModel.position.y,
        0
      ),
      shape: shape,
      material: defaultMaterial,
    });

    world.addBody(body);

    let brickId = brickModel.uuid;
    let brickPosition = brickModel.position;
    body.id = brickId;

    objectsToUpdate.push({ brickPosition, brickId, body });
  });
}

let footModel = null;
let footObject = null;
let parameters = {
  color: "#ffffff",
};
gltfLoader.load("/static/models/foot.glb", (gltf) => {
  footModel = gltf.scene;
  footModel.scale.set(0.2, 0.2, 0.2);
  footModel.rotation.y = 1.4;
  footModel.position.y = -1.6;
  footModel.children[0].material.color.set(parameters.color);

  scene.add(footModel);

  const shape = new CANNON.Box(new CANNON.Vec3(0.6, 0.1, 0.2));

  const body = new CANNON.Body({
    position: new CANNON.Vec3(footModel.position.x, -1.6, 0),
    shape: shape,
    mass: 0,
  });

  body.addEventListener("collide", hitEffects);

  world.addBody(body);

  let footId = footModel.uuid;

  footObject = { footId, body };
});

// User controls for foot model
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    footModel.position.x -= 0.2;
    footObject.body.position.copy(footModel.position);
  } else if (event.key === "ArrowRight") {
    footModel.position.x += 0.2;
    footObject.body.position.copy(footModel.position);
  }
});

const color = document.getElementById("footcolor");
color.addEventListener("input", (event) => {
  footModel.children[0].material.color.set(event.target.value);
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
  for (const object of objectsToUpdate) {
    object.brickPosition.copy(object.body.position);
  }

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

const cannonDebugger = new CannonDebugger(scene, world);

let oldElapsedTime = 0;
// let textDirectionUp = true;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  world.step(1 / 60, deltaTime, 3);
  manageBlocks();

  // Update controls
  controls.update();

  cannonDebugger.update();

  let sceneArray = scene.children;
  for (let i = 0; i < sceneArray.length; i++) {
    let item = sceneArray[i];

    if (item.name === "playTextUp" && item.position.y < 0.2) {
      item.position.y += 0.005;
    } else if (item.name === "playTextUp" && item.position.y >= 0.2) {
      item.name = "playTextDown";
    } else if (item.name === "playTextDown" && item.position.y > -0.2) {
      item.position.y -= 0.005;
    } else if (item.name === "playTextDown" && item.position.y <= -0.2) {
      item.name = "playTextUp";
    }
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
