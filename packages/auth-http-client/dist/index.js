"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_module_types_1 = require("@localfr/auth-module-types");
class HttpClient {
    constructor($http) {
        this.$http = $http;
    }
    async health() {
        const response = await this.$http.get(auth_module_types_1.endpointsUrls._HEALTH);
        return response.data;
    }
    async login(username, password) {
        const response = await this.$http.post(auth_module_types_1.endpointsUrls.GENERATE_USER_TOKEN, { username, password });
        return response.data;
    }
    async refresh(access_token, refresh_token, token_type) {
        const response = await this.$http.request({
            method: auth_module_types_1.EndpointMethods.REFRESH_USER_TOKEN,
            url: auth_module_types_1.endpointsUrls.REFRESH_USER_TOKEN,
            data: { access_token, refresh_token, token_type },
        });
        return response.data;
    }
    async findUserByEmail(email) {
        const response = await this.$http.request({
            method: auth_module_types_1.EndpointMethods.FIND_USER_BY_EMAIL,
            url: auth_module_types_1.endpointsUrls.FIND_USER_BY_EMAIL,
            data: { email },
        });
        return response.data;
    }
    async sendPasswordResetLink(email) {
        const response = await this.$http.request({
            method: auth_module_types_1.EndpointMethods.SEND_PWD_LINK,
            url: auth_module_types_1.endpointsUrls.SEND_PWD_LINK,
            data: { email },
        });
        return response.data;
    }
}
exports.default = HttpClient;
//# sourceMappingURL=index.js.map