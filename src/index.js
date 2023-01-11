import "./styles/index.scss";

//ANCHOR Webpack import all images
// function importAll(r) {
//   return r.keys().map(r);
// }

// const images = importAll(
//   require.context("../src/images", false, /\.(png|jpe?g|gif|svg|webp)$/)
// );

const frame = document.querySelector(".slider");
const content = document.querySelector(".content");
const menuWrapper = document.querySelector(".menu-wrapper");
const menuItems = document.querySelectorAll(".menu__item");
// console.log(menuItems);
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
const sliderItem = document.querySelector(".slider__list");
let count = 0;

title.services.addEventListener("click", (e) => {
  count++;
  sliderItem.style.rotate = `${count * -90}deg`;
});
