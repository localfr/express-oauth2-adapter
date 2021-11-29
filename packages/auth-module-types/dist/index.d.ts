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
declare type Method = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
export declare const EndpointMethods: Record<Endpoint, Method>;
export declare namespace HttpResponses {
    type _HEALTH = {
        success: boolean;
    };
    type GENERATE_USER_TOKEN = {
        token_type: string;
        access_token: string;
        refresh_token: string;
        expires_in: number;
        expires_at: string;
    };
    type REFRESH_USER_TOKEN = {
        token_type: string;
        access_token: string;
        refresh_token: string;
        expires_in: number;
        expires_at: string;
    };
    type FIND_USER_BY_EMAIL = any;
    type SEND_PWD_LINK = any;
}
export declare type Handlers = Record<Endpoint, {
    method: Method;
    path: string;
    handler: ExpressHandler;
}>;
export {};
