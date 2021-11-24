import { Express, Router } from 'express';
import { Endpoint, Handlers, endpoints } from '@localfr/auth-module-types';

const handlers: Handlers = {
  [Endpoint._HEALTH]: {
    method: 'get',
    path: endpoints._HEALTH,
    handler(req, res) {
      res.json({ success: true });
    }
  }
}

export function register(root: string, app: Express, actives: Endpoint[]): void {
  // Création du routeur express
  const router = Router();
  // Activation des endpoints demandés
  actives.forEach(endpoint => {
    const { method, path, handler } = handlers[ endpoint ];
    router[ method ](path, handler);
  });
  // Mise en place du router dans l'application
  app.use(root, router);
};