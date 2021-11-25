/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ClientOAuth2.ts":
/*!*****************************!*\
  !*** ./src/ClientOAuth2.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.refreshApiToken = exports._refreshTimeout = exports.ttl = exports.client = exports._state = void 0;\nconst client_oauth2_1 = __importDefault(__webpack_require__(/*! client-oauth2 */ \"client-oauth2\"));\nexports._state = {\n    tokenType: '',\n    accessToken: '',\n    expiresTime: 0,\n    get expiresAt() {\n        return new Date(this.expiresTime);\n    },\n};\nexports.client = new client_oauth2_1.default({\n    clientId: String(process.env.LOCALFR_API_OAUTH2_CLIENT_ID),\n    clientSecret: String(process.env.LOCALFR_API_OAUTH2_CLIENT_SECRET),\n    accessTokenUri: String(process.env.LOCALFR_API_BASE_URL) + String(process.env.LOCALFR_API_OAUTH2_TOKEN_URI),\n});\nfunction ttl(date) {\n    return Math.floor((Date.parse(date) - Date.now()) / 1000);\n}\nexports.ttl = ttl;\nasync function refreshApiToken() {\n    console.debug('refreshing token...');\n    exports._refreshTimeout && clearTimeout(exports._refreshTimeout);\n    return exports.client\n        .credentials\n        .getToken()\n        .then(response => {\n        console.debug('access_token successfully negociated.');\n        const { token_type, expires_in, access_token } = response.data;\n        const ttl = ((+expires_in - 1) * 1000);\n        exports._state.tokenType = token_type;\n        exports._state.accessToken = access_token;\n        exports._state.expiresTime = Date.now() + ttl;\n        exports._refreshTimeout = setTimeout(refreshApiToken, ttl);\n        console.debug('access_token will be refreshed in %s seconds.', ttl / 1000);\n    });\n}\nexports.refreshApiToken = refreshApiToken;\n\n\n//# sourceURL=webpack://@localfr/auth-express-router/./src/ClientOAuth2.ts?");

/***/ }),

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports[\"default\"] = {\n    localfr: {\n        api: {\n            baseUrl: (process.env.LOCALFR_API_BASE_URL || '').replace(/\\/$/, ''),\n            tokenEndpoint: process.env.LOCALFR_API_TOKEN_ENDPOINT || '/oauth/token',\n            usersEndpoint: process.env.LOCALFR_API_USERS_ENDPOINT || '/users',\n            resetPasswordEndpoint: process.env.LOCALFR_API_USERS_ENDPOINT || '/emails/reset-password',\n            oauth2: {\n                tokenUri: process.env.LOCALFR_API_OAUTH2_TOKEN_URI || '/oauth/v2/token',\n                clientId: process.env.LOCALFR_API_OAUTH2_CLIENT_ID,\n                clientSecret: process.env.LOCALFR_API_OAUTH2_CLIENT_SECRET,\n                publicKey: process.env.LOCALFR_API_OAUTH2_PUBLIC_KEY\n            }\n        }\n    },\n};\n\n\n//# sourceURL=webpack://@localfr/auth-express-router/./src/config/index.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.register = exports.handlers = void 0;\nconst axios_1 = __importDefault(__webpack_require__(/*! axios */ \"axios\"));\nconst express_1 = __webpack_require__(/*! express */ \"express\");\nconst email_validator_1 = __webpack_require__(/*! email-validator */ \"email-validator\");\nconst auth_module_types_1 = __webpack_require__(/*! @localfr/auth-module-types */ \"@localfr/auth-module-types\");\nconst ClientOAuth2_1 = __webpack_require__(/*! ./ClientOAuth2 */ \"./src/ClientOAuth2.ts\");\nconst config_1 = __importDefault(__webpack_require__(/*! ./config */ \"./src/config/index.ts\"));\nasync function findUser(email) {\n    const url = `${config_1.default.localfr.api.baseUrl}/api${config_1.default.localfr.api.usersEndpoint}`;\n    const params = {\n        params: { email, active: true },\n        headers: {\n            'Authorization': `${ClientOAuth2_1._state.tokenType} ${ClientOAuth2_1._state.accessToken}`,\n            'Content-type': 'application/ld+json'\n        }\n    };\n    return axios_1.default\n        .get(url, params)\n        .then(response => {\n        const count = response.data['hydra:totalItems'];\n        if (0 === count) {\n            return;\n        }\n        const results = response.data['hydra:member'];\n        let user;\n        if (1 === count) {\n            user = results[0];\n        }\n        else {\n            return results.find((item) => email === item.email);\n        }\n    });\n}\nasync function resetPassword(userId) {\n    const url = `${config_1.default.localfr.api.baseUrl}/api${config_1.default.localfr.api.resetPasswordEndpoint}`;\n    const body = { userId };\n    const headers = {\n        'Authorization': `${ClientOAuth2_1._state.tokenType} ${ClientOAuth2_1._state.accessToken}`,\n        'Content-type': 'application/json'\n    };\n    return axios_1.default.post(url, body, { headers });\n}\nexports.handlers = {\n    [auth_module_types_1.Endpoint._HEALTH]: {\n        method: auth_module_types_1.EndpointMethods._HEALTH,\n        path: auth_module_types_1.endpointsUrls._HEALTH,\n        async handler(req, res) {\n            return res.json({ success: true });\n        }\n    },\n    [auth_module_types_1.Endpoint.GENERATE_USER_TOKEN]: {\n        method: 'post',\n        path: auth_module_types_1.endpointsUrls.GENERATE_USER_TOKEN,\n        async handler(req, res) {\n            const data = req.body;\n            return ClientOAuth2_1.client\n                .owner\n                .getToken(data.username, data.password)\n                .then(user => res.send(user.data))\n                .catch(error => res.status(401).send(error));\n        }\n    },\n    [auth_module_types_1.Endpoint.REFRESH_USER_TOKEN]: {\n        method: auth_module_types_1.EndpointMethods.REFRESH_USER_TOKEN,\n        path: auth_module_types_1.endpointsUrls.REFRESH_USER_TOKEN,\n        async handler(req, res) {\n            if (!('user' in req.body)) {\n                return res.status(400).send();\n            }\n            const data = req.body;\n            const token = ClientOAuth2_1.client.createToken(data.user.access_token, data.user.refresh_token, data.user.token_type);\n            return token\n                .refresh()\n                .then(response => {\n                const { expires_in } = response.data;\n                // fix-me: \"expires\" est-il vraiment nécessaire ?\n                return res.send({ data: response.data, expires: expires_in });\n            })\n                .catch(error => res.status(401).send(error));\n        }\n    },\n    [auth_module_types_1.Endpoint.FIND_USER_BY_EMAIL]: {\n        method: auth_module_types_1.EndpointMethods.FIND_USER_BY_EMAIL,\n        path: auth_module_types_1.endpointsUrls.FIND_USER_BY_EMAIL,\n        async handler(req, res) {\n            const email = req.params.email;\n            if (!email_validator_1.validate(email)) {\n                return res.status(400).send({\n                    status: 400,\n                    statusText: 'Bad Request',\n                    message: 'Invalid email input.'\n                });\n            }\n            return findUser(email)\n                .then(user => user ? res.json(user) : res.status(404).send(`No user found with email ${email}.`))\n                .catch(error => res.status(error.response.status).json(error.response.data));\n        }\n    },\n    [auth_module_types_1.Endpoint.SEND_PWD_LINK]: {\n        method: auth_module_types_1.EndpointMethods.SEND_PWD_LINK,\n        path: auth_module_types_1.endpointsUrls.SEND_PWD_LINK,\n        async handler(req, res) {\n            const email = req.body.email;\n            if (!email) {\n                return res.status(400).send('Missing email !');\n            }\n            if (!email_validator_1.validate(email)) {\n                return res.status(400).send({\n                    status: 400,\n                    statusText: 'Bad Request',\n                    message: 'Invalid email input.'\n                });\n            }\n            return findUser(email)\n                .then(user => {\n                if (!user) {\n                    return res.status(404).send();\n                }\n                return resetPassword(user.id)\n                    .then(response => res.json(response.data));\n            })\n                .catch(error => res.status(error.response.status).json(error.response.data));\n        }\n    }\n};\nfunction register(root, app, actives) {\n    // Création du routeur express\n    const router = express_1.Router();\n    // Activation des urls demandés\n    (actives || auth_module_types_1.allEndpoints).forEach(endpoint => {\n        const { method, path, handler } = exports.handlers[endpoint];\n        console.log('registering %s, %s %s', endpoint, method, path);\n        router[method](path, handler);\n    });\n    // Démarrage de la routine de vérification du token de l'api\n    // Mise en place du router dans l'application\n    return ClientOAuth2_1.refreshApiToken().then(() => app.use(root, router));\n}\nexports.register = register;\n;\n\n\n//# sourceURL=webpack://@localfr/auth-express-router/./src/index.ts?");

/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.server = exports.app = void 0;\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ \"body-parser\"));\nconst dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ \"dotenv\"));\ndotenv_1.default.config({ path: '../../.env' });\nconst index_1 = __webpack_require__(/*! ./index */ \"./src/index.ts\");\nconst AUTH_SERVER_HOST = process.env.AUTH_SERVER_HOST || 'localhost';\nconst AUTH_SERVER_PORT = process.env.AUTH_SERVER_PORT || 3000;\nconst AUTH_ROOT_SEGMENT = process.env.AUTH_ROOT_SEGMENT || '/auth';\nexports.app = express_1.default();\nexports.app.use(body_parser_1.default.json());\nexports.server = (async () => {\n    await index_1.register(AUTH_ROOT_SEGMENT, exports.app);\n    await new Promise((resolve) => {\n        const server = exports.app.listen(AUTH_SERVER_PORT, () => {\n            console.log('Running at %s:%s...', AUTH_SERVER_HOST, AUTH_SERVER_PORT);\n            resolve(server);\n        });\n    });\n})();\nprocess.on('uncaughtException', function (err) {\n    console.error(err.message);\n    process.exit();\n});\nexports[\"default\"] = exports.server;\n\n\n//# sourceURL=webpack://@localfr/auth-express-router/./src/server.ts?");

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