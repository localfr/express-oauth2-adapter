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

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.server = exports.app = void 0;
const express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
const body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ "body-parser"));
const dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ "dotenv"));
dotenv_1.default.config({ path: '../../.env' });
const index_1 = __webpack_require__(/*! ./index */ "./src/index.ts");
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
exports["default"] = exports.server;


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

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "client-oauth2":
/*!********************************!*\
  !*** external "client-oauth2" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("client-oauth2");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFPLEVBQUUsQ0FBQztBQUM3QixXQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUVkLGNBQU0sR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ2hDLE1BQU0sZ0JBQVEsQ0FBQyxpQkFBaUIsRUFBRSxXQUFHLENBQUMsQ0FBQztJQUN2QyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDNUIsTUFBTSxNQUFNLEdBQUcsV0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7WUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3ZFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUVMLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsVUFBUyxHQUFHO0lBQzFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqQixDQUFDLENBQUMsQ0FBQztBQUVILHFCQUFlLGNBQU0sQ0FBQzs7Ozs7Ozs7Ozs7QUM5QnRCOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGxvY2FsZnIvYXV0aC1leHByZXNzLXJvdXRlci8uL3NyYy9DbGllbnRPQXV0aDIudHMiLCJ3ZWJwYWNrOi8vQGxvY2FsZnIvYXV0aC1leHByZXNzLXJvdXRlci8uL3NyYy9jb25maWcvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGxvY2FsZnIvYXV0aC1leHByZXNzLXJvdXRlci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyLy4vc3JjL3NlcnZlci50cyIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL2V4dGVybmFsIGNvbW1vbmpzIFwiQGxvY2FsZnIvYXV0aC1tb2R1bGUtdHlwZXNcIiIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL2V4dGVybmFsIGNvbW1vbmpzIFwiYXhpb3NcIiIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL2V4dGVybmFsIGNvbW1vbmpzIFwiYm9keS1wYXJzZXJcIiIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL2V4dGVybmFsIGNvbW1vbmpzIFwiY2xpZW50LW9hdXRoMlwiIiwid2VicGFjazovL0Bsb2NhbGZyL2F1dGgtZXhwcmVzcy1yb3V0ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJkb3RlbnZcIiIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL2V4dGVybmFsIGNvbW1vbmpzIFwiZW1haWwtdmFsaWRhdG9yXCIiLCJ3ZWJwYWNrOi8vQGxvY2FsZnIvYXV0aC1leHByZXNzLXJvdXRlci9leHRlcm5hbCBjb21tb25qcyBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0Bsb2NhbGZyL2F1dGgtZXhwcmVzcy1yb3V0ZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWV4cHJlc3Mtcm91dGVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50T0F1dGgyIGZyb20gJ2NsaWVudC1vYXV0aDInO1xuXG50eXBlIFN0YXRlID0ge1xuICB0b2tlblR5cGU6IHN0cmluZyxcbiAgYWNjZXNzVG9rZW46IHN0cmluZyxcbiAgZXhwaXJlc1RpbWU6IG51bWJlcixcbiAgZXhwaXJlc0F0OiBEYXRlLFxufVxuXG5leHBvcnQgY29uc3QgX3N0YXRlOiBTdGF0ZSA9IHtcbiAgdG9rZW5UeXBlOiAnJyxcbiAgYWNjZXNzVG9rZW46ICcnLFxuICBleHBpcmVzVGltZTogMCxcbiAgZ2V0IGV4cGlyZXNBdCgpIHtcbiAgICByZXR1cm4gbmV3IERhdGUodGhpcy5leHBpcmVzVGltZSk7XG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50T0F1dGgyKHtcbiAgY2xpZW50SWQ6IFN0cmluZyhwcm9jZXNzLmVudi5MT0NBTEZSX0FQSV9PQVVUSDJfQ0xJRU5UX0lEKSxcbiAgY2xpZW50U2VjcmV0OiBTdHJpbmcocHJvY2Vzcy5lbnYuTE9DQUxGUl9BUElfT0FVVEgyX0NMSUVOVF9TRUNSRVQpLFxuICBhY2Nlc3NUb2tlblVyaTogU3RyaW5nKHByb2Nlc3MuZW52LkxPQ0FMRlJfQVBJX0JBU0VfVVJMKSArIFN0cmluZyhwcm9jZXNzLmVudi5MT0NBTEZSX0FQSV9PQVVUSDJfVE9LRU5fVVJJKSxcbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gdHRsKGRhdGU6IHN0cmluZyk6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKChEYXRlLnBhcnNlKGRhdGUpIC0gRGF0ZS5ub3coKSkgLyAxMDAwKTtcbn1cblxuZXhwb3J0IGxldCBfcmVmcmVzaFRpbWVvdXQ6IE5vZGVKUy5UaW1lb3V0O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hBcGlUb2tlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc29sZS5kZWJ1ZygncmVmcmVzaGluZyB0b2tlbi4uLicpO1xuXG4gIF9yZWZyZXNoVGltZW91dCAmJiBjbGVhclRpbWVvdXQoX3JlZnJlc2hUaW1lb3V0KTtcblxuICByZXR1cm4gY2xpZW50XG4gIC5jcmVkZW50aWFsc1xuICAuZ2V0VG9rZW4oKVxuICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgY29uc29sZS5kZWJ1ZygnYWNjZXNzX3Rva2VuIHN1Y2Nlc3NmdWxseSBuZWdvY2lhdGVkLicpO1xuICAgIGNvbnN0IHsgdG9rZW5fdHlwZSwgZXhwaXJlc19pbiwgYWNjZXNzX3Rva2VuIH0gPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnN0IHR0bCA9ICgoK2V4cGlyZXNfaW4gLTEpICogMTAwMCk7XG5cbiAgICBfc3RhdGUudG9rZW5UeXBlID0gdG9rZW5fdHlwZTtcbiAgICBfc3RhdGUuYWNjZXNzVG9rZW4gPSBhY2Nlc3NfdG9rZW47XG4gICAgX3N0YXRlLmV4cGlyZXNUaW1lID0gRGF0ZS5ub3coKSArIHR0bDtcblxuICAgIF9yZWZyZXNoVGltZW91dCA9IHNldFRpbWVvdXQocmVmcmVzaEFwaVRva2VuLCB0dGwpO1xuICAgIGNvbnNvbGUuZGVidWcoJ2FjY2Vzc190b2tlbiB3aWxsIGJlIHJlZnJlc2hlZCBpbiAlcyBzZWNvbmRzLicsIHR0bCAvIDEwMDApO1xuICB9KTtcbn0iLCJleHBvcnQgZGVmYXVsdCB7XG4gIGxvY2FsZnI6IHtcbiAgICBhcGk6IHtcbiAgICAgICAgYmFzZVVybDogKHByb2Nlc3MuZW52LkxPQ0FMRlJfQVBJX0JBU0VfVVJMIHx8ICcnKS5yZXBsYWNlKC9cXC8kLywgJycpLFxuICAgICAgICB0b2tlbkVuZHBvaW50OiBwcm9jZXNzLmVudi5MT0NBTEZSX0FQSV9UT0tFTl9FTkRQT0lOVCB8fCAnL29hdXRoL3Rva2VuJyxcbiAgICAgICAgdXNlcnNFbmRwb2ludDogcHJvY2Vzcy5lbnYuTE9DQUxGUl9BUElfVVNFUlNfRU5EUE9JTlQgfHwgJy91c2VycycsXG4gICAgICAgIHJlc2V0UGFzc3dvcmRFbmRwb2ludDogcHJvY2Vzcy5lbnYuTE9DQUxGUl9BUElfVVNFUlNfRU5EUE9JTlQgfHwgJy9lbWFpbHMvcmVzZXQtcGFzc3dvcmQnLFxuICAgICAgICBvYXV0aDI6IHtcbiAgICAgICAgICAgIHRva2VuVXJpOiBwcm9jZXNzLmVudi5MT0NBTEZSX0FQSV9PQVVUSDJfVE9LRU5fVVJJIHx8ICcvb2F1dGgvdjIvdG9rZW4nLFxuICAgICAgICAgICAgY2xpZW50SWQ6IHByb2Nlc3MuZW52LkxPQ0FMRlJfQVBJX09BVVRIMl9DTElFTlRfSUQsXG4gICAgICAgICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkxPQ0FMRlJfQVBJX09BVVRIMl9DTElFTlRfU0VDUkVULFxuICAgICAgICAgICAgcHVibGljS2V5OiBwcm9jZXNzLmVudi5MT0NBTEZSX0FQSV9PQVVUSDJfUFVCTElDX0tFWVxuICAgICAgICB9XG4gICAgfVxuICB9LFxufSIsImltcG9ydCBBeGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgeyBFeHByZXNzLCBSb3V0ZXIgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IHZhbGlkYXRlIGFzIGlzRW1haWwgfSBmcm9tICdlbWFpbC12YWxpZGF0b3InO1xuaW1wb3J0IHsgRW5kcG9pbnQsIEhhbmRsZXJzLCBlbmRwb2ludHNVcmxzIGFzIHVybHMsIGFsbEVuZHBvaW50cywgRW5kcG9pbnRNZXRob2RzIH0gZnJvbSAnQGxvY2FsZnIvYXV0aC1tb2R1bGUtdHlwZXMnO1xuaW1wb3J0IHsgY2xpZW50LCByZWZyZXNoQXBpVG9rZW4sIF9zdGF0ZSB9IGZyb20gJy4vQ2xpZW50T0F1dGgyJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuXG5hc3luYyBmdW5jdGlvbiBmaW5kVXNlcihlbWFpbDogc3RyaW5nKSB7XG4gIGNvbnN0IHVybCA9IGAke2NvbmZpZy5sb2NhbGZyLmFwaS5iYXNlVXJsfS9hcGkke2NvbmZpZy5sb2NhbGZyLmFwaS51c2Vyc0VuZHBvaW50fWA7XG4gIGNvbnN0IHBhcmFtcyA9IHtcbiAgICBwYXJhbXM6IHsgZW1haWwsIGFjdGl2ZTogdHJ1ZSB9LFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdBdXRob3JpemF0aW9uJzogYCR7X3N0YXRlLnRva2VuVHlwZX0gJHtfc3RhdGUuYWNjZXNzVG9rZW59YCxcbiAgICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vbGQranNvbidcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEF4aW9zXG4gIC5nZXQodXJsLCBwYXJhbXMpXG4gIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICBjb25zdCBjb3VudCA9IHJlc3BvbnNlLmRhdGFbJ2h5ZHJhOnRvdGFsSXRlbXMnXTtcbiAgICBpZiAoMCA9PT0gY291bnQpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IHJlc3VsdHMgPSByZXNwb25zZS5kYXRhWydoeWRyYTptZW1iZXInXTtcblxuICAgIGxldCB1c2VyO1xuICAgIGlmICgxID09PSBjb3VudCkge1xuICAgICAgdXNlciA9IHJlc3VsdHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHRzLmZpbmQoKGl0ZW06IHsgZW1haWw6IHN0cmluZyB9KSA9PiBlbWFpbCA9PT0gaXRlbS5lbWFpbCk7XG4gICAgfVxuICB9KVxufVxuXG5hc3luYyBmdW5jdGlvbiByZXNldFBhc3N3b3JkKHVzZXJJZDogc3RyaW5nKSB7XG4gIGNvbnN0IHVybCA9IGAke2NvbmZpZy5sb2NhbGZyLmFwaS5iYXNlVXJsfS9hcGkke2NvbmZpZy5sb2NhbGZyLmFwaS5yZXNldFBhc3N3b3JkRW5kcG9pbnR9YDtcbiAgY29uc3QgYm9keSA9IHsgdXNlcklkIH07XG4gIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgJ0F1dGhvcml6YXRpb24nOiBgJHtfc3RhdGUudG9rZW5UeXBlfSAke19zdGF0ZS5hY2Nlc3NUb2tlbn1gLFxuICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgfTtcblxuICByZXR1cm4gQXhpb3MucG9zdCh1cmwsIGJvZHksIHsgaGVhZGVycyB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IGhhbmRsZXJzOiBIYW5kbGVycyA9IHtcbiAgW0VuZHBvaW50Ll9IRUFMVEhdOiB7XG4gICAgbWV0aG9kOiBFbmRwb2ludE1ldGhvZHMuX0hFQUxUSCxcbiAgICBwYXRoOiB1cmxzLl9IRUFMVEgsXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgICB9XG4gIH0sXG4gIFtFbmRwb2ludC5HRU5FUkFURV9VU0VSX1RPS0VOXToge1xuICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgIHBhdGg6IHVybHMuR0VORVJBVEVfVVNFUl9UT0tFTixcbiAgICBhc3luYyBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgICBjb25zdCBkYXRhID0gcmVxLmJvZHk7XG4gICAgICBcbiAgICAgIHJldHVybiBjbGllbnRcbiAgICAgIC5vd25lclxuICAgICAgLmdldFRva2VuKGRhdGEudXNlcm5hbWUsIGRhdGEucGFzc3dvcmQpXG4gICAgICAudGhlbih1c2VyID0+IHJlcy5zZW5kKHVzZXIuZGF0YSkpXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gcmVzLnN0YXR1cyg0MDEpLnNlbmQoZXJyb3IpKTtcbiAgICB9XG4gIH0sXG4gIFtFbmRwb2ludC5SRUZSRVNIX1VTRVJfVE9LRU5dOiB7XG4gICAgbWV0aG9kOiBFbmRwb2ludE1ldGhvZHMuUkVGUkVTSF9VU0VSX1RPS0VOLFxuICAgIHBhdGg6IHVybHMuUkVGUkVTSF9VU0VSX1RPS0VOLFxuICAgIGFzeW5jIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgICAgIGlmKCEoJ3VzZXInIGluIHJlcS5ib2R5KSl7IHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCgpIH1cbiAgICAgIFxuICAgICAgY29uc3QgZGF0YSA9IHJlcS5ib2R5O1xuICAgICAgY29uc3QgdG9rZW4gPSBjbGllbnQuY3JlYXRlVG9rZW4oZGF0YS51c2VyLmFjY2Vzc190b2tlbiwgZGF0YS51c2VyLnJlZnJlc2hfdG9rZW4sIGRhdGEudXNlci50b2tlbl90eXBlKTtcbiAgICAgIFxuICAgICAgcmV0dXJuIHRva2VuXG4gICAgICAucmVmcmVzaCgpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGNvbnN0IHsgZXhwaXJlc19pbiB9ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgLy8gZml4LW1lOiBcImV4cGlyZXNcIiBlc3QtaWwgdnJhaW1lbnQgbsOpY2Vzc2FpcmUgP1xuICAgICAgICByZXR1cm4gcmVzLnNlbmQoeyBkYXRhOiByZXNwb25zZS5kYXRhLCBleHBpcmVzOiBleHBpcmVzX2luIH0pO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiByZXMuc3RhdHVzKDQwMSkuc2VuZChlcnJvcikpO1xuICAgIH1cbiAgfSxcbiAgW0VuZHBvaW50LkZJTkRfVVNFUl9CWV9FTUFJTF06IHtcbiAgICBtZXRob2Q6IEVuZHBvaW50TWV0aG9kcy5GSU5EX1VTRVJfQllfRU1BSUwsXG4gICAgcGF0aDogdXJscy5GSU5EX1VTRVJfQllfRU1BSUwsXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgZW1haWwgPSByZXEucGFyYW1zLmVtYWlsO1xuICBcbiAgICAgIGlmICghaXNFbWFpbChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHtcbiAgICAgICAgICBzdGF0dXM6IDQwMCxcbiAgICAgICAgICBzdGF0dXNUZXh0OiAnQmFkIFJlcXVlc3QnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdJbnZhbGlkIGVtYWlsIGlucHV0LidcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgXG4gICAgICByZXR1cm4gZmluZFVzZXIoZW1haWwpXG4gICAgICAudGhlbih1c2VyID0+IHVzZXIgPyByZXMuanNvbih1c2VyKSA6IHJlcy5zdGF0dXMoNDA0KS5zZW5kKGBObyB1c2VyIGZvdW5kIHdpdGggZW1haWwgJHtlbWFpbH0uYCkpXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gcmVzLnN0YXR1cyhlcnJvci5yZXNwb25zZS5zdGF0dXMpLmpzb24oZXJyb3IucmVzcG9uc2UuZGF0YSkpO1xuICAgIH1cbiAgfSxcbiAgW0VuZHBvaW50LlNFTkRfUFdEX0xJTktdOiB7XG4gICAgbWV0aG9kOiBFbmRwb2ludE1ldGhvZHMuU0VORF9QV0RfTElOSyxcbiAgICBwYXRoOiB1cmxzLlNFTkRfUFdEX0xJTkssXG4gICAgYXN5bmMgaGFuZGxlcihyZXEsIHJlcykge1xuICAgICAgY29uc3QgZW1haWwgPSByZXEuYm9keS5lbWFpbDtcbiAgICBcbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKCdNaXNzaW5nIGVtYWlsICEnKTtcbiAgICAgIH1cblxuICAgICAgaWYoIWlzRW1haWwoZW1haWwpKXtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHtcbiAgICAgICAgICBzdGF0dXM6IDQwMCxcbiAgICAgICAgICBzdGF0dXNUZXh0OiAnQmFkIFJlcXVlc3QnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdJbnZhbGlkIGVtYWlsIGlucHV0LidcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaW5kVXNlcihlbWFpbClcbiAgICAgIC50aGVuKHVzZXIgPT4ge1xuICAgICAgICBpZighdXNlcil7IHJldHVybiByZXMuc3RhdHVzKDQwNCkuc2VuZCgpOyB9XG4gICAgICAgIHJldHVybiByZXNldFBhc3N3b3JkKHVzZXIuaWQpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlcy5qc29uKHJlc3BvbnNlLmRhdGEpKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiByZXMuc3RhdHVzKGVycm9yLnJlc3BvbnNlLnN0YXR1cykuanNvbihlcnJvci5yZXNwb25zZS5kYXRhKSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3Rlcihyb290OiBzdHJpbmcsIGFwcDogRXhwcmVzcywgYWN0aXZlcz86IEVuZHBvaW50W10pOiBQcm9taXNlPEV4cHJlc3M+IHtcbiAgLy8gQ3LDqWF0aW9uIGR1IHJvdXRldXIgZXhwcmVzc1xuICBjb25zdCByb3V0ZXIgPSBSb3V0ZXIoKTtcbiAgLy8gQWN0aXZhdGlvbiBkZXMgdXJscyBkZW1hbmTDqXNcbiAgKGFjdGl2ZXMgfHwgYWxsRW5kcG9pbnRzKS5mb3JFYWNoKGVuZHBvaW50ID0+IHtcbiAgICBjb25zdCB7IG1ldGhvZCwgcGF0aCwgaGFuZGxlciB9ID0gaGFuZGxlcnNbIGVuZHBvaW50IF07XG4gICAgY29uc29sZS5sb2coJ3JlZ2lzdGVyaW5nICVzLCAlcyAlcycsIGVuZHBvaW50LCBtZXRob2QsIHBhdGgpO1xuICAgIHJvdXRlclsgbWV0aG9kIF0ocGF0aCwgaGFuZGxlcik7XG4gIH0pO1xuICAvLyBEw6ltYXJyYWdlIGRlIGxhIHJvdXRpbmUgZGUgdsOpcmlmaWNhdGlvbiBkdSB0b2tlbiBkZSBsJ2FwaVxuICAvLyBNaXNlIGVuIHBsYWNlIGR1IHJvdXRlciBkYW5zIGwnYXBwbGljYXRpb25cbiAgcmV0dXJuIHJlZnJlc2hBcGlUb2tlbigpLnRoZW4oKCkgPT4gYXBwLnVzZShyb290LCByb3V0ZXIpKTtcbn07IiwiaW1wb3J0IEV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgQm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgRG90ZW52IGZyb20gJ2RvdGVudic7XG5cbkRvdGVudi5jb25maWcoeyBwYXRoOiAnLi4vLi4vLmVudicgfSk7XG5cbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnLi9pbmRleCc7XG5cbmNvbnN0IEFVVEhfU0VSVkVSX0hPU1QgPSBwcm9jZXNzLmVudi5BVVRIX1NFUlZFUl9IT1NUIHx8ICdsb2NhbGhvc3QnO1xuY29uc3QgQVVUSF9TRVJWRVJfUE9SVCA9IHByb2Nlc3MuZW52LkFVVEhfU0VSVkVSX1BPUlQgfHwgMzAwMDtcbmNvbnN0IEFVVEhfUk9PVF9TRUdNRU5UID0gcHJvY2Vzcy5lbnYuQVVUSF9ST09UX1NFR01FTlQgfHwgJy9hdXRoJztcblxuZXhwb3J0IGNvbnN0IGFwcCA9IEV4cHJlc3MoKTtcbmFwcC51c2UoQm9keVBhcnNlci5qc29uKCkpO1xuXG5leHBvcnQgY29uc3Qgc2VydmVyID0gKGFzeW5jICgpID0+IHtcbiAgYXdhaXQgcmVnaXN0ZXIoQVVUSF9ST09UX1NFR01FTlQsIGFwcCk7XG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3Qgc2VydmVyID0gYXBwLmxpc3RlbihBVVRIX1NFUlZFUl9QT1JULCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnUnVubmluZyBhdCAlczolcy4uLicsIEFVVEhfU0VSVkVSX0hPU1QsIEFVVEhfU0VSVkVSX1BPUlQpO1xuICAgICAgcmVzb2x2ZShzZXJ2ZXIpO1xuICAgIH0pO1xuICB9KTtcbn0pKCk7XG5cbnByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgZnVuY3Rpb24oZXJyKSB7XG4gIGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpO1xuICBwcm9jZXNzLmV4aXQoKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXI7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQGxvY2FsZnIvYXV0aC1tb2R1bGUtdHlwZXNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXhpb3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2xpZW50LW9hdXRoMlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZW1haWwtdmFsaWRhdG9yXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3NlcnZlci50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==