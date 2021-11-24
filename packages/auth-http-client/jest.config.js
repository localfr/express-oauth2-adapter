const pkg = require('./package.json');
const base = require("../../jest.config.base.js");
module.exports = {
  ...base,
  name: pkg.name,
  globalSetup: './jest.setup.js',
  globalTeardown: './jest.teardown.js',
}