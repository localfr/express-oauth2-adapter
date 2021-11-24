import { AxiosInstance } from 'axios';
import { HttpResponses, endpoints } from '@localfr/auth-module-types';

export default class HttpClient {
  constructor(protected $http: AxiosInstance){
    
  }

  async health(){
    const response = await this.$http.get<HttpResponses._HEALTH>(endpoints._HEALTH);
    return response.data;
  }
}