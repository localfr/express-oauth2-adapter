"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const index_1 = __importDefault(require("./index"));
describe('', () => {
    let client;
    beforeAll(() => {
        const axios = axios_1.default.create({ baseURL: `http://${process.env.AUTH_SERVER_HOST}:${process.env.AUTH_SERVER_PORT}` + process.env.AUTH_ROOT_SEGMENT });
        client = new index_1.default(axios);
    });
    it('Should return expected response', async () => {
        const health = await client.health();
        expect(health).toHaveProperty('success', true);
    });
    it('Should return user token', async () => {
        const response = await client.login('david.smile@local.test', 'password');
        expect(response).toHaveProperty('access_token');
    });
});
//# sourceMappingURL=index.test.js.map