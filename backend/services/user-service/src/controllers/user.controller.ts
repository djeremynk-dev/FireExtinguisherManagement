import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';

export const UserController = {
  async me(req: Request, res: Response) {
    const userId = req.user!.id;
    const user = await UserService.getMe(userId);
    return res.json({
      success: true,
      data: user
    });
  },

  async updateOwnProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const updated = await UserService.updateOwnProfile(userId, req.body);
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updated
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  },

  async list(req: Request, res: Response) {
    const { role, search } = req.query as { role?: string; search?: string };
    const users = await UserService.listUsers({ role, search });
    return res.json({
      success: true,
      data: users
    });
  },

  async getById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = await UserService.getById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  },

  async adminUpdateUser(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updated = await UserService.adminUpdateUser(id, req.body);
      return res.json({
        success: true,
        message: 'User updated successfully',
        data: updated
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update user'
      });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await UserService.remove(id);
      return res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete user'
      });
    }
  }
};