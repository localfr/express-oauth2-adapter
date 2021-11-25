import { Handler as ExpressHandler } from 'express';
/**
 * Liste des Handlers proposé par ce module
 */
export declare enum Endpoint {
    _HEALTH = "_HEALTH",
    GENERATE_USER_TOKEN = "GENERATE_USER_TOKEN",
    REFRESH_USER_TOKEN = "REFRESH_USER_TOKEN",
    FIND_USER_BY_EMAIL = "FIND_USER_BY_EMAIL",
    SEND_PWD_LINK = "SEND_PWD_LINK"
}
export declare const allEndpoints: Endpoint[];
/**
 * Mapping des handlers à l'url d'une route
 */
export declare type EndpointsUrls = Record<Endpoint, string>;
export declare const endpointsUrls: EndpointsUrls;
export declare namespace HttpResponses {
    type _HEALTH = {
        success: boolean;
    };
    type GENERATE_USER_TOKEN = {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        token_type: string;
    };
}
export declare type Handlers = Record<Endpoint, {
    method: 'head' | 'get' | 'post' | 'put' | 'patch' | 'delete';
    path: string;
    handler: ExpressHandler;
}>;
