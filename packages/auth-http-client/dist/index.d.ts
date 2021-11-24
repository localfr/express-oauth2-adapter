import { AxiosInstance } from 'axios';
import { HttpResponses } from '@localfr/auth-module-types';
export default class HttpClient {
    protected $http: AxiosInstance;
    constructor($http: AxiosInstance);
    health(): Promise<HttpResponses._HEALTH>;
}
