const path = require("path")
const externals = require('webpack-node-externals');

module.exports = {
  mode: "development",
  target: 'node',
  devtool: "inline-source-map",
  externals: [externals()],
  entry: {
    'index': path.resolve(__dirname, './src/index.ts'),
    'server': path.resolve(__dirname, './src/server.ts'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
}