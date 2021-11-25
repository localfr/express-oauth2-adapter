import { AxiosInstance } from 'axios';
import { HttpResponses, endpointsUrls as urls } from '@localfr/auth-module-types';

export default class HttpClient {
  constructor(protected $http: AxiosInstance){
    
  }
  
  async health(){
    const response = await this.$http.get<HttpResponses._HEALTH>(urls._HEALTH);
    return response.data;
  }
}