const externals = require('webpack-node-externals');
module.exports = {
  mode: process.env.NODE_ENV || 'development',
  target: 'node',
  externalsPresets: { node: true },
  externals: [externals()],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /\.(test)\.ts$/]
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
}