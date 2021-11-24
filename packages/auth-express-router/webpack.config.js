const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path: '../../.env' });

const base = require('../../webpack.config.base');

module.exports = [
  {
    ...base,
    entry: './src/index.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
  {
    ...base,
    entry: './src/server.ts',
    output: {
      filename: 'server.js',
      path: path.resolve(__dirname, 'dist'),
    },
  }
];