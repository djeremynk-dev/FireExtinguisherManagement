import type { Request, Response, NextFunction } from 'express';

export const attachUser = (req: Request, _res: Response, next: NextFunction) => {
  // Currently a no-op. Placeholder if you later want to decode JWT once at gateway
  // and add user info to headers like x-user-id, x-user-role.
  next();
};