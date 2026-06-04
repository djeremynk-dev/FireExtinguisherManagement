import { z } from 'zod';

export const scheduleInspectionSchema = z.object({
  body: z.object({
    extinguisherId: z.string().min(1, 'Fire extinguisher is required'),
    scheduledDate: z.string().min(1, 'Scheduled date is required'),
    scheduledTime: z.string().min(1, 'Scheduled time is required'),
    inspectorId: z.string().optional(),
    notes: z.string().optional()
  })
});

export const updateInspectionSchema = z.object({
  body: z.object({
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
    actualDate: z.string().optional(),
    findings: z.string().optional(),
    status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'OVERDUE', 'CANCELLED']).optional(),
    outcome: z.enum(['PASSED', 'FAILED', 'PENDING']).optional(),
    notes: z.string().optional()
  })
});