import Experience from "../Experience.js";
import * as THREE from "three";

export default class Bricks {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("brick");
    }

    // Setup
    this.resource = this.resources.items.brickModel;
    this.brickColorArray = ["#fab4d1", "#b4f4fa", "#fafab4", "#b4fabd"];
    this.brickColorArrayIndex = 0;
    this.setModel();
  }
  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.2, 0.2, 0.2);
    this.model.rotation.x = -3;
    this.model.position.x = (Math.random() - 0.5) * 8;
    this.model.position.y = 2.2 + Math.random() * (3 - 2.2);
    this.model.children[0].material.color.set(
      this.brickColorArray[this.brickColorArrayIndex]
    );
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001);
  }
}
