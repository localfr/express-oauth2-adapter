const dotenv = require('dotenv');
const server = require('@localfr/auth-express-router/dist/server');

dotenv.config({ path: '../../.env' });

module.exports = () => {
  global.server = server.server;
}