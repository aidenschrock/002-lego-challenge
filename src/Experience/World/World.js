import Experience from "../Experience.js";
import * as THREE from "three";
import Environment from "./Environment.js";
import Bricks from "./Bricks.js";
import Foot from "./Foot.js";
import PlayText from "./PlayText.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Test mesh
    // const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial()
    // );
    // this.scene.add(testMesh);

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
  }
}
