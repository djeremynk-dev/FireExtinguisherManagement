import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

export const validate = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: result.error.flatten()
            });
        }
        next();
    };
};