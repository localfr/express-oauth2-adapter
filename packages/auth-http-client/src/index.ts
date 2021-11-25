import { AxiosInstance } from 'axios';
import { HttpResponses, endpointsUrls as urls } from '@localfr/auth-module-types';

export default class HttpClient {
  constructor(protected $http: AxiosInstance){
    
  }
  
  async health(){
    const response = await this.$http.get<HttpResponses._HEALTH>(urls._HEALTH);
    return response.data;
  }

  async login(username: string, password: string) {
    const response = await this.$http.post<HttpResponses.GENERATE_USER_TOKEN>(urls.GENERATE_USER_TOKEN, { username, password });
    return response.data;
  }
}