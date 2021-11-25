/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../auth-module-types/dist/index.js":
/*!******************************************!*\
  !*** ../auth-module-types/dist/index.js ***!
  \******************************************/
/***/ ((module) => {

var __dirname = "/";
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 128:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const auth_module_types_1 = __webpack_require__(/*! @localfr/auth-module-types */ "../auth-module-types/dist/index.js");
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
    async refresh(acess_token, refresh_token, token_type) {
        const response = await this.$http.request({
            method: auth_module_types_1.EndpointMethods.REFRESH_USER_TOKEN,
            url: auth_module_types_1.endpointsUrls.REFRESH_USER_TOKEN,
            data: { acess_token, refresh_token, token_type },
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
exports["default"] = HttpClient;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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L2F1dGgtbW9kdWxlLXR5cGVzL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQGxvY2FsZnIvYXV0aC1odHRwLWNsaWVudC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbG9jYWxmci9hdXRoLWh0dHAtY2xpZW50Ly4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKioqKiovICgoKSA9PiB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0XCJ1c2Ugc3RyaWN0XCI7XG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfbW9kdWxlc19fID0gKHtcblxuLyoqKi8gMTI4OlxuLyoqKi8gKChfX3VudXNlZF93ZWJwYWNrX21vZHVsZSwgZXhwb3J0cykgPT4ge1xuXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgKHsgdmFsdWU6IHRydWUgfSkpO1xuZXhwb3J0cy5FbmRwb2ludE1ldGhvZHMgPSBleHBvcnRzLmVuZHBvaW50c1VybHMgPSBleHBvcnRzLmFsbEVuZHBvaW50cyA9IGV4cG9ydHMuRW5kcG9pbnQgPSB2b2lkIDA7XG4vKipcbiAqIExpc3RlIGRlcyBIYW5kbGVycyBwcm9wb3PDqSBwYXIgY2UgbW9kdWxlXG4gKi9cbnZhciBFbmRwb2ludDtcbihmdW5jdGlvbiAoRW5kcG9pbnQpIHtcbiAgICBFbmRwb2ludFtcIl9IRUFMVEhcIl0gPSBcIl9IRUFMVEhcIjtcbiAgICBFbmRwb2ludFtcIkdFTkVSQVRFX1VTRVJfVE9LRU5cIl0gPSBcIkdFTkVSQVRFX1VTRVJfVE9LRU5cIjtcbiAgICBFbmRwb2ludFtcIlJFRlJFU0hfVVNFUl9UT0tFTlwiXSA9IFwiUkVGUkVTSF9VU0VSX1RPS0VOXCI7XG4gICAgRW5kcG9pbnRbXCJGSU5EX1VTRVJfQllfRU1BSUxcIl0gPSBcIkZJTkRfVVNFUl9CWV9FTUFJTFwiO1xuICAgIEVuZHBvaW50W1wiU0VORF9QV0RfTElOS1wiXSA9IFwiU0VORF9QV0RfTElOS1wiO1xufSkoRW5kcG9pbnQgPSBleHBvcnRzLkVuZHBvaW50IHx8IChleHBvcnRzLkVuZHBvaW50ID0ge30pKTtcbmV4cG9ydHMuYWxsRW5kcG9pbnRzID0gW1xuICAgIEVuZHBvaW50Ll9IRUFMVEgsXG4gICAgRW5kcG9pbnQuR0VORVJBVEVfVVNFUl9UT0tFTixcbiAgICBFbmRwb2ludC5SRUZSRVNIX1VTRVJfVE9LRU4sXG4gICAgRW5kcG9pbnQuRklORF9VU0VSX0JZX0VNQUlMLFxuICAgIEVuZHBvaW50LlNFTkRfUFdEX0xJTkssXG5dO1xuZXhwb3J0cy5lbmRwb2ludHNVcmxzID0ge1xuICAgIFtFbmRwb2ludC5fSEVBTFRIXTogJy9faGVhbHRoJyxcbiAgICBbRW5kcG9pbnQuR0VORVJBVEVfVVNFUl9UT0tFTl06ICcvZ2VuZXJhdGUtdXNlci10b2tlbicsXG4gICAgW0VuZHBvaW50LlJFRlJFU0hfVVNFUl9UT0tFTl06ICcvcmVmcmVzaC11c2VyLXRva2VuJyxcbiAgICBbRW5kcG9pbnQuRklORF9VU0VSX0JZX0VNQUlMXTogJy91c2Vycy86ZW1haWwnLFxuICAgIFtFbmRwb2ludC5TRU5EX1BXRF9MSU5LXTogJy9zZW5kLXJlc2V0LXB3ZC1saW5rJyxcbn07XG5leHBvcnRzLkVuZHBvaW50TWV0aG9kcyA9IHtcbiAgICBbRW5kcG9pbnQuX0hFQUxUSF06ICdnZXQnLFxuICAgIFtFbmRwb2ludC5HRU5FUkFURV9VU0VSX1RPS0VOXTogJ3Bvc3QnLFxuICAgIFtFbmRwb2ludC5SRUZSRVNIX1VTRVJfVE9LRU5dOiAncG9zdCcsXG4gICAgW0VuZHBvaW50LkZJTkRfVVNFUl9CWV9FTUFJTF06ICdnZXQnLFxuICAgIFtFbmRwb2ludC5TRU5EX1BXRF9MSU5LXTogJ3Bvc3QnLFxufTtcblxuXG4vKioqLyB9KVxuXG4vKioqKioqLyBcdH0pO1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2NvbXBhdCAqL1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0aWYgKHR5cGVvZiBfX25jY3dwY2tfcmVxdWlyZV9fICE9PSAndW5kZWZpbmVkJykgX19uY2N3cGNrX3JlcXVpcmVfXy5hYiA9IF9fZGlybmFtZSArIFwiL1wiO1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvLyBzdGFydHVwXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHQvLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfbW9kdWxlc19fWzEyOF0oMCwgX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKioqKioqLyBcdG1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX2V4cG9ydHNfXztcbi8qKioqKiovIFx0XG4vKioqKioqLyB9KSgpXG47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgQXhpb3NJbnN0YW5jZSwgTWV0aG9kIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgSHR0cFJlc3BvbnNlcywgRW5kcG9pbnRNZXRob2RzLCBlbmRwb2ludHNVcmxzIGFzIHVybHMgfSBmcm9tICdAbG9jYWxmci9hdXRoLW1vZHVsZS10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0dHBDbGllbnQge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgJGh0dHA6IEF4aW9zSW5zdGFuY2Upe1xuICAgIFxuICB9XG4gIFxuICBhc3luYyBoZWFsdGgoKXtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuJGh0dHAuZ2V0PEh0dHBSZXNwb25zZXMuX0hFQUxUSD4odXJscy5fSEVBTFRIKTtcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfVxuXG4gIGFzeW5jIGxvZ2luKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuJGh0dHAucG9zdDxIdHRwUmVzcG9uc2VzLkdFTkVSQVRFX1VTRVJfVE9LRU4+KHVybHMuR0VORVJBVEVfVVNFUl9UT0tFTiwgeyB1c2VybmFtZSwgcGFzc3dvcmQgfSk7XG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH1cblxuICBhc3luYyByZWZyZXNoKGFjZXNzX3Rva2VuOiBzdHJpbmcsIHJlZnJlc2hfdG9rZW46IHN0cmluZywgdG9rZW5fdHlwZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLiRodHRwLnJlcXVlc3Q8SHR0cFJlc3BvbnNlcy5SRUZSRVNIX1VTRVJfVE9LRU4+KHtcbiAgICAgIG1ldGhvZDogRW5kcG9pbnRNZXRob2RzLlJFRlJFU0hfVVNFUl9UT0tFTiBhcyBNZXRob2QsXG4gICAgICB1cmw6IHVybHMuUkVGUkVTSF9VU0VSX1RPS0VOLFxuICAgICAgZGF0YTogeyBhY2Vzc190b2tlbiwgcmVmcmVzaF90b2tlbiwgdG9rZW5fdHlwZSB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH1cblxuICBhc3luYyBmaW5kVXNlckJ5RW1haWwoZW1haWw6IHN0cmluZykge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy4kaHR0cC5yZXF1ZXN0PEh0dHBSZXNwb25zZXMuRklORF9VU0VSX0JZX0VNQUlMPih7XG4gICAgICBtZXRob2Q6IEVuZHBvaW50TWV0aG9kcy5GSU5EX1VTRVJfQllfRU1BSUwgYXMgTWV0aG9kLFxuICAgICAgdXJsOiB1cmxzLkZJTkRfVVNFUl9CWV9FTUFJTCxcbiAgICAgIGRhdGE6IHsgZW1haWwgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICB9XG5cbiAgYXN5bmMgc2VuZFBhc3N3b3JkUmVzZXRMaW5rKGVtYWlsOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuJGh0dHAucmVxdWVzdDxIdHRwUmVzcG9uc2VzLlNFTkRfUFdEX0xJTks+KHtcbiAgICAgIG1ldGhvZDogRW5kcG9pbnRNZXRob2RzLlNFTkRfUFdEX0xJTksgYXMgTWV0aG9kLFxuICAgICAgdXJsOiB1cmxzLlNFTkRfUFdEX0xJTkssXG4gICAgICBkYXRhOiB7IGVtYWlsIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==