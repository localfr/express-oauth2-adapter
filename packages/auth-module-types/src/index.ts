import { Handler } from 'express';

/**
 * Liste des Handlers proposé par ce module
 */
 export enum Endpoint {
  _HEALTH = '_HEALTH',
}

/**
 * Mapping des handlers à l'url d'une route
 */
 export type EndpointsUrls = Record<Endpoint, string>;
 export const endpoints: EndpointsUrls = {
  [Endpoint._HEALTH]: '/_health',
}

export namespace HttpResponses {
  export type _HEALTH = {
    success: boolean,
  }
}

export type Handlers = Record<Endpoint, {
  method: 'head' | 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  handler: Handler,
}>;