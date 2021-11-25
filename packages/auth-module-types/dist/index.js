module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(980);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 980:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointMethods = exports.endpointsUrls = exports.allEndpoints = exports.Endpoint = void 0;
/**
 * Liste des Handlers proposé par ce module
 */
var Endpoint;
(function (Endpoint) {
    Endpoint["_HEALTH"] = "_HEALTH";
    Endpoint["GENERATE_USER_TOKEN"] = "GENERATE_USER_TOKEN";
    Endpoint["REFRESH_USER_TOKEN"] = "REFRESH_USER_TOKEN";
    Endpoint["FIND_USER_BY_EMAIL"] = "FIND_USER_BY_EMAIL";
    Endpoint["SEND_PWD_LINK"] = "SEND_PWD_LINK";
})(Endpoint = exports.Endpoint || (exports.Endpoint = {}));
exports.allEndpoints = [
    Endpoint._HEALTH,
    Endpoint.GENERATE_USER_TOKEN,
    Endpoint.REFRESH_USER_TOKEN,
    Endpoint.FIND_USER_BY_EMAIL,
    Endpoint.SEND_PWD_LINK,
];
exports.endpointsUrls = {
    [Endpoint._HEALTH]: '/_health',
    [Endpoint.GENERATE_USER_TOKEN]: '/generate-user-token',
    [Endpoint.REFRESH_USER_TOKEN]: '/refresh-user-token',
    [Endpoint.FIND_USER_BY_EMAIL]: '/users/:email',
    [Endpoint.SEND_PWD_LINK]: '/send-reset-pwd-link',
};
exports.EndpointMethods = {
    [Endpoint._HEALTH]: 'get',
    [Endpoint.GENERATE_USER_TOKEN]: 'post',
    [Endpoint.REFRESH_USER_TOKEN]: 'post',
    [Endpoint.FIND_USER_BY_EMAIL]: 'get',
    [Endpoint.SEND_PWD_LINK]: 'post',
};


/***/ })

/******/ });
//# sourceMappingURL=index.js.map