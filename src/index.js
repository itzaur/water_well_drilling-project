import "./styles/index.scss";

//ANCHOR Webpack import all images
function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("../src/images", false, /\.(png|jpe?g|gif|svg|webp)$/)
);

const frame = document.querySelector(".frame");
const content = document.querySelector(".content");
const menuWrapper = document.querySelector(".menu-wrapper");
const menuItems = document.querySelectorAll(".menu__item");
console.log(menuItems);
const openMenuBtn = document.querySelector(".button-menu");
const closeMenuBtn = document.querySelector(".button-close");
const overlayPath = document.querySelector(".overlay__path");

const title = {
  main: document.querySelector(".content__title-main"),
  down: document.querySelector(".content__title-down"),
  bg: document.querySelector(".content__title-bg"),
};

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
      [title.main, title.down, title.bg],
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
      [title.main, title.down, title.bg],
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

openMenuBtn.addEventListener("click", openMenuAnimation);
closeMenuBtn.addEventListener("click", closeMenuAnimation);
