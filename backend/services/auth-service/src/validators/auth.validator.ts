import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Valid email is required'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        phoneNumber: z.string().optional()
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Valid email is required'),
        password: z.string().min(1, 'Password is required')
    })
});

export const refreshSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required')
    })
});

export const updateProfileSchema = z.object({
    body: z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        phoneNumber: z.string().optional()
    })
});

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(8, 'New password must be at least 8 characters')
    })
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email('Valid email is required')
    })
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(1, 'Reset token is required'),
        newPassword: z.string().min(8, 'New password must be at least 8 characters')
    })
});