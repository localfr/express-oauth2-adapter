import { Express } from 'express';
import { Endpoint, Handlers } from '@localfr/auth-module-types';
export declare const handlers: Handlers;
export declare function register(root: string, app: Express, actives?: Endpoint[]): Promise<Express>;
