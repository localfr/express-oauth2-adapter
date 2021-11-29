"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.handlers = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = require("express");
const email_validator_1 = require("email-validator");
const auth_module_types_1 = require("@localfr/auth-module-types");
const ClientOAuth2_1 = require("./ClientOAuth2");
const config_1 = __importDefault(require("./config"));
function _toCustomToken(token) {
    const { access_token, refresh_token, token_type } = token.data;
    const expires_in = token.data.expires_in;
    const expires_at = new Date(Date.now() + (expires_in * 1000));
    return { access_token, refresh_token, token_type, expires_in, expires_at };
}
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
            if (!(['username', 'password']
                .every(key => Object.keys(req.body).includes(key)))) {
                return res.status(400).send();
            }
            const data = req.body;
            return ClientOAuth2_1.client
                .owner
                .getToken(data.username, data.password)
                .then(token => _toCustomToken(token))
                .then(custom => res.json(custom))
                .catch(error => res.status(401).send(error));
        }
    },
    [auth_module_types_1.Endpoint.REFRESH_USER_TOKEN]: {
        method: auth_module_types_1.EndpointMethods.REFRESH_USER_TOKEN,
        path: auth_module_types_1.endpointsUrls.REFRESH_USER_TOKEN,
        async handler(req, res) {
            if (!(['access_token', 'refresh_token', 'token_type']
                .every(key => Object.keys(req.body).includes(key)))) {
                return res.status(400).send();
            }
            const { access_token, refresh_token, token_type } = req.body;
            const token = ClientOAuth2_1.client.createToken(access_token, refresh_token, token_type);
            return token
                .refresh()
                .then(token => _toCustomToken(token))
                .then(custom => res.json(custom))
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
//# sourceMappingURL=index.js.map