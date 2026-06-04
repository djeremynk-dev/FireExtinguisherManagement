import { prisma } from '../lib/prisma.js';

export const ExtinguisherService = {
  async create(data: any) {
    const existing = await prisma.fireExtinguisher.findUnique({
      where: { serialNumber: data.serialNumber }
    });

    if (existing) {
      throw new Error('Serial number already exists');
    }

    return prisma.fireExtinguisher.create({
      data: {
        serialNumber: data.serialNumber,
        location: data.location,
        type: data.type,
        size: data.size,
        installationDate: new Date(data.installationDate),
        expiryDate: new Date(data.expiryDate),
        status: data.status || 'ACTIVE',
        notes: data.notes
      }
    });
  },

  async findAll() {
    return prisma.fireExtinguisher.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async findById(id: string) {
    return prisma.fireExtinguisher.findUnique({
      where: { id }
    });
  },

  async update(id: string, data: any) {
    return prisma.fireExtinguisher.update({
      where: { id },
      data: {
        ...data,
        installationDate: data.installationDate ? new Date(data.installationDate) : undefined,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined
      }
    });
  },

  async remove(id: string) {
    return prisma.fireExtinguisher.delete({
      where: { id }
    });
  }
};