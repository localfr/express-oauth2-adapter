"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const index_1 = require("./index");
const path_to_regexp_1 = require("path-to-regexp");
describe('', () => {
    let axios;
    beforeAll(() => {
        axios = axios_1.default.create({
            baseURL: `http://${process.env.AUTH_SERVER_HOST}:${process.env.AUTH_SERVER_PORT}${process.env.AUTH_ROOT_SEGMENT}`
        });
    });
    it('Should return access_token', async () => {
        const { method, path } = index_1.handlers.GENERATE_USER_TOKEN;
        const response = await axios.request({ method: method, url: path, data: { username: 'david.smile@local.test', password: 'password' } });
        expect(response.data).toHaveProperty('token_type');
        expect(response.data).toHaveProperty('access_token');
        expect(response.data).toHaveProperty('refresh_token');
        expect(response.data).toHaveProperty('expires_in');
    });
    it('Should return error', async () => {
        const { method, path } = index_1.handlers.GENERATE_USER_TOKEN;
        try {
            await axios.request({ method: method, url: path, data: { username: 'user', password: 'pass' } });
        }
        catch (e) {
            expect(e.response.status).toBe(401);
        }
    });
    it('Should return user', async () => {
        const { method, path } = index_1.handlers.FIND_USER_BY_EMAIL;
        const url = path_to_regexp_1.compile(path)({ email: 'david.smile@local.test' });
        try {
            const response = await axios.request({ method: method, url });
            expect(response.status).toBe(200);
        }
        catch (e) {
            expect(e.response.status).toBeGreaterThanOrEqual(400);
            expect(e.response.status).toBeLessThan(500);
        }
    });
    it('Should return 400', async () => {
        const { method, path } = index_1.handlers.FIND_USER_BY_EMAIL;
        const url = path_to_regexp_1.compile(path)({ email: 'isNotAnEmail' });
        try {
            await axios.request({ method: method, url });
        }
        catch (e) {
            expect(e.response.status).toBe(400);
        }
    });
    it('Should send password reset', async () => {
        const { method, path } = index_1.handlers.SEND_PWD_LINK;
        try {
            const response = await axios.request({ method: method, url: path, data: { email: 'david.smile@local.test' } });
            expect(response.status).toBe(200);
        }
        catch (e) {
            expect(e.response.status).toBe(404);
        }
    });
    describe('', () => {
        let state;
        beforeEach(async () => {
            const { method, path } = index_1.handlers.GENERATE_USER_TOKEN;
            const response = await axios.request({ method: method, url: path, data: { username: 'david.smile@local.test', password: 'password' } });
            state = response.data;
        });
        it('Should refresh user token', async () => {
            const { method, path } = index_1.handlers.REFRESH_USER_TOKEN;
            const { access_token, refresh_token, token_type } = state;
            const response = await axios.request({ method: method, url: path, data: { user: { access_token, refresh_token, token_type } } });
            expect(response.data).toHaveProperty('data.token_type');
            expect(response.data).toHaveProperty('data.access_token');
            expect(response.data).toHaveProperty('data.refresh_token');
            expect(response.data).toHaveProperty('data.expires_in');
        });
        it('Should return error', async () => {
            const { method, path } = index_1.handlers.REFRESH_USER_TOKEN;
            try {
                await axios.request({ method: method, url: path, data: { user: { access_token: 'access_token', refresh_token: 'refresh_token', token_type: 'token_type' } } });
            }
            catch (e) {
                expect(e.response.status).toBe(401);
            }
        });
    });
});
//# sourceMappingURL=index.test.js.map