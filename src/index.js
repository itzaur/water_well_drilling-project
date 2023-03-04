import "./styles/index.scss";
import Sketch from "./Sketch";
import { gsap, random } from "gsap";
import resources from "./resources.js";

const frame = document.querySelector(".slider");
const content = document.querySelector(".content");
const menuWrapper = document.querySelector(".menu-wrapper");
const contactWrapper = document.querySelector(".contact-wrapper");
// const menuItems = document.querySelectorAll(".menu__item");
const galleryTitleItems = document.querySelectorAll(".gallery__item-title h3");
const openMenuBtn = document.querySelector(".button-menu");
const closeMenuBtn = document.querySelectorAll(".button-close");
const overlayPath = document.querySelector(".overlay__path");

//Slider
const slider = document.querySelector(".slider");

const title = {
  main: document.querySelector(".content__title-main"),
  down: document.querySelector(".content__title-down"),
  bg: document.querySelector(".content__title-bg"),
  services: document.querySelector(".services__title"),
  services_name: document.querySelector(".services__title-name"),
  services_name_inner: document.querySelector(".services__title-name-inner"),
  menu: document.querySelector(".text-content"),
};

new Sketch("#background").init();
new Sketch(".slider").initSlider();
// new Sketch("#helicoid").initHelicoid();
// new Contact("#contact-app").init();

const sliderTrigger = document.querySelectorAll(".slider__link");
let isAnimating = false;

const openMenuAnimation = (e) => {
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
        if (e.target.dataset.title === "services") {
          menuWrapper.classList.add("menu-wrapper--open");
        } else {
          contactWrapper.classList.add("contact-wrapper--open");
          // new Sketch("#helicoid").initHelicoid();
        }
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
    .set(galleryTitleItems, {
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
      galleryTitleItems,
      {
        y: 0,
        startAt: { y: 150 },
        opacity: 1,
        stagger: 0.05,
        duration: 1.2,
        ease: "power4",
        clearProps: "transform",
      },
      ">-=1.2"
    )
    .to(
      "#contact-app canvas",
      {
        y: 0,
        startAt: { y: 150 },
        opacity: 1,
        duration: 1.2,
        ease: "power4",
      },
      "< 0"
    );
};

const closeMenuAnimation = (e) => {
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
        contactWrapper.classList.remove("contact-wrapper--open");
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
      galleryTitleItems,
      {
        y: 200,
        opacity: 0,
        stagger: -0.05,
        duration: 0.8,
        ease: "power2.in",
      },
      0
    )
    .to(
      "#contact-app canvas",
      {
        y: 200,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
      },
      "< 0"
    );
};

// openMenuBtn.addEventListener("click", openMenuAnimation);
closeMenuBtn.forEach((btn) => {
  btn.addEventListener("click", closeMenuAnimation);
});

sliderTrigger.forEach((btn) => {
  btn.addEventListener("click", openMenuAnimation);
});

title.services.addEventListener("mouseenter", () => {
  gsap
    .timeline({
      defaults: {
        duration: 0.6,
        ease: "expo",
      },
    })
    .addLabel("start", 0)
    .set(
      title.services_name_inner,
      {
        transformOrigin: "0% 50%",
      },
      "start"
    )
    .to(
      title.services_name_inner,
      {
        startAt: { filter: "blur(0px)" },
        duration: 0.2,
        ease: "power1.in",
        yPercent: -100,
        rotation: -4,
        filter: "blur(6px)",
      },
      "start"
    )
    .to(
      title.services_name_inner,
      {
        startAt: { yPercent: 100, rotation: 4, filter: "blur(6px)" },
        yPercent: 0,
        rotation: 0,
        filter: "blur(0px)",
      },
      "start+=0.2"
    );
});

//ANCHOR Gallery
const gallery = document.querySelector(".gallery");
const galleryItem = document.querySelectorAll(".gallery__item");

let isActive = false;

const galleryTextBox = document.querySelector(".text-content");
const textIds = resources.filter((text) => text.title);
let newElement;

for (let i = 0; i < textIds.length; i++) {
  newElement = document.createElement("div");
  newElement.innerHTML = `${textIds[i].title}`;
  newElement.classList.add(`append`);
  newElement.setAttribute("data-num", i);
  galleryItem[i].appendChild(newElement);
}

const gallerySubtitle = document.querySelector(".gallery__item-subtitle");
const galleryText = gsap.utils.toArray(".append");
const galleryItems = gsap.utils.toArray(".gallery__item");
const animations = galleryText.map(createAnimation);

galleryItems.forEach((item) => {
  item.addEventListener("click", toggleAnimations);
});

function toggleAnimations(event) {
  let target = this;

  // const sibling = target.nextElementSibling;
  // sibling.classList.toggle("sibling-element");

  const allOtherImages = galleryItems.filter((img) => img !== target);
  allOtherImages.forEach((img) => {
    img.classList.remove("active");
    // const otherSiblings = img.nextElementSibling;
    // otherSiblings.classList.remove("sibling-element");
  });
  target.classList.toggle("active");

  animations.forEach(function (animation, i) {
    animation(target);
  });

  const index = target.children[0].dataset.num;

  galleryText[index].classList.toggle("active");

  // event.currentTarget.clicked = !event.currentTarget.clicked;
  // if (event.currentTarget.clicked) {
  //   console.log("e.currentTarget clicked");
  //   target.classList.add("active");
  // } else {
  //   console.log("e.currentTarget not clicked");
  //   target.classList.remove("active");
  // }

  // target.scrollIntoView({ behavior: "smooth" });
}

function createAnimation(element) {
  // const splitTextElement = new SplitText(element, {
  //   type: "words",
  //   wordsClass: "word++",
  //   wordDelimiter: "\n",
  //   // reduceWhiteSpace: false,
  // });
  // const numWords = splitTextElement.words.length;

  const animation = gsap.timeline().reverse();

  animation.from(element.children, 0.6, {
    rotationX: -120,
    transformOrigin: "top center -150",
    ease: "power3.out",
    autoAlpha: 0,
    stagger: 0.1,
    onStart: () => {
      animation.timeScale(1);
    },
    onComplete: () => {
      animation.timeScale(2);
    },
  });

  const text = element.dataset.num;

  return function (target) {
    const reversed =
      target.children[0].dataset.num !== text ? true : !animation.reversed();
    animation.reversed(reversed);
  };
}

/*
 * Stop transition
 */
function stopTransitionOnResize() {
  const classes = document.body.classList;
  let timer = 0;
  window.addEventListener("resize", function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    } else classes.add("stop-transitions");

    timer = setTimeout(() => {
      classes.remove("stop-transitions");
      timer = null;
    }, 100);
  });
}

stopTransitionOnResize();

export { title };
