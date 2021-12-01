"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshApiToken = exports._refreshTimeout = exports.ttl = exports.client = exports._state = void 0;
const client_oauth2_1 = __importDefault(require("client-oauth2"));
exports._state = {
    tokenType: '',
    accessToken: '',
    expiresTime: 0,
    get expiresAt() {
        return new Date(this.expiresTime);
    },
};
exports.client = new client_oauth2_1.default({
    clientId: String(process.env.LOCALFR_API_OAUTH2_CLIENT_ID),
    clientSecret: String(process.env.LOCALFR_API_OAUTH2_CLIENT_SECRET),
    accessTokenUri: String(process.env.LOCALFR_API_BASE_URL) + String(process.env.LOCALFR_API_OAUTH2_TOKEN_URI),
});
function ttl(date) {
    return Math.floor((Date.parse(date) - Date.now()) / 1000);
}
exports.ttl = ttl;
async function refreshApiToken() {
    console.debug('refreshing token...');
    exports._refreshTimeout && clearTimeout(exports._refreshTimeout);
    return exports.client
        .credentials
        .getToken()
        .then(response => {
        console.debug('access_token successfully negociated.');
        const { token_type, expires_in, access_token } = response.data;
        const ttl = ((+expires_in - 1) * 1000);
        exports._state.tokenType = token_type;
        exports._state.accessToken = access_token;
        exports._state.expiresTime = Date.now() + ttl;
        exports._refreshTimeout = setTimeout(refreshApiToken, ttl);
        console.debug('access_token will be refreshed in %s seconds.', ttl / 1000);
        return exports._state;
    });
}
exports.refreshApiToken = refreshApiToken;
//# sourceMappingURL=ClientOAuth2.js.map