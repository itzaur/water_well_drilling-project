import * as THREE from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InstancedUniformsMesh } from "three-instanced-uniforms-mesh";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import * as dat from "lil-gui";
import { gsap } from "gsap";

// export default class Contact {
//   constructor(container) {
//     this.container = document.querySelector(container);

//     //Sizes
//     this.width = this.container.clientWidth;
//     this.height = this.container.clientHeight;

//     //Colors
//     this.colors = [
//       new THREE.Color("#ffb700"),
//       new THREE.Color("#ffffff"),
//       new THREE.Color("#1f507a"),
//       new THREE.Color("#31333f"),
//     ];

//     //Hover
//     this.uniforms = {
//       uHover: 0,
//     };
//     this.hover = false;

//     this.resize = () => this.onResize();
//     this.mousemove = (e) => this.onMousemove(e);
//   }

//   init() {
//     this.createScene();
//     this.createClock();
//     this.createCamera();
//     this.createRenderer();
//     this.createControls();
//     this.createContactMesh();
//     this.createRaycaster();
//     this.addListeners();

//     this.renderer.setAnimationLoop(() => {
//       this.update();
//       this.render();
//     });
//   }

//   destroy() {
//     this.renderer.dispose();
//     this.removeListeners();
//   }

//   createScene() {
//     this.scene = new THREE.Scene();
//   }

//   createCamera() {
//     this.camera = new THREE.PerspectiveCamera(
//       75,
//       this.width / this.height,
//       0.1,
//       100
//     );

//     this.camera.position.set(0, 0, 2.1);
//   }

//   createControls() {
//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//     this.controls.enableDamping = true;
//   }

//   createClock() {
//     this.clock = new THREE.Clock();
//   }

//   createRenderer() {
//     this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     this.container.appendChild(this.renderer.domElement);
//   }

//   createContactMesh() {
//     this.group = new THREE.Group();
//     this.geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5, 8, 8, 8);
//     this.material = new THREE.MeshStandardMaterial({ wireframe: true });

//     this.contactMesh = new THREE.Mesh(this.geometry, this.material);
//     // this.contactMesh.position.set(-1.6, 0.5, 0);

//     this.group.add(this.contactMesh);

//     this.instancedGeometry = new THREE.BoxGeometry(
//       0.005,
//       0.005,
//       0.005,
//       1,
//       1,
//       1
//     );

//     // this.uniforms = {
//     //   uTime: { value: 0 },
//     //   uHover: { value: this.uniforms.uHover },
//     //   uRotation: { value: 0 },
//     //   uSize: { value: 0 },
//     //   uPointer: { value: new THREE.Vector3() },
//     //   uColor: { value: new THREE.Color() },
//     // };

//     this.instancedMaterial = new THREE.ShaderMaterial({
//       wireframe: true,
//       vertexShader: require("./static/shaders/contact.vertex.glsl"),
//       fragmentShader: require("./static/shaders/contact.fragment.glsl"),
//       uniforms: {
//         uTime: { value: 0 },
//         uHover: { value: this.uniforms.uHover },
//         uRotation: { value: 0 },
//         uSize: { value: 0 },
//         uPointer: { value: new THREE.Vector3() },
//         uColor: { value: new THREE.Color() },
//       },
//     });

//     const count = this.geometry.attributes.position.count;

//     this.instancedMesh = new InstancedUniformsMesh(
//       this.instancedGeometry,
//       this.instancedMaterial,
//       count
//     );

//     // this.instancedMesh.position.set(-1.6, 0.5, 0);

//     const dummy = new THREE.Object3D();

//     const positions = this.geometry.attributes.position.array;
//     for (let i = 0; i < positions.length; i += 3) {
//       dummy.position.set(positions[i + 0], positions[i + 1], positions[i + 2]);

//       dummy.updateMatrix();

//       this.instancedMesh.setMatrixAt(i / 3, dummy.matrix);
//       this.instancedMesh.setUniformAt(
//         "uRotation",
//         i / 3,
//         THREE.MathUtils.randFloat(-1, 1)
//       );
//       this.instancedMesh.setUniformAt(
//         "uSize",
//         i / 3,
//         THREE.MathUtils.randFloat(0.3, 3)
//       );

//       const colorIndex = THREE.MathUtils.randInt(0, this.colors.length - 1);
//       this.instancedMesh.setUniformAt("uColor", i / 3, this.colors[colorIndex]);
//     }

//     this.group.add(this.instancedMesh);
//     this.group.position.x = -1.8;

//     this.scene.add(this.group);
//   }

//   update() {
//     // this.camera.lookAt(0, 0, 0);
//     this.controls.update();
//   }

//   render() {
//     this.elapsedTime = this.clock.getElapsedTime();

//     this.renderer.render(this.scene, this.camera);

//     this.instancedMesh.rotation.x =
//       Math.sin(Math.PI * 2) + this.elapsedTime * 0.1;
//     this.contactMesh.rotation.x =
//       Math.sin(Math.PI * 2) + this.elapsedTime * 0.1;

//     this.instancedMesh.rotation.z = Math.cos(Math.PI) + this.elapsedTime * 0.1;
//     this.contactMesh.rotation.z = Math.cos(Math.PI) + this.elapsedTime * 0.1;
//   }

//   createRaycaster() {
//     this.mouse = new THREE.Vector2();
//     this.raycaster = new THREE.Raycaster();
//     this.intersects = [];
//     this.point = new THREE.Vector3();
//   }

//   addListeners() {
//     window.addEventListener("resize", this.resize, { passive: true });
//     window.addEventListener("mousemove", this.mousemove, { passive: true });
//   }

//   removeListeners() {
//     window.removeEventListener("resize", this.resize, { passive: true });
//     window.removeEventListener("mousemove", this.onMousemove, {
//       passive: true,
//     });
//   }

//   onMousemove(e) {
//     const x = (e.clientX / this.width) * 2 - 1;
//     const y = -((e.clientY / this.height) * 2 - 1);

//     this.mouse.set(x, y);

//     this.raycaster.setFromCamera(this.mouse, this.camera);
//     this.intersects = this.raycaster.intersectObject(this.contactMesh);
//     // console.log(this.intersects);

//     if (this.intersects.length === 0) {
//       console.log("not hover");
//       if (this.hover) {
//         this.hover = false;
//         this.animateHoverUniform(0);
//       }
//     } else {
//       console.log("hover");
//       if (!this.hover) {
//         this.hover = true;
//         this.animateHoverUniform(1);
//       }

//       console.log(this.intersects[0]);

//       gsap.to(this.point, {
//         x: () => this.intersects[0]?.point.x || 0,
//         y: () => this.intersects[0]?.point.y || 0,
//         z: () => this.intersects[0]?.point.z || 0,
//         duration: 0.3,
//         onUpdate: () => {
//           for (let i = 0; i < this.instancedMesh.count; i++) {
//             this.instancedMesh.setUniformAt("uPointer", i, this.point);
//           }
//         },
//       });
//     }

//     // gsap.to(this.camera.position, {
//     //   x: () => x * 0.15,
//     //   y: () => y * 0.1,
//     //   duration: 0.5,
//     // });
//   }

//   animateHoverUniform(value) {
//     gsap.to(this.uniforms, {
//       uHover: value,
//       duration: 0.25,
//       onUpdate: () => {
//         for (let i = 0; i < this.instancedMesh.count; i++) {
//           this.instancedMesh.setUniformAt("uHover", i, this.uniforms.uHover);
//         }
//       },
//     });
//   }

//   onResize() {
//     //Update sizes
//     this.width = this.container.clientWidth;
//     this.height = this.container.clientHeight;

//     //Update camera
//     this.camera.aspect = this.width / this.height;
//     this.camera.updateProjectionMatrix();

//     //Update renderer
//     this.renderer.setSize(this.width, this.height);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   }
// }

const preload = () => {
  let manager = new THREE.LoadingManager();
  manager.onLoad = function () {
    const environment = new Environment(typo, particle);
  };

  var typo = null;
  const loader = new FontLoader(manager);
  const font = loader.load(
    "https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json",
    function (font) {
      typo = font;
    }
  );
  const particle = new THREE.TextureLoader(manager).load(
    "https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png"
  );
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
)
  preload();
else document.addEventListener("DOMContentLoaded", preload);

class Environment {
  constructor(font, particle) {
    this.font = font;
    this.particle = particle;
    this.container = document.querySelector("#contact-app");

    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.setup();
    this.bindEvents();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  bindEvents() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  setup() {
    this.createParticles = new CreateParticles(
      this.scene,
      this.font,
      this.particle,
      this.camera,
      this.renderer
    );
  }

  render() {
    this.createParticles.render();
    this.renderer.render(this.scene, this.camera);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      65,
      this.container.clientWidth / this.container.clientHeight,
      1,
      10000
    );
    this.camera.position.set(0, 0, 100);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    this.renderer.setAnimationLoop(() => {
      this.render();
    });
  }

  onWindowResize() {
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }
}

class CreateParticles {
  constructor(scene, font, particleImg, camera, renderer) {
    this.scene = scene;
    this.font = font;
    this.particleImg = particleImg;
    this.camera = camera;
    this.renderer = renderer;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-200, 200);

    this.colorChange = new THREE.Color();

    this.buttom = false;

    this.data = {
      text: "+375 29 478 594",
      amount: 1500,
      particleSize: 1,
      particleColor: 0xbd1218,
      textSize: 18,
      area: 20,
      ease: 0.05,
    };

    this.setup();
    this.bindEvents();
  }

  setup() {
    const geometry = new THREE.PlaneGeometry(
      this.visibleWidthAtZDepth(100, this.camera),
      this.visibleHeightAtZDepth(100, this.camera)
    );
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
    });
    this.planeArea = new THREE.Mesh(geometry, material);
    this.planeArea.visible = false;
    this.createText();
  }

  bindEvents() {
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseDown() {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
    vector.unproject(this.camera);
    const dir = vector.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / dir.z;
    this.currenPosition = this.camera.position
      .clone()
      .add(dir.multiplyScalar(distance));

    const pos = this.particles.geometry.attributes.position;
    this.buttom = true;
    this.data.ease = 0.01;
  }

  onMouseUp() {
    this.buttom = false;
    this.data.ease = 0.05;
  }

  onMouseMove() {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  render(level) {
    const time = ((0.001 * performance.now()) % 12) / 12;
    const zigzagTime = (1 + Math.sin(time * 2 * Math.PI)) / 6;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObject(this.planeArea);

    if (intersects.length > 0) {
      const pos = this.particles.geometry.attributes.position;
      const copy = this.geometryCopy.attributes.position;
      const coulors = this.particles.geometry.attributes.customColor;
      const size = this.particles.geometry.attributes.size;

      const mx = intersects[0].point.x;
      const my = intersects[0].point.y;
      const mz = intersects[0].point.z;

      for (var i = 0, l = pos.count; i < l; i++) {
        const initX = copy.getX(i);
        const initY = copy.getY(i);
        const initZ = copy.getZ(i);

        let px = pos.getX(i);
        let py = pos.getY(i);
        let pz = pos.getZ(i);

        this.colorChange.setHSL(0.5, 1, 1);
        coulors.setXYZ(
          i,
          this.colorChange.r,
          this.colorChange.g,
          this.colorChange.b
        );
        coulors.needsUpdate = true;

        size.array[i] = this.data.particleSize;
        size.needsUpdate = true;

        let dx = mx - px;
        let dy = my - py;
        const dz = mz - pz;

        const mouseDistance = this.distance(mx, my, px, py);
        let d = (dx = mx - px) * dx + (dy = my - py) * dy;
        const f = -this.data.area / d;

        if (this.buttom) {
          const t = Math.atan2(dy, dx);
          px -= f * Math.cos(t);
          py -= f * Math.sin(t);

          this.colorChange.setHSL(0.5 + zigzagTime, 1.0, 0.5);
          coulors.setXYZ(
            i,
            this.colorChange.r,
            this.colorChange.g,
            this.colorChange.b
          );
          coulors.needsUpdate = true;

          if (
            px > initX + 70 ||
            px < initX - 70 ||
            py > initY + 70 ||
            py < initY - 70
          ) {
            this.colorChange.setHSL(0.15, 1.0, 0.5);
            coulors.setXYZ(
              i,
              this.colorChange.r,
              this.colorChange.g,
              this.colorChange.b
            );
            coulors.needsUpdate = true;
          }
        } else {
          if (mouseDistance < this.data.area) {
            if (i % 5 == 0) {
              const t = Math.atan2(dy, dx);
              px -= 0.03 * Math.cos(t);
              py -= 0.03 * Math.sin(t);

              this.colorChange.setHSL(0.15, 1.0, 0.5);
              coulors.setXYZ(
                i,
                this.colorChange.r,
                this.colorChange.g,
                this.colorChange.b
              );
              coulors.needsUpdate = true;

              size.array[i] = this.data.particleSize / 1.2;
              size.needsUpdate = true;
            } else {
              const t = Math.atan2(dy, dx);
              px += f * Math.cos(t);
              py += f * Math.sin(t);

              pos.setXYZ(i, px, py, pz);
              pos.needsUpdate = true;

              size.array[i] = this.data.particleSize * 1.3;
              size.needsUpdate = true;
            }

            if (
              px > initX + 10 ||
              px < initX - 10 ||
              py > initY + 10 ||
              py < initY - 10
            ) {
              this.colorChange.setHSL(0.15, 1.0, 0.5);
              coulors.setXYZ(
                i,
                this.colorChange.r,
                this.colorChange.g,
                this.colorChange.b
              );
              coulors.needsUpdate = true;

              size.array[i] = this.data.particleSize / 1.8;
              size.needsUpdate = true;
            }
          }
        }

        px += (initX - px) * this.data.ease;
        py += (initY - py) * this.data.ease;
        pz += (initZ - pz) * this.data.ease;

        pos.setXYZ(i, px, py, pz);
        pos.needsUpdate = true;
      }
    }
  }

  createText() {
    let thePoints = [];

    let shapes = this.font.generateShapes(this.data.text, this.data.textSize);
    let geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();

    const xMid =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    const yMid =
      (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2.85;

    geometry.center();

    let holeShapes = [];

    for (let q = 0; q < shapes.length; q++) {
      let shape = shapes[q];
      console.log(shape.holes && shape.holes.length > 0);

      if (shape.holes && shape.holes.length > 0) {
        for (let j = 0; j < shape.holes.length; j++) {
          let hole = shape.holes[j];
          holeShapes.push(hole);
        }
      }
    }
    shapes.push.apply(shapes, holeShapes);

    let colors = [];
    let sizes = [];

    for (let x = 0; x < shapes.length; x++) {
      let shape = shapes[x];

      const amountPoints =
        shape.type == "Path" ? this.data.amount / 2 : this.data.amount;

      let points = shape.getSpacedPoints(amountPoints);

      points.forEach((element, z) => {
        const a = new THREE.Vector3(element.x, element.y, 0);
        thePoints.push(a);
        colors.push(this.colorChange.r, this.colorChange.g, this.colorChange.b);
        sizes.push(1);
      });
    }

    let geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints);
    geoParticles.translate(xMid, yMid, 0);

    geoParticles.setAttribute(
      "customColor",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    geoParticles.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1)
    );

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xbd1218) },
        pointTexture: { value: this.particleImg },
      },
      vertexShader: require("./static/shaders/contact.vertex.glsl"),
      fragmentShader: require("./static/shaders/contact.fragment.glsl"),

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    this.particles = new THREE.Points(geoParticles, material);
    this.scene.add(this.particles);

    this.geometryCopy = new THREE.BufferGeometry();
    this.geometryCopy.copy(this.particles.geometry);
  }

  visibleHeightAtZDepth(depth, camera) {
    const cameraOffset = camera.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    const vFOV = (camera.fov * Math.PI) / 180;

    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
  }

  visibleWidthAtZDepth(depth, camera) {
    const height = this.visibleHeightAtZDepth(depth, camera);
    return height * camera.aspect;
  }

  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }
}
