import { Handler as ExpressHandler } from 'express';

/**
 * Liste des Handlers proposé par ce module
 */
 export enum Endpoint {
  _HEALTH = '_HEALTH',
  GENERATE_USER_TOKEN = 'GENERATE_USER_TOKEN',
  REFRESH_USER_TOKEN = 'REFRESH_USER_TOKEN',
  FIND_USER_BY_EMAIL = 'FIND_USER_BY_EMAIL',
  SEND_PWD_LINK = 'SEND_PWD_LINK',
}

export const allEndpoints = [
  Endpoint._HEALTH,
  Endpoint.GENERATE_USER_TOKEN,
  Endpoint.REFRESH_USER_TOKEN,
  Endpoint.FIND_USER_BY_EMAIL,
  Endpoint.SEND_PWD_LINK,
];

/**
 * Mapping des handlers à l'url d'une route
 */
 export type EndpointsUrls = Record<Endpoint, string>;
 export const endpointsUrls: EndpointsUrls = {
  [Endpoint._HEALTH]: '/_health',
  [Endpoint.GENERATE_USER_TOKEN]: '/generate-user-token',
  [Endpoint.REFRESH_USER_TOKEN]: '/refresh-user-token',
  [Endpoint.FIND_USER_BY_EMAIL]: '/users/:email',
  [Endpoint.SEND_PWD_LINK]: '/send-reset-pwd-link',
}

export namespace HttpResponses {
  export type _HEALTH = {
    success: boolean,
  }
  export type GENERATE_USER_TOKEN = {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    token_type: string,
  }
}

export type Handlers = Record<Endpoint, {
  method: 'head' | 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  handler: ExpressHandler
}>;