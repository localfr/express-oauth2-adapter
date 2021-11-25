"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../../.env' });
const index_1 = require("./index");
const AUTH_SERVER_HOST = process.env.AUTH_SERVER_HOST || 'localhost';
const AUTH_SERVER_PORT = process.env.AUTH_SERVER_PORT || 3000;
const AUTH_ROOT_SEGMENT = process.env.AUTH_ROOT_SEGMENT || '/auth';
exports.app = express_1.default();
exports.app.use(body_parser_1.default.json());
exports.server = (async () => {
    await index_1.register(AUTH_ROOT_SEGMENT, exports.app);
    await new Promise((resolve) => {
        const server = exports.app.listen(AUTH_SERVER_PORT, () => {
            console.log('Running at %s:%s...', AUTH_SERVER_HOST, AUTH_SERVER_PORT);
            resolve(server);
        });
    });
})();
process.on('uncaughtException', function (err) {
    console.error(err.message);
    process.exit();
});
exports.default = exports.server;
//# sourceMappingURL=server.js.map