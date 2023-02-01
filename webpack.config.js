const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

let mode = "development";
// let target = "web";

if (process.env.NODE_ENV === "production") {
  mode = "production";
  //   target = "browserslist";
}

module.exports = {
  mode: mode,
  devtool: "source-map",
  //   target: target,
  entry: {
    main: "./src/index.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    // assetModuleFilename: "images/[name].[ext][query]",
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
        generator: {
          filename: "assets/images/[hash][ext]",
          // filename: "images/[name].[ext]",
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          // filename: "fonts/[name].[ext]",
          filename: "assets/fonts/[hash][ext]",
        },
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/i,
        type: "asset/source",
      },
    ],
  },

  devServer: {
    static: "./dist",
    hot: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "./src/static") }],
    }),
  ],
};
