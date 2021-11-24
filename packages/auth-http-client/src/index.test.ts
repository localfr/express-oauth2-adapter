import Axios from 'axios';
import ApiService from './index';

it('Should return expected response', async () => {
  const axios = Axios.create({ baseURL: 'http://localhost:3000' + process.env.AUTH_ROOT_SEGMENT });
  const client = new ApiService(axios);
  const health = await client.health();
  expect(health).toHaveProperty('success', true);
});