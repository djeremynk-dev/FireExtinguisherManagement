import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

export const AuthController = {
    async register(req: Request, res: Response) {
        try {
            const result = await AuthService.register(req.body);
            return res.status(201).json({ success: true, message: 'User registered successfully', data: result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message || 'Registration failed' });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const result = await AuthService.login(req.body.email, req.body.password);
            return res.json({ success: true, message: 'Login successful', data: result });
        } catch (error: any) {
            return res.status(401).json({ success: false, message: error.message || 'Login failed' });
        }
    },

    async refresh(req: Request, res: Response) {
        try {
            const result = await AuthService.refresh(req.body.refreshToken);
            return res.json({ success: true, message: 'Token refreshed', data: result });
        } catch {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }
    },

    async me(req: Request, res: Response) {
        const user = await AuthService.me(req.user!.id);
        return res.json({ success: true, data: user });
    },

    async updateProfile(req: Request, res: Response) {
        const updated = await prisma.user.update({
            where: { id: req.user!.id },
            data: req.body
        });
        return res.json({
            success: true,
            message: 'Profile updated',
            data: {
                id: updated.id,
                firstName: updated.firstName,
                lastName: updated.lastName,
                email: updated.email,
                phoneNumber: updated.phoneNumber,
                role: updated.role
            }
        });
    },

    async forgotPassword(req: Request, res: Response) {
        try {
            const result = await AuthService.forgotPassword(req.body.email);
            return res.json({ success: true, ...result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message || 'Request failed' });
        }
    },

    async resetPassword(req: Request, res: Response) {
        try {
            const result = await AuthService.resetPassword(req.body.token, req.body.newPassword);
            return res.json({ success: true, ...result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message || 'Reset failed' });
        }
    },

    async logout(req: Request, res: Response) {
        try {
            const result = await AuthService.logout(req.user!.id);
            return res.json({ success: true, ...result });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message || 'Logout failed' });
        }
    },

    async changePassword(req: Request, res: Response) {
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const valid = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
        if (!valid) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

        const passwordHash = await bcrypt.hash(req.body.newPassword, 12);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash }
        });

        return res.json({ success: true, message: 'Password updated successfully' });
    }
};