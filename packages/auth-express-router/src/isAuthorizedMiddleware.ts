import { RequestHandler } from 'express';
import { verify } from './utils/accessToken';

export const isAuthorizedMiddleware: RequestHandler = async (req, res, next) => {
  try{
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.split(' ').pop();
      if(token){
        if(await verify(token)){
          return next();
        }
      }
    }
  } catch(e: any){
    //
  }

  return res.status(401).send();
};
