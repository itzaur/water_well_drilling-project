import "./styles/index.scss";

//ANCHOR Webpack import all images
function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("../src/images", false, /\.(png|jpe?g|gif|svg|webp)$/)
);

console.log("Hello");
console.log("go next");
