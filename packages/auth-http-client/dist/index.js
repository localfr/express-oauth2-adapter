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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst auth_module_types_1 = __webpack_require__(/*! @localfr/auth-module-types */ \"@localfr/auth-module-types\");\nclass HttpClient {\n    constructor($http) {\n        this.$http = $http;\n    }\n    async health() {\n        const response = await this.$http.get(auth_module_types_1.endpointsUrls._HEALTH);\n        return response.data;\n    }\n    async login(username, password) {\n        const response = await this.$http.post(auth_module_types_1.endpointsUrls.GENERATE_USER_TOKEN, { username, password });\n        return response.data;\n    }\n    async refresh(acess_token, refresh_token, token_type) {\n        const response = await this.$http.request({\n            method: auth_module_types_1.EndpointMethods.REFRESH_USER_TOKEN,\n            url: auth_module_types_1.endpointsUrls.REFRESH_USER_TOKEN,\n            data: { acess_token, refresh_token, token_type },\n        });\n        return response.data;\n    }\n    async findUserByEmail(email) {\n        const response = await this.$http.request({\n            method: auth_module_types_1.EndpointMethods.FIND_USER_BY_EMAIL,\n            url: auth_module_types_1.endpointsUrls.FIND_USER_BY_EMAIL,\n            data: { email },\n        });\n        return response.data;\n    }\n    async sendPasswordResetLink(email) {\n        const response = await this.$http.request({\n            method: auth_module_types_1.EndpointMethods.SEND_PWD_LINK,\n            url: auth_module_types_1.endpointsUrls.SEND_PWD_LINK,\n            data: { email },\n        });\n        return response.data;\n    }\n}\nexports[\"default\"] = HttpClient;\n\n\n//# sourceURL=webpack://@localfr/auth-http-client/./src/index.ts?");

/***/ }),

/***/ "@localfr/auth-module-types":
/*!*********************************************!*\
  !*** external "@localfr/auth-module-types" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("@localfr/auth-module-types");

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;