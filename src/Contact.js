import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

export default class Contact {
  constructor(container) {
    this.container = document.querySelector(container);

    //Sizes
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    //Parameters
    this.config = {
      text: "+372 29 457 25 41 \n \n water@gmail.com",
      amount: 500,
      particleSize: 1.2,
      // particleColor: 0x64321e,
      contactPageTextColor: 0xfebd50,
      // contactPageTextColor: 0xd7acd2,
      textSize: 20,
      area: 150,
      ease: 0.05,
    };
    this.colorChange = new THREE.Color();
    this.buttom = false;

    this.material = null;

    this.resize = () => this.onResize();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createControls();
    this.createLoaders();
    this.loadTexture();
    this.createParticles();
    this.createRaycaster();
    this.checkMobile();

    this.loadFont().then(() => {
      this.addlisteners();

      this.renderer.setAnimationLoop(() => {
        this.update();
        this.render();
        this.renderText();
      });
    });
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 100);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.maxDistance = 250;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);
  }

  createLoaders() {
    this.loadingManager = new THREE.LoadingManager();
    this.fontLoader = new FontLoader(this.loadingManager);

    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
  }

  loadTexture() {
    this.particleTexture = this.textureLoader.load(
      "https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png"
    );
  }

  loadFont() {
    return new Promise((resolve) => {
      this.fontLoader.load("fonts/RussoOne.json", (font) => {
        console.log("font loaded");

        let thePoints = [];

        let shapes = font.generateShapes(
          this.config.text,
          this.config.textSize
        );

        let geometry = new THREE.ShapeGeometry(shapes);

        geometry.computeBoundingBox();

        const xMiddle =
          -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        const yMiddle =
          (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2.85;

        geometry.center();

        let holeShapes = [];

        for (let i = 0; i < shapes.length; i++) {
          let shape = shapes[i];

          if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
              let hole = shape.holes[j];
              holeShapes.push(hole);
            }
          }
        }

        //   shapes.push.apply(shapes, holeShapes);
        shapes.push(...holeShapes);

        let colors = [];
        let sizes = [];

        for (let q = 0; q < shapes.length; q++) {
          let shape = shapes[q];

          const amountPoints =
            shape.type == "Path" ? this.config.amount / 2 : this.config.amount;

          let points = shape.getSpacedPoints(amountPoints);

          points.forEach((point) => {
            const vector = new THREE.Vector3(point.x, point.y, 0);
            thePoints.push(vector);
            colors.push(
              this.colorChange.r,
              this.colorChange.g,
              this.colorChange.b
            );
            sizes.push(1);
          });
        }

        let geometryParticles = new THREE.BufferGeometry().setFromPoints(
          thePoints
        );
        geometryParticles.translate(xMiddle, yMiddle, 0);

        geometryParticles.setAttribute(
          "customColor",
          new THREE.Float32BufferAttribute(colors, 3)
        );
        geometryParticles.setAttribute(
          "size",
          new THREE.Float32BufferAttribute(sizes, 1)
        );

        this.material = new THREE.ShaderMaterial({
          vertexShader: require("./static/shaders/contact.vertex.glsl"),
          fragmentShader: require("./static/shaders/contact.fragment.glsl"),
          uniforms: {
            color: { value: new THREE.Color(this.config.contactPageTextColor) },
            pointTexture: { value: this.particleTexture },
          },
          transparent: true,
          depthTest: false,
          blending: THREE.AdditiveBlending,
        });

        this.particles = new THREE.Points(geometryParticles, this.material);
        this.scene.add(this.particles);

        this.geometryCopy = new THREE.BufferGeometry();
        this.geometryCopy.copy(this.particles.geometry);
      }),
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (err) {
          console.log(err, "An error happened");
        };
      resolve();
    });
  }

  createParticles() {
    this.geometryParticles = new THREE.PlaneGeometry(
      this.visibleWidthAtZDepth(100, this.camera),
      this.visibleHeightAtZDepth(100, this.camera)
    );

    this.materialParticles = new THREE.MeshBasicMaterial({
      transparent: true,
      color: 0x00ff00,
      //   wireframe: true,
    });

    this.planeArea = new THREE.Mesh(
      this.geometryParticles,
      this.materialParticles
    );
    this.planeArea.visible = false;

    // this.scene.add(this.planeArea);
  }

  createRaycaster() {
    this.mouse = new THREE.Vector2(-200, 200);

    this.raycaster = new THREE.Raycaster();
    this.intersects = [];
    // this.point = new THREE.Vector3()
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

  update() {
    this.controls.update();

    this.camera.position.z = this.isMobile ? 300 : 130;
  }

  renderText() {
    const time = ((0.001 * performance.now()) % 12) / 12;
    const zigzagTime = (1 + Math.sin(time * 2 * Math.PI)) / 6;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObject(this.planeArea);

    if (this.intersects.length > 0) {
      if (this.geometryCopy == undefined) return;
      const copy = this.geometryCopy.attributes.position;

      //   const position = this.particles.geometry.attributes.position;
      //   const customColor = this.particles.geometry.attributes.customColor;
      //   const size = this.particles.geometry.attributes.size;

      const { position, customColor, size } =
        this.particles.geometry.attributes;

      const mx = this.intersects[0]?.point.x || 0;
      const my = this.intersects[0]?.point.y || 0;
      const mz = this.intersects[0]?.point.z || 0;

      for (let i = 0; i < position.count; i++) {
        const initX = copy.getX(i);
        const initY = copy.getY(i);
        const initZ = copy.getZ(i);

        let px = position.getX(i);
        let py = position.getY(i);
        let pz = position.getZ(i);

        this.colorChange.setHSL(0.5, 1, 1);
        customColor.setXYZ(
          i,
          this.colorChange.r,
          this.colorChange.g,
          this.colorChange.b
        );
        customColor.needsUpdate = true;

        size.array[i] = this.config.particleSize;
        size.needsUpdate = true;

        ///////////
        let dx = mx - px;
        let dy = my - py;
        const dz = mz - pz;

        const mouseDistance = this.distance(mx, my, px, py);

        // console.log(mouseDistance);

        let d = (dx = mx - px) * dx + (dy = my - py) * dy;
        const f = -this.config.area / d;

        if (this.buttom) {
          const t = Math.atan2(dy, dx);
          px -= f * Math.cos(t);
          py -= f * Math.sin(t);

          this.colorChange.setHSL(0.5 + zigzagTime, 1.0, 0.5);
          customColor.setXYZ(
            i,
            this.colorChange.r,
            this.colorChange.g,
            this.colorChange.b
          );
          customColor.needsUpdate = true;

          if (
            px > initX + 70 ||
            px < initX - 70 ||
            py > initY + 70 ||
            py < initY - 70
          ) {
            this.colorChange.setHSL(0.15, 1.0, 0.5);
            customColor.setXYZ(
              i,
              this.colorChange.r,
              this.colorChange.g,
              this.colorChange.b
            );
            customColor.needsUpdate = true;
          }
        } else {
          if (mouseDistance < this.config.area) {
            if (i % 5 == 0) {
              const t = Math.atan2(dy, dx);
              px -= 0.03 * Math.cos(t);
              py -= 0.03 * Math.sin(t);

              this.colorChange.setHSL(0.15, 1.0, 0.5);
              customColor.setXYZ(
                i,
                this.colorChange.r,
                this.colorChange.g,
                this.colorChange.b
              );
              customColor.needsUpdate = true;

              size.array[i] = this.config.particleSize / 1.2;
              size.needsUpdate = true;
            } else {
              const t = Math.atan2(dy, dx);
              px += f * Math.cos(t);
              py += f * Math.sin(t);

              position.setXYZ(i, px, py, pz);
              position.needsUpdate = true;

              size.array[i] = this.config.particleSize * 1.3;
              size.needsUpdate = true;
            }

            if (
              px > initX + 10 ||
              px < initX - 10 ||
              py > initY + 10 ||
              py < initY - 10
            ) {
              this.colorChange.setHSL(0.15, 1.0, 0.5);
              customColor.setXYZ(
                i,
                this.colorChange.r,
                this.colorChange.g,
                this.colorChange.b
              );
              customColor.needsUpdate = true;

              size.array[i] = this.config.particleSize / 1.8;
              size.needsUpdate = true;
            }
          }
        }

        px += (initX - px) * this.config.ease;
        py += (initY - py) * this.config.ease;
        pz += (initZ - pz) * this.config.ease;

        position.setXYZ(i, px, py, pz);
        position.needsUpdate = true;
      }
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 568;
  }

  addlisteners() {
    window.addEventListener("resize", this.resize, { passive: true });
    window.addEventListener("mousemove", this.onMousemove.bind(this));
    // window.addEventListener("mousedown", this.onMousedown.bind(this));
    // window.addEventListener("mouseup", this.onMouseup.bind(this));
  }

  onResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.checkMobile();
  }

  onMousemove(e) {
    this.mouse.x = (e.clientX / this.width) * 2 - 1;
    this.mouse.y = -((e.clientY / this.height) * 2 - 1);
  }

  //   onMousedown(e) {
  //     console.log("mousedown");
  //     this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  //     this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  //     const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
  //     vector.unproject(this.camera);
  //     const dir = vector.sub(this.camera.position).normalize();
  //     const distance = -this.camera.position.z / dir.z;
  //     this.currenPosition = this.camera.position
  //       .clone()
  //       .add(dir.multiplyScalar(distance));

  //     const pos = this.particles.geometry.attributes.position;
  //     this.buttom = true;
  //     this.config.ease = 0.01;
  //   }

  //   onMouseup(e) {
  //     console.log("mouseup");
  //     this.buttom = false;
  //     this.config.ease = 0.05;
  //   }
}
