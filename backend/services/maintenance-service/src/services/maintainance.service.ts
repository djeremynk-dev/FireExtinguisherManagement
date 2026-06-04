import { prisma } from '../lib/prisma.js';

export const MaintenanceService = {
  async create(data: any) {
    return prisma.maintenanceLog.create({
      data: {
        extinguisherId: data.extinguisherId,
        inspectorId: data.inspectorId || null,
        maintenanceType: data.maintenanceType,
        serviceDate: new Date(data.serviceDate),
        details: data.details,
        status: data.status || 'PENDING',
        nextServiceDue: data.nextServiceDue ? new Date(data.nextServiceDue) : null,
        notes: data.notes
      }
    });
  },

  async findAll() {
    return prisma.maintenanceLog.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async findById(id: string) {
    return prisma.maintenanceLog.findUnique({
      where: { id }
    });
  },

  async update(id: string, data: any) {
    return prisma.maintenanceLog.update({
      where: { id },
      data: {
        ...data,
        serviceDate: data.serviceDate ? new Date(data.serviceDate) : undefined,
        nextServiceDue: data.nextServiceDue ? new Date(data.nextServiceDue) : undefined
      }
    });
  },

  async remove(id: string) {
    return prisma.maintenanceLog.delete({
      where: { id }
    });
  }
};