import * as THREE from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { gsap } from "gsap";
import { title } from "./index.js";
import resources from "./resources.js";

export default class Sketch {
  constructor(container) {
    this.container = document.querySelector(container);
    this.resources = resources;

    //Sizes
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    //Parameters
    this.imageAspect = 1.77;
    this.uniforms = {
      uTime: { value: 0.0 },
      uResolution: { value: new THREE.Vector2() },
      uMouse: { value: new THREE.Vector2() },
      uMousemoved: { value: false },
      uProgress: { value: 0 },
      uPixels: { value: new THREE.Vector2(this.width, this.height) },
      uvRate1: { value: new THREE.Vector2(1, 1) },
      uAccel: { value: new THREE.Vector2(0.5, 2) },
      uScale: { value: new THREE.Vector2(1, 1) },
      uRadius: { value: 2 },
      uLightIntensity: { value: 3 },
      uColor: { value: new THREE.Color("#171511") },
      uCol1: { value: 0.1641 },
      uCol2: { value: 0.3731 },
      uCol3: { value: 0.2502 },
    };

    this.resize = () => this.onWindowResize();
    this.pointermove = (e) => this.onPointermove(e);
  }

  async init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createBackgroundPlane();
    this.createClock();
    this.createLoaders();
    this.addListeners();

    // this.createHelicoid();
    // this.createSliderMesh();
    // this.animateSlider();

    await this.loadTextures();

    this.render();
    this.addDebugPanel();
  }

  async initSlider() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createSliderMesh();
    this.animateSlider();
    this.createClock();
    this.createLoaders();
    this.addListeners();

    await this.loadTextures();

    this.render();
  }

  // async initHelicoid() {
  //   this.createScene();
  //   this.createCamera();
  //   this.createLight();
  //   this.createRenderer();
  //   this.createHelicoid();
  //   this.createClock();
  //   this.createLoaders();
  //   this.addListeners();

  //   await this.loadTextures();

  //   this.render();
  // }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    // this.camera = new THREE.PerspectiveCamera(
    //   75,
    //   this.width / this.height,
    //   0.1,
    //   1000
    // );
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);

    this.camera.position.z = 1;
    this.camera.lookAt(new THREE.Vector3());
  }

  createLight() {
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    this.directionalLight.position.set(3, 1, 1);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(2048, 2048);
    this.directionalLight.shadow.camera.top = 2;
    this.directionalLight.shadow.camera.right = 2;
    this.directionalLight.shadow.camera.bottom = -2;
    this.directionalLight.shadow.camera.left = -2;
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.normalBias = 0.01;

    this.scene.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(this.ambientLight);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.container.appendChild(this.renderer.domElement);

    this.renderer.physicallyCorrectLights = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
  }

  createBackgroundPlane() {
    this.geometry = new THREE.PlaneGeometry(2, 2);

    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: this.uniforms,
      // vertexShader: require("./static/shaders/background.vertex.glsl"),
      // fragmentShader: require("./static/shaders/background.fragment.glsl"),
      vertexShader: require("./static/shaders/test.vertex.glsl"),
      fragmentShader: require("./static/shaders/test.fragment.glsl"),
    });

    this.uniforms.uResolution.value.x = this.renderer.domElement.width;
    this.uniforms.uResolution.value.y = this.renderer.domElement.height;

    this.material.extensions.derivatives = true;

    this.backgroundPlane = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.backgroundPlane);
  }

  createLoaders() {
    this.loadingManager = new THREE.LoadingManager();

    this.loadingManager.onProgress = (url, loaded, total) => {
      console.log(`Loaded ${loaded} resources out of ${total} -> ${url}`);
    };

    this.loadingManager.onLoad = () => {
      console.log("All resources loaded");
    };

    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
  }

  async loadTextures() {
    this.textures = {};
    const texturesUrls = this.resources.filter((texture) => texture.url);

    const loadTexture = (name, url) => {
      return new Promise((resolve) => {
        this.textureLoader.load(url, (texture) => {
          this.textures[name] = texture;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.minFilter = THREE.LinearFilter;

          resolve();
        });
      });
    };

    const promises = texturesUrls.map(async ({ name, url }) => {
      return loadTexture(name, url);
    });

    await Promise.all(promises);

    for (let i in this.textures) {
      this.uniforms["u" + i] = {
        type: "t",
        value: this.textures[i],
      };
    }
  }

  createSliderMesh() {
    this.sliderGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);

    this.sliderMaterial = new THREE.ShaderMaterial({
      // side: 2,
      transparent: true,
      // wireframe: true,
      vertexShader: require("./static/shaders/slider.vertex.glsl"),
      fragmentShader: require("./static/shaders/slider.fragment.glsl"),
      uniforms: this.uniforms,
    });

    this.sliderMesh = new THREE.Mesh(this.sliderGeometry, this.sliderMaterial);

    this.renderer.domElement.classList.add("slider__link");
    this.scene.add(this.sliderMesh);

    // this.camera.position.z = 3;
    // this.plane.position.z = 1;
    // let dist = this.camera.position.z / 260 - this.plane.position.z;

    // let height = 1;
    // this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));
    // this.camera.position.z = 240;

    // this.checkMobile();
    // this.sliderMesh.scale.set(this.isMobile ? 1 : 1, this.isMobile ? 1 : 2, 0);
  }

  animateSlider() {
    const tl = gsap.timeline();

    title.services.addEventListener("click", () => {
      // title.services.innerHTML = `<h4 class="title-up">Контакты</h4>
      //       <h4 class="title-down">Контакты</h4>`;

      title.services_name_inner.innerHTML = `
        <span class="services__title-name-inner">Контакты</span>
      `;

      if (title.services.classList.contains("done")) {
        tl.to(this.sliderMaterial.uniforms.uProgress, 1, {
          value: 0,
        });

        title.services.classList.remove("done");

        // title.services.innerHTML = `<h4 class="title-up">Услуги</h4>
        //     <h4 class="title-down">Услуги</h4>`;
        title.services_name_inner.innerHTML = `<span class="services__title-name-inner">Услуги</span>`;
      } else {
        tl.to(this.sliderMaterial.uniforms.uProgress, 1, {
          value: 1,
        });

        title.services.classList.add("done");
      }
    });
  }

  // getMaterial() {
  //   const material = new THREE.MeshPhysicalMaterial({
  //     color: 0xffffff,
  //     metalness: 0.5,
  //     roughness: 0,
  //     clearcoat: 1,
  //     clearcoatRoughness: 0.4,
  //     // wireframe: true,
  //     side: 2,
  //   });

  //   material.onBeforeCompile = (shader) => {
  //     shader.uniforms.playhead = { value: 0 };

  //     shader.fragmentShader =
  //       `
  //           uniform float playhead;
  //           ` + shader.fragmentShader;

  //     shader.fragmentShader = shader.fragmentShader.replace(
  //       "#include <logdepthbuf_fragment>",
  //       `

  //           float diff = dot(vec3(1.0), vNormal);

  //           vec2 p = vec2(1.0, 0.5);
  //           float f = fract(p.y * 7.0);
  //           float col = smoothstep(0.45, 0.1, abs(f - 0.5));

  //           vec3 colorA = vec3(0.5, 0.5, 2.0);
  //           vec3 colorB = vec3(0.5, 0.5, 1.0);
  //           vec3 colorC = vec3(0.0, 0.0, 1.0);
  //           vec3 colorD = vec3(0.0, 0.0, 1.0);

  //           vec3 mixedColor = colorA + colorB * cos( 2.0 * 3.1415 * (colorC * diff + colorD + playhead)) + col;

  //           diffuseColor.rgb = vec3(diff, 0.0, 0.0);
  //           diffuseColor.rgb = mixedColor;

  //         ` + "#include <logdepthbuf_fragment>"
  //     );

  //     material.userData.shader = shader;
  //   };

  //   return material;
  // }

  // createHelicoid() {
  //   const material = this.getMaterial();

  //   function Helicoid(u, v, target) {
  //     const alpha = Math.PI * 2 * (v - 0.5);
  //     const theta = Math.PI * 2 * (u - 0.5);
  //     const dividend = 1 + Math.cosh(alpha) * Math.cosh(theta);
  //     const t = 3;

  //     let x = (Math.sinh(theta) * Math.cos(alpha * t)) / dividend;
  //     let z = (Math.sinh(theta) * Math.sin(alpha * t)) / dividend;
  //     let y = (1.5 * (Math.cosh(theta) * Math.sinh(alpha))) / dividend;

  //     target.set(x, y, z);
  //   }

  //   // material = new THREE.MeshNormalMaterial({ side: 2 });

  //   const geometry = new ParametricGeometry(Helicoid, 200, 200);

  //   this.helicoid = new THREE.Mesh(geometry, material);

  //   this.helicoid.castShadow = this.helicoid.receiveShadow = true;

  //   this.camera.position.z = 3;

  //   this.scene.add(this.helicoid);
  // }

  addListeners() {
    window.addEventListener("resize", this.resize, false);
    document.addEventListener("pointermove", this.pointermove, false);
  }

  onWindowResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);

    this.uniforms.uResolution.value.x = this.renderer.domElement.width;
    this.uniforms.uResolution.value.y = this.renderer.domElement.height;

    if (this.sliderMesh) {
      if (this.imageAspect > this.camera.aspect) {
        this.sliderMaterial.uniforms.uScale.value.set(
          this.imageAspect / this.camera.aspect,
          1
        );
      } else {
        this.sliderMaterial.uniforms.uScale.value.set(1, 1);
      }
    }

    if (this.backgroundPlane) {
      if (this.imageAspect > this.camera.aspect) {
        this.material.uniforms.uScale.value.set(
          this.imageAspect / this.camera.aspect,
          1
        );
      } else {
        this.material.uniforms.uScale.value.set(
          1,
          this.camera.aspect / this.imageAspect
        );
      }
    }

    // if (this.sliderMesh) {
    //   this.sliderWidth = this.container.clientWidth;
    //   this.sliderHeight = this.container.clientHeight;

    //   this.camera.aspect = this.sliderWidth / this.sliderHeight;
    //   this.renderer.setSize(this.sliderWidth, this.sliderHeight);
    // }

    // if (this.sliderMesh) {
    //   let dist = this.camera.position.z / 400 - this.sliderMesh.position.z;

    //   let height = 1;
    //   this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    //   this.sliderMesh.scale.x = this.sliderMesh.scale.y;
    // }

    // if (this.sliderMesh) {
    //   cssAspectRatioX = +getComputedStyle(document.querySelector(".slider"))
    //     .aspectRatio[0];
    //   cssAspectRatioY = +getComputedStyle(
    //     document.querySelector(".slider")
    //   ).aspectRatio.slice(-1);

    //   this.isMobile
    //     ? this.sliderMesh.scale.set(cssAspectRatioY * 0.5, cssAspectRatioX, 0)
    //     : this.sliderMesh.scale.set(cssAspectRatioY, cssAspectRatioX, 0);
    // }
    //     // if (this.plane) {
    //     //   this.plane.scale.set(this.isMobile ? 1 : 2, this.isMobile ? 1 : 1, 0);
    //     //   console.log(this.plane.scale);
    //     // }
    //     this.checkMobile();
    this.checkMobile();
  }

  onPointermove(e) {
    const ratio = window.innerWidth / window.innerHeight;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);

    this.uniforms.uMouse.value.x = x * ratio;
    this.uniforms.uMouse.value.y = y;

    // const vpRatio = window.innerWidth / window.innerHeight;
    // this.uniforms.uMouse.value.x = (e.offsetX / window.innerWidth) * vpRatio;
    // this.uniforms.uMouse.value.y = 1 - e.offsetY / window.innerHeight;

    // if (this.helicoid) {
    //   gsap.to(this.camera.position, {
    //     x: () => x * 0.1,
    //     y: () => y * 0.12,
    //     duration: 0.5,
    //   });
    // }

    // uniforms.uMouse.value.x =
    //   (e.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
    // uniforms.uMouse.value.y =
    //   ((e.pageY - window.innerHeight / 2) / window.innerHeight) * -1;

    this.uniforms.uMousemoved.value = true;

    // e.preventDefault();
  }

  createClock() {
    this.clock = new THREE.Clock();
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 568;
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();
    this.uniforms.uTime.value = elapsedTime;
    this.renderer.render(this.scene, this.camera);

    // if (this.helicoid) {
    //   this.helicoid.rotation.y = elapsedTime * 0.2;

    //   if (this.helicoid.material.userData.shader) {
    //     this.helicoid.material.userData.shader.uniforms.playhead.value =
    //       elapsedTime * 0.2;
    //   }

    //   this.helicoid.position.x = this.isMobile ? 0 : 2.6;
    //   // this.helicoid.position.z = -1;
    // }

    window.requestAnimationFrame(this.render.bind(this));
  }

  addDebugPanel() {
    this.gui = new dat.GUI();

    this.gui
      .add(this.uniforms.uCol1, "value")
      .min(0)
      .max(1)
      .step(0.0001)
      .name("mixColor1")
      .onChange(() => {
        this.material.needsUpdate = true;
      });
    this.gui
      .add(this.uniforms.uCol2, "value")
      .min(0)
      .max(1)
      .step(0.0001)
      .name("mixColor2")
      .onChange(() => {
        this.material.needsUpdate = true;
      });
    this.gui
      .add(this.uniforms.uCol3, "value")
      .min(0)
      .max(1)
      .step(0.0001)
      .name("mixColor3")
      .onChange(() => {
        this.material.needsUpdate = true;
      });
    this.gui
      .add(this.uniforms.uLightIntensity, "value")
      .min(0)
      .max(10)
      .step(0.0001)
      .name("LightIntensity")
      .onChange(() => {
        this.material.needsUpdate = true;
      });
    this.gui
      .add(this.uniforms.uRadius, "value")
      .min(0)
      .max(5)
      .step(0.0001)
      .name("LightSquare")
      .onChange(() => {
        this.material.needsUpdate = true;
      });
    this.gui
      .addColor(this.uniforms.uColor, "value")
      .name("uColor")
      .onChange(() => {
        this.material.needsUpdate = true;
      });
  }
}
