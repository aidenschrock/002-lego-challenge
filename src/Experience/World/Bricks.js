import Experience from "../Experience.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";
// import CannonDebugger from "cannon-es-debugger";

export default class Bricks {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.physicsWorld = this.experience.world.physicsWorld;
    this.objectsToUpdate = [];

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("brick");
    }

    // Setup
    this.resource = this.resources.items.brickModel;
    this.brickColorArray = ["#fab4d1", "#b4f4fa", "#fafab4", "#b4fabd"];
    this.brickColorArrayIndex = 0;
    window.setInterval(() => {
      this.setModel();
    }, 1000);
  }
  setModel() {
    this.model = this.resource.scene;
    this.model.name = "brick";
    this.model.scale.set(0.2, 0.2, 0.2);
    this.model.rotation.x = -3;
    this.model.position.x = (Math.random() - 0.5) * 8;
    this.model.position.y = 2.2 + Math.random() * (3 - 2.2);
    this.model.children[0].material.color.set(
      this.brickColorArray[this.brickColorArrayIndex]
    );
    this.scene.add(this.model);

    const shape = new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1));
    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(
        this.model.position.x,
        this.model.position.y,
        0
      ),
      shape: shape,
      material: this.physicsWorld.defaultMaterial,
    });

    this.physicsWorld.addBody(this.body);

    let brickId = this.model.uuid;
    let brickPosition = this.model.position;
    this.body.id = brickId;
    let brickBody = this.body;
    let brickModel = this.model;

    this.objectsToUpdate.push({
      brickModel,
      brickPosition,
      brickId,
      brickBody,
    });
    // this.model.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     child.castShadow = true;
    //   }
    // });
  }

  manageBlocks() {
    // this.model.position.copy(this.body.position);
    //   object.brickPosition.copy(object.body.position);

    for (const object of this.objectsToUpdate) {
      object.brickPosition.copy(object.brickBody.position);
    }

    this.deleteBlock();
  }

  deleteBlock() {
    // for (const object of this.objectsToUpdate) {
    //   if (object.brickBody.position.y <= -1.7) {
    //     this.physicsWorld.removeBody(object.brickBody);
    //     this.scene.remove(object.brickModel);
    //   }
    // }
    let sceneArray = this.scene.children;
    let bodyArray = this.physicsWorld.bodies;

    for (let i = 0; i < sceneArray.length; i++) {
      if (sceneArray[i].name === "brick" && sceneArray[i].position.y <= -1.7) {
        console.log("here");
        for (let j = 0; j < objectsToUpdate.length; j++) {
          if (this.objectsToUpdate[j].brickId === sceneArray[i].uuid) {
            // this.objectsToUpdate[j].body.removeEventListener("collide", hitEffects);
            this.physicsWorld.removeBody(this.objectsToUpdate[j].brickBody);
            this.objectsToUpdate.splice(j, 1);
          }
        }
        scene.remove(sceneArray[i]);
      }
    }
  }

  update() {
    // this.experience.cannonDebugger.update();
    // this.setModel();
    this.manageBlocks();
  }
}
