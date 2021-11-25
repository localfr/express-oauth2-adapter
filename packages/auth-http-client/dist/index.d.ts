import { AxiosInstance } from 'axios';
import { HttpResponses } from '@localfr/auth-module-types';
export default class HttpClient {
    protected $http: AxiosInstance;
    constructor($http: AxiosInstance);
    health(): Promise<HttpResponses._HEALTH>;
    login(username: string, password: string): Promise<HttpResponses.GENERATE_USER_TOKEN>;
    refresh(acess_token: string, refresh_token: string, token_type: string): Promise<HttpResponses.REFRESH_USER_TOKEN>;
    findUserByEmail(email: string): Promise<any>;
    sendPasswordResetLink(email: string): Promise<any>;
}
