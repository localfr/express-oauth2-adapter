/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ClientOAuth2.ts":
/*!*****************************!*\
  !*** ./src/ClientOAuth2.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.refreshApiToken = exports._refreshTimeout = exports.ttl = exports.client = exports._state = void 0;
const client_oauth2_1 = __importDefault(__webpack_require__(/*! client-oauth2 */ "client-oauth2"));
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
    });
}
exports.refreshApiToken = refreshApiToken;


/***/ }),

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = {
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


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.register = exports.handlers = void 0;
const axios_1 = __importDefault(__webpack_require__(/*! axios */ "axios"));
const express_1 = __webpack_require__(/*! express */ "express");
const email_validator_1 = __webpack_require__(/*! email-validator */ "email-validator");
const auth_module_types_1 = __webpack_require__(/*! @localfr/auth-module-types */ "@localfr/auth-module-types");
const ClientOAuth2_1 = __webpack_require__(/*! ./ClientOAuth2 */ "./src/ClientOAuth2.ts");
const config_1 = __importDefault(__webpack_require__(/*! ./config */ "./src/config/index.ts"));
async function findUser(email) {
    const url = `${config_1.default.localfr.api.baseUrl}/api${config_1.default.localfr.api.usersEndpoint}`;
    const params = {
        params: { email, active: true },
        headers: {
            'Authorization': `${ClientOAuth2_1._state.tokenType} ${ClientOAuth2_1._state.accessToken}`,
            'Content-type': 'application/ld+json'
        }
    };
    return axios_1.default
        .get(url, params)
        .then(response => {
        const count = response.data['hydra:totalItems'];
        if (0 === count) {
            return;
        }
        const results = response.data['hydra:member'];
        let user;
        if (1 === count) {
            user = results[0];
        }
        else {
            return results.find((item) => email === item.email);
        }
    });
}
async function resetPassword(userId) {
    const url = `${config_1.default.localfr.api.baseUrl}/api${config_1.default.localfr.api.resetPasswordEndpoint}`;
    const body = { userId };
    const headers = {
        'Authorization': `${ClientOAuth2_1._state.tokenType} ${ClientOAuth2_1._state.accessToken}`,
        'Content-type': 'application/json'
    };
    return axios_1.default.post(url, body, { headers });
}
exports.handlers = {
    [auth_module_types_1.Endpoint._HEALTH]: {
        method: auth_module_types_1.EndpointMethods._HEALTH,
        path: auth_module_types_1.endpointsUrls._HEALTH,
        async handler(req, res) {
            return res.json({ success: true });
        }
    },
    [auth_module_types_1.Endpoint.GENERATE_USER_TOKEN]: {
        method: 'post',
        path: auth_module_types_1.endpointsUrls.GENERATE_USER_TOKEN,
        async handler(req, res) {
            const data = req.body;
            return ClientOAuth2_1.client
                .owner
                .getToken(data.username, data.password)
                .then(user => res.send(user.data))
                .catch(error => res.status(401).send(error));
        }
    },
    [auth_module_types_1.Endpoint.REFRESH_USER_TOKEN]: {
        method: auth_module_types_1.EndpointMethods.REFRESH_USER_TOKEN,
        path: auth_module_types_1.endpointsUrls.REFRESH_USER_TOKEN,
        async handler(req, res) {
            if (!('user' in req.body)) {
                return res.status(400).send();
            }
            const data = req.body;
            const token = ClientOAuth2_1.client.createToken(data.user.access_token, data.user.refresh_token, data.user.token_type);
            return token
                .refresh()
                .then(response => {
                const { expires_in } = response.data;
                // fix-me: "expires" est-il vraiment nécessaire ?
                return res.send({ data: response.data, expires: expires_in });
            })
                .catch(error => res.status(401).send(error));
        }
    },
    [auth_module_types_1.Endpoint.FIND_USER_BY_EMAIL]: {
        method: auth_module_types_1.EndpointMethods.FIND_USER_BY_EMAIL,
        path: auth_module_types_1.endpointsUrls.FIND_USER_BY_EMAIL,
        async handler(req, res) {
            const email = req.params.email;
            if (!email_validator_1.validate(email)) {
                return res.status(400).send({
                    status: 400,
                    statusText: 'Bad Request',
                    message: 'Invalid email input.'
                });
            }
            return findUser(email)
                .then(user => user ? res.json(user) : res.status(404).send(`No user found with email ${email}.`))
                .catch(error => res.status(error.response.status).json(error.response.data));
        }
    },
    [auth_module_types_1.Endpoint.SEND_PWD_LINK]: {
        method: auth_module_types_1.EndpointMethods.SEND_PWD_LINK,
        path: auth_module_types_1.endpointsUrls.SEND_PWD_LINK,
        async handler(req, res) {
            const email = req.body.email;
            if (!email) {
                return res.status(400).send('Missing email !');
            }
            if (!email_validator_1.validate(email)) {
                return res.status(400).send({
                    status: 400,
                    statusText: 'Bad Request',
                    message: 'Invalid email input.'
                });
            }
            return findUser(email)
                .then(user => {
                if (!user) {
                    return res.status(404).send();
                }
                return resetPassword(user.id)
                    .then(response => res.json(response.data));
            })
                .catch(error => res.status(error.response.status).json(error.response.data));
        }
    }
};
function register(root, app, actives) {
    // Création du routeur express
    const router = express_1.Router();
    // Activation des urls demandés
    (actives || auth_module_types_1.allEndpoints).forEach(endpoint => {
        const { method, path, handler } = exports.handlers[endpoint];
        console.log('registering %s, %s %s', endpoint, method, path);
        router[method](path, handler);
    });
    // Démarrage de la routine de vérification du token de l'api
    // Mise en place du router dans l'application
    return ClientOAuth2_1.refreshApiToken().then(() => app.use(root, router));
}
exports.register = register;
;


/***/ }),

/***/ "@localfr/auth-module-types":
/*!*********************************************!*\
  !*** external "@localfr/auth-module-types" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("@localfr/auth-module-types");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "client-oauth2":
/*!********************************!*\
  !*** external "client-oauth2" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("client-oauth2");

/***/ }),

/***/ "email-validator":
/*!**********************************!*\
  !*** external "email-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("email-validator");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUQsU0FBZ0IsUUFBUSxDQUFDLElBQVksRUFBRSxHQUFZLEVBQUUsT0FBb0I7SUFDdkUsOEJBQThCO0lBQzlCLE1BQU0sTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztJQUN4QiwrQkFBK0I7SUFDL0IsQ0FBQyxPQUFPLElBQUksZ0NBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUMzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxnQkFBUSxDQUFFLFFBQVEsQ0FBRSxDQUFDO1FBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUUsTUFBTSxDQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsNERBQTREO0lBQzVELDZDQUE2QztJQUM3QyxPQUFPLDhCQUFlLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBWkQsNEJBWUM7QUFBQSxDQUFDOzs7Ozs7Ozs7OztBQ2pKRjs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGxvY2FsZnIvYXV0aC1leHByZXNzLXJvdXRlci8uL3NyYy9DbGllbnRPQXV0aDIudHMiLCJ3ZWJwYWNrOi8vQGxvY2FsZnIvYXV0aC1leHByZXNzLXJvdXRlci8uL3NyYy9jb25maWcvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGxvY2FsZnIvYXV0aC1leHByZXNzLXJvdXRlci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL2V4dGVybmFsIGNvbW1vbmpzIFwiQGxvY2FsZnIvYXV0aC1tb2R1bGUtdHlwZXNcIiIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL2V4dGVybmFsIGNvbW1vbmpzIFwiYXhpb3NcIiIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL2V4dGVybmFsIGNvbW1vbmpzIFwiY2xpZW50LW9hdXRoMlwiIiwid2VicGFjazovL0Bsb2NhbGZyL2F1dGgtZXhwcmVzcy1yb3V0ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJlbWFpbC12YWxpZGF0b3JcIiIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL2V4dGVybmFsIGNvbW1vbmpzIFwiZXhwcmVzc1wiIiwid2VicGFjazovL0Bsb2NhbGZyL2F1dGgtZXhwcmVzcy1yb3V0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGxvY2FsZnIvYXV0aC1leHByZXNzLXJvdXRlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0Bsb2NhbGZyL2F1dGgtZXhwcmVzcy1yb3V0ZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0Bsb2NhbGZyL2F1dGgtZXhwcmVzcy1yb3V0ZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnRPQXV0aDIgZnJvbSAnY2xpZW50LW9hdXRoMic7XG5cbnR5cGUgU3RhdGUgPSB7XG4gIHRva2VuVHlwZTogc3RyaW5nLFxuICBhY2Nlc3NUb2tlbjogc3RyaW5nLFxuICBleHBpcmVzVGltZTogbnVtYmVyLFxuICBleHBpcmVzQXQ6IERhdGUsXG59XG5cbmV4cG9ydCBjb25zdCBfc3RhdGU6IFN0YXRlID0ge1xuICB0b2tlblR5cGU6ICcnLFxuICBhY2Nlc3NUb2tlbjogJycsXG4gIGV4cGlyZXNUaW1lOiAwLFxuICBnZXQgZXhwaXJlc0F0KCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLmV4cGlyZXNUaW1lKTtcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnRPQXV0aDIoe1xuICBjbGllbnRJZDogU3RyaW5nKHByb2Nlc3MuZW52LkxPQ0FMRlJfQVBJX09BVVRIMl9DTElFTlRfSUQpLFxuICBjbGllbnRTZWNyZXQ6IFN0cmluZyhwcm9jZXNzLmVudi5MT0NBTEZSX0FQSV9PQVVUSDJfQ0xJRU5UX1NFQ1JFVCksXG4gIGFjY2Vzc1Rva2VuVXJpOiBTdHJpbmcocHJvY2Vzcy5lbnYuTE9DQUxGUl9BUElfQkFTRV9VUkwpICsgU3RyaW5nKHByb2Nlc3MuZW52LkxPQ0FMRlJfQVBJX09BVVRIMl9UT0tFTl9VUkkpLFxufSk7XG5cbmV4cG9ydCBmdW5jdGlvbiB0dGwoZGF0ZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoKERhdGUucGFyc2UoZGF0ZSkgLSBEYXRlLm5vdygpKSAvIDEwMDApO1xufVxuXG5leHBvcnQgbGV0IF9yZWZyZXNoVGltZW91dDogTm9kZUpTLlRpbWVvdXQ7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVmcmVzaEFwaVRva2VuKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zb2xlLmRlYnVnKCdyZWZyZXNoaW5nIHRva2VuLi4uJyk7XG5cbiAgX3JlZnJlc2hUaW1lb3V0ICYmIGNsZWFyVGltZW91dChfcmVmcmVzaFRpbWVvdXQpO1xuXG4gIHJldHVybiBjbGllbnRcbiAgLmNyZWRlbnRpYWxzXG4gIC5nZXRUb2tlbigpXG4gIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICBjb25zb2xlLmRlYnVnKCdhY2Nlc3NfdG9rZW4gc3VjY2Vzc2Z1bGx5IG5lZ29jaWF0ZWQuJyk7XG4gICAgY29uc3QgeyB0b2tlbl90eXBlLCBleHBpcmVzX2luLCBhY2Nlc3NfdG9rZW4gfSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc3QgdHRsID0gKCgrZXhwaXJlc19pbiAtMSkgKiAxMDAwKTtcblxuICAgIF9zdGF0ZS50b2tlblR5cGUgPSB0b2tlbl90eXBlO1xuICAgIF9zdGF0ZS5hY2Nlc3NUb2tlbiA9IGFjY2Vzc190b2tlbjtcbiAgICBfc3RhdGUuZXhwaXJlc1RpbWUgPSBEYXRlLm5vdygpICsgdHRsO1xuXG4gICAgX3JlZnJlc2hUaW1lb3V0ID0gc2V0VGltZW91dChyZWZyZXNoQXBpVG9rZW4sIHR0bCk7XG4gICAgY29uc29sZS5kZWJ1ZygnYWNjZXNzX3Rva2VuIHdpbGwgYmUgcmVmcmVzaGVkIGluICVzIHNlY29uZHMuJywgdHRsIC8gMTAwMCk7XG4gIH0pO1xufSIsImV4cG9ydCBkZWZhdWx0IHtcbiAgbG9jYWxmcjoge1xuICAgIGFwaToge1xuICAgICAgICBiYXNlVXJsOiAocHJvY2Vzcy5lbnYuTE9DQUxGUl9BUElfQkFTRV9VUkwgfHwgJycpLnJlcGxhY2UoL1xcLyQvLCAnJyksXG4gICAgICAgIHRva2VuRW5kcG9pbnQ6IHByb2Nlc3MuZW52LkxPQ0FMRlJfQVBJX1RPS0VOX0VORFBPSU5UIHx8ICcvb2F1dGgvdG9rZW4nLFxuICAgICAgICB1c2Vyc0VuZHBvaW50OiBwcm9jZXNzLmVudi5MT0NBTEZSX0FQSV9VU0VSU19FTkRQT0lOVCB8fCAnL3VzZXJzJyxcbiAgICAgICAgcmVzZXRQYXNzd29yZEVuZHBvaW50OiBwcm9jZXNzLmVudi5MT0NBTEZSX0FQSV9VU0VSU19FTkRQT0lOVCB8fCAnL2VtYWlscy9yZXNldC1wYXNzd29yZCcsXG4gICAgICAgIG9hdXRoMjoge1xuICAgICAgICAgICAgdG9rZW5Vcmk6IHByb2Nlc3MuZW52LkxPQ0FMRlJfQVBJX09BVVRIMl9UT0tFTl9VUkkgfHwgJy9vYXV0aC92Mi90b2tlbicsXG4gICAgICAgICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuTE9DQUxGUl9BUElfT0FVVEgyX0NMSUVOVF9JRCxcbiAgICAgICAgICAgIGNsaWVudFNlY3JldDogcHJvY2Vzcy5lbnYuTE9DQUxGUl9BUElfT0FVVEgyX0NMSUVOVF9TRUNSRVQsXG4gICAgICAgICAgICBwdWJsaWNLZXk6IHByb2Nlc3MuZW52LkxPQ0FMRlJfQVBJX09BVVRIMl9QVUJMSUNfS0VZXG4gICAgICAgIH1cbiAgICB9XG4gIH0sXG59IiwiaW1wb3J0IEF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IEV4cHJlc3MsIFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgdmFsaWRhdGUgYXMgaXNFbWFpbCB9IGZyb20gJ2VtYWlsLXZhbGlkYXRvcic7XG5pbXBvcnQgeyBFbmRwb2ludCwgSGFuZGxlcnMsIGVuZHBvaW50c1VybHMgYXMgdXJscywgYWxsRW5kcG9pbnRzLCBFbmRwb2ludE1ldGhvZHMgfSBmcm9tICdAbG9jYWxmci9hdXRoLW1vZHVsZS10eXBlcyc7XG5pbXBvcnQgeyBjbGllbnQsIHJlZnJlc2hBcGlUb2tlbiwgX3N0YXRlIH0gZnJvbSAnLi9DbGllbnRPQXV0aDInO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbmRVc2VyKGVtYWlsOiBzdHJpbmcpIHtcbiAgY29uc3QgdXJsID0gYCR7Y29uZmlnLmxvY2FsZnIuYXBpLmJhc2VVcmx9L2FwaSR7Y29uZmlnLmxvY2FsZnIuYXBpLnVzZXJzRW5kcG9pbnR9YDtcbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIHBhcmFtczogeyBlbWFpbCwgYWN0aXZlOiB0cnVlIH0sXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0F1dGhvcml6YXRpb24nOiBgJHtfc3RhdGUudG9rZW5UeXBlfSAke19zdGF0ZS5hY2Nlc3NUb2tlbn1gLFxuICAgICAgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9sZCtqc29uJ1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gQXhpb3NcbiAgLmdldCh1cmwsIHBhcmFtcylcbiAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgIGNvbnN0IGNvdW50ID0gcmVzcG9uc2UuZGF0YVsnaHlkcmE6dG90YWxJdGVtcyddO1xuICAgIGlmICgwID09PSBjb3VudCkgeyByZXR1cm4gfVxuXG4gICAgY29uc3QgcmVzdWx0cyA9IHJlc3BvbnNlLmRhdGFbJ2h5ZHJhOm1lbWJlciddO1xuXG4gICAgbGV0IHVzZXI7XG4gICAgaWYgKDEgPT09IGNvdW50KSB7XG4gICAgICB1c2VyID0gcmVzdWx0c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdHMuZmluZCgoaXRlbTogeyBlbWFpbDogc3RyaW5nIH0pID0+IGVtYWlsID09PSBpdGVtLmVtYWlsKTtcbiAgICB9XG4gIH0pXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlc2V0UGFzc3dvcmQodXNlcklkOiBzdHJpbmcpIHtcbiAgY29uc3QgdXJsID0gYCR7Y29uZmlnLmxvY2FsZnIuYXBpLmJhc2VVcmx9L2FwaSR7Y29uZmlnLmxvY2FsZnIuYXBpLnJlc2V0UGFzc3dvcmRFbmRwb2ludH1gO1xuICBjb25zdCBib2R5ID0geyB1c2VySWQgfTtcbiAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAnQXV0aG9yaXphdGlvbic6IGAke19zdGF0ZS50b2tlblR5cGV9ICR7X3N0YXRlLmFjY2Vzc1Rva2VufWAsXG4gICAgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9O1xuXG4gIHJldHVybiBBeGlvcy5wb3N0KHVybCwgYm9keSwgeyBoZWFkZXJzIH0pO1xufVxuXG5leHBvcnQgY29uc3QgaGFuZGxlcnM6IEhhbmRsZXJzID0ge1xuICBbRW5kcG9pbnQuX0hFQUxUSF06IHtcbiAgICBtZXRob2Q6IEVuZHBvaW50TWV0aG9kcy5fSEVBTFRILFxuICAgIHBhdGg6IHVybHMuX0hFQUxUSCxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgIH1cbiAgfSxcbiAgW0VuZHBvaW50LkdFTkVSQVRFX1VTRVJfVE9LRU5dOiB7XG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgcGF0aDogdXJscy5HRU5FUkFURV9VU0VSX1RPS0VOLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSByZXEuYm9keTtcbiAgICAgIFxuICAgICAgcmV0dXJuIGNsaWVudFxuICAgICAgLm93bmVyXG4gICAgICAuZ2V0VG9rZW4oZGF0YS51c2VybmFtZSwgZGF0YS5wYXNzd29yZClcbiAgICAgIC50aGVuKHVzZXIgPT4gcmVzLnNlbmQodXNlci5kYXRhKSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiByZXMuc3RhdHVzKDQwMSkuc2VuZChlcnJvcikpO1xuICAgIH1cbiAgfSxcbiAgW0VuZHBvaW50LlJFRlJFU0hfVVNFUl9UT0tFTl06IHtcbiAgICBtZXRob2Q6IEVuZHBvaW50TWV0aG9kcy5SRUZSRVNIX1VTRVJfVE9LRU4sXG4gICAgcGF0aDogdXJscy5SRUZSRVNIX1VTRVJfVE9LRU4sXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgaWYoISgndXNlcicgaW4gcmVxLmJvZHkpKXsgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCkgfVxuICAgICAgXG4gICAgICBjb25zdCBkYXRhID0gcmVxLmJvZHk7XG4gICAgICBjb25zdCB0b2tlbiA9IGNsaWVudC5jcmVhdGVUb2tlbihkYXRhLnVzZXIuYWNjZXNzX3Rva2VuLCBkYXRhLnVzZXIucmVmcmVzaF90b2tlbiwgZGF0YS51c2VyLnRva2VuX3R5cGUpO1xuICAgICAgXG4gICAgICByZXR1cm4gdG9rZW5cbiAgICAgIC5yZWZyZXNoKClcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgY29uc3QgeyBleHBpcmVzX2luIH0gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAvLyBmaXgtbWU6IFwiZXhwaXJlc1wiIGVzdC1pbCB2cmFpbWVudCBuw6ljZXNzYWlyZSA/XG4gICAgICAgIHJldHVybiByZXMuc2VuZCh7IGRhdGE6IHJlc3BvbnNlLmRhdGEsIGV4cGlyZXM6IGV4cGlyZXNfaW4gfSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHJlcy5zdGF0dXMoNDAxKS5zZW5kKGVycm9yKSk7XG4gICAgfVxuICB9LFxuICBbRW5kcG9pbnQuRklORF9VU0VSX0JZX0VNQUlMXToge1xuICAgIG1ldGhvZDogRW5kcG9pbnRNZXRob2RzLkZJTkRfVVNFUl9CWV9FTUFJTCxcbiAgICBwYXRoOiB1cmxzLkZJTkRfVVNFUl9CWV9FTUFJTCxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCBlbWFpbCA9IHJlcS5wYXJhbXMuZW1haWw7XG4gIFxuICAgICAgaWYgKCFpc0VtYWlsKGVtYWlsKSkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe1xuICAgICAgICAgIHN0YXR1czogNDAwLFxuICAgICAgICAgIHN0YXR1c1RleHQ6ICdCYWQgUmVxdWVzdCcsXG4gICAgICAgICAgbWVzc2FnZTogJ0ludmFsaWQgZW1haWwgaW5wdXQuJ1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICBcbiAgICAgIHJldHVybiBmaW5kVXNlcihlbWFpbClcbiAgICAgIC50aGVuKHVzZXIgPT4gdXNlciA/IHJlcy5qc29uKHVzZXIpIDogcmVzLnN0YXR1cyg0MDQpLnNlbmQoYE5vIHVzZXIgZm91bmQgd2l0aCBlbWFpbCAke2VtYWlsfS5gKSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiByZXMuc3RhdHVzKGVycm9yLnJlc3BvbnNlLnN0YXR1cykuanNvbihlcnJvci5yZXNwb25zZS5kYXRhKSk7XG4gICAgfVxuICB9LFxuICBbRW5kcG9pbnQuU0VORF9QV0RfTElOS106IHtcbiAgICBtZXRob2Q6IEVuZHBvaW50TWV0aG9kcy5TRU5EX1BXRF9MSU5LLFxuICAgIHBhdGg6IHVybHMuU0VORF9QV0RfTElOSyxcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCBlbWFpbCA9IHJlcS5ib2R5LmVtYWlsO1xuICAgIFxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoJ01pc3NpbmcgZW1haWwgIScpO1xuICAgICAgfVxuXG4gICAgICBpZighaXNFbWFpbChlbWFpbCkpe1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe1xuICAgICAgICAgIHN0YXR1czogNDAwLFxuICAgICAgICAgIHN0YXR1c1RleHQ6ICdCYWQgUmVxdWVzdCcsXG4gICAgICAgICAgbWVzc2FnZTogJ0ludmFsaWQgZW1haWwgaW5wdXQuJ1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZpbmRVc2VyKGVtYWlsKVxuICAgICAgLnRoZW4odXNlciA9PiB7XG4gICAgICAgIGlmKCF1c2VyKXsgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5zZW5kKCk7IH1cbiAgICAgICAgcmV0dXJuIHJlc2V0UGFzc3dvcmQodXNlci5pZClcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzLmpzb24ocmVzcG9uc2UuZGF0YSkpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHJlcy5zdGF0dXMoZXJyb3IucmVzcG9uc2Uuc3RhdHVzKS5qc29uKGVycm9yLnJlc3BvbnNlLmRhdGEpKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKHJvb3Q6IHN0cmluZywgYXBwOiBFeHByZXNzLCBhY3RpdmVzPzogRW5kcG9pbnRbXSk6IFByb21pc2U8RXhwcmVzcz4ge1xuICAvLyBDcsOpYXRpb24gZHUgcm91dGV1ciBleHByZXNzXG4gIGNvbnN0IHJvdXRlciA9IFJvdXRlcigpO1xuICAvLyBBY3RpdmF0aW9uIGRlcyB1cmxzIGRlbWFuZMOpc1xuICAoYWN0aXZlcyB8fCBhbGxFbmRwb2ludHMpLmZvckVhY2goZW5kcG9pbnQgPT4ge1xuICAgIGNvbnN0IHsgbWV0aG9kLCBwYXRoLCBoYW5kbGVyIH0gPSBoYW5kbGVyc1sgZW5kcG9pbnQgXTtcbiAgICBjb25zb2xlLmxvZygncmVnaXN0ZXJpbmcgJXMsICVzICVzJywgZW5kcG9pbnQsIG1ldGhvZCwgcGF0aCk7XG4gICAgcm91dGVyWyBtZXRob2QgXShwYXRoLCBoYW5kbGVyKTtcbiAgfSk7XG4gIC8vIETDqW1hcnJhZ2UgZGUgbGEgcm91dGluZSBkZSB2w6lyaWZpY2F0aW9uIGR1IHRva2VuIGRlIGwnYXBpXG4gIC8vIE1pc2UgZW4gcGxhY2UgZHUgcm91dGVyIGRhbnMgbCdhcHBsaWNhdGlvblxuICByZXR1cm4gcmVmcmVzaEFwaVRva2VuKCkudGhlbigoKSA9PiBhcHAudXNlKHJvb3QsIHJvdXRlcikpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAbG9jYWxmci9hdXRoLW1vZHVsZS10eXBlc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJheGlvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjbGllbnQtb2F1dGgyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVtYWlsLXZhbGlkYXRvclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==