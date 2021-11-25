import Axios from 'axios';
import ApiService from './index';

describe('', () => {
  let client: ApiService;
  
  beforeAll(() => {
    const axios = Axios.create({ baseURL: `http://${process.env.AUTH_SERVER_HOST}:${process.env.AUTH_SERVER_PORT}` + process.env.AUTH_ROOT_SEGMENT });
    client = new ApiService(axios);
  });

  it('Should return expected response', async () => {
    const health = await client.health();
    expect(health).toHaveProperty('success', true);
  });

  it('Should return user token', async () => {
    const response = await client.login('david.smile@local.test', 'password');
    expect(response).toHaveProperty('access_token');
  });
});