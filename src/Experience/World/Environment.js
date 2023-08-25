import Experience from "../Experience.js";
import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    // Setup
    this.setBackground();
    // this.setSunLight();
    this.setRectAreaLights();
  }

  setBackground() {
    this.scene.background = new THREE.Color(0xe49bb6);
  }

  setRectAreaLights() {
    this.rectAreaLight = new THREE.RectAreaLight(0xffffff, 1, 5, 5);
    this.rectAreaLight.position.set(-1, 1, 1.5);
    this.rectAreaLight.lookAt(0, 0, 0);
    this.scene.add(this.rectAreaLight);

    this.lowerRectAreaLight = new THREE.RectAreaLight(0xd9759a, 5, 5, 2);
    this.lowerRectAreaLight.position.set(1, -4, 0);
    this.lowerRectAreaLight.lookAt(0, 0, 0);
    this.scene.add(this.lowerRectAreaLight);

    this.rectAreaLightHelper = new RectAreaLightHelper(this.rectAreaLight);
    this.lowerRectAreaLightHelper = new RectAreaLightHelper(
      this.lowerRectAreaLight
    );
    this.scene.add(this.rectAreaLightHelper);
    this.scene.add(this.lowerRectAreaLightHelper);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.rectAreaLight, "intensity")
        .min(0)
        .max(5)
        .step(0.02);
      this.debugFolder
        .add(this.rectAreaLight.position, "x")
        .name("recLightX")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.rectAreaLight.position, "y")
        .name("recLightY")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.rectAreaLight.position, "z")
        .name("recLightZ")
        .min(-5)
        .max(5)
        .step(0.001);
      this.debugFolder
        .add(this.lowerRectAreaLight, "intensity")
        .min(0)
        .max(5)
        .step(0.02);
      this.debugFolder
        .add(this.lowerRectAreaLight.position, "x")
        .name("lowerRecLightX")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.lowerRectAreaLight.position, "y")
        .name("lowerRecLightY")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.lowerRectAreaLight.position, "z")
        .name("lowerRecLightZ")
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, -2.25);
    this.scene.add(this.sunLight);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight, "intensity")
        .name("sunLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "x")
        .name("sunLightX")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "y")
        .name("sunLightY")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "z")
        .name("sunLightZ")
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }
}
