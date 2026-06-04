import { prisma } from '../lib/prisma.js';

export const UserService = {
  async getMe(userId: string) {
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
        jobTitle: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async updateOwnProfile(userId: string, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        jobTitle: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async listUsers(params: { role?: string; search?: string }) {
    const where: any = {};

    if (params.role) {
      where.role = params.role;
    }

    if (params.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } }
      ];
    }

    return prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        jobTitle: true,
        department: true,
        avatarUrl: true,
        createdAt: true
      }
    });
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        jobTitle: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async adminUpdateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        jobTitle: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });
  },

  async remove(id: string) {
    return prisma.user.delete({
      where: { id }
    });
  }
};