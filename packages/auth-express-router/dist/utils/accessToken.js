"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const jose_1 = require("jose");
const env_1 = __importDefault(require("../env"));
const verify = async (token) => {
    return jose_1.jwtVerify(token, await jose_1.importSPKI(String(env_1.default.localfr.api.oauth2.publicKey), 'ES256'), { audience: env_1.default.localfr.api.oauth2.clientId });
};
exports.verify = verify;
//# sourceMappingURL=accessToken.js.map