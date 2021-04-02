const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const srcPath = path.resolve(__dirname, "src");
const distPath = path.resolve(__dirname, "dist");
const publicPath = path.resolve(__dirname, "public");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: "0.0.0.0",
    contentBase: [distPath, publicPath],
    compress: true,
    port: 9000,
  },
  entry: path.resolve(srcPath, "index.ts"),
  output: {
    path: distPath,
    filename: "bundle.[contenthash].js",
    clean: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "public" }],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(srcPath, "index.html"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.ts$/i,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".scss", ".css"],
  },
};
