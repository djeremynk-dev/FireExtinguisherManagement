import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authenticate.js';
import { Role } from '../constants/roles.js';
import { errorResponse } from '../utils/api-response.js';

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || !roles.includes(authReq.user.role)) {
      return res.status(403).json(errorResponse('Forbidden'));
    }

    next();
  };
};