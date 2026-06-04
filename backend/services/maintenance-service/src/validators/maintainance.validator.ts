import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  body: z.object({
    extinguisherId: z.string().min(1, 'Fire extinguisher is required'),
    inspectorId: z.string().optional(),
    maintenanceType: z.string().min(1, 'Maintenance type is required'),
    serviceDate: z.string().min(1, 'Service date is required'),
    details: z.string().min(1, 'Details are required'),
    status: z.enum(['PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED']).optional(),
    nextServiceDue: z.string().optional(),
    notes: z.string().optional()
  })
});

export const updateMaintenanceSchema = z.object({
  body: z.object({
    extinguisherId: z.string().optional(),
    inspectorId: z.string().optional(),
    maintenanceType: z.string().optional(),
    serviceDate: z.string().optional(),
    details: z.string().optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED']).optional(),
    nextServiceDue: z.string().optional(),
    notes: z.string().optional()
  })
});