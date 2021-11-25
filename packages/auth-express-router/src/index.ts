import Axios from 'axios';
import { Express, Router } from 'express';
import { validate as isEmail } from 'email-validator';
import { Endpoint, Handlers, endpointsUrls as urls, allEndpoints } from '@localfr/auth-module-types';
import { client, refreshApiToken, _state } from './ClientOAuth2';
import config from './config';

async function findUser(email: string) {
  const url = `${config.localfr.api.baseUrl}/api${config.localfr.api.usersEndpoint}`;
  const params = {
    params: { email, active: true },
    headers: {
      'Authorization': `${_state.tokenType} ${_state.accessToken}`,
      'Content-type': 'application/ld+json'
    }
  };

  return Axios
  .get(url, params)
  .then(response => {
    const count = response.data['hydra:totalItems'];
    if (0 === count) { return }

    const results = response.data['hydra:member'];

    let user;
    if (1 === count) {
      user = results[0];
    } else {
      return results.find((item: { email: string }) => email === item.email);
    }
  })
}

async function resetPassword(userId: string) {
  const url = `${config.localfr.api.baseUrl}/api${config.localfr.api.resetPasswordEndpoint}`;
  const body = { userId };
  const headers = {
    'Authorization': `${_state.tokenType} ${_state.accessToken}`,
    'Content-type': 'application/json'
  };

  return Axios.post(url, body, { headers });
}

export const handlers: Handlers = {
  [Endpoint._HEALTH]: {
    method: 'get',
    path: urls._HEALTH,
    async handler(req, res) {
      return res.json({ success: true });
    }
  },
  [Endpoint.GENERATE_USER_TOKEN]: {
    method: 'post',
    path: urls.GENERATE_USER_TOKEN,
    async handler(req, res) {
      const data = req.body;
      
      return client
      .owner
      .getToken(data.username, data.password)
      .then(user => res.send(user.data))
      .catch(error => res.status(401).send(error));
    }
  },
  [Endpoint.REFRESH_USER_TOKEN]: {
    method: 'post',
    path: urls.REFRESH_USER_TOKEN,
    async handler(req, res) {
      if(!('user' in req.body)){ return res.status(400).send() }
      
      const data = req.body;
      const token = client.createToken(data.user.access_token, data.user.refresh_token, data.user.token_type);
      
      return token
      .refresh()
      .then(response => {
        const { expires_in } = response.data;
        // fix-me: "expires" est-il vraiment nécessaire ?
        return res.send({ data: response.data, expires: expires_in });
      })
      .catch(error => res.status(401).send(error));
    }
  },
  [Endpoint.FIND_USER_BY_EMAIL]: {
    method: 'get',
    path: urls.FIND_USER_BY_EMAIL,
    async handler(req, res) {
      const email = req.params.email;
  
      if (!isEmail(email)) {
        return res.status(400).send({
          status: 400,
          statusText: 'Bad Request',
          message: 'Invalid email input.'
        });
      }
    
      return findUser(email)
      .then(user => user ? res.json(user) : res.status(404).send(`No user found with email ${email}.`))
      .catch(error => res.status(error.response.status).json(error.response.data));
    }
  },
  [Endpoint.SEND_PWD_LINK]: {
    method: 'post',
    path: urls.SEND_PWD_LINK,
    async handler(req, res) {
      const email = req.body.email;
    
      if (!email) {
        return res.status(400).send('Missing email !');
      }

      if(!isEmail(email)){
        return res.status(400).send({
          status: 400,
          statusText: 'Bad Request',
          message: 'Invalid email input.'
        });
      }

      return findUser(email)
      .then(user => {
        if(!user){ return res.status(404).send(); }
        return resetPassword(user.id)
        .then(response => res.json(response.data))
      })
      .catch(error => res.status(error.response.status).json(error.response.data));
    }
  }
}

export function register(root: string, app: Express, actives?: Endpoint[]): Promise<Express> {
  // Création du routeur express
  const router = Router();
  // Activation des urls demandés
  (actives || allEndpoints).forEach(endpoint => {
    const { method, path, handler } = handlers[ endpoint ];
    console.log('registering %s, %s %s', endpoint, method, path);
    router[ method ](path, handler);
  });
  // Démarrage de la routine de vérification du token de l'api
  // Mise en place du router dans l'application
  return refreshApiToken().then(() => app.use(root, router));
};