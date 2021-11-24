/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst auth_module_types_1 = __webpack_require__(/*! @localfr/auth-module-types */ \"../auth-module-types/dist/index.js\");\nclass HttpClient {\n    constructor($http) {\n        this.$http = $http;\n    }\n    async health() {\n        const response = await this.$http.get(auth_module_types_1.endpoints._HEALTH);\n        return response.data;\n    }\n}\nexports[\"default\"] = HttpClient;\n\n\n//# sourceURL=webpack://@localfr/auth-http-client/./src/index.ts?");

/***/ }),

/***/ "../auth-module-types/dist/index.js":
/*!******************************************!*\
  !*** ../auth-module-types/dist/index.js ***!
  \******************************************/
/***/ ((module) => {

eval("var __dirname = \"/\";\n/******/ (() => { // webpackBootstrap\n/******/ \t\"use strict\";\n/******/ \tvar __webpack_modules__ = ({\n\n/***/ 128:\n/***/ ((__unused_webpack_module, exports) => {\n\n\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.endpoints = exports.Endpoint = void 0;\n/**\n * Liste des Handlers proposé par ce module\n */\nvar Endpoint;\n(function (Endpoint) {\n    Endpoint[\"_HEALTH\"] = \"_HEALTH\";\n})(Endpoint = exports.Endpoint || (exports.Endpoint = {}));\nexports.endpoints = {\n    [Endpoint._HEALTH]: '/_health',\n};\n\n\n/***/ })\n\n/******/ \t});\n/************************************************************************/\n/******/ \t/* webpack/runtime/compat */\n/******/ \t\n/******/ \tif (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + \"/\";\n/******/ \t\n/************************************************************************/\n/******/ \t\n/******/ \t// startup\n/******/ \t// Load entry module and return exports\n/******/ \t// This entry module is referenced by other modules so it can't be inlined\n/******/ \tvar __webpack_exports__ = {};\n/******/ \t__webpack_modules__[128](0, __webpack_exports__);\n/******/ \tmodule.exports = __webpack_exports__;\n/******/ \t\n/******/ })()\n;\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack://@localfr/auth-http-client/../auth-module-types/dist/index.js?");

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