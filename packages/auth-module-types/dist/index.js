/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 128:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.endpointsUrls = exports.allEndpoints = exports.Endpoint = void 0;
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[128](0, __webpack_exports__);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map