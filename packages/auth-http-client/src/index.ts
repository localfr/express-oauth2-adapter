import { AxiosInstance, Method } from 'axios';
import { HttpResponses, EndpointMethods, endpointsUrls as urls } from '@localfr/auth-module-types';

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

  async refresh(access_token: string, refresh_token: string, token_type: string) {
    const response = await this.$http.request<HttpResponses.REFRESH_USER_TOKEN>({
      method: EndpointMethods.REFRESH_USER_TOKEN as Method,
      url: urls.REFRESH_USER_TOKEN,
      data: { access_token, refresh_token, token_type },
    });

    return response.data;
  }

  async findUserByEmail(email: string) {
    const response = await this.$http.request<HttpResponses.FIND_USER_BY_EMAIL>({
      method: EndpointMethods.FIND_USER_BY_EMAIL as Method,
      url: urls.FIND_USER_BY_EMAIL,
      data: { email },
    });

    return response.data;
  }

  async sendPasswordResetLink(email: string) {
    const response = await this.$http.request<HttpResponses.SEND_PWD_LINK>({
      method: EndpointMethods.SEND_PWD_LINK as Method,
      url: urls.SEND_PWD_LINK,
      data: { email },
    });

    return response.data;
  }
}