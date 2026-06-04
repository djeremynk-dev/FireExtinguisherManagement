import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Gateway Error]', err);
  res.status(500).json({
    success: false,
    message: 'Gateway error',
    details: process.env.NODE_ENV === 'development' ? String(err?.message || err) : undefined
  });
};