import Experience from "../Experience.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import Environment from "./Environment.js";
import Bricks from "./Bricks.js";
import Foot from "./Foot.js";
import PlayText from "./PlayText.js";
import CannonDebugger from "cannon-es-debugger";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    // Test mesh
    // const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial()
    // );
    // this.scene.add(testMesh);

    // Physics
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -1, 0);
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    this.physicsWorld.allowSleep = true;

    this.defaultMaterial = new CANNON.Material("default");
    this.defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );

    this.physicsWorld.addContactMaterial(this.defaultContactMaterial);
    this.physicsWorld.defaultContactMaterial = this.defaultContactMaterial;

    this.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld);

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.bricks = new Bricks();
      this.foot = new Foot();
      this.playText = new PlayText();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.foot) this.foot.update();
    if (this.bricks) this.bricks.update();
    if (this.playText) this.playText.update();
    this.physicsWorld.step(1 / 60, this.time.deltaTime, 3);
    this.cannonDebugger.update();
  }
}
