import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';
import { errorResponse } from '../utils/api-response.js';

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!parsed.success) {
      return res.status(400).json(
        errorResponse('Validation error', parsed.error.flatten())
      );
    }

    next();
  };
};