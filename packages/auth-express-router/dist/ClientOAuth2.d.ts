/// <reference types="node" />
import ClientOAuth2 from 'client-oauth2';
declare type State = {
    tokenType: string;
    accessToken: string;
    expiresTime: number;
    expiresAt: Date;
};
export declare const _state: State;
export declare const client: ClientOAuth2;
export declare function ttl(date: string): number;
export declare let _refreshTimeout: NodeJS.Timeout;
export declare function refreshApiToken(): Promise<void>;
export {};
