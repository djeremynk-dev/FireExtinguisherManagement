import { z } from 'zod';

export const updateOwnProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phoneNumber: z.string().optional(),
    jobTitle: z.string().optional(),
    department: z.string().optional(),
    avatarUrl: z.string().url().optional()
  })
});

export const adminUpdateUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phoneNumber: z.string().optional(),
    jobTitle: z.string().optional(),
    department: z.string().optional(),
    avatarUrl: z.string().url().optional(),
    role: z.enum(['ADMIN', 'INSPECTOR', 'USER']).optional(),
    isActive: z.boolean().optional(),
    isEmailVerified: z.boolean().optional()
  })
});

export const listUsersQuerySchema = z.object({
  query: z.object({
    role: z.enum(['ADMIN', 'INSPECTOR', 'USER']).optional(),
    search: z.string().optional()
  })
});