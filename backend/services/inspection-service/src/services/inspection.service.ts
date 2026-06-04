import { prisma } from '../lib/prisma.js';

export const InspectionService = {
  async schedule(data: any) {
    return prisma.inspection.create({
      data: {
        extinguisherId: data.extinguisherId,
        inspectorId: data.inspectorId || null,
        scheduledDate: new Date(data.scheduledDate),
        scheduledTime: data.scheduledTime,
        notes: data.notes,
        status: 'SCHEDULED',
        outcome: 'PENDING'
      }
    });
  },

  async findAll() {
    return prisma.inspection.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async findById(id: string) {
    return prisma.inspection.findUnique({
      where: { id }
    });
  },

  async update(id: string, data: any) {
    return prisma.inspection.update({
      where: { id },
      data: {
        ...data,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
        actualDate: data.actualDate ? new Date(data.actualDate) : undefined
      }
    });
  },

  async remove(id: string) {
    return prisma.inspection.delete({
      where: { id }
    });
  }
};