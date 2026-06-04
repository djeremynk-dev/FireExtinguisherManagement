import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { UserRole } from '../../generated/prisma/enums.js';
import crypto from 'crypto';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'access_secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

const signAccessToken = (payload: { id: string; email: string; role: UserRole }) =>
  jwt.sign(payload, accessSecret as jwt.Secret, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' } as jwt.SignOptions);

const signRefreshToken = (payload: { id: string; email: string; role: UserRole }) =>
  jwt.sign(payload, refreshSecret as jwt.Secret, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as jwt.SignOptions);

const publicUser = (user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const AuthService = {
    async register(data: { firstName: string; lastName: string; email: string; password: string; phoneNumber?: string }) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) throw new Error('Email already exists');

        const passwordHash = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email.toLowerCase(),
                passwordHash,
                phoneNumber: data.phoneNumber,
                role: UserRole.USER
            }
        });

        const tokenPayload = { id: user.id, email: user.email, role: user.role };
        const accessToken = signAccessToken(tokenPayload);
        const refreshToken = signRefreshToken(tokenPayload);

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: await bcrypt.hash(refreshToken, 12),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        return { user: publicUser(user), accessToken, refreshToken };
    },

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user || !user.isActive) throw new Error('Invalid credentials');

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error('Invalid credentials');

        const tokenPayload = { id: user.id, email: user.email, role: user.role };
        const accessToken = signAccessToken(tokenPayload);
        const refreshToken = signRefreshToken(tokenPayload);

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: await bcrypt.hash(refreshToken, 12),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        return { user: publicUser(user), accessToken, refreshToken };
    },

    async refresh(refreshToken: string) {
            const payload = jwt.verify(refreshToken, refreshSecret as jwt.Secret) as { id: string; email: string; role: UserRole };
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user || !user.isActive) throw new Error('Invalid token');

        const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
        return { accessToken };
    },

    async me(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                role: true,
                isActive: true,
                isEmailVerified: true,
                createdAt: true,
                updatedAt: true
            }
        });
    },

    async forgotPassword(email: string) {
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
            return { message: 'If the email exists, a reset link has been sent.' };
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = await bcrypt.hash(rawToken, 12);

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000)
            }
        });

        return {
            message: 'If the email exists, a reset link has been sent.',
            resetToken: rawToken
        };
    },

    async resetPassword(token: string, newPassword: string) {
        const tokens = await prisma.passwordResetToken.findMany({
            where: { used: false, expiresAt: { gt: new Date() } },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        let matched: (typeof tokens)[number] | null = null;
        for (const entry of tokens) {
            const ok = await bcrypt.compare(token, entry.tokenHash);
            if (ok) {
                matched = entry;
                break;
            }
        }

        if (!matched) {
            throw new Error('Invalid or expired reset token');
        }

        const passwordHash = await bcrypt.hash(newPassword, 12);
        await prisma.$transaction([
            prisma.user.update({
                where: { id: matched.userId },
                data: { passwordHash }
            }),
            prisma.passwordResetToken.update({
                where: { id: matched.id },
                data: { used: true }
            })
        ]);

        return { message: 'Password reset successfully' };
    },

    async logout(userId: string) {
        await prisma.refreshToken.deleteMany({ where: { userId } });
        return { message: 'Logged out successfully' };
    }
};