module.exports = {
  mode: process.env.NODE_ENV || 'development',
  target: 'node',
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