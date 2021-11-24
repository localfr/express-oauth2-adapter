import { Handler } from 'express';
/**
 * Liste des Handlers proposé par ce module
 */
export declare enum Endpoint {
    _HEALTH = "_HEALTH"
}
/**
 * Mapping des handlers à l'url d'une route
 */
export declare type EndpointsUrls = Record<Endpoint, string>;
export declare const endpoints: EndpointsUrls;
export declare namespace HttpResponses {
    type _HEALTH = {
        success: boolean;
    };
}
export declare type Handlers = Record<Endpoint, {
    method: 'head' | 'get' | 'post' | 'put' | 'patch' | 'delete';
    path: string;
    handler: Handler;
}>;
