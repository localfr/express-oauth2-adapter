import Express from 'express';
import BodyParser from 'body-parser';
import Dotenv from 'dotenv';
import { Endpoint } from '@localfr/auth-module-types';

Dotenv.config({ path: '../../.env' });

import { register } from './index';

const AUTH_SERVER_HOST = process.env.AUTH_SERVER_HOST || 'localhost';
const AUTH_SERVER_PORT = process.env.AUTH_SERVER_PORT || 3000;
const AUTH_ROOT_SEGMENT = process.env.AUTH_ROOT_SEGMENT || '/auth';

export const app = Express();
app.use(BodyParser.json());

register(AUTH_ROOT_SEGMENT, app);

export const server = app.listen(AUTH_SERVER_PORT, () => console.log('Running at %s:%s...', AUTH_SERVER_HOST, AUTH_SERVER_PORT));