const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path: '../../.env' });

const base = require('../../webpack.config.base.js');

module.exports = {
  ...base,
  entry: './src/index.ts',
  target: 'web',
  plugins: [
    new webpack.EnvironmentPlugin([
      'AUTH_ROOT_SEGMENT'
    ]),
  ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
};