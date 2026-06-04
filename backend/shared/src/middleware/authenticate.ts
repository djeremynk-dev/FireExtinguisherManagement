import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/api-response.js';
import { Role } from '../constants/roles.js';

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json(errorResponse('Unauthorized'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'change_this_access_secret') as AuthUser;
    (req as AuthRequest).user = payload;
    next();
  } catch {
    return res.status(401).json(errorResponse('Invalid or expired token'));
  }
};