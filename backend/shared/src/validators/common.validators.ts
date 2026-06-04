import { z } from 'zod';

export const idParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});