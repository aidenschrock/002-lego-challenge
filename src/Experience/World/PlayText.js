import Experience from "../Experience.js";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export default class PlayText {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.fontLoader = new FontLoader();
    this.material = new THREE.MeshMatcapMaterial();
    this.matCapTexture = this.resources.items.textMatcap;
    this.material.matcap = this.matCapTexture;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("playtext");
    }

    // Setup

    this.setFont();
  }
  setFont() {
    this.fontLoader.load("/fonts/brix.typeface.json", (font) => {
      const textConfig = {
        font: font,
        size: 0.5,
        height: 0.2,
      };

      const pTextGeometry = new TextGeometry("P", textConfig);
      const lTextGeometry = new TextGeometry("L", textConfig);
      const aTextGeometry = new TextGeometry("A", textConfig);
      const yTextGeometry = new TextGeometry("Y", textConfig);

      this.pText = new THREE.Mesh(pTextGeometry, this.material);
      this.lText = new THREE.Mesh(lTextGeometry, this.material);
      this.aText = new THREE.Mesh(aTextGeometry, this.material);
      this.yText = new THREE.Mesh(yTextGeometry, this.material);

      this.pText.position.set(-1.2, -0.2, -0.5);
      this.lText.position.set(-0.5, 0, -0.5);
      this.aText.position.set(0.2, 0.2, -0.5);
      this.yText.position.set(1, -0.1, -0.5);

      this.pText.name = "playTextUp";
      this.lText.name = "playTextUp";
      this.aText.name = "playTextUp";
      this.yText.name = "playTextUp";

      this.scene.add(this.pText);
      this.scene.add(this.lText);
      this.scene.add(this.aText);
      this.scene.add(this.yText);

      this.textMeshArray = [this.pText, this.lText, this.aText, this.yText];
    });
  }

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001);
    // let textMeshArray = [this.pText, this.lText, this.aText, this.yText];

    if (this.textMeshArray) {
      for (let i = 0; i < this.textMeshArray.length; i++) {
        let item = this.textMeshArray[i];
        // console.log(item.name);

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
    }
  }
}
