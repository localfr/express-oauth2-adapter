"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    localfr: {
        api: {
            baseUrl: (process.env.LOCALFR_API_BASE_URL || '').replace(/\/$/, ''),
            tokenEndpoint: process.env.LOCALFR_API_TOKEN_ENDPOINT || '/oauth/token',
            usersEndpoint: process.env.LOCALFR_API_USERS_ENDPOINT || '/users',
            resetPasswordEndpoint: process.env.LOCALFR_API_USERS_ENDPOINT || '/emails/reset-password',
            oauth2: {
                tokenUri: process.env.LOCALFR_API_OAUTH2_TOKEN_URI || '/oauth/v2/token',
                clientId: process.env.LOCALFR_API_OAUTH2_CLIENT_ID,
                clientSecret: process.env.LOCALFR_API_OAUTH2_CLIENT_SECRET,
                publicKey: process.env.LOCALFR_API_OAUTH2_PUBLIC_KEY
            }
        }
    },
};
//# sourceMappingURL=env.js.map