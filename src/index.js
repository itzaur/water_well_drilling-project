import "./styles/index.scss";
import * as THREE from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import { gsap } from "gsap";

const frame = document.querySelector(".slider");
const content = document.querySelector(".content");
const menuWrapper = document.querySelector(".menu-wrapper");
const menuItems = document.querySelectorAll(".menu__item");
const openMenuBtn = document.querySelector(".button-menu");
const closeMenuBtn = document.querySelector(".button-close");
const overlayPath = document.querySelector(".overlay__path");

//Slider
const slider = document.querySelector(".slider");

//Test
// const closeMenuBtns = document.querySelectorAll(".slider__link");

////

const title = {
  main: document.querySelector(".content__title-main"),
  down: document.querySelector(".content__title-down"),
  bg: document.querySelector(".content__title-bg"),
  services: document.querySelector(".services__title"),
};

const picturesArray = [
  {
    img1Src:
      "https://images.unsplash.com/photo-1675034743372-672c3c3f8377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    img2Src:
      "https://images.unsplash.com/photo-1675060901942-e5e3877d26ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80",
    img3Src:
      "https://images.unsplash.com/photo-1674859659457-3dde5db387c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
    imgDisplacementSrc: "",
    elId: 0,
  },
  {
    img1Src:
      "https://images.unsplash.com/photo-1674909073110-5aa68607e693?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
    img2Src:
      "https://images.unsplash.com/photo-1668018367039-22526ebf2461?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=739&q=80",
    img3Src:
      "https://images.unsplash.com/photo-1674909072480-ad551618b63e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
    imgDisplacementSrc: "",
    elId: 1,
  },
];

const imagesToPreload = picturesArray
  .map((item) => item.img1Src)
  .concat(picturesArray.map((item) => item.img2Src))
  .concat(picturesArray.map((item) => item.img3Src))
  .concat(picturesArray.map((item) => item.imgDisplacementSrc))
  .filter((el) => el !== "");

let cssAspectRatioX = null;
let cssAspectRatioY = null;

/**
 * Three.js part
 */
// let previousTime = 0;
// let currentSlide = 0;
// let nextSlide = null;

// export default class Sketch {
//   constructor(container) {
//     this.container = document.querySelector(container);

//     //Sizes
//     this.width = this.container.clientWidth;
//     this.height = this.container.clientHeight;

//     //Textures
//     this.textures = {
//       noise: {
//         url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png",
//         // loaded: false,
//       },
//       map_color: {
//         url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/Lava_001_COLOR.png",
//         // loaded: false,
//       },
//       map_normal: {
//         url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/Lava_001_NRM.png",
//         // loaded: false,
//       },
//       map_roughness: {
//         url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/Lava_001_OCC.png",
//         // loaded: false,
//       },
//       map_displacement: {
//         url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/Lava_001_DISP.png",
//         // loaded: false,
//       },
//       sliderImg1: {
//         url: "https://images.unsplash.com/photo-1675034743372-672c3c3f8377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//         // loaded: false,
//       },
//       sliderImg2: {
//         url: "https://images.unsplash.com/photo-1675060901942-e5e3877d26ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80",
//         // loaded: false,
//       },
//       // sliderImg3: {
//       //   url: "https://images.unsplash.com/photo-1674859659457-3dde5db387c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
//       //   loaded: false,
//       // },
//       // sliderImg4: {
//       //   url: "https://images.unsplash.com/photo-1674909073110-5aa68607e693?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
//       //   loaded: false,
//       // },
//       // sliderImg5: {
//       //   url: "https://images.unsplash.com/photo-1668018367039-22526ebf2461?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=739&q=80",
//       //   loaded: false,
//       // },
//       // sliderImg6: {
//       //   url: "https://images.unsplash.com/photo-1674909072480-ad551618b63e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
//       //   loaded: false,
//       // },
//     };

//     // this.allLoaded = null;
//     // this.texture = null;
//     // this.sliderMaterial = null;
//     // this.sliderGeometry = null;
//     // this.uniforms = null;
//     this.uniforms = null;

//     this.resize = () => this.onResize();
//     this.mousemove = (e) => this.onMousemove(e);
//   }

//   // start() {
//   //   console.log("Textures are load");
//   //   this.renderer.setAnimationLoop(() => {
//   //     this.update();
//   //     this.render();
//   //   });
//   // }

//   init() {
//     this.createScene();
//     this.createCamera();
//     this.createLight();
//     this.createClock();
//     this.loadTextures();
//     this.createHelicoid();

//     this.createRenderer();
//     this.createControls();
//     this.addListeners();

//     this.renderer.setAnimationLoop(() => {
//       this.update();
//       this.render();
//     });
//   }

//   initSlider() {
//     this.createScene();
//     this.createCamera();
//     this.createLight();
//     this.createClock();
//     this.loadTextures();
//     this.createRenderer();
//     this.createControls();
//     this.createSliderMesh();
//     this.animateSlider();
//     this.addListeners();

//     this.renderer.setAnimationLoop(() => {
//       this.update();
//       this.render();
//     });
//   }

//   initBackground() {
//     this.createScene();
//     this.createCamera();
//     this.createLight();
//     this.createClock();
//     this.loadTextures();
//     this.createRenderer();
//     this.createControls();
//     this.createBackgroundPlane();
//     this.addListeners();

//     this.renderer.setAnimationLoop(() => {
//       this.update();
//       this.render();
//     });
//   }

//   createScene() {
//     this.scene = new THREE.Scene();
//   }

//   createCamera() {
//     this.camera = new THREE.PerspectiveCamera(
//       75,
//       this.width / this.height,
//       1,
//       1000
//     );

//     const sliderCameraPositionZ = 220;
//     const helicoidCameraPositionZ = 2.4;

//     this.camera.position.set(
//       0,
//       0,
//       this.scene.id === 4 ? helicoidCameraPositionZ : sliderCameraPositionZ
//     );

//     // this.camera.position.set(0, 0, 4);
//     this.camera.lookAt(new THREE.Vector3());

//     // let vFOV = THREE.MathUtils.degToRad(this.camera.fov);
//     // let h = 2 * Math.tan(vFOV / 2) * this.camera.position.z;
//     // let w = h * this.camera.aspect;
//     // console.log(w);
//   }

//   loadTextures() {
//     this.textureLoader = new THREE.TextureLoader();

//     this.texture1 = this.textureLoader.load(this.textures.sliderImg1.url);
//     this.texture2 = this.textureLoader.load(this.textures.sliderImg2.url);

//     this.textureNoise = this.textureLoader.load(this.textures.noise.url);
//     this.textureMapColor = this.textureLoader.load(this.textures.map_color.url);
//     this.textureMapNormal = this.textureLoader.load(
//       this.textures.map_normal.url
//     );
//     this.textureMapRoughness = this.textureLoader.load(
//       this.textures.map_roughness.url
//     );
//     this.textureMapDisplacement = this.textureLoader.load(
//       this.textures.map_displacement.url
//     );

//     this.textureNoise.wrapS = THREE.RepeatWrapping;
//     this.textureNoise.wrapT = THREE.RepeatWrapping;
//     this.textureNoise.minFilter = THREE.LinearFilter;

//     this.textureMapColor.wrapS = THREE.RepeatWrapping;
//     this.textureMapColor.wrapT = THREE.RepeatWrapping;
//     this.textureMapColor.minFilter = THREE.LinearFilter;

//     this.textureMapNormal.wrapS = THREE.RepeatWrapping;
//     this.textureMapNormal.wrapT = THREE.RepeatWrapping;
//     this.textureMapNormal.minFilter = THREE.LinearFilter;

//     this.textureMapRoughness.wrapS = THREE.RepeatWrapping;
//     this.textureMapRoughness.wrapT = THREE.RepeatWrapping;
//     this.textureMapRoughness.minFilter = THREE.LinearFilter;

//     this.textureMapDisplacement.wrapS = THREE.RepeatWrapping;
//     this.textureMapDisplacement.wrapT = THREE.RepeatWrapping;
//     this.textureMapDisplacement.minFilter = THREE.LinearFilter;

//     // this.allLoaded = true;
//     // let texture;

//     // for (let i in this.textures) {
//     //   let tex = this.textures[i];

//     //   if (tex.loaded === false) {
//     //     this.allLoaded = false;

//     //     this.textureLoader.load(tex.url, (texture) => {
//     //       texture.wrapS = THREE.RepeatWrapping;
//     //       texture.wrapT = THREE.RepeatWrapping;
//     //       texture.minFilter = THREE.LinearFilter;
//     //       tex.texture = texture;

//     //       tex.loaded = true;
//     //       this.loadTextures();
//     //       console.log(tex);
//     //     });
//     //     break;
//     //   }
//     // }

//     // if (this.allLoaded === true) {
//     //   this.start();
//     // }
//   }

//   createControls() {
//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//     this.controls.enableDamping = true;
//   }

//   createClock() {
//     this.clock = new THREE.Clock();
//   }

//   createLight() {
//     this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
//     this.directionalLight.position.set(3, 1, 1);
//     this.directionalLight.castShadow = true;
//     this.directionalLight.shadow.mapSize.set(2048, 2048);
//     this.directionalLight.shadow.camera.top = 2;
//     this.directionalLight.shadow.camera.right = 2;
//     this.directionalLight.shadow.camera.bottom = -2;
//     this.directionalLight.shadow.camera.left = -2;
//     this.directionalLight.shadow.camera.far = 15;
//     this.directionalLight.shadow.normalBias = 0.01;

//     this.scene.add(this.directionalLight);

//     this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
//     this.scene.add(this.ambientLight);
//   }

//   createRenderer() {
//     this.renderer = new THREE.WebGLRenderer({
//       // canvas: this.canvas,
//       // alpha: true,
//       antialias: true,
//     });

//     this.container.appendChild(this.renderer.domElement);

//     this.renderer.domElement.classList.add("slider__link");

//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     this.renderer.physicallyCorrectLights = true;
//     this.renderer.shadowMap.enabled = true;
//     this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     this.renderer.outputEncoding = THREE.sRGBEncoding;
//   }

//   getMaterial() {
//     const material = new THREE.MeshPhysicalMaterial({
//       color: 0xffffff,
//       metalness: 0.5,
//       roughness: 0,
//       clearcoat: 1,
//       clearcoatRoughness: 0.4,
//       // wireframe: true,
//       side: 2,
//     });

//     material.onBeforeCompile = (shader) => {
//       shader.uniforms.playhead = { value: 0 };

//       shader.fragmentShader =
//         `
//         uniform float playhead;
//         ` + shader.fragmentShader;

//       shader.fragmentShader = shader.fragmentShader.replace(
//         "#include <logdepthbuf_fragment>",
//         `

//         float diff = dot(vec3(1.0), vNormal);

//         vec2 p = vec2(1.0, 0.5);
//         float f = fract(p.y * 7.0);
//         float col = smoothstep(0.45, 0.1, abs(f - 0.5));

//         vec3 colorA = vec3(0.5, 0.5, 2.0);
//         vec3 colorB = vec3(0.5, 0.5, 1.0);
//         vec3 colorC = vec3(0.0, 0.0, 1.0);
//         vec3 colorD = vec3(0.0, 0.0, 1.0);

//         vec3 mixedColor = colorA + colorB * cos( 2.0 * 3.1415 * (colorC * diff + colorD + playhead)) + col;

//         diffuseColor.rgb = vec3(diff, 0.0, 0.0);
//         diffuseColor.rgb = mixedColor;

//       ` + "#include <logdepthbuf_fragment>"
//       );

//       material.userData.shader = shader;
//     };

//     return material;
//   }

//   createHelicoid() {
//     const material = this.getMaterial();

//     function Helicoid(u, v, target) {
//       const alpha = Math.PI * 2 * (v - 0.5);
//       const theta = Math.PI * 2 * (u - 0.5);
//       const dividend = 1 + Math.cosh(alpha) * Math.cosh(theta);
//       const t = 3;

//       let x = (Math.sinh(theta) * Math.cos(alpha * t)) / dividend;
//       let z = (Math.sinh(theta) * Math.sin(alpha * t)) / dividend;
//       let y = (1.5 * (Math.cosh(theta) * Math.sinh(alpha))) / dividend;

//       target.set(x, y, z);
//     }

//     // material = new THREE.MeshNormalMaterial({ side: 2 });

//     const geometry = new ParametricGeometry(Helicoid, 200, 200);

//     this.helicoid = new THREE.Mesh(geometry, material);

//     this.helicoid.castShadow = this.helicoid.receiveShadow = true;

//     this.scene.add(this.helicoid);
//   }

//   createSliderMesh() {
//     this.sliderGeometry = new THREE.PlaneGeometry(
//       this.width,
//       this.height,
//       1,
//       1
//     );

//     // for (let i in this.textures) {
//     //   this.uniforms["u_" + i] = this.textures[i];
//     //   console.log(this.textures[i].texture);
//     // }

//     this.sliderMaterial = new THREE.ShaderMaterial({
//       // side: 2,
//       transparent: true,
//       // wireframe: true,
//       vertexShader: require("./static/shaders/slider.vertex.glsl"),
//       fragmentShader: require("./static/shaders/slider.fragment.glsl"),
//       uniforms: {
//         uTime: { value: 0 },
//         uProgress: { value: 0 },
//         uPixels: { value: new THREE.Vector2(this.width, this.height) },
//         uvRate1: { value: new THREE.Vector2(1, 1) },
//         uAccel: { value: new THREE.Vector2(0.5, 2) },
//         uTexture1: { value: this.texture1 },
//         uTexture2: { value: this.texture2 },
//       },
//     });

//     this.sliderMesh = new THREE.Mesh(this.sliderGeometry, this.sliderMaterial);

//     this.scene.add(this.sliderMesh);

//     // this.camera.position.z = 600;
//     // this.plane.position.z = 1;
//     // let dist = this.camera.position.z / 260 - this.plane.position.z;

//     // let height = 1;
//     // this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));
//     // this.camera.position.z = 240;

//     this.checkMobile();
//     this.sliderMesh.scale.set(this.isMobile ? 1 : 1, this.isMobile ? 1 : 2, 0);
//   }

//   createBackgroundPlane() {
//     this.bgGeometry = new THREE.PlaneGeometry(1000, 1000);

//     this.uniforms = {
//       uTime: { value: 1.0 },
//       uResolution: { value: new THREE.Vector2() },
//       uMouse: { value: new THREE.Vector2() },
//       uMousemoved: { value: false },
//       uNoise: { type: "t", value: this.textureNoise },
//       uMapColor: { type: "t", value: this.textureMapColor },
//       uMapNormal: { type: "t", value: this.textureMapNormal },
//       uMapRoughness: { type: "t", value: this.textureMapRoughness },
//       uMapDisplacement: { type: "t", value: this.textureMapDisplacement },
//       uTexture1: { value: this.texture1 },
//     };

//     this.bgMaterial = new THREE.ShaderMaterial({
//       // wireframe: true,
//       vertexShader: require("./static/shaders/background.vertex.glsl"),
//       fragmentShader: require("./static/shaders/background.fragment.glsl"),
//       uniforms: this.uniforms,
//     });

//     console.log(this.bgMaterial.uniforms.uMapNormal.value);

//     // this.bgMaterial.extensions.derivatives = true;

//     this.bgPlane = new THREE.Mesh(this.bgGeometry, this.bgMaterial);
//     this.camera.position.z = 700;

//     this.scene.add(this.bgPlane);
//   }

//   animateSlider() {
//     const tl = gsap.timeline();

//     title.services.addEventListener("click", () => {
//       // nextSlide = (currentSlide + 2) % this.textures.length;
//       // currentSlide++;

//       // if (currentSlide > this.textures.length - 1) {
//       //   currentSlide = 0;
//       // }

//       if (title.services.classList.contains("done")) {
//         tl.to(this.sliderMaterial.uniforms.uProgress, 1, {
//           value: 0,
//         });

//         title.services.classList.remove("done");
//       } else {
//         tl.to(this.sliderMaterial.uniforms.uProgress, 1, {
//           value: 1,
//         });

//         title.services.classList.add("done");
//       }
//     });
//   }

//   update() {
//     const elapsedTime = this.clock.getElapsedTime();

//     if (this.bgPlane) {
//       this.uniforms.uTime.value = elapsedTime;
//     }

//     if (this.sliderMesh) {
//       this.sliderMaterial.uniforms.uTime.value = elapsedTime;

//       // const currentTime = Date.now();
//       // this.delta = currentTime - this.current;
//       // this.current = currentTime;
//       // this.elapsed = this.current - this.start;
//       const deltaTime = elapsedTime - previousTime;
//       previousTime = elapsedTime;
//       // console.log(deltaTime);

//       // this.speed += this.delta * 0.003;
//       // this.position += this.speed;
//       // this.speed *= 0.7;

//       // let i = Math.round(this.position);
//       // let dif = i - this.position;
//       // this.position += dif * 0.03;

//       // if (Math.abs(i - this.position) < 0.001) {
//       //   this.position = i;
//       // }

//       // console.log(this.position);

//       // this.planeMaterial.uniforms.uProgress.value = this.position;

//       // console.log(currentSlide);

//       // this.planeMaterial.uniforms.uTexture1 = this.textures[currentSlide];

//       // this.planeMaterial.uniforms.uTexture2 = this.textures[nextSlide];
//     }

//     this.controls.update();

//     if (this.helicoid) {
//       this.helicoid.rotation.y = elapsedTime * 0.2;
//       this.controls.update();

//       if (this.helicoid.material.userData.shader) {
//         this.helicoid.material.userData.shader.uniforms.playhead.value =
//           elapsedTime * 0.2;
//       }

//       const theta1 = Math.PI * elapsedTime * 0.32;
//       const theta2 = Math.PI * elapsedTime * 0.32 + Math.PI;

//       this.helicoid.position.x = this.isMobile ? 0 : 1.6;
//     }
//   }

//   render() {
//     this.renderer.render(this.scene, this.camera);
//   }

//   checkMobile() {
//     this.isMobile = window.innerWidth < 568;
//   }

//   onResize() {
//     //Update sizes
//     // if (this.helicoid) {
//     //   this.width = window.innerWidth;
//     //   this.height = window.innerHeight;

//     // }

//     // if (this.plane) {
//     //   this.width = this.container.clientWidth;
//     //   this.height = this.container.clientHeight;
//     //   // this.width = window.innerWidth;
//     //   // this.height = window.innerHeight;

//     // }

//     this.width = this.container.clientWidth;
//     this.height = this.container.clientHeight;
//     // console.log(this.width, this.height);

//     //Update camera
//     this.camera.aspect = this.width / this.height;
//     this.camera.updateProjectionMatrix();

//     //Update renderer
//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     // let dist = this.camera.position.z / 260 - this.plane.position.z;

//     // let height = 1;
//     // this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

//     // this.plane.scale.x = this.plane.scale.y;

//     if (this.sliderMesh) {
//       cssAspectRatioX = +getComputedStyle(document.querySelector(".slider"))
//         .aspectRatio[0];
//       cssAspectRatioY = +getComputedStyle(
//         document.querySelector(".slider")
//       ).aspectRatio.slice(-1);

//       this.isMobile
//         ? this.sliderMesh.scale.set(cssAspectRatioY * 0.5, cssAspectRatioX, 0)
//         : this.sliderMesh.scale.set(cssAspectRatioY, cssAspectRatioX, 0);
//     }
//     // if (this.plane) {
//     //   this.plane.scale.set(this.isMobile ? 1 : 2, this.isMobile ? 1 : 1, 0);
//     //   console.log(this.plane.scale);
//     // }
//     this.checkMobile();
//   }

//   onMousemove(e) {
//     const x = (e.clientX / this.width) * 2 - 1;
//     const y = -((e.clientY / this.height) * 2 - 1);

//     gsap.to(this.camera.position, {
//       x: () => x * 0.1,
//       y: () => y * 0.32,
//       duration: 0.5,
//     });

//     if (this.bgMaterial) {
//       let ratio = this.width / this.height;
//       this.bgMaterial.uniforms.uMouse.value.x =
//         (e.clientX - this.width / 6) / this.width / ratio;
//       this.bgMaterial.uniforms.uMouse.value.y =
//         ((e.clientY - this.height / 2) / this.height) * -1;
//       this.bgMaterial.uniforms.uMousemoved.value = true;

//       // e.preventDefault();
//     }
//   }

//   addListeners() {
//     window.addEventListener("resize", this.resize, { passive: true });
//     window.addEventListener("mousemove", this.mousemove, { passive: true });
//   }
// }

// const app = new Sketch("#helicoid");
// app.init();

// const slid = new Sketch(".slider");
// slid.initSlider();

// const backgroundMesh = new Sketch("#background");
// backgroundMesh.initBackground();

export default class Sketch {
  constructor(container) {
    this.container = document.querySelector(container);

    // this.width = window.innerWidth;
    // this.height = window.innerHeight;

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.imageAspect = 1.77;

    this.uniforms = {
      uTime: { type: "f", value: 0.0 },
      uResolution: { type: "v2", value: new THREE.Vector2() },
      uMouse: { type: "v2", value: new THREE.Vector2() },
      uMousemoved: { type: "b", value: false },
      uProgress: { value: 0 },
      uPixels: { value: new THREE.Vector2(this.width, this.height) },
      uvRate1: { value: new THREE.Vector2(1, 1) },
      uAccel: { value: new THREE.Vector2(0.5, 2) },
      uScale: { value: new THREE.Vector2(1, 1) },
    };

    this.resize = () => this.onWindowResize();
    this.pointermove = (e) => this.onPointermove(e);
  }

  async init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createBgMesh();
    this.createClock();
    this.createLoaders();
    this.addListeners();

    // this.createHelicoid();
    // this.createSliderMesh();
    // this.animateSlider();

    await this.loadTextures();

    this.render();
  }

  async initSlider() {
    this.createScene();
    this.createCamera();
    // this.createOrthographicCamera();
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

  createBgMesh() {
    this.geometry = new THREE.PlaneGeometry(2, 2);

    // this.uniforms = {
    //   uTime: { type: "f", value: 1.0 },
    //   uResolution: { type: "v2", value: new THREE.Vector2() },
    //   uMouse: { type: "v2", value: new THREE.Vector2() },
    //   uMousemoved: { type: "b", value: false },
    //   uProgress: { value: 0 },
    //   uPixels: { value: new THREE.Vector2(this.width, this.height) },
    //   uvRate1: { value: new THREE.Vector2(1, 1) },
    //   uAccel: { value: new THREE.Vector2(0.5, 2) },
    // };

    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: this.uniforms,
      vertexShader: require("./static/shaders/background.vertex.glsl"),
      fragmentShader: require("./static/shaders/background.fragment.glsl"),
    });

    this.uniforms.uResolution.value.x = this.renderer.domElement.width;
    this.uniforms.uResolution.value.y = this.renderer.domElement.height;

    this.material.extensions.derivatives = true;

    this.bgMesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.bgMesh);
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

    const urls = [
      {
        name: "Noise",
        url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png",
      },
      {
        // url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/Lava_001_COLOR.png",
        name: "MapColor",
        url: "https://raw.githubusercontent.com/pizza3/asset/master/chaassets/Lava/Lava_001_COLOR.webp",
      },
      {
        // url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/Lava_001_NRM.png",
        name: "MapNormal",
        url: "https://raw.githubusercontent.com/pizza3/asset/master/chaassets/Lava/Lava_001_NRM.webp",
      },
      {
        // url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/Lava_001_OCC.png",
        name: "MapRoughness",
        url: "https://raw.githubusercontent.com/pizza3/asset/master/chaassets/Lava/Lava_001_OCC.webp",
      },
      {
        // url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/Lava_001_DISP.png",
        name: "MapDisplacement",
        url: "https://raw.githubusercontent.com/pizza3/asset/master/chaassets/Lava/Lava_001_DISP.webp",
      },
      {
        name: "Texture1",
        url: "https://images.unsplash.com/photo-1675034743372-672c3c3f8377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      },
      {
        name: "Texture2",
        url: "https://images.unsplash.com/photo-1675060901942-e5e3877d26ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80",
      },
      // sliderImg3: {
      //   url: "https://images.unsplash.com/photo-1674859659457-3dde5db387c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
      //   loaded: false,
      // },
      // sliderImg4: {
      //   url: "https://images.unsplash.com/photo-1674909073110-5aa68607e693?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
      //   loaded: false,
      // },
      // sliderImg5: {
      //   url: "https://images.unsplash.com/photo-1668018367039-22526ebf2461?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=739&q=80",
      //   loaded: false,
      // },
      // sliderImg6: {
      //   url: "https://images.unsplash.com/photo-1674909072480-ad551618b63e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
      //   loaded: false,
      // },
    ];

    const promises = urls.map(async ({ name, url }) => {
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
    // this.w = this.container.clientWidth;
    // this.h = this.container.clientHeight;
    // console.log(this.w, this.h);
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
    // this.sliderMesh.position.set(-0.5, 0.5, 0);
    // this.sliderMesh.scale.set(1.5, 1.5, 1.5);
    // this.camera.position.z = 300;

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
      // nextSlide = (currentSlide + 2) % this.textures.length;
      // currentSlide++;

      // if (currentSlide > this.textures.length - 1) {
      //   currentSlide = 0;
      // }

      if (title.services.classList.contains("done")) {
        tl.to(this.sliderMaterial.uniforms.uProgress, 1, {
          value: 0,
        });

        title.services.classList.remove("done");
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
    let ratio = window.innerHeight / window.innerWidth;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);

    this.uniforms.uMouse.value.x = x;
    this.uniforms.uMouse.value.y = y;

    if (this.helicoid) {
      gsap.to(this.camera.position, {
        x: () => x * 0.1,
        y: () => y * 0.12,
        duration: 0.5,
      });
    }

    // uniforms.uMouse.value.x =
    //   (e.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
    // uniforms.uMouse.value.y =
    //   ((e.pageY - window.innerHeight / 2) / window.innerHeight) * -1;

    this.uniforms.uMousemoved.value = true;

    e.preventDefault();
  }

  createClock() {
    this.clock = new THREE.Clock();
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 568;
  }

  render() {
    let elapsedTime = this.clock.getElapsedTime();
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
}

new Sketch("#background").init();
new Sketch(".slider").initSlider();
// new Sketch("#helicoid").initHelicoid();

const sliderTrigger = document.querySelectorAll(".slider__link");
let isAnimating = false;

const openMenuAnimation = () => {
  if (isAnimating) return;
  isAnimating = true;

  gsap
    .timeline({
      onComplete: () => (isAnimating = false),
    })
    .set(overlayPath, {
      // attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
      attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" },
    })
    .to(
      overlayPath,
      {
        // attr: { d: "M 0 0 V 50 Q 50 100 100 50 V 0 z" },
        attr: { d: "M 0 100 V 50 Q 50 0 100 50 V 100 z" },
        ease: "power4.in",
        duration: 0.8,
      },
      0
    )
    .to(overlayPath, {
      // attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
      attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" },
      ease: "power2",
      duration: 0.3,
      onComplete: () => {
        menuWrapper.classList.add("menu-wrapper--open");
        content.classList.add("content--close");
        frame.classList.add("frame--close");
      },
    })
    .to(
      [title.main, title.down, title.bg, title.services, slider],
      {
        y: -200,
        duration: 0.8,
        ease: "power3.in",
        stagger: 0.05,
      },
      0.2
    )
    .set(menuItems, {
      opacity: 0,
    })
    .set(overlayPath, {
      // attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
      attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
    })
    .to(overlayPath, {
      duration: 0.3,
      ease: "power2.in",
      // attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
      attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
    })
    .to(overlayPath, {
      duration: 0.8,
      ease: "power4",
      // attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
      attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
    })
    .to(
      menuItems,
      {
        y: 0,
        startAt: { y: 150 },
        opacity: 1,
        stagger: 0.05,
        duration: 1.2,
        ease: "power4",
      },
      ">-=1.2"
    );
};

const closeMenuAnimation = () => {
  if (isAnimating) return;
  isAnimating = true;

  gsap
    .timeline({
      onComplete: () => (isAnimating = false),
    })
    .set(overlayPath, {
      // attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
      attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
    })
    .to(
      overlayPath,
      {
        duration: 0.8,
        ease: "power4.in",
        // attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
        attr: { d: "M 0 0 V 50 Q 50 100 100 50 V 0 z" },
      },
      0
    )
    .to(overlayPath, {
      duration: 0.3,
      ease: "power2",
      // attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
      attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
      onComplete: () => {
        menuWrapper.classList.remove("menu-wrapper--open");
        content.classList.remove("content--close");
        frame.classList.remove("frame--close");
      },
    })
    .set(overlayPath, {
      // attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
      attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" },
    })
    .to(overlayPath, {
      // attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
      attr: { d: "M 0 100 V 50 Q 50 100 100 50 V 100 z" },
      ease: "power2.in",
      duration: 0.3,
    })
    .to(overlayPath, {
      // attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
      attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" },
      ease: "power4",
      duration: 0.8,
    })
    .to(
      [title.main, title.down, title.bg, title.services],
      {
        y: 0,
        duration: 1.2,
        ease: "power4",
        stagger: -0.05,
      },
      ">-=1.2"
    )
    .to(
      slider,
      {
        y: 0,
        duration: 0.5,
        ease: "none",
      },
      "<-0.2"
    )
    .to(
      menuItems,
      {
        y: 200,
        opacity: 0,
        stagger: -0.05,
        duration: 0.8,
        ease: "power2.in",
      },
      0
    );
};

// openMenuBtn.addEventListener("click", openMenuAnimation);
closeMenuBtn.addEventListener("click", closeMenuAnimation);
sliderTrigger.forEach((btn) => {
  btn.addEventListener("click", openMenuAnimation);
});

//ANCHOR Gallery
const gallery = document.querySelector(".gallery");
const galleryItem = document.querySelectorAll(".gallery__img");

let isActive = false;

gallery.addEventListener("click", (e) => {
  isActive = !isActive;
  const clicked = e.target.closest(".gallery__img");
  // if (!clicked) return;

  // if (!e.target.classList.contains("active")) {
  //   galleryItem.forEach((item) => {
  //     item.classList.remove("active");
  //     console.log("remove active");
  //   });

  // }

  // galleryItem.forEach((item) => item.classList.remove("active"));

  if (isActive) {
    clicked.classList.add("active");
  } else {
    clicked.classList.remove("active");
    clicked.classList.add("not-active");
    setTimeout(() => {
      clicked.classList.remove("not-active");
    }, 950);
  }
});

// window.addEventListener("click", (e) => {
//   if (!e.target.closest(".gallery")) {
//     galleryItem.forEach((item) => {
//       item.classList.remove("active");
//       console.log("click");
//     });
//   }
// });

// const gallery = gsap.utils.toArray(".gallery");
// const galleryItem = gsap.utils.toArray(".gallery img");
// const galleryToggles = galleryItem.map(createAnimation);

// galleryItem.forEach((item) => {
//   item.addEventListener("click", () => toggleGallery(item));
// });
// function toggleGallery(clickedItem) {
//   galleryToggles.forEach((toggleFn) => toggleFn(clickedItem));
// }

// // galleryItem.forEach((item) => {
// //   item.addEventListener("click", () => toggleGallery(item));
// // });

// // function toggleGallery(clickedItem) {
// //   galleryToggles.forEach((toggleFn) => toggleFn(clickedItem));
// // }

// function createAnimation(element) {
//   // let item = document.querySelector("img");

//   let animation = gsap
//     .timeline({ paused: true })
//     .to(element, {
//       "clip-path": "circle(100% at 50% 70%)",
//       "grid-area": "1 / 1 / -1 / -1",
//       duration: 2,
//       ease: "power4",
//     })
//     .reverse();

//   return function (clickedItem) {
//     if (clickedItem === element) {
//       console.log(clickedItem, element);
//       animation.reversed(!animation.reversed());
//       element.classList.add("active");
//     } else {
//       console.log(clickedItem, element);
//       animation.reverse();
//       element.classList.remove("active");
//     }
//   };
// }

/*
 * Slider
 */
// const servicesButton = document.querySelector(".services__title");
// const sliderItem = document.querySelector(".slider__list");
// let count = 0;

// title.services.addEventListener("click", (e) => {
//   count++;
//   sliderItem.style.rotate = `${count * -90}deg`;
// });
