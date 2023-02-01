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
const closeMenuBtns = document.querySelectorAll(".slider__link");

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

/**
 * Three.js part
 */
let previousTime = 0;
let currentSlide = 0;
let nextSlide = null;
export default class Sketch {
  constructor(container) {
    this.container = document.querySelector(container);

    //Sizes
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.speed = 0;
    this.position = 0;
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    this.resize = () => this.onResize();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createLight();
    this.createClock();
    this.createHelicoid();
    this.createSpheres();
    this.createRenderer();
    this.createControls();

    this.renderer.setAnimationLoop(() => {
      this.addListeners();
      this.update();
      this.render();
    });
  }

  initSlider() {
    this.createScene();
    this.createCamera();
    this.createLight();
    this.createClock();
    this.createLoader();
    this.createRenderer();
    this.createControls();
    this.createMesh();
    this.animateSlider();

    this.renderer.setAnimationLoop(() => {
      this.addListeners();
      this.update();
      this.render();
    });
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      1,
      1000
    );

    this.camera.position.set(0, 0, this.scene.id === 17 ? 200 : 4);
    // this.camera.position.set(0, 0, 4);
    this.camera.lookAt(new THREE.Vector3());
  }

  createLoader() {
    this.textureLoader = new THREE.TextureLoader();
    this.texture1 = this.textureLoader.load(`${imagesToPreload[0]}`);
    this.texture2 = this.textureLoader.load(`${imagesToPreload[1]}`);
    this.texture3 = this.textureLoader.load(`${imagesToPreload[2]}`);
    this.texture4 = this.textureLoader.load(`${imagesToPreload[3]}`);
    this.texture5 = this.textureLoader.load(`${imagesToPreload[4]}`);
    this.texture6 = this.textureLoader.load(`${imagesToPreload[5]}`);

    this.textures = [
      this.texture1,
      this.texture2,
      this.texture3,
      this.texture4,
      this.texture5,
      this.texture6,
    ];
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  createClock() {
    this.clock = new THREE.Clock();
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
    // this.directionalLight.shadow.normalBias = 0.01;

    this.scene.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(this.ambientLight);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      // canvas: this.canvas,
      alpha: true,
      antialias: true,
    });

    this.container.appendChild(this.renderer.domElement);

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.physicallyCorrectLights = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
  }

  getMaterial() {
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.4,
      // wireframe: true,
      side: 2,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.playhead = { value: 0 };

      shader.fragmentShader =
        `
        uniform float playhead;
        ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <logdepthbuf_fragment>",
        `

        float diff = dot(vec3(1.0), vNormal);
       

        vec2 p = vec2(1.0, 0.5);
        float f = fract(p.y * 7.0);
        float col = smoothstep(0.45, 0.1, abs(f - 0.5));

        vec3 colorA = vec3(0.5, 0.5, 2.0);
        vec3 colorB = vec3(0.5, 0.5, 1.0);
        vec3 colorC = vec3(0.0, 0.0, 1.0);
        vec3 colorD = vec3(0.0, 0.0, 1.0);

        vec3 mixedColor = colorA + colorB * cos( 2.0 * 3.1415 * (colorC * diff + colorD + playhead)) + col;

        diffuseColor.rgb = vec3(diff, 0.0, 0.0);
        diffuseColor.rgb = mixedColor;

      ` + "#include <logdepthbuf_fragment>"
      );

      material.userData.shader = shader;
    };

    return material;
  }

  createHelicoid() {
    const material = this.getMaterial();

    function Helicoid(u, v, target) {
      const alpha = Math.PI * 2 * (v - 0.5);
      const theta = Math.PI * 2 * (u - 0.5);
      const dividend = 1 + Math.cosh(alpha) * Math.cosh(theta);
      const t = 3;

      let x = (Math.sinh(theta) * Math.cos(alpha * t)) / dividend;
      let z = (Math.sinh(theta) * Math.sin(alpha * t)) / dividend;
      let y = (1.5 * (Math.cosh(theta) * Math.sinh(alpha))) / dividend;

      target.set(x, y, z);
    }

    // material = new THREE.MeshNormalMaterial({ side: 2 });

    const geometry = new ParametricGeometry(Helicoid, 100, 100);

    this.helicoid = new THREE.Mesh(geometry, material);

    this.helicoid.castShadow = this.helicoid.receiveShadow = true;

    this.scene.add(this.helicoid);

    // this.scene.background = new THREE.Color(0xff0000, 0.1);
    // this.scene.fog = new THREE.Fog(0xffffff, 0.05, 10);
  }

  createSpheres() {
    const material = this.getMaterial();
    const geometry = new THREE.IcosahedronGeometry(0.23, 5);

    this.ball1 = new THREE.Mesh(geometry, material);
    this.ball2 = new THREE.Mesh(geometry, material);

    this.ball1.castShadow = this.ball1.receiveShadow = true;
    this.ball2.castShadow = this.ball2.receiveShadow = true;

    // this.scene.add(this.ball1, this.ball2);
  }

  createMesh() {
    this.planeGeoetry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);

    this.planeMaterial = new THREE.ShaderMaterial({
      side: 2,
      transparent: true,
      // wireframe: true,
      vertexShader: require("./static/shaders/slider.vertex.glsl"),
      fragmentShader: require("./static/shaders/slider.fragment.glsl"),
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uPixels: { value: new THREE.Vector2(this.width, this.height) },
        uvRate1: { value: new THREE.Vector2(1, 1) },
        uAccel: { value: new THREE.Vector2(0.5, 2) },
        uTexture1: {
          value: this.texture2,
        },
        uTexture2: {
          value: this.texture3,
        },
      },
    });

    this.plane = new THREE.Mesh(this.planeGeoetry, this.planeMaterial);

    this.scene.add(this.plane);

    // this.camera.position.z = 600;
    // this.plane.position.z = 1;
    // let dist = this.camera.position.z - this.plane.position.z;

    // let height = 1;
    // this.camera.fov = 5000;
    // // this.camera.fov = 200;
    // if (this.width / this.height > 1) {
    // this.plane.scale.x = this.plane.scale.y = 2.05;
    // }
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
        tl.to(this.planeMaterial.uniforms.uProgress, 1, {
          value: 0,
        });

        title.services.classList.remove("done");
      } else {
        tl.to(this.planeMaterial.uniforms.uProgress, 1, {
          value: 1,
        });

        title.services.classList.add("done");
      }
    });
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();

    if (this.plane) {
      this.planeMaterial.uniforms.uTime.value = elapsedTime;

      // const currentTime = Date.now();
      // this.delta = currentTime - this.current;
      // this.current = currentTime;
      // this.elapsed = this.current - this.start;
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
      // console.log(deltaTime);

      // this.speed += this.delta * 0.003;
      // this.position += this.speed;
      // this.speed *= 0.7;

      // let i = Math.round(this.position);
      // let dif = i - this.position;
      // this.position += dif * 0.03;

      // if (Math.abs(i - this.position) < 0.001) {
      //   this.position = i;
      // }

      // console.log(this.position);

      // this.planeMaterial.uniforms.uProgress.value = this.position;

      // console.log(currentSlide);

      // this.planeMaterial.uniforms.uTexture1 = this.textures[currentSlide];

      // this.planeMaterial.uniforms.uTexture2 = this.textures[nextSlide];
    }

    this.controls.update();

    if (this.helicoid) {
      this.helicoid.rotation.y = elapsedTime * 0.2;
      this.controls.update();

      if (this.helicoid.material.userData.shader) {
        this.helicoid.material.userData.shader.uniforms.playhead.value =
          elapsedTime * 0.2;
      }

      const theta1 = Math.PI * elapsedTime * 0.32;
      const theta2 = Math.PI * elapsedTime * 0.32 + Math.PI;

      this.ball1.position.x = Math.sin(theta1) * 0.6 + (this.isMobile ? 0 : 3);
      this.ball1.position.z = Math.cos(theta1) * 0.6;

      this.ball2.position.x = Math.sin(theta2) * 0.6 + (this.isMobile ? 0 : 3);
      this.ball2.position.z = Math.cos(theta2) * 0.6;

      this.helicoid.position.x = this.isMobile ? 0 : 3;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 767;
  }

  onResize() {
    //Update sizes
    // if (this.helicoid) {
    //   this.width = window.innerWidth;
    //   this.height = window.innerHeight;

    // }

    // if (this.plane) {
    //   this.width = this.container.clientWidth;
    //   this.height = this.container.clientHeight;
    //   // this.width = window.innerWidth;
    //   // this.height = window.innerHeight;

    // }

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    // console.log(this.width, this.height);

    //Update camera
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    //Update renderer
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // if (this.plane) {
    //   let dist =
    //     this.camera.position.z / this.camera.position.z - this.plane.position.z;

    //   let height = 1;
    //   this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    //   this.plane.scale.x = this.plane.scale.y =
    //     (1.05 * this.width) / this.height;
    // }

    this.checkMobile();
  }

  addListeners() {
    window.addEventListener("resize", this.resize, { passive: true });
  }
}

const app = new Sketch("#helicoid");
app.init();

const slid = new Sketch(".slider");
slid.initSlider();

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
      [title.main, title.down, title.bg, title.services, slider],
      {
        y: 0,
        duration: 1.2,
        ease: "power4",
        stagger: -0.05,
      },
      ">-=1.2"
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

closeMenuBtns.forEach((btn) => {
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
