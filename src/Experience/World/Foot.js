import Experience from "../Experience.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";

export default class Foot {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.physicsWorld = this.experience.world.physicsWorld;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("foot");
    }

    // Setup
    this.resource = this.resources.items.footModel;
    this.parameters = {
      color: "#ffffff",
    };
    this.setModel();
  }
  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.2, 0.2, 0.2);
    this.model.rotation.y = 1.4;
    this.model.position.y = -1.6;
    this.model.children[0].material.color.set(this.parameters.color);
    this.scene.add(this.model);

    const shape = new CANNON.Box(new CANNON.Vec3(0.6, 0.1, 0.2));

    const body = new CANNON.Body({
      position: new CANNON.Vec3(this.model.position.x, -1.6, 0),
      shape: shape,
      mass: 0,
    });

    // body.addEventListener("collide", hitEffects);

    this.physicsWorld.addBody(body);

    // this.model.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     child.castShadow = true;
    //   }
    // });
  }

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001);
  }
}
