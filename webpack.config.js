const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const loader = require("sass-loader");

let mode = "development";
// let target = "web";

if (process.env.NODE_ENV === "production") {
  mode = "production";
  //   target = "browserslist";
}

module.exports = {
  mode: mode,
  //   target: target,
  output: {
    assetModuleFilename: "images/[hash][ext][query]",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)/i,
        type: "asset/resource",
      },
    ],
  },

  plugins: [new MiniCssExtractPlugin()],

  devtool: "source-map",
  devServer: {
    static: "./dist",
    // hot: true,
  },
};
