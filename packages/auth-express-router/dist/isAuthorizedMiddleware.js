"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorizedMiddleware = void 0;
const accessToken_1 = require("./utils/accessToken");
const isAuthorizedMiddleware = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (authorization) {
            const token = authorization.split(' ').pop();
            if (token) {
                if (await accessToken_1.verify(token)) {
                    return next();
                }
            }
        }
    }
    catch (e) {
        //
    }
    return res.status(401).send();
};
exports.isAuthorizedMiddleware = isAuthorizedMiddleware;
//# sourceMappingURL=isAuthorizedMiddleware.js.map